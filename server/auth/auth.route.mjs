import express from 'express';
// remove this comment and add your controller functions
import { registerAccount, emailVerification, changePassword } from './auth.controller.mjs';
import { authenticateToken } from '../middleware/verifier.mjs';

const router = express.Router();

/**
 * 
 */
router.post('/register', registerAccount);

/**
 * 
 */
router.post('/verification', emailVerification);


/**
 * 
 */
router.post('/password',authenticateToken, changePassword);






export default router;
