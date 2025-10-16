import { getPartnerFromDb, getCVFromPartner, addCVToPartner, getAllCVsFromPartner, getFollowersFromPartner, checkCVStatus, recordEmailCVSent } from './partners.service.mjs';

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const getPartner = async (req, res) => {
  const result = await getPartnerFromDb(req.username);
  if (result.ok) {
    return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const sendCVToPartner = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const result = await addCVToPartner(req.username, req.files);
  if (result.ok) {
    return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const getAllPartnerCVs = async (req, res) => {
  const result = await getAllCVsFromPartner(req.username);
  if (result.ok) {
    return res.status(200).json(result.value);
  }

  return res.status(result.error).json({ error: result.errorMsg });
};


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const getCV = async (req, res) => {
  const result = await getCVFromPartner(req.params.username, req.params.cvID);
  if (result.ok) {
    return res.status(200).json(result.value);
  }

  return res.status(result.error).json({ error: result.errorMsg });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const checkCVStatusEndpoint = async (req, res) => {
  const { username: partnerUsername } = req.params;

  // Prefer authenticated user (req.user) as the attendee.
  // Fall back to req.usernamespace only when present and meaningful.
  const attendeeUsername = req.user?.username ?? null;

  // If we don't have an authenticated attendee, return cvSent: false
  if (!attendeeUsername) {
    return res.status(200).json({ cvSent: false });
  }

  const result = await checkCVStatus(attendeeUsername, partnerUsername);
  if (result.ok) {
    return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
};

/**
 * Record that the authenticated attendee sent their CV via email to this partner.
 * Calls service.recordEmailCVSent and returns created CV node metadata.
 */
export const recordEmailCVSentEndpoint = async (req, res) => {
  // Debug logging to trace 404 / missing auth issues
  console.log('[partners.controller] recordEmailCVSentEndpoint called', {
    method: req.method,
    params: req.params,
    hasAuthHeader: !!req.headers?.authorization,
    user: req.user ?? null,
  });

  const { username: partnerUsername } = req.params;
  const attendeeUsername = req.user?.username;

  // Require authentication
  if (!attendeeUsername) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const result = await recordEmailCVSent(attendeeUsername, partnerUsername);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (err) {
    console.error('[partners.controller] recordEmailCVSentEndpoint error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const getFollowers = async (req, res) => {
  const result = await getFollowersFromPartner(req.params.username);
  if (result.ok) {
    return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
};

