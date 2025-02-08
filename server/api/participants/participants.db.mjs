// TODO: Add documentation

import e from 'express';
import { getDriver } from '../../database/connector.mjs';

/**
 *
 * @param {string} username
 * @returns {Promise<{name: string, email: string} | null>}
 */
export const getParticipantByUsername = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (a:Participant {username: $username}) RETURN a',
      { username }
    );
    const r = result.records[0]?.get(0)?.properties ?? null;
    if (!r) return null;

    // const { name, email } = r;
    // return {
    //   name,
    //   email,
    // };
    return r;
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} id
 * @returns {Promise<{resultID: string}[]>}
 */
export const updateParticipantWithData = async (username, data) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})
      SET a += $data
      RETURN a`,
      { username, data }
    );

    const r = result.records[0]?.get(0)?.properties ?? null;
    if (!r) return null;
    const { name, email } = r;
    return {
      name,
      email,
    };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} eventID
 * @returns {Promise<{resultID: string}[]>}
 */
export const addEventToSchedule = async (username, eventID) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})
      MATCH (e:Event {event_id: $eventID})
      CREATE r=(a)-[:GOES_TO]->(e)
      SET e.curr_cap = e.curr_cap + 1
      RETURN r`,
      { username, eventID }
    );

    const r = result.records[0]?.get(0)?.properties ?? null;
    if (!r) return null;
    const { name, date } = r;
    return {
      name,
      date,
    };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} eventID
 * @returns {Promise<{resultID: string}[]>}
 */
export const removeEventFromSchedule = async (username, eventID) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})-[r:GOES_TO]->(e:Event {id: $eventID})
      SET e.curr_cap = e.curr_cap - 1
      DELETE r`,
      { username, eventID }
    );

    const r = result.records[0]?.get(0)?.properties ?? null;
    if (!r) return null;
    const { name, date } = r;
    return {
      name,
      date,
    };
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} eventID
 * @returns {Promise<{resultID: string}[]>}
 */
export const addConnectionRequest = async (username, otherUsername) => {
  const driver = getDriver();
  const session = driver.session();
  const requestID = Math.random().toString(36).substring(7);
  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})
        MATCH (b:Participant {username: $otherUsername})
        CREATE (a)-[r:REQUESTS {rid: $requestID}]->(b)
        RETURN r.rid`,
      { username, otherUsername, requestID }
    );

    const r = result.records[0]?.get(0) ?? null;
    if (!r) return null;
    return r;
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @returns {Promise<{resultID: string}[]>}
 */
export const getSentConnectionRequests = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})
        MATCH r=(a)-[:REQUESTS]->(b:Participant)
        RETURN r`,
      { username }
    );

    return result.records.map((r) => {
      return r.get(0).segments;
    });
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @returns {Promise<{resultID: string}[]>}
 */
export const getReceivedConnectionRequests = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})
        MATCH r=(b:Participant)-[:REQUESTS]->(a)
        RETURN r`,
      { username }
    );

    return result.records.map((r) => {
      return r.get(0).segments;
    });
  } finally {
    await session.close();
  }
};

/**
 * @param {string} username
 * @param {string} otherUsername
 * @returns {Promise<{resultID: string}[]>}
 */
export const acceptConnectionRequest = async (username, requestID) => {
  const driver = getDriver();
  const session = driver.session();
  const cid = Math.random().toString(36).substring(7);
  try {
    const result = await session.run(
      `MATCH (b:Participant)-[r:REQUESTS {rid: $requestID}]->(a:Participant {username: $username})
        DELETE r  
        WITH a, b
        CREATE (a)-[r1:CONNECTS_WITH {cid: $cid}]->(b)
        CREATE (b)-[r2:CONNECTS_WITH {cid: $cid}]->(a)
        RETURN r1.cid, r2.cid`,
      { username, requestID, cid }
    );

    // const res = result.records[0]?? null;
    // if (!r) return null;

    return result.records[0]._fields;
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} partnerUsername
 * @param {boolean} accept
 * @returns {Promise<{resultID: string}[]>}
 */
export const rejectConnectionRequest = async (username, requestID) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (b:Participant)-[r:REQUESTS {rid: $requestID}]->(a:Participant {username: $username})
        DELETE r`,
      { username, requestID }
    );

    return result;
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @param {string} partnerUsername
 * @returns {Promise<{resultID: string}[]>}
 */
export const deleteConnection = async (username, connectionID) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})-[r1:CONNECTS_WITH {cid: $connectionID}]->(b:Participant)
      MATCH (b:Participant)-[r2:CONNECTS_WITH {cid: $connectionID}]->(a:Participant {username: $username})
        DELETE r1, r2`,
      { username, connectionID }
    );

    return result;
  } finally {
    await session.close();
  }
};

