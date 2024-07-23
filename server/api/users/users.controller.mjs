import { 
  getTicket,
  getQRCode,
  getEvents,
  getConnections,
  getNotifications,
  searchUsers,
  updateUserSettings,
  getRecommendations
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
export const getUserConnections = async (req, res) => {
  const result = await getConnections(req.username, req.role);
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
export const getUserNotifications = async (req, res) => {
  const result = await getNotifications(req.username, req.role);
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
export const getUserRecommendations = async (req, res) => {
  const result = await getRecommendations(req.username, req.role);
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
  const result = await searchUsers(req.query.name); // query param either a value or undefined
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

