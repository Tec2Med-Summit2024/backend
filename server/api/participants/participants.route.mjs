// TODO: Add documentation

import express from 'express';
import {
  getParticipant,
  updateParticipant,
  addEventToSchedule,
  removeEventFromSchedule,
  addCertificate,
  getCertificate,
  getCertificates,
  getQuestions,
  getFollowedPartners,
  uploadProfileImage,
} from './participants.controller.mjs';
import { verifyUsername } from '../../middleware/verifier.mjs';
import { validateProfileImageUpload, handleMultipartData, handleFileUploadErrors } from '../../middleware/fileUploadValidation.mjs';

const router = express.Router();

router.param('username', verifyUsername);

// participants resource routes

/**
 *
 */
router.get('/:username', getParticipant);

/**
 *
 */
router.put('/:username', handleMultipartData, updateParticipant);

/**
 *
 */
router.post('/:username/events', addEventToSchedule);

/**
 *
 */
router.delete('/:username/events/:eventID', removeEventFromSchedule);

/**
 *
 */
router.post('/:username/certificates', addCertificate);

/**
 *
 */
router.get('/:username/certificates/:certificateID', getCertificate);

/**
 *
 */
router.get('/:username/certificates', getCertificates);

/**
 *
 */
router.get('/:username/questions', getQuestions);

/**
 *
 */
router.get('/:username/partners', getFollowedPartners);

/**
 * Upload profile image for a participant
 */
router.post('/:username/profile-image', validateProfileImageUpload, uploadProfileImage);

export default router;
