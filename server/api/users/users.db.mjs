import { getDriver } from '../../database/connector.mjs';


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
      `MATCH (u:${role} {name: $username})
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
      `MATCH (p:${role} {name: $username})-[:${eventsRelationships[role]}]->(e:Event)
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
      `MATCH (u:${role} {name: $username})-[:${connectionsRelationships[role]}]-(c)
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
      `MATCH (u:${role} {name: $username})-[:RECEIVES]->(n:Notification)
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


export const searchUsersDB = async (query, type, email, location, field, institution, interests, expertises) => {
  const driver = getDriver();
  const session = driver.session();

  query = query || '';
  location = location || '';
  field = field || '';
  institution = institution || '';
  if(interests)
    interests = interests.split(';');
  else
    interests = [];  

  if(expertises)
    expertises = expertises.split(';');
  else
    expertises = [];


  try {
    const result = await session.run(  
      `MATCH (user)
       WHERE (user:Participant OR user:Partner) AND user.email = $email
      WITH user, user.interests AS user_interests, user.expertise AS user_expertise, user.institution AS user_institution, $type AS type, $query AS query,
      $location AS location, $field AS field, $institution AS institution, $interests AS query_interests, $expertises AS query_expertises
      
      // Find matching entities based on both Participants and Partners
      MATCH (entity)
      WHERE 
        (
          (entity:Partner AND type = 'partner') OR
          (entity:Participant AND any(t IN entity.type WHERE toLower(t) = toLower(type)))
        )
      AND toLower(entity.name) CONTAINS toLower(query)
      AND entity.email <> user.email

      // Se alguma cena brekar deve ser por causa destes filtros (nome das propriedades etc ...)
      AND toLower(entity.current_location) CONTAINS toLower(location)
      AND toLower(entity.field_of_study_work_research) CONTAINS toLower(field)
      AND toLower(entity.institution) CONTAINS toLower(institution)
      AND all(i IN query_interests WHERE i IN entity.interests)
      AND all(i IN query_expertises WHERE i IN entity.expertise)


      // Check if a FOLLOW relationship exists between the user and the entity (if the entity is a Partner)
      OPTIONAL MATCH (user)-[follows:FOLLOWS]->(entity)
      WITH user, entity, follows, user_interests, user_expertise, user_institution,
          entity.expertise AS entity_expertise,
          entity.interests AS entity_interests,
          entity.institution AS entity_institution

      WITH user, entity, user_interests, user_expertise, entity_expertise, entity_interests, entity_institution, user_institution, follows,
        // Calculate matched interests and expertise
        coalesce(size([interest IN user_interests WHERE interest IN entity_expertise])) AS matched_interests,
        coalesce(size([expertise IN user_expertise WHERE expertise IN entity_interests])) AS matched_expertise,
        // Determine if the entity's location matches the user's location (1 if true, 0 if false)
        CASE WHEN entity_institution = user_institution THEN 1 ELSE 0 END AS institution_match,
        // Set follow_exists to true if the FOLLOW relationship exists
        CASE WHEN follows IS NOT NULL THEN true ELSE false END AS follow_exists

      RETURN entity.name AS name,
            entity.username AS username,
            entity.biography AS biography,
            entity.photo_id AS photo_id,
            follow_exists
 
      ORDER BY matched_interests DESC, matched_expertise DESC, institution_match DESC, name DESC`,
      { query, type, email, location, field, institution, interests, expertises }
    );
    
    
  return result.records.map((n) => {
    return {
      name: n.get(0),
      username: n.get(1),
      biography: n.get(2),
      photo_id: n.get(3),
      follow_exists: n.get(4)
    };
  }

);
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
      `MATCH u:${role} {name: $username})-[:HAS]->(s:Settings)
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


export const getUserTypeDB = async (username, role) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (e)
WHERE (e:Participant OR e:Partner)
AND e.username = "sarah98"
RETURN 
    CASE 
        WHEN e:Partner THEN ["Partner"]
        ELSE e.type
    END AS type`,
      { username}
    );
    
    return {
      type: result.records[0].get(0) 
    }
    
  } catch (error) {
    return { ok: false, error: 500, errorMsg: error.message };
  } finally {
    await session.close();
  }
};

