import { getDriver } from '../database/connector.mjs';

/**
 * @param { string } email
 * @param { string } verificationCode
 */
export const createVerificationCode = async (email, verificationCode) => {
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
      createParticipant(email, verificationCode);
    }
    // In case Account has has no Id yet
    if(!result.records[0].get(0)){
      addAccountId(email);
    }

  } catch (error) {
    console.log(error);
    return null;
  } finally {
    session.close();
  }
};

const createParticipant = async (email, verificationCode) => {
  const driver = getDriver();
  const session = driver.session();
  const username = crypto.randomUUID();

  try {
    await session.run(
      `CREATE (a:Participant
      {email: $email,
      verification_code: $verificationCode, 
      type: ["Attendee"],
      username: $username
      })`,
      { email, verificationCode, username }
    );

    return null;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    session.close();
  }
};

const addAccountId = async (email) => {
  const driver = getDriver();
  const session = driver.session();
  const username = crypto.randomUUID();

  try {
    await session.run( 
      `MATCH (n) WHERE (n:Participant OR n:Partner)
        AND n.email = $email
        SET n.username = $username`,
      { email, username }
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
        labels(e)[0] AS type`,
      { email }
    );
    if(result.records.length > 0 ){
      return {
        username: result.records[0].get(0), 
        password: result.records[0].get(1), 
        verification_code: result.records[0].get(2), 
        type: result.records[0].get(3)};
    }
    return null;
      
  } finally {
    await session.close();
  }
};