/**
 *
 * @param {string} username
 * @returns {Promise<{resultID: string}[]>}
 */
export const getParticipantContactsInDb = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})
        MATCH (a)-[:CONNECTED]->(p:Partner)
        RETURN p`,
      { username }
    );

    return result.records.map((r) => {
      const { name, email } = r.get(0).properties;
      return {
        name,
        email,
      };
    });
  } finally {
    await session.close();
  }
};

/**
 * @param {string} username
 * @param {string} certificate
 */
export const addCertificate = async (username, eventID) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})
       MATCH (e:Event {event_id: $eventID})
       CREATE (c:Certificate {cert_id: a.username+e.event_id})
       CREATE (e)-[r1:GIVES]->(c)
       CREATE (a)-[r2:GETS]->(c)`,
      { username, eventID }
    );

    const r = result.records[0]?.get(0)?.segments ?? null;
    if (!r) return null;
    return r;
  } finally {
    await session.close();
  }
};

/**
 * @param {string} username
 * @param {string} certificateID
 * @returns {Promise<{resultID: string}[]>}
 */
export const getCertificate = async (username, certificateID) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})-[r:GETS]->(c:Certificate {cert_id: $certificateID})
       MATCH (e:Event)-[r2:GIVES]->(c)
       MATCH (e)-[:IN_TYPE]->(et:EventType)
       RETURN c.cert_id, e.name, et.name, e.start, e.end, e.event_id`,
      { username, certificateID }
    );

    const r = result.records[0]?.get(0)?.properties ?? null;
    if (!r) return null;
    return r;
  } finally {
    await session.close();
  }
};

/**
 * @param {string} username
 * @returns {Promise<{resultID: string}[]>}
 */
export const getCertificates = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})-[r:GETS]->(c:Certificate)
       MATCH (e:Event)-[r2:GIVES]->(c)
       MATCH (e)-[:IN_TYPE]->(et:EventType)
       RETURN c.cert_id, e.name, et.name, e.start, e.end, e.event_id`,
      { username }
    );

    return result.records.map((r) => {
      // Create an object mapping keys to values
      const mapped = {};
      r.keys.forEach((key, i) => {
        mapped[key] = r._fields[i];
      });
      mapped['e.start'] = mapped['e.start'].toStandardDate();
      mapped['e.end'] = mapped['e.end'].toStandardDate();
      mapped['e.event_id'] = mapped['e.event_id'].low;
      return mapped;
    });
  } finally {
    await session.close();
  }
};

/**
 * @param {string} username
 * @returns {Promise<{resultID: string}[]>}
 */
export const getQuestions = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})
        MATCH (a)-[:ASKS]->(q:Question)
        RETURN q`,
      { username }
    );

    return result.records.map((r) => {
      const { question, answer } = r.get(0).properties;
      return {
        question,
        answer,
      };
    });
  } finally {
    await session.close();
  }
};

/**
 * @param {string} username
 * @returns {Promise<{resultID: string}[]>}
 */
export const getFollowedPartners = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Participant {username: $username})
        MATCH (a)-[:FOLLOWS]->(p:Partner)
        RETURN p`,
      { username }
    );
    return result.records.map((r) => {
      const partner = r.get(0);
      return partner.properties;
    });
  } finally {
    await session.close();
  }
};
