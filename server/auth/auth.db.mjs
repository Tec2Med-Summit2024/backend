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

    // In case 
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
      {email: $email, verification_code: $verificationCode})`,
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
 *
 * @param {User} user
 * @returns {Promise< >}
 */
export const addAccount = async (user) => {


};


/**
 *
 * @param {User} user
 * @returns {Promise< >}
 */
export const getAccount = async (user) => {


};
