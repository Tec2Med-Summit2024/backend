import { getDriver } from '../../database/connector.mjs';

/**
 *
 * @param {string} username
 * @returns {Promise<{name: string, email: string} | null>}
 */
export const getPartnerByUsername = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (partner:Partner {username: $username})
        // Check if there's a COLLECTS relationship with any CV node
        OPTIONAL MATCH (partner)-[r:COLLECTS]->(:CV)
        RETURN apoc.map.merge(properties(partner), {hasCV: r IS NOT NULL}) AS partnerDetails`,
      { username }
    );
    
    const r = result.records[0]?.get(0) ?? null;
    
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
export const sendCVToPartner = async (username, id) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Partner {username: $username})
      CREATE (p)-[:COLLECTS]->(cv:CV {id: $id})
       RETURN cv`,
      { username, id }
    );

    const cv = result.records[0]?.get(0)?.properties ?? null;
    const resultID = cv;

    return {
      resultID
    };
  } finally {
    await session.close();
  }
};

/**
 * Get all the CVs connected to the given partner
 * @param {string} username
 * @returns {Promise<{name: string, email: string}[]>}
 */
export const getReceivedCVsByPartner = async (username) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Partner {username: $username})-[:COLLECTS]->(cv:CV)
            RETURN cv`,
      { username }
    );

    return result.records.map((r) => r.get(0).properties);
  } finally {
    await session.close();
  }
};

/**
 * Get a CV connected to the given partner
 * @param {string} username Partner's username
 * @param {string} cvId CV's id to get
 */
export const getCV = async (username, cvId) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Partner {username: $username})-[:COLLECTS]->(cv:CV {id: $cvId})
            RETURN cv`,
      { username, cvId }
    );

    const cv = result.records[0]?.get(0)?.properties ?? null;
    return cv;
  } finally {
    await session.close();
  }
};
