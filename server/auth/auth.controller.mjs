import { verifyAcc, verifyCode, changePass, loginAcc } from './auth.service.mjs';

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const verifyAccount = async (req, res) => {
  try {
    const result = await verifyAcc(req.body.email);
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
    const { email, password } = req.body;
    const userId = req.user?.id || req.user?.username;
    
    // Log password change attempt
    console.log(`🔐 Password change attempt for email: ${email}, user: ${userId}`);
    
    // Validate input
    if (!email || !password) {
      console.log(`❌ Password change failed - missing email or password for user: ${userId}`);
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Additional security logging
    if (req.user && req.user.email !== email) {
      console.log(`⚠️  Security warning: User ${userId} attempting to change password for different email ${email}`);
      // You might want to add additional security measures here
    }
    
    const result = await changePass(email, password);
    
    if (result.ok) {
      console.log(`✅ Password successfully changed for email: ${email}, user: ${userId}`);
      return res.status(200).json(result);
    }
    
    console.log(`❌ Password change failed for email: ${email}, error: ${result.errorMsg}`);
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    console.error(`💥 Password change error for email: ${req.body.email}:`, error);
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
    const result = await loginAcc(req.body.email, req.body.password);
    if (result.ok) {
      return res.status(200).json(result);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



