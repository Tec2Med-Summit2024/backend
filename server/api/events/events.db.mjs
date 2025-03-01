import { getDriver } from '../../database/connector.mjs';

/**
 *
 * @returns
 */
export const getAllEventsFromDb = async () => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`MATCH (e:Event )-[:IN_TYPE]->(et:EventType) RETURN e, et.name`);

    return result.records.map((r) => {
      const event = r.get('e')?.properties;
      if (event) {
        event.type = r.get('et.name'); // Add eventType as 'type' inside event JSON
      }
      return event;
    });
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
      WHERE toLower(e.name) CONTAINS toLower($name) 
       AND toLower(et.name) CONTAINS toLower($type)
       AND e.start >= $start 
       AND e.end <= $end 
       RETURN e, et.name AS eventType`,
      { name, type, start, end }
    );

    return result.records.map((r) => {
      const event = r.get('e')?.properties;
      if (event) {
        event.type = r.get('eventType'); // Add eventType as 'type' inside event JSON
      }
      return event;
    });
  } catch (error) {
    console.log(error);
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
      `MATCH (e:Event )-[:IN_TYPE]->(et:EventType) 
      WHERE e.event_id = $eventId 
      RETURN e, et.name AS eventType`,
      { eventId }
    );
    const record = result.records[0]; // Get the first record
    if (!record) return null;
    const event = record.get('e')?.properties;
    if (event) {
      event.type = record.get('eventType'); // Add eventType as 'type' inside event JSON
    }
    return event;
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
export const createQuestionInEventFromDb = async (username, id, question) => {
  const driver = getDriver();
  const session = driver.session();
  console.log(id, question);
  const eventId = parseInt(id);

  try {
    const result = await session.run(
      `MATCH (e:Event) WHERE e.event_id = $eventId
      MATCH (p:Participant {username: $username})
      CREATE (q:Question $question)-[:ASKED_IN]->(e)
      CREATE (p)-[:ASKS]->(q)
      RETURN q`,
      {username, eventId, question }
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
 * Like a question
 * @param {string} eventId
 * @param {string} questionId
 */
export const likeQuestionInEventFromDb = async (eventId, questionId) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (q:Question)-[:ASKED_IN]->(e:Event) 
      WHERE e.event_id = $eventId AND q.question_id = $questionId 
      SET q.likes = q.likes + 1 
      RETURN q`,
      { eventId, questionId }
    );

    return result.records[0]?.get(0)?.properties;
  } catch (error) {
    return null;
  } finally {
    session.close();
  }
};

/**
 * Dislike a question
 * @param {string} eventId
 * @param {string} questionId
 */
export const dislikeQuestionInEventFromDb = async (eventId, questionId) => {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (q:Question)-[:ASKED_IN]->(e:Event) 
      WHERE e.event_id = $eventId AND q.question_id = $questionId 
      SET q.likes = q.likes - 1 
      RETURN q`,
      { eventId, questionId }
    );

    return result.records[0]?.get(0)?.properties;
  } catch (error) {
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
      `MATCH (p:Participant)-[:ASKS]->(q:Question)-[:ASKED_IN]->(e:Event)  
      WHERE e.event_id = $eventId  
      RETURN q, p.name AS participantName, p.username AS participantUsername  
      ORDER BY q.likes DESC
`,
      { eventId }
    );
    return result.records.map((r) => {
      const question = r.get('q')?.properties;
      if (question) {
        question.participant = {
          name: r.get('participantName'),
          username: r.get('participantUsername'),
        };
      }
      return question;
    });
  } catch (error) {
    return null;
  } finally {
    session.close();
  }
};
