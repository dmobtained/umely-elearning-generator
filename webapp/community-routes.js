'use strict';

const multer = require('multer');

/**
 * computeLevel — pure functie, makkelijk te testen.
 * @param {Array<{slug: string}>} allModules - alle modules uit elearning.modules
 * @param {Array<{module_slug: string, score_pct: number, completed: boolean}>} userProgress
 * @returns {number} 0-4
 */
function computeLevel(allModules, userProgress) {
  const total = allModules.length;
  if (total === 0) return 0;

  const abModules = allModules.filter(m => /^elearning-[ab]/.test(m.slug));
  const totalAB = abModules.length;

  const done = userProgress.filter(p => p.completed && p.score_pct >= 70);
  const perfect = userProgress.filter(p => p.completed && p.score_pct === 100);
  const abDone = done.filter(p => /^elearning-[ab]/.test(p.module_slug));

  if (perfect.length >= total) return 4;
  if (done.length >= total) return 3;
  if (done.length > total / 2) return 2;
  if (totalAB > 0 && abDone.length >= totalAB) return 1;
  return 0;
}

/**
 * Haalt het level op van een gebruiker.
 * @param {string} userId
 * @param {object} supabase
 * @returns {Promise<{level: number, completed: number, total: number}>}
 */
async function fetchLevel(userId, supabase) {
  const [{ data: allModules }, { data: progress }] = await Promise.all([
    supabase.from('modules').select('slug'),
    supabase.from('user_progress').select('module_slug, score_pct, completed').eq('user_id', userId),
  ]);

  const total = (allModules || []).length;
  const completedCount = (progress || []).filter(p => p.completed && p.score_pct >= 70).length;
  const level = computeLevel(allModules || [], progress || []);

  return { level, completed: completedCount, total };
}

/**
 * Geeft de minimale vereiste level om een room te lezen/schrijven.
 */
function canAccessRoom(userLevel, roomLevel) {
  return userLevel >= roomLevel;
}

/**
 * Validates profile input. Returns error string or null.
 */
function validateProfileInput(body) {
  const { bio, specializations } = body || {};
  if (!bio || bio.trim().length === 0) return 'Bio is verplicht.';
  if (bio.length > 300) return 'Bio mag maximaal 300 tekens bevatten.';
  if (!Array.isArray(specializations) || specializations.length === 0) return 'Minimaal één specialisatie is verplicht.';
  if (specializations.some(s => typeof s !== 'string' || s.trim().length === 0 || s.length > 50))
    return 'Specialisaties mogen maximaal 50 tekens bevatten.';
  return null;
}

/**
 * Mounts alle community routes op de Express app.
 * @param {object} app - Express app
 * @param {object} supabase - Supabase client (schema: elearning)
 * @param {Function} requireAuth - bestaande auth middleware
 */
