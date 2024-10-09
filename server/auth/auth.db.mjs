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
      `MATCH (n) WHERE (n:Attendee OR n:Partner) 
      AND n.email = $email 
      SET n.verification_code = $verificationCode
      RETURN n`,
      { email, verificationCode }
    );

    // In case of no Attendee found, create a new basic one
    if( ! result.records.length > 0 ){
      createAttendee(email, verificationCode);
    } 

  } catch (error) {
    console.log(error);
    return null;
  } finally {
    session.close();
  }
};

const createAttendee = async (email, verificationCode) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    await session.run(
      `CREATE (a:Attendee 
      {email: $email, verification_code: 
      $verificationCode, type: 'Attendee'})`,
      { email, verificationCode }
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
 * @returns {Promise< >}
 */
export const getVerificationCode = async (email) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (n) WHERE (n:Attendee OR n:Partner) 
        AND n.email = $email 
        RETURN n.verification_code`,
      { email }
    );
    const code = result.records[0]?.get(0);
  
    return code;
      
  } finally {
    await session.close();
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
      `MATCH (n) WHERE (n:Attendee OR n:Partner) 
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
      `MATCH (n:Attendee {email: $email})
        RETURN n.password`,
      { email }
    );
    if(result.records.length > 0 ) {
      return { password: result.records[0].get(0), role: 'attendee' };
    }  
    const result1 = await session.run(
      `MATCH (n:Partner {email: $email})
        RETURN n.password`,
      { email }
    );  
    if(result1.records.length > 0 ) {
      return { password: result.records[0].get(0), role: 'partner' };
    }
    return null;
  } finally {
    await session.close();
  }
};


/**
 *
 * @param {User} user
 * @returns {Promise< >}
 */
export const getAccount = async (user) => {


};
