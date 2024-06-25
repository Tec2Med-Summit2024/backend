import { getPartnerFromDb, searchPartnerCVs, getCVFromPartner } from './partners.service.mjs';

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


/**
 * 
 * @param {import("express").Request} req 
 * @param {*} res 
 */
export const getCV = async (req, res) => {
  const result = await getCVFromPartner(req.params.username, req.params.cvID);
  if (result.ok) {
    return res.status(200).json(result.value);
  }

  return res.status(result.error).json({ error: result.errorMsg });
};
