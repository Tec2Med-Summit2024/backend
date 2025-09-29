// TODO: Add documentation

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
    const {
      email,
      name,
      biography,
      phone,
      current_location,
      field_of_study_work_research,
      institution,
      linkedIn,
      instagram,
      facebook,
      website,
      interests,
      expertise,
    } = r;
    return {
      email,
      name,
      biography,
      phone,
      current_location,
      field_of_study_work_research,
      institution,
      linkedIn,
      instagram,
      facebook,
      website,
      interests,
      expertise,
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
      WITH nodes(r) AS nodeList
      RETURN nodeList[0].username AS username, nodeList[1].event_id AS eventID;`,
      { username, eventID }
    );

    const record = result.records[0]; // Get the first record
    if (!record) return null;

    const user = record.get('username'); // Extract username
    const event = record.get('eventID'); // Extract eventID

    return { user, event };
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
       CREATE (a)-[r2:GETS]->(c)
       RETURN c.cert_id
       `,
      { username, eventID }
    );

    const r = result.records[0]?.get(0);
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
       RETURN c.cert_id AS certID, e.name AS eventName, et.name AS eventType, 
              e.start AS eventStart, e.end AS eventEnd, e.event_id AS eventID`,
      { username, certificateID }
    );

    const r = result.records[0];
    if (!r) return null;

    return {
      certID: r.get('certID'),
      event: {
        eventName: r.get('eventName'),
        eventType: r.get('eventType'),
        eventStart: r.get('eventStart'),
        eventEnd: r.get('eventEnd'),
        eventID: r.get('eventID'),
      },
    };
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
       RETURN c.cert_id AS certID, e.name AS eventName, et.name AS eventType, 
              e.start AS eventStart, e.end AS eventEnd, e.event_id AS eventID`,
      { username }
    );

    return result.records.map((r) => ({
      certID: r.get('certID'),
      event: {
        eventName: r.get('eventName'),
        eventType: r.get('eventType'),
        eventStart: r.get('eventStart'),
        eventEnd: r.get('eventEnd'),
        eventID: r.get('eventID'),
      },
    }));
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
