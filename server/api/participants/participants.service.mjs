// TODO: Add documentation

import {
  getParticipantByUsername,
  updateParticipantWithData,
  addEventToSchedule,
  removeEventFromSchedule,
  addConnectionRequest,
  getSentConnectionRequests,
  getReceivedConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  deleteConnection,
  getParticipantContactsInDb,
  addCertificate,
  getCertificate,
  getCertificates,
  getQuestions,
  getFollowedPartners,
} from './participants.db.mjs';

import { getEventById } from '../events/events.db.mjs';

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
  const event = await getEventById(eventID);
  if (!event) {
    return { ok: false, error: 404, errorMsg: 'Event not found' };
  }
  if (event.curr_cap === event.max_cap) {
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
  const event = await getEventById(eventID);
  if (!event) {
    return { ok: false, error: 404, errorMsg: 'Event not found' };
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
 * @param {string} eventID
 */
export const addConnectionRequestToParticipant = async (
  username,
  otherUsername
) => {
  const participant = await getParticipantByUsername(username);
  const otherParticipant = await getParticipantByUsername(otherUsername);
  if (!participant || !otherParticipant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  const result = await addConnectionRequest(username, otherUsername);
  if (!result) {
    return {
      ok: false,
      error: 500,
      errorMsg: 'Unable to add connection request',
    };
  }

  return { ok: true, value: result };
};

/**
 *
 * @param {string} username
 * @param {string} eventID
 */
export const getParticipantRequests = async (username, sent, received) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }
  if (sent) {
    return { ok: true, value: await getSentConnectionRequests(username) };
  }
  if (received) {
    return { ok: true, value: await getReceivedConnectionRequests(username) };
  }
  const sentRequests = await getSentConnectionRequests(username);
  const receivedRequests = await getReceivedConnectionRequests(username);
  return {
    ok: true,
    value: { sent: sentRequests, received: receivedRequests },
  };
};

/**
 *
 * @param {string} username
 * @param {string} partnerUsername
 */
export const decideOnRequest = async (username, requestID, accepted) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  // const partner = await getPartnerByUsername(partnerUsername);
  // if (!partner) {
  //   return { ok: false, error: 404, errorMsg: 'Partner not found' };
  // }

  // TODO: Check if request exists

  let result;
  if (accepted) {
    result = await acceptConnectionRequest(username, requestID);
    return { ok: true, value: result };
  } else {
    result = await rejectConnectionRequest(username, requestID);
  }
  if (!result) {
    return { ok: false, error: 500, errorMsg: 'Unable to accept request' };
  }

  return { ok: true, value: result };
};

/**
 *
 * @param {string} username
 * @param {string} partnerUsername
 */
export const deleteParticipantConnection = async (username, connectionID) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  // const partner = await getPartnerByUsername(partnerUsername);
  // if (!partner) {
  //   return { ok: false, error: 404, errorMsg: 'Partner not found' };
  // }

  // TODO: Check if connection exists

  const result = await deleteConnection(username, connectionID);
  if (!result) {
    return { ok: false, error: 500, errorMsg: 'Unable to delete connection' };
  }

  return { ok: true, value: result };
};

/**
 *
 * @param {string} username
 * @param {string} partnerUsername
 */
export const getParticipantContacts = async (username) => {
  const participant = await getParticipantByUsername(username);
  if (!participant) {
    return { ok: false, error: 404, errorMsg: 'Participant not found' };
  }

  return { ok: true, value: await getParticipantContactsInDb(username) };
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
