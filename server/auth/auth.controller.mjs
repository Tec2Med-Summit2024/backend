import { registerAcc, verifyCode, changePass } from './auth.service.mjs';

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const registerAccount = async (req, res) => {
  try {
    const result = await registerAcc(req.body.email);
    if (result.ok) {
      return res.status(200).json(result);
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
export const emailVerification = async (req, res) => {
  try {
    const result = await verifyCode(req.body.email, req.body.code);
    if (result.ok) {
      return res.status(200).json(result);
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
export const changePassword = async (req, res) => {
  try {
    const result = await changePass(req.body.email, req.body.password);
    if (result.ok) {
      return res.status(200).json(result);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};





