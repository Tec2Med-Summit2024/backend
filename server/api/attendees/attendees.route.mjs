import express from 'express';
// remove this comment and add your controller functions
import {
  getAttendee,
  updateAttendee,
  addEventToSchedule,
  removeEventFromSchedule,
  addConnectionRequest,
  getRequests,
  decideRequest,
  deleteConnection,
  getContacts,
  addCertificate,
  getCertificate,
  getCertificates,
  getQuestions,
  getFollowedPartners,
} from './attendees.controller.mjs';
import { verifyUsername } from '../../middleware/verifier.mjs';

const router = express.Router();

router.param('username', verifyUsername);

// attendees resource routes

/**
 *
 */
router.get('/:username', getAttendee);

/**
 *
 */
router.put('/:username', updateAttendee);

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
router.post('/:username/request', addConnectionRequest);

/**
 *
 */
router.get('/:username/request', getRequests);

/**
 *
 */
router.delete('/:username/request/:requestID', decideRequest);

/**
 *
 */
router.delete('/:username/connections/:connectionID', deleteConnection);

/**
 *
 */
router.get('/:username/contacts', getContacts);

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

export default router;
