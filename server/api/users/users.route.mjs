import express from 'express';
// remove this comment and add your controller functions
import { getUserTicket, getUserQRCode, getUserEvents, getUsers, updateSettings, getNotifications, getUserType, followUserController, unfollowUserController, getFollowingController, checkFollowingController} from './users.controller.mjs';
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

/**
 * Follow a user
 */
router.post('/follow/:targetUsername', authenticateToken, (req, res, next) => {
  // For follow/unfollow, we use the authenticated user's username, not a route parameter
  req.username = req.user.username;
  next();
}, followUserController);

/**
 * Unfollow a user
 */
router.delete('/follow/:targetUsername', authenticateToken, (req, res, next) => {
  // For follow/unfollow, we use the authenticated user's username, not a route parameter
  req.username = req.user.username;
  next();
}, unfollowUserController);

/**
 * Get list of users that the current user follows
 */
router.get('/:username/following', authenticateToken, getFollowingController);

/**
 * Check if current user follows a specific user
 */
router.get('/following/:targetUsername', authenticateToken, (req, res, next) => {
  // For check following, we use the authenticated user's username, not a route parameter
  req.username = req.user.username;
  next();
}, checkFollowingController);



export default router;
