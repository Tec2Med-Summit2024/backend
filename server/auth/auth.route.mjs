import express from 'express';
import { verifyAccount, emailVerification, changePassword, loginAccount } from './auth.controller.mjs';
import { authenticateToken } from '../middleware/verifier.mjs';


const router = express.Router();

/**
 * 
 */
router.post('/request-verification', verifyAccount);


/**
 * 
 */
router.post('/verify', emailVerification);


/**
 * 
 */
router.post('/login', loginAccount);

/**
 * 
 */
router.put('/password',authenticateToken, changePassword);



export default router;
