// TODO: Add documentation

import {
  getParticipantByUsername,
  updateParticipantWithData,
  updateParticipantProfileImage,
  getParticipantProfileImage,
  addEventToSchedule,
  removeEventFromSchedule,
  addCertificate,
  getCertificate,
  getCertificates,
  getQuestions,
  getFollowedPartners,
} from './participants.db.mjs';

import { getEventById } from '../events/events.service.mjs';

export const getParticipantFromDb = async (username) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  return { ok: true, value: participant };
};

export const updateParticipantInDb = async (username, data) => {
  const participant = await updateParticipantWithData(username, data);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  return { ok: true, value: participant };
};

export const addEventToParticipantSchedule = async (username, eventID) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  // TODO: Check if event exists
  const eventRes = await getEventById(eventID);

  if (eventRes.ok === false) {
    return eventRes;
  }

  const e = eventRes.value;
  if (e.curr_cap === e.max_cap) {
    return { ok: false, error: 400, errorMsg: 'Event is full' };
  }

  const result = await addEventToSchedule(username, eventID);
  if (!result) {
    return {
      ok: false,
      error: 500,
      errorMsg: 'Unable to add event to schedule',
    };
  }

  return { ok: true, value: result };
};

/**
 *
 * @param {string} username
 * @param {string} eventID
 */
export const removeEventFromParticipantSchedule = async (username, eventID) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  // TODO: Check if event exists
  const eventRes = await getEventById(eventID);

  if (eventRes.ok === false) {
    return eventRes;
  }

  const result = await removeEventFromSchedule(username, eventID);
  if (!result) {
    return {
      ok: false,
      error: 500,
      errorMsg: 'Unable to remove event from schedule',
    };
  }

  return { ok: true, value: result };
};

/**
 *
 * @param {string} username
 */
export const addParticipantCertificate = async (username, certificate) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  // TODO: Check if certificate exists

  const result = await addCertificate(username, certificate);
  if (!result) {
    return { ok: false, error: 500, errorMsg: 'Unable to add certificate' };
  }

  return { ok: true, value: result };
};

/**
 *
 * @param {string} username
 */
export const getParticipantCertificate = async (username, certificateID) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  const certificate = await getCertificate(username, certificateID);
  if (!certificate) {
    return { ok: false, error: 404, errorMsg: 'Certificate not found' };
  }

  return { ok: true, value: certificate };
};

/**
 *
 * @param {string} username
 */
export const getParticipantCertificates = async (username) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  return { ok: true, value: await getCertificates(username) };
};

/**
 *
 * @param {string} username
 */
export const getParticipantQuestions = async (username) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  return { ok: true, value: await getQuestions(username) };
};

/**
 *
 * @param {string} username
 */
export const getParticipantFollowedPartners = async (username) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  return { ok: true, value: await getFollowedPartners(username) };
};

/**
 * Updates the profile image for a participant
 * @param {string} username - Participant username
 * @param {string} imagePath - Relative path to the profile image
 * @returns {Promise<{ok: boolean, profile_image?: string, error?: number, errorMsg?: string}>}
 */
export const updateParticipantProfileImageInDb = async (username, imagePath) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  const result = await updateParticipantProfileImage(username, imagePath);
  if (!result.success) {
    return { ok: false, error: 500, errorMsg: result.error };
  }

  return { ok: true, value: { profile_image: result.profile_image } };
};

/**
 * Gets the profile image for a participant
 * @param {string} username - Participant username
 * @returns {Promise<{ok: boolean, profile_image?: string, error?: number, errorMsg?: string}>}
 */
export const getParticipantProfileImageFromDb = async (username) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  const result = await getParticipantProfileImage(username);
  if (!result.success) {
    return { ok: false, error: 500, errorMsg: result.error };
  }

  return { ok: true, value: { profile_image: result.profile_image } };
};
