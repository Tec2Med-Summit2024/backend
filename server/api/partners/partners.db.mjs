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
  } catch (error) {
    throw error;
  } finally {
    await session.close();
  }
};
