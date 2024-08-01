import { getPartnerByUsername } from '../partners/partners.db.mjs';

import {
    getAttendeeByUsername,
    updateAttendeeWithData,
    addEventToSchedule,
    removeEventFromSchedule,
    addConnectionRequest,
    getConnectionRequests,
    decideConnectionRequest,
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
  
    const result = await addEventToSchedule(username, eventID);
    if (!result) {
      return { ok: false, error: 500, errorMsg: 'Unable to add event to schedule' };
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
  
    const result = await removeEventFromSchedule(username, eventID);
    if (!result) {
      return { ok: false, error: 500, errorMsg: 'Unable to remove event from schedule' };
    }
  
    return { ok: true, value: result };
};

/**
 * 
 * @param {string} username 
 * @param {string} eventID 
 */
export const addConnectionRequestToAttendee = async (username, eventID) => {
    const attendee = await getAttendeeByUsername(username);
    if (!attendee) {
      return { ok: false, error: 404, errorMsg: 'Attendee not found' };
    }
  
    const result = await addConnectionRequest(username, eventID);
    if (!result) {
      return { ok: false, error: 500, errorMsg: 'Unable to add connection request' };
    }
  
    return { ok: true, value: result };
};

/**
 * 
 * @param {string} username 
 * @param {string} eventID 
 */
export const getAttendeeRequests = async (username) => {
    const attendee = await getAttendeeByUsername(username);
    if (!attendee) {
      return { ok: false, error: 404, errorMsg: 'Attendee not found' };
    }
  
    return { ok: true, value: await getConnectionRequests(username) };
};

/**
 * 
 * @param {string} username 
 * @param {string} partnerUsername 
 */
export const decideOnRequest = async (username, partnerUsername, accept) => {
    const attendee = await getAttendeeByUsername(username);
    if (!attendee) {
      return { ok: false, error: 404, errorMsg: 'Attendee not found' };
    }
  
    const partner = await getPartnerByUsername(partnerUsername);
    if (!partner) {
      return { ok: false, error: 404, errorMsg: 'Partner not found' };
    }
  
    const result = await decideConnectionRequest(username, partnerUsername, accept);
    if (!result) {
      return { ok: false, error: 500, errorMsg: 'Unable to decide on request' };
    }
  
    return { ok: true, value: result };
};

/**
 * 
 * @param {string} username 
 * @param {string} partnerUsername 
 */
export const deleteAttendeeConnection = async (username, partnerUsername) => {
    const attendee = await getAttendeeByUsername(username);
    if (!attendee) {
      return { ok: false, error: 404, errorMsg: 'Attendee not found' };
    }
  
    const partner = await getPartnerByUsername(partnerUsername);
    if (!partner) {
      return { ok: false, error: 404, errorMsg: 'Partner not found' };
    }
  
    const result = await deleteConnection(username, partnerUsername);
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
  
    return { ok: true, value: await getCertificate(username, certificateID) };
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
