import { 
  getTicket,
  getQRCode,
  getEvents,
  getUserNotifications,
  searchUsers,
  updateUserSettings,
  getUserTypes
} from './users.service.mjs';

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const getUserTicket = async (req, res) => {
  const result = await getTicket(req.username, req.role);
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
export const getUserQRCode = async (req, res) => {
  const result = await getQRCode(req.username, req.role);
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
export const getUserEvents = async (req, res) => {
  const result = await getEvents(req.username, req.role);
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
export const getNotifications = async (req, res) => {
  const result = await getUserNotifications(req.username, req.role);
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
export const getUsers = async (req, res) => {
  const result = await searchUsers(req.query.name, req.query.type, req.user, req.query.location, 
    req.query.field, req.query.institution, req.query.interests, req.query.expertises, req.query.limit); 
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
export const updateSettings = async (req, res) => {
  const result = await updateUserSettings(req.username, req.role, req.body);
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
export const getUserType = async (req, res) => {
  const result = await getUserTypes(req.username, req.role);
  if (result.ok) {
    return res.status(200).json(result.value);
  }
  
  return res.status(result.error).json({ error: result.errorMsg });
};



