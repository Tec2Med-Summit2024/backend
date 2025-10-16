import {
  getPartnerByUsername,
  sendCVToPartner,
  getReceivedCVsByPartner,
  getCV,
  getFollowersByPartner,
  checkCVSentToPartner,
  recordEmailCVFromAttendee
} from './partners.db.mjs';
import crypto from 'crypto';

export const getPartnerFromDb = async (username) => {
  const partner = await getPartnerByUsername(username);
  if (!partner) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }

  return { ok: true, value: partner };
};

export const addCVToPartner = async (username, files) => {

  const partner = await getPartnerByUsername(username);
  if (!partner) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }

  const cv = files.pdf;

  if (!cv) {
    return { ok: false, error: 404, errorMsg: 'Pdf not found' };
  }

  const uploadPath = `./tmp/${cv.name}`;
  cv.mv(uploadPath, function (err) {
    if (err)
      return { ok: false, error: 500, errorMsg: err };

    console.log('File uploaded!');
  });

  const uuid = crypto.randomUUID();
  const cvID = await sendCVToPartner(username, uuid);

  if (!cvID) {
    return { ok: false, error: 500, errorMsg: 'Unable to add CV' };
  }

  return { ok: true, value: cvID };
};

/**
 * Get all the CVs from a partner identified by the username
 * @param {string} username 
 */
export const getAllCVsFromPartner = async (username) => {
  const partner = await getPartnerByUsername(username);
  if (!partner) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }

  return { ok: true, value: await getReceivedCVsByPartner(username) };
};

/**
 * 
 * @param {string} username 
 * @param {string} cvID 
 */
export const getCVFromPartner = async (username, cvID) => {
  const partner = await getPartnerByUsername(username);
  if (!partner) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }

  return { ok: true, value: await getCV(username, cvID) };
};

/**
 * Check if a user has sent their CV to a specific partner
 * @param {string} attendeeUsername
 * @param {string} partnerUsername
 */
export const checkCVStatus = async (attendeeUsername, partnerUsername) => {
  const result = await checkCVSentToPartner(attendeeUsername, partnerUsername);
  if (!result) {
    return { ok: true, value: { cvSent: false } };
  }
  return { ok: true, value: { cvSent: true } };
};

/**
 * 
 * @param {string} username 
 */
export const getFollowersFromPartner = async (username) => {
  const followers = await getPartnerByUsername(username);
  if (!followers) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }

  return { ok: true, value: await getFollowersByPartner(username) };
};

/**
 * Check if a user has sent their CV to a specific partner (single parameter version)
 * @param {string} partnerUsername
 */
export const getPartnerCVStatus = async (partnerUsername) => {
  const partner = await getPartnerByUsername(partnerUsername);
  if (!partner) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }
  
  // For now, return false as we don't have a specific implementation
  // This would need to be implemented based on your CV sending logic
  return { ok: true, value: { cvSent: false } };
};

/**
 * Record that an attendee sent their CV via email to a partner
 * @param {string} attendeeUsername
 * @param {string} partnerUsername
 */
export const recordEmailCVSent = async (attendeeUsername, partnerUsername) => {
  // Validate partner exists
  const partner = await getPartnerByUsername(partnerUsername);
  if (!partner) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }

  // Create a UUID for the CV record
  const uuid = crypto.randomUUID();

  try {
    const cv = await recordEmailCVFromAttendee(attendeeUsername, partnerUsername, uuid);
    if (!cv) {
      return { ok: false, error: 500, errorMsg: 'Unable to record CV send' };
    }
    return { ok: true, value: cv };
  } catch (err) {
    return { ok: false, error: 500, errorMsg: err.message || 'Internal error' };
  }
};

