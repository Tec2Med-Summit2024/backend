import { getDriver } from '../../database/connector.mjs';

export const makeQuery = async (query, params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(query, params);

      return resolve(result.records.map((r) => r.get(0)?.properties));
    } catch (error) {
      return reject(error);
    }
  });
};
