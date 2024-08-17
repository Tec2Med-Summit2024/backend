import {
  getAttendeeByUsername,
  updateAttendeeWithData,
  addEventToSchedule,
  removeEventFromSchedule,
  addConnectionRequest,
  getSentConnectionRequests,
  getReceivedConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  deleteConnection,
  getAttendeeContactsInDb,
  addCertificate,
  getCertificate,
  getCertificates,
  getQuestions,
  getFollowedPartners,
} from './attendees.db.mjs';

export const getAttendeeFromDb = async (username) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
  }

  return { ok: true, value: attendee };
};

export const updateAttendeeInDb = async (username, data) => {
  const attendee = await updateAttendeeWithData(username, data);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
  }

  return { ok: true, value: attendee };
};

export const addEventToAttendeeSchedule = async (username, eventID) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
  }

  // TODO: Check if event exists

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
export const removeEventFromAttendeeSchedule = async (username, eventID) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
  }

  // TODO: Check if event exists

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
export const addConnectionRequestToAttendee = async (
  username,
  otherUsername
) => {
  const attendee = await getAttendeeByUsername(username);
  const otherAttendee = await getAttendeeByUsername(otherUsername);
  if (!attendee || !otherAttendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
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
export const getAttendeeRequests = async (username, sent, received) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
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
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
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
export const deleteAttendeeConnection = async (username, connectionID) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
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
export const getAttendeeContacts = async (username) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
  }

  return { ok: true, value: await getAttendeeContactsInDb(username) };
};

/**
 *
 * @param {string} username
 */
export const addAttendeeCertificate = async (username, certificate) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
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
export const getAttendeeCertificate = async (username, certificateID) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
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
export const getAttendeeCertificates = async (username) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
  }

  return { ok: true, value: await getCertificates(username) };
};

/**
 *
 * @param {string} username
 */
export const getAttendeeQuestions = async (username) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
  }

  return { ok: true, value: await getQuestions(username) };
};

/**
 *
 * @param {string} username
 */
export const getAttendeeFollowedPartners = async (username) => {
  const attendee = await getAttendeeByUsername(username);
  if (!attendee) {
    return { ok: false, error: 404, errorMsg: 'Attendee not found' };
  }

  return { ok: true, value: await getFollowedPartners(username) };
};
