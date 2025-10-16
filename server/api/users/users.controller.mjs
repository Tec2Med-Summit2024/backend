import {
  getTicket,
  getQRCode,
  getEvents,
  getUserNotifications,
  searchUsers,
  updateUserSettings,
  getUserTypes,
  followUser,
  unfollowUser,
  getFollowing,
  checkFollowing
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
  const result = await searchUsers(req.query.name, req.query.type, req.user.email, req.query.location,
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
export const followUserController = async (req, res) => {
  const { targetUsername } = req.params;
  const result = await followUser(req.username, targetUsername);
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
export const unfollowUserController = async (req, res) => {
  const { targetUsername } = req.params;
  const result = await unfollowUser(req.username, targetUsername);
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
export const getFollowingController = async (req, res) => {
  const result = await getFollowing(req.username);
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
export const checkFollowingController = async (req, res) => {
  const { targetUsername } = req.params;
  const result = await checkFollowing(req.username, targetUsername);
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



