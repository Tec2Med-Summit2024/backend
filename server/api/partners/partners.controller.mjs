import { getPartnerFromDb, searchPartnerCVs } from './partners.service.mjs';

export const getPartner = async (req, res) => {
  const result = await getPartnerFromDb(req.username);
  if (result.ok) {
    return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
};

export const sendCVToPartner = async (req, res) => {
  // TODO: Implement this function
};

export const getCV = async (req, res) => {
  // TODO: Implement this function
};

export const searchCVs = async (req, res) => {
  const result = await searchPartnerCVs(req.username, req.query);
  if (result.ok) {
    return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
};
