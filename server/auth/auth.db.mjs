import { getDriver } from '../database/connector.mjs';

/**
 * @param { string } email
 * @param { string } verificationCode
 */
export const createVerificationCode = async (email, verificationCode, foundUser) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (n) WHERE (n:Participant OR n:Partner) 
      AND n.email = $email 
      SET n.verification_code = $verificationCode
      RETURN n.username`,
      { email, verificationCode}
    );

    // In case of no Participant found, create a new basic one
    if( ! result.records.length > 0 ){
      createParticipant(email, verificationCode, foundUser);
    }

  } catch (error) {
    console.log(error);
    return null;
  } finally {
    session.close();
  }
};

const createParticipant = async (email, verificationCode, foundUser) => {
  const driver = getDriver();
  const session = driver.session();
  const username = crypto.randomUUID();
  const name = foundUser.name;
  const phone = foundUser.phone;

  try {
    await session.run(
      `CREATE (a:Participant
      {email: $email,
      verification_code: $verificationCode, 
      type: ["Attendee"],
      username: $username,
      phone: $phone,
      name: $name})`,
      { email, verificationCode, username, phone, name }
    );

    return null;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    session.close();
  }
};


/**
 * @param { string } email
 * @param { string } password
 * @returns {Promise< >}
 */
export const changePassword = async (email, password) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    await session.run(
      `MATCH (n) WHERE (n:Participant OR n:Partner) 
        AND n.email = $email 
        SET n.password = $password`,
      { email, password }
    );
    return null;
  } finally {
    await session.close();
  }
};

/**
 * @param { string } email
 * @returns {Promise< >}
 */
export const lookUpAccount = async (email) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (e)
        WHERE (e:Participant OR e:Partner)
        AND e.email = $email
        RETURN e.username AS username, 
        e.password AS password, 
        e.verification_code AS verification_code,
        e.name AS name,
        e.phone AS phone,
        labels(e)[0] AS type`,
      { email }
    );
    if(result.records.length > 0 ){
      return {
        username: result.records[0].get(0), 
        password: result.records[0].get(1), 
        verification_code: result.records[0].get(2),
        name: result.records[0].get(3),
        phone: result.records[0].get(4),
        type: result.records[0].get(5)};
    }
    return null;
      
  } finally {
    await session.close();
  }
};