module.exports = function mountCommunityRoutes(app, supabase, requireAuth) {
  /**
   * Middleware: blokkeert toegang als community_enabled=false in app_settings.
   * Admins komen altijd door.
   */
  async function requireCommunityAccess(req, res, next) {
    try {
      const { data: setting } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'community_enabled')
        .single();

      const enabled = !setting || setting.value !== 'false';
      if (enabled) return next();

      // Community uit — admins mogen er altijd in
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (profile?.role === 'admin') {
        req.isAdmin = true;
        return next();
      }

      return res.status(403).json({ error: 'Community is momenteel uitgeschakeld.' });
    } catch (err) {
      console.error('[community/access]', err.message);
      next(); // fail-open
    }
  }

  /**
   * GET /api/community/level
   * Geeft het huidige level van de ingelogde gebruiker terug.
   */
  app.get('/api/community/level', requireAuth, requireCommunityAccess, async (req, res) => {
    try {
      const result = await fetchLevel(req.user.id, supabase);

      // Admin-check (los van BETA: admins zijn altijd level 4 voor de UI)
      if (!req.isAdmin) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', req.user.id)
          .single();
        req.isAdmin = profile?.role === 'admin';
      }

      res.json({
        level: req.isAdmin ? Math.max(result.level, 4) : result.level,
        completed: result.completed,
        total: result.total,
        isAdmin: !!req.isAdmin,
      });
    } catch (err) {
      console.error('[community/level]', err.message);
      res.status(500).json({ error: 'Kon level niet berekenen.' });
    }
  });

  /**
   * GET /api/community/messages/:level
   * Geeft de laatste 100 berichten terug voor de opgegeven room.
   */
  app.get('/api/community/messages/:level', requireAuth, requireCommunityAccess, async (req, res) => {
    try {
      const roomLevel = parseInt(req.params.level, 10);
      if (![1, 2, 3, 4].includes(roomLevel)) {
        return res.status(400).json({ error: 'Ongeldig room-level.' });
      }

      // Resolve admin status (requireCommunityAccess zet req.isAdmin alleen als COMMUNITY_BETA=true)
      let isAdmin = req.isAdmin || false;
      if (!isAdmin) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', req.user.id).single();
        isAdmin = profile?.role === 'admin';
        req.isAdmin = isAdmin; // cache voor consistentie
      }

      // Controleer of gebruiker dit level heeft (admins altijd toegestaan)
      if (!isAdmin) {
        const { level } = await fetchLevel(req.user.id, supabase);
        if (!canAccessRoom(level, roomLevel)) {
          return res.status(403).json({ error: 'Geen toegang tot deze room.' });
        }
      }

      const { data, error } = await supabase
        .from('community_messages')
        .select('id, user_id, user_name, is_admin, content, created_at')
        .eq('room_level', roomLevel)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) return res.status(500).json({ error: error.message });
      res.json({ messages: data || [] });
    } catch (err) {
      console.error('[community/messages/get]', err.message);
      res.status(500).json({ error: 'Kon berichten niet ophalen.' });
    }
  });

  /**
   * POST /api/community/messages
   * Stuurt een nieuw bericht naar een room.
   * Body: { room_level: number, content: string }
   */
  app.post('/api/community/messages', requireAuth, requireCommunityAccess, async (req, res) => {
    const { room_level, content } = req.body;

    if (![1, 2, 3, 4].includes(room_level)) {
      return res.status(400).json({ error: 'Ongeldig room-level.' });
    }
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Bericht mag niet leeg zijn.' });
    }
    if (content.length > 2000) {
      return res.status(400).json({ error: 'Bericht mag maximaal 2000 tekens bevatten.' });
    }

    // Controleer of gebruiker dit level heeft
    let isAdmin = req.isAdmin || false;
    if (!isAdmin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();
      isAdmin = profile?.role === 'admin';
      req.isAdmin = isAdmin; // cache voor consistentie
    }

    if (!isAdmin) {
      const { level } = await fetchLevel(req.user.id, supabase);
      if (!canAccessRoom(level, room_level)) {
        return res.status(403).json({ error: 'Geen toegang tot deze room.' });
      }
    }

    // Bepaal weergavenaam
    const meta = req.user.user_metadata || {};
    const userName = [meta.firstName, meta.lastName].filter(Boolean).join(' ')
      || req.user.email.split('@')[0];

    const { error } = await supabase
      .from('community_messages')
      .insert({
        room_level,
        user_id: req.user.id,
        user_name: userName,
        is_admin: isAdmin,
        content: content.trim(),
      });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
  });

  /**
   * DELETE /api/community/messages/:id
   * Admin kan elk bericht verwijderen.
   */
  app.delete('/api/community/messages/:id', requireAuth, async (req, res) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (profile?.role !== 'admin') {
        return res.status(403).json({ error: 'Alleen admins kunnen berichten verwijderen.' });
      }

      const { error } = await supabase
        .from('community_messages')
        .delete()
        .eq('id', req.params.id);

      if (error) return res.status(500).json({ error: error.message });
      res.json({ ok: true });
    } catch (err) {
      console.error('[community/delete-message]', err.message);
      res.status(500).json({ error: 'Serverfout.' });
    }
  });

  // ── PROFILE ENDPOINTS ────────────────────────────────────────────────────

  /**
   * GET /api/community/profile/me
   * Returns own profile + whether it is complete.
   */
  app.get('/api/community/profile/me', requireAuth, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('community_profiles')
        .select('*')
        .eq('user_id', req.user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        return res.json({ profile: null, complete: false });
      }
      if (error) return res.status(500).json({ error: error.message });

      const complete = (data.bio || '').length > 0 && (data.specializations || []).length > 0;
      res.json({ profile: data, complete });
    } catch (err) {
      console.error('[community/profile/me]', err.message);
      res.status(500).json({ error: 'Kon profiel niet ophalen.' });
    }
  });

  /**
   * PUT /api/community/profile/me
   * Create or update own profile.
   */
  app.put('/api/community/profile/me', requireAuth, async (req, res) => {
    try {
      const validationError = validateProfileInput(req.body);
      if (validationError) return res.status(400).json({ error: validationError });

      const { bio, specializations, company, website, instagram, twitter, linkedin, is_public } = req.body;

      const { error } = await supabase
        .from('community_profiles')
        .upsert({
          user_id: req.user.id,
          bio: bio.trim(),
          specializations,
          company: company || null,
          website: website || null,
          instagram: instagram || null,
          twitter: twitter || null,
          linkedin: linkedin || null,
          is_public: is_public !== false,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) return res.status(500).json({ error: error.message });
      res.json({ ok: true });
    } catch (err) {
      console.error('[community/profile/me PUT]', err.message);
      res.status(500).json({ error: 'Kon profiel niet opslaan.' });
    }
  });

  /**
   * GET /api/community/profile/:userId
   * Returns public profile of any user.
   */
  app.get('/api/community/profile/:userId', requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const isOwnProfile = userId === req.user.id;

      const { data, error } = await supabase
        .from('community_profiles')
        .select('user_id, bio, specializations, company, website, instagram, twitter, linkedin, avatar_url, is_public')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Profiel niet gevonden.' });
      }
      if (error) return res.status(500).json({ error: error.message });

      // Module stats
      const [{ data: allModules }, { data: progress }] = await Promise.all([
        supabase.from('modules').select('slug'),
        supabase.from('user_progress').select('module_slug, score_pct, completed').eq('user_id', userId),
      ]);
      const totalModules = (allModules || []).length;
      const completedModules = (progress || []).filter(p => p.completed && p.score_pct >= 70).length;
      const level = computeLevel(allModules || [], progress || []);

      // Follow stats
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase.from('community_follows').select('*', { count: 'exact', head: true }).eq('target_id', userId).eq('status', 'accepted'),
        supabase.from('community_follows').select('*', { count: 'exact', head: true }).eq('requester_id', userId).eq('status', 'accepted'),
      ]);

      // Admin check
      const { data: profileRow } = await supabase.from('profiles').select('role').eq('id', userId).single();
      const isAdmin = profileRow?.role === 'admin';

      // Auth.users metadata for display name
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      const meta = authUser?.user?.user_metadata || {};
      const displayName = [meta.firstName, meta.lastName].filter(Boolean).join(' ')
        || meta.full_name || meta.name || authUser?.user?.email?.split('@')[0] || 'Gebruiker';

      if (!data.is_public && !isOwnProfile) {
        return res.json({
          profile: { is_public: false },
          display_name: displayName,
          module_stats: { completed: 0, total: totalModules },
          follow_stats: { followers: followers || 0, following: following || 0 },
          level,
          is_admin: isAdmin,
          is_own: false,
        });
      }

      res.json({
        profile: data,
        display_name: displayName,
        module_stats: { completed: completedModules, total: totalModules },
        follow_stats: { followers: followers || 0, following: following || 0 },
        level,
        is_admin: isAdmin,
        is_own: isOwnProfile,
      });
    } catch (err) {
      console.error('[community/profile/:userId]', err.message);
      res.status(500).json({ error: 'Kon profiel niet ophalen.' });
    }
  });

  /**
   * POST /api/community/profile/avatar
   * Upload avatar to Supabase Storage.
   */
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
      else cb(new Error('Alleen JPEG, PNG of WebP toegestaan.'));
    },
  });

  app.post('/api/community/profile/avatar', requireAuth, (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Bestand is te groot. Max 2MB.' });
      }
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'Geen bestand ontvangen.' });

      const ext = req.file.mimetype === 'image/webp' ? 'webp' : req.file.mimetype === 'image/png' ? 'png' : 'jpg';
      const path = `avatars/${req.user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('community-avatars')
        .upload(path, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) return res.status(500).json({ error: uploadError.message });

      const { data: urlData } = supabase.storage.from('community-avatars').getPublicUrl(path);
      const avatarUrl = urlData.publicUrl;

      const { error: dbError } = await supabase
        .from('community_profiles')
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('user_id', req.user.id);

      if (dbError) return res.status(500).json({ error: dbError.message });

      res.json({ ok: true, avatar_url: avatarUrl });
    } catch (err) {
      console.error('[community/profile/avatar]', err.message);
      res.status(500).json({ error: 'Kon foto niet uploaden.' });
    }
  });
};

// Exporteer computeLevel apart zodat tests het direct kunnen importeren
module.exports.computeLevel = computeLevel;
module.exports.validateProfileInput = validateProfileInput;
