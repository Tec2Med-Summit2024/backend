import {
  getPartnerByUsername,
  searchReceivedCVsByPartener,
} from './partners.db.mjs';

export const getPartnerFromDb = async (username) => {
  const partner = await getPartnerByUsername(username);
  if (!partner) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }

  return { ok: true, value: partner };
};

export const addCVToPartner = async (username, cv) => {
  // TODO: Implement this function
};

export const getCVFromPartner = async (username, cvID) => {
  // TODO: Implement this function
};

export const searchPartnerCVs = async (username, query) => {
  const partner = await getPartnerByUsername(username);
  if (!partner) {
    return { ok: false, error: 404, errorMsg: 'Partner not found' };
  }
  return {
    ok: true,
    value: await searchReceivedCVsByPartener(username, query),
  };
};
