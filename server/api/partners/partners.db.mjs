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
      `MATCH (p:Partner {name: $username})
            RETURN p`,
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
export const sendCVToPartner = async (username, id) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Partner {name: $username})
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


export const findCV = () => {

}


/**
 *
 * @param {string} username
 * @param {object} query
 * @returns {Promise<{name: string, email: string}[]>}
 */
export const searchReceivedCVsByPartner = async (username, query) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Partner {name: $username})-[:COLLECTS]->(cv:CV)
            RETURN cv`,
      { username }
    );

    return result.records.map((r) => r.get(0).properties);
  } finally {
    await session.close();
  }
};
