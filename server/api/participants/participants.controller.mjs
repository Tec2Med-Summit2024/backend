// TODO: Add documentation

import {
  getParticipantFromDb,
  updateParticipantInDb,
  addEventToParticipantSchedule,
  removeEventFromParticipantSchedule,
  addConnectionRequestToParticipant,
  getParticipantRequests,
  decideOnRequest,
  deleteParticipantConnection,
  getParticipantContacts,
  addParticipantCertificate,
  getParticipantCertificate,
  getParticipantCertificates,
  getParticipantQuestions,
  getParticipantFollowedPartners,
} from './participants.service.mjs';

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getParticipant = async (req, res) => {
  try {
    const result = await getParticipantFromDb(req.username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const updateParticipant = async (req, res) => {
  try {
    const result = await updateParticipantInDb(req.username, req.body);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const addEventToSchedule = async (req, res) => {
  try {
    const result = await addEventToParticipantSchedule(
      req.username,
      req.body.eventID
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const removeEventFromSchedule = async (req, res) => {
  try {
    const result = await removeEventFromParticipantSchedule(
      req.username,
      req.params.eventID
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const addConnectionRequest = async (req, res) => {
  try {
    const result = await addConnectionRequestToParticipant(
      req.username,
      req.body.participant
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getRequests = async (req, res) => {
  try {
    const result = await getParticipantRequests(req.username, req.query.sent, req.query.received);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const decideRequest = async (req, res) => {
  try {
    const result = await decideOnRequest(
      req.username,
      req.params.requestID,
      req.body.accepted
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteConnection = async (req, res) => {
  try {
    const result = await deleteParticipantConnection(
      req.username,
      req.params.connectionID
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getContacts = async (req, res) => {
  try {
    const result = await getParticipantContacts(req.username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const addCertificate = async (req, res) => {
  try {
    console.log(req.body);
    const result = await addParticipantCertificate(
      req.username,
      req.body.eventID
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getCertificate = async (req, res) => {
  try {
    const result = await getParticipantCertificate(
      req.username,
      req.params.certificateID
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getCertificates = async (req, res) => {
  try {
    const result = await getParticipantCertificates(req.username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getQuestions = async (req, res) => {
  try {
    const result = await getParticipantQuestions(req.username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getFollowedPartners = async (req, res) => {
  try {
    const result = await getParticipantFollowedPartners(req.username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
