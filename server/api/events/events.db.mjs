import { getDriver } from '../../database/connector.mjs';

/**
 *
 * @returns
 */
export const getAllEventsFromDb = async () => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`MATCH (e:Event) RETURN e`);

    return result.records.map((r) => r.get(0)?.properties);
  } catch (error) {
    return null;
  } finally {
    session.close();
  }
};

/**
 *
 * @param {string} search
 * @param {Date} start
 * @param {Date} end
 */
export const getFilteredEventsFromDb = async (name, type, start, end) => {
  const driver = getDriver();
  const session = driver.session();
  console.log(name, type, start, end);
  console.log(typeof start, typeof end);
  try {
    const result = await session.run(
      `MATCH (e:Event )-[:IN_TYPE]->(et:EventType) 
      WHERE toLower(e.name) CONTAINS toLower($search) 
       AND toLower(et.name) CONTAINS toLower($type)
       AND toLower(e.name) CONTAINS toLower($name)
       AND e.start >= datetime($start) 
       AND e.end <= datetime($end) RETURN e, et.name`,
      { name, start, end }
    );

    return result.records.map((r) => r.get(0)?.properties);
  } catch (error) {
    return null;
  } finally {
    session.close();
  }
};

/**
 *
 * @param {string} id
 */
export const getEventByIdFromDb = async (id) => {
  const driver = getDriver();
  const session = driver.session();
  const eventId = parseInt(id);
  try {
    const result = await session.run(
      `MATCH (e:Event )-[:IN_TYPE]->(et:EventType) WHERE e.event_id = $eventId RETURN e, et.name`,
      { eventId }
    );

    return result.records[0]?.get(0)?.properties;
  } catch (error) {
    return null;
  } finally {
    session.close();
  }
};

/**
 *
 * @param {string} eventId
 * @param {*} question
 */
export const createQuestionInEventFromDb = async (id, question) => {
  const driver = getDriver();
  const session = driver.session();
  console.log(id, question);
  const eventId = parseInt(id);

  try {
    const result = await session.run(
      `MATCH (e:Event) WHERE e.event_id = $eventId 
      CREATE (q:Question $question)-[:ASKED_IN]->(e) RETURN q`,
      { eventId, question }
    );

    return result.records[0]?.get(0)?.properties;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    session.close();
  }
};

/**
 * Get all the questions from an event
 * @param {string} eventId
 */
export const getQuestionsFromEventFromDb = async (id) => {
  const driver = getDriver();
  const session = driver.session();
  const eventId = parseInt(id);
  try {
    const result = await session.run(
      `MATCH (q:Question)-[:ASKED_IN]->(e:Event) WHERE e.event_id = $eventId RETURN q`,
      { eventId }
    );

    return result.records.map((r) => r.get(0)?.properties);
  } catch (error) {
    return null;
  } finally {
    session.close();
  }
};
