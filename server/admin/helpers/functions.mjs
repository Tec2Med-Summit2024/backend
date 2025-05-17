import { getDriver } from '../../database/connector.mjs';

export const makeQuery = async (query, params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(query, params);

      const mappedResults = result.records.map((r) => {
        const value = r.get(0);
        // If the value has a `.properties` object (likely a Neo4j Node), return that
        if (value && typeof value === 'object' && 'properties' in value) {
          return value.properties;
        }
        // Otherwise, return the value itself (assumed to be a plain object or primitive)
        return value;
      });

      return resolve(mappedResults);
    } catch (error) {
      return reject(error);
    }
  });
};