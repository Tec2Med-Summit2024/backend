import express from 'express';
import { verifyAccount, emailVerification, changePassword, loginAccount } from './auth.controller.mjs';
import { authenticatePasswordChange } from '../middleware/verifyPasswordResetToken.mjs';


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
 * Enhanced password endpoint that supports both:
 * 1. JWT token authentication (for logged-in users changing password)
 * 2. Verification token authentication (for signup/forgot password flows)
 */
router.put('/password', authenticatePasswordChange, changePassword);



export default router;
