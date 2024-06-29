import { getPartnerFromDb, getCVFromPartner, addCVToPartner, getAllCVsFromPartner } from './partners.service.mjs';

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const getPartner = async (req, res) => {
  const result = await getPartnerFromDb(req.username);
  if (result.ok) {
    return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const sendCVToPartner = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const result = await addCVToPartner(req.username, req.files);
  if (result.ok) {
    return res.status(200).json(result.value);
  }
  return res.status(result.error).json({ error: result.errorMsg });
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const getAllPartnerCVs = async (req, res) => {
  const result = await getAllCVsFromPartner(req.username);
  if (result.ok) {
    return res.status(200).json(result.value);
  }

  return res.status(result.error).json({ error: result.errorMsg });
}


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export const getCV = async (req, res) => {
  const result = await getCVFromPartner(req.params.username, req.params.cvID);
  if (result.ok) {
    return res.status(200).json(result.value);
  }

  return res.status(result.error).json({ error: result.errorMsg });
};
