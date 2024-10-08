import express from 'express';
// remove this comment and add your controller functions
import { registerAccount, loginAccount, logoutAccount } from './auth.controller.mjs';

const router = express.Router();


/**
 * 
 */
router.post('/register', registerAccount);

/**
 * 
 */
router.post('/login', loginAccount);

/**
 * 
 */
router.post('/:username', logoutAccount);



export default router;
