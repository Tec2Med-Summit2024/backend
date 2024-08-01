import { getDriver } from '../../database/connector.mjs';

/**
 *
 * @param {string} username
 * @returns {Promise<{name: string, email: string} | null>}
 */
export const getAttendeeByUsername = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (a:Attendee {username: $username}) RETURN a',
      { username }
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
 * @param {string} id
 * @returns {Promise<{resultID: string}[]>}
 */
export const updateAttendeeWithData = async (username, data) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
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
      `MATCH (a:Attendee {username: $username})
      MATCH (e:Event {id: $eventID})
      CREATE (a)-[:ATTENDS]->(e)
      RETURN e`,
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
      `MATCH (a:Attendee {username: $username})
      MATCH (e:Event {id: $eventID})
      DETACH DELETE (a)-[:ATTENDS]->(e)
      RETURN e`,
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
export const addConnectionRequest = async (username, eventID) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
        MATCH (e:Event {id: $eventID})
        CREATE (a)-[:REQUESTS]->(e)
        RETURN e`,
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
 * @returns {Promise<{resultID: string}[]>}
 */
export const getConnectionRequests = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
        MATCH (a)-[:REQUESTS]->(e:Event)
        RETURN e`,
      { username }
    );

    return result.records.map((r) => {
      const { name, date } = r.get(0).properties;
      return {
        name,
        date,
      };
    });
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
export const decideConnectionRequest = async (username, partnerUsername, accept) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
        MATCH (p:Partner {username: $partnerUsername})
        MATCH (a)-[r:REQUESTS]->(e:Event)
        DELETE r
        WITH a, p, e
        CREATE (a)-[:CONNECTED]->(p)
        CREATE (p)-[:CONNECTED]->(a)
        RETURN e`,
      { username, partnerUsername }
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
 * @param {string} partnerUsername
 * @returns {Promise<{resultID: string}[]>}
 */
export const deleteConnection = async (username, partnerUsername) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
        MATCH (p:Partner {username: $partnerUsername})
        MATCH (a)-[r:CONNECTED]->(p)
        DELETE r
        WITH a, p
        MATCH (p)-[r2:CONNECTED]->(a)
        DELETE r2
        RETURN p`,
      { username, partnerUsername }
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
 * @returns {Promise<{resultID: string}[]>}
 */
export const getAttendeeContactsInDb = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
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
export const addCertificate = async (username, certificate) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
        SET a.certificate = $certificate
        RETURN a`,
      { username, certificate }
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
 * @param {string} username
 * @param {string} certificateID
 * @returns {Promise<{resultID: string}[]>}
 */
export const getCertificate = async (username, certificateID) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
        RETURN a.certificate`,
      { username }
    );

    return result.records.map((r) => {
      const certificate = r.get(0);
      return {
        certificate,
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
export const getCertificates = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
        RETURN a.certificate`,
      { username }
    );

    return result.records.map((r) => {
      const certificate = r.get(0);
      return {
        certificate,
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
export const getQuestions = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Attendee {username: $username})
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
      `MATCH (a:Attendee {username: $username})
        MATCH (a)-[:FOLLOWS]->(p:Partner)
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
