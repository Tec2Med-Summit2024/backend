import express from 'express';
// remove this comment and add your controller functions
import { getUserTicket, getUserQRCode, getUserEvents, getUsers, updateSettings, getNotifications, getUserType} from './users.controller.mjs';
import { authenticateToken, verifyUsername } from '../../middleware/verifier.mjs';

const router = express.Router();

router.param('username', verifyUsername);
router.use(authenticateToken);

/**
 * 
 */
router.get('/:username/ticket', getUserTicket);

/**
 * 
 */
router.get('/:username/qrcode', getUserQRCode);

/**
 * 
 */
router.get('/:username/events', getUserEvents);

/**
 * 
 */
router.get('/:username/notifications', getNotifications);


/**
 *           
 */
router.get('', getUsers);

/**
 * 
 */
router.put('/:username/settings', updateSettings);

/**
 * 
 */
router.get('/:username/type', getUserType);



export default router;
