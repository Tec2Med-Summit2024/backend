import express from 'express';
 // remove this comment and add your controller functions
import { getCV, getPartner, sendCVToPartner, getAllPartnerCVs, getFollowers, checkCVStatusEndpoint, recordEmailCVSentEndpoint } from './partners.controller.mjs';
import { verifyUsername, authenticateToken } from '../../middleware/verifier.mjs';
 
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
 
 /**
  *
  */
 router.get('/:username/cv-status', checkCVStatusEndpoint);
 
/**
* Record that an authenticated attendee sent their CV via email to this partner
*/
router.post('/:username/cv-sent', authenticateToken, recordEmailCVSentEndpoint);
 
 export default router;
