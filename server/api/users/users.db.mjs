import { getDriver } from '../../database/connector.mjs';

const rolesDict = {
  partner: 'Partner',
  participant: 'Participant',
};

const userType = { 
  partners: 'Partner',
  attendees: 'Attendee',
  instructors: 'Instructor',
  speakers: 'Speaker',
};

const eventsRelationships = {
  partner: 'HOSTS',
  participant: 'GOES_TO',
};

const connectionsRelationships = {
  partner: 'FOLLOWS',
  participant: 'CONNECTS_WITH',
};

/**
 *
 * @param {string} username User's username
 * @param {string} role User's role
 * @returns {Promise<{ } | null>}
 */
const getUser = async (username, role) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(  
      `MATCH (u:${rolesDict[role]} {name: $username})
            RETURN u`,
      { username }
    );
    return result.records[0]?.get(0)?.properties ?? null;
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
        await session.close();
  }
};  

/**
 *
 * @param {string} username User's username
 * @param {string} role User's role
 * @returns {Promise<{ } | null>}
 */
export const getTicketDB = async (username, role) => {
  const user = await getUser(username, role);
  if (!user) return null;

  return { ticket_id: user.ticket_id };
};

/**
 *
 * @param {string} username User's username
 * @param {string} role User's role
 * @returns {Promise<{qr_code: string} | null>}
 */
export const getQRCodeDB = async (username, role) => {
  const user = await getUser(username, role);
  if (!user) return null;
  
  return { qr_code: user.qr_code }; 
};

/**
 *
 * @param {string} username User's username
 * @param {string} role User's role
 * @returns {Promise<{ } | null>}
 */
export const getEventsDB = async (username, role) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(  
      `MATCH (p:${rolesDict[role]} {name: $username})-[:${eventsRelationships[role]}]->(e:Event)
            RETURN e`,
      { username }
    );
    
    return result.records.map((e) => e.get(0).properties);
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
        await session.close();
  }
};

/**
 *
 * @param {string} username User's username
 * @param {string} role User's role
 * @returns {Promise<{ } | null>}
 */
export const getConnectionsDB = async (username, role) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(  
      `MATCH (u:${rolesDict[role]} {name: $username})-[:${connectionsRelationships[role]}]-(c)
            RETURN c`,
      { username }
    );
    
  return result.records.map((c) => c.get(0).properties);
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
        await session.close();
  }
};

/**
 *
 * @param {string} username User's username
 * @param {string} role User's role
 * @returns {Promise<{ } | null>}
 */
export const getNotificationsDB = async (username, role) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(  
      `MATCH (u:${rolesDict[role]} {name: $username})-[:RECEIVES]->(n:Notification)
            RETURN n`,
      { username }
    );
    
  return result.records.map((n) => n.get(0).properties);
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
        await session.close();
  }
};


// Verifica só a lista de interesses e expertizes, não vê localidade e ou  intituicao de estudo/trabalho
export const getRecommendationsDB = async (username, role) => {
  const driver = getDriver();
  const session = driver.session();
  
  try {
    const result = await session.run(  
      `MATCH (p:Participant {name: $username})
        WITH p.interests AS p_interests
        MATCH (entity)
        WHERE (entity:Participant OR entity:Partner)
        AND entity.name <> $username
        WITH entity, p_interests, entity.expertise AS entity_expertise
        RETURN entity AS expertise,
          coalesce(size([expert IN entity_expertise WHERE expert IN p_interests]), 0) AS shared_expertise_count
        ORDER BY shared_expertise_count DESC`,
      { username }
    );
  

  return result.records.map((n) => n.get(0).properties);
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
        await session.close();
  }
};

export const searchUsersDB = async (name, type) => {
  const driver = getDriver();
  const session = driver.session();

  name = name || '';
  let query;
  try {
    if(userType[type] === 'Partner') {
      query = `MATCH (a:Partner) WHERE a.name CONTAINS "${name}" 
                  RETURN a`;
    } else {
      query = `MATCH (a:Participant) WHERE a.type = "${userType[type]}" AND a.name CONTAINS "${name}" RETURN a`;
    }
    const result = await session.run(query);
   return result.records.map((n) => n.get(0).properties);
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
        await session.close();
  }
};

export const updateSettingsDB = async (username, role, data) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH u:${rolesDict[role]} {name: $username})-[:HAS]->(s:Settings)
       SET s += $data RETURN s`,
      { username, data }
    );

    return { ok: true, value: result.records[0].get(0).properties };
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

