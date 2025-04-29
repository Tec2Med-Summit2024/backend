import express from 'express';
// remove this comment and add your controller functions
import { getCV, getPartner, sendCVToPartner, getAllPartnerCVs, getFollowers } from './partners.controller.mjs';
import { verifyUsername } from '../../middleware/verifier.mjs';

const router = express.Router();

router.param('username', verifyUsername);

/**
 * 
 */
router.get('/:username', getPartner);

/**
 * 
 */
router.post('/:username/cvs', sendCVToPartner);

/**
 * 
 */
router.get('/:username/cvs', getAllPartnerCVs);

/**
 * 
 */
router.get('/:username/cvs/:cvID', getCV);

/**
 * 
 */
router.get('/:username/followers', getFollowers);


export default router;
