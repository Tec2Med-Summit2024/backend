import { getPartnerFromDb } from './partners.service.mjs';

export const getPartner = async (req, res, username) => {
  const result = await getPartnerFromDb(req.params.username);
  if (result.ok) {
    return res.status(200).json(result.value);
  } else {
    return res.status(result.error).json({ error: result.errorMsg });
  }
};

export const sendCVToPartner = async (req, res, username) => {
  // TODO: Implement this function
};

export const getCV = async (req, res, username, cvID) => {
  // TODO: Implement this function
};

export const searchCVs = async (req, res, username) => {
  // TODO: Implement this function
};
