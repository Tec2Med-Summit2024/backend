import express from 'express';
// remove this comment and add your controller functions
import { getUserTicket, getUserQRCode, getUserEvents, getUserConnections, getUsers, updateSettings, getNotifications} from './users.controller.mjs';
import { verifyRole, verifyUsername } from '../../middleware/verifier.mjs';

const router = express.Router();

router.param('username', verifyUsername);

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
router.get('/:username/connections', getUserConnections);

/**
 * 
 */
router.get('/:username/notifications', getNotifications);


/**
 *           
 */
router.get('', verifyRole, getUsers);

/**
 * 
 */
router.put('/:username/settings', updateSettings);


export default router;
