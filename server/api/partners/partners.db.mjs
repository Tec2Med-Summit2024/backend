import { getDriver } from '../../database/connector.mjs';

/**
 * Create a partner in the database
 * @param {Object} partner - The partner to create
 * @param {string} partner.name - The name of the partner
 * @param {string} partner.email - The email of the partner
 *
 * @returns {Promise<Object>} - The created partner
 */
export const neo4jCreatePartner = async (partner) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `CREATE (p:Partner {name: $name, email: $email})
            RETURN p`,
      partner
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
