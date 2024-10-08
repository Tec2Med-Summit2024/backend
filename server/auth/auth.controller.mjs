import { registerAcc, loginAcc, logoutAcc } from './auth.service.mjs';

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const registerAccount = async (req, res) => {
  try {
    const result = await registerAcc(req.body.email);
    if (result.ok) {
      return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const loginAccount = async (req, res) => {
  try {
    const result = await loginAcc(req.body);
    if (result.ok) {
      return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const logoutAccount = async (req, res) => {
  try {
    const result = await logoutAcc(req.body);
    if (result.ok) {
      return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

