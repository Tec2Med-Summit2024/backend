import {
  getPartnerByUsername,
  sendCVToPartner,
  getReceivedCVsByPartner,
  getCV
} from './partners.db.mjs';

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
