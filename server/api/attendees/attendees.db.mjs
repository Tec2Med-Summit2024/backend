import { getDriver } from '../../database/connector.mjs';

/*
 *
 * @param {string} username
 * @returns
 */
export const getAttendeeFromDb = async (username) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username}) RETURN a',
      { username }
    );
    if (result.records.length === 0) {
      return { ok: false, error: 404, errorMsg: 'Attendee not found' };
    }
    return { ok: true, value: result.records[0].get(0).properties };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {object} data
 * @returns
 */
export const updateAttendeeInDb = async (username, data) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username}) SET a += $data RETURN a',
      { username, data }
    );
    if (result.records.length === 0) {
      return { ok: false, error: 404, errorMsg: 'Attendee not found' };
    }
    return { ok: true, value: result.records[0].get(0).properties };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} eventID
 * @returns
 */
export const addEventToAttendeeSchedule = async (username, eventID) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[:ATTENDS]->(e:Event {eventID: $eventID}) RETURN a',
      { username, eventID }
    );
    if (result.records.length === 0) {
      return { ok: false, error: 404, errorMsg: 'Attendee or Event not found' };
    }
    return { ok: true, value: result.records[0].get(0).properties };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} eventID
 * @returns
 */
export const removeEventFromAttendeeSchedule = async (username, eventID) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[r:ATTENDS]->(e:Event {eventID: $eventID}) DELETE r RETURN a',
      { username, eventID }
    );
    if (result.records.length === 0) {
      return { ok: false, error: 404, errorMsg: 'Attendee or Event not found' };
    }
    return { ok: true, value: result.records[0].get(0).properties };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} requestUsername
 * @returns
 */
export const addConnectionRequestToAttendee = async (username, requestUsername) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username}), (b:Attendee {username: $requestUsername}) CREATE (a)-[:REQUEST]->(b) RETURN a',
      { username, requestUsername }
    );
    if (result.records.length === 0) {
      return { ok: false, error: 404, errorMsg: 'Attendee or Requested Attendee not found' };
    }
    return { ok: true, value: result.records[0].get(0).properties };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @returns
 */
export const getAttendeeRequests = async (username) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[:REQUEST]->(b:Attendee) RETURN b',
      { username }
    );
    return { ok: true, value: result.records.map((record) => record.get(0).properties) };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} requestUsername
 * @param {boolean} accept
 * @returns
 */
export const decideOnRequest = async (username, requestUsername, accept) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[r:REQUEST]->(b:Attendee {username: $requestUsername}) DELETE r',
      { username, requestUsername }
    );
    if (result.records.length === 0) {
      return { ok: false, error: 404, errorMsg: 'Request not found' };
    }
    if (accept) {
      await session.run(
        'MATCH (a:Attendee {username: $username}), (b:Attendee {username: $requestUsername}) CREATE (a)-[:CONNECTS]->(b)',
        { username, requestUsername }
      );
    }
    return { ok: true, value: accept };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} connectionID
 * @returns
 */
export const deleteAttendeeConnection = async (username, connectionID) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[r:CONNECTS]->(b:Attendee) WHERE ID(b) = toInteger($connectionID) DELETE r',
      { username, connectionID }
    );
    if (result.records.length === 0) {
      return { ok: false, error: 404, errorMsg: 'Connection not found' };
    }
    return { ok: true, value: result.records[0].get(0).properties };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @returns
 */
export const getAttendeeContacts = async (username) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[:CONNECTS]->(b:Attendee) RETURN b',
      { username }
    );
    return { ok: true, value: result.records.map((record) => record.get(0).properties) };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {object} data
 * @returns
 */
export const addAttendeeCertificate = async (username, data) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username}) CREATE (a)-[:HAS_CERTIFICATE]->(c:Certificate $data) RETURN c',
      { username, data }
    );
    return { ok: true, value: result.records[0].get(0).properties };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} certificateID
 * @returns
 */
export const getAttendeeCertificate = async (username, certificateID) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[:HAS_CERTIFICATE]->(c:Certificate {certificateID: $certificateID}) RETURN c',
      { username, certificateID }
    );
    if (result.records.length === 0) {
      return { ok: false, error: 404, errorMsg: 'Certificate not found' };
    }
    return { ok: true, value: result.records[0].get(0).properties };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @returns
 */
export const getAttendeeCertificates = async (username) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[:HAS_CERTIFICATE]->(c:Certificate) RETURN c',
      { username }
    );
    return { ok: true, value: result.records.map((record) => record.get(0).properties) };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @returns
 */
export const getAttendeeQuestions = async (username) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[:ASKS]->(q:Question) RETURN q',
      { username }
    );
    return { ok: true, value: result.records.map((record) => record.get(0).properties) };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @returns
 */
export const getAttendeeFollowedPartners = async (username) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username})-[:FOLLOWS]->(p:Partner) RETURN p',
      { username }
    );
    return { ok: true, value: result.records.map((record) => record.get(0).properties) };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};
