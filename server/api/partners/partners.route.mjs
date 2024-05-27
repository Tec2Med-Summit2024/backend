import express from 'express';
// remove this comment and add your controller functions
import { getCV, getPartner, sendCVToPartner, searchCVs } from './partners.controller.mjs';

const router = express.Router();

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
router.get('/:username/cvs/:cvID', getCV);

/**
 *
 */
router.get('/:username/cvs', searchCVs);

export default router;
