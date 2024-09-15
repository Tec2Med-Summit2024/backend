// TODO: Add documentation

import {
  getAttendeeFromDb,
  updateAttendeeInDb,
  addEventToAttendeeSchedule,
  removeEventFromAttendeeSchedule,
  addConnectionRequestToAttendee,
  getAttendeeRequests,
  decideOnRequest,
  deleteAttendeeConnection,
  getAttendeeContacts,
  addAttendeeCertificate,
  getAttendeeCertificate,
  getAttendeeCertificates,
  getAttendeeQuestions,
  getAttendeeFollowedPartners,
} from './attendees.service.mjs';

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAttendee = async (req, res) => {
  try {
    const result = await getAttendeeFromDb(req.username);
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
export const updateAttendee = async (req, res) => {
  try {
    const result = await updateAttendeeInDb(req.username, req.body);
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
    const result = await addEventToAttendeeSchedule(
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
    const result = await removeEventFromAttendeeSchedule(
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
    const result = await addConnectionRequestToAttendee(
      req.username,
      req.body.attendee
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
    const result = await getAttendeeRequests(req.username, req.query.sent, req.query.received);
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
    const result = await deleteAttendeeConnection(
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
    const result = await getAttendeeContacts(req.username);
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
    const result = await addAttendeeCertificate(
      req.username,
      req.body.certificate
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
    const result = await getAttendeeCertificate(
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
    const result = await getAttendeeCertificates(req.username);
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
    const result = await getAttendeeQuestions(req.username);
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
    const result = await getAttendeeFollowedPartners(req.username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
