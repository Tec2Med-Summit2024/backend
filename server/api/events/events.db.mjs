import { getDriver } from '../../database/connector.mjs';

/**
 *
 * @returns
 */
export const getAllEventsFromDb = async () => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (e:Event )-[:IN_TYPE]->(et:EventType) RETURN e, et.name`
    );

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

export const getFilteredEventsFromDb = async (search, start, end, filters) => {
  const driver = getDriver();
  const session = driver.session();
  console.log('Searching events with filters:', filters);
  const {
    userId,
    registered,
    speakerInstructor,
    questionsAsked,
    topics,
    types,
  } = filters;
  console.log('Searching events with filters:', filters);
  try {
    let query = `
      MATCH (e:Event)-[:IN_TYPE]->(et:EventType)
      WHERE e.start >= $start AND e.end <= $end
      ${search ? 'AND toLower(e.name) CONTAINS toLower($search)' : ''}
      ${types.length ? 'AND toLower(et.name) IN $types' : ''}
      ${
        topics.length
          ? 'AND ANY(topic IN e.topics_covered WHERE topic IN $topics)'
          : ''
      }
    `;

    // Add filter-specific MATCH and WHERE clauses
    if (registered || speakerInstructor || questionsAsked) {
      query += ' WITH e, et ';
      
      if (registered) {
        query += `
          MATCH (p:Participant {username: $userId})-[:GOES_TO]->(e)
        `;
      }
      
      if (speakerInstructor) {
        query += `
          MATCH (e {speakers_instructors: $userId})
        `;
      }
      
      if (questionsAsked) {
        query += `
          MATCH (p2:Participant {username: $userId})-[:ASKS]->(q:Question)-[:ASKED_IN]->(e)
        `;
      }
      
      // Combine all filter conditions with proper WHERE clause
      const filterConditions = [];
      if (registered) filterConditions.push('p IS NOT NULL');
      if (speakerInstructor) filterConditions.push('e.speakers_instructors CONTAINS $userId');
      if (questionsAsked) filterConditions.push('q IS NOT NULL');
      
      if (filterConditions.length > 0) {
        query += ` WHERE ${filterConditions.join(' OR ')}`;
      }
    }

    query += ` RETURN e, et.name as eventType`;
    console.log('Constructed query:', query);
    const result = await session.run(query, {
      search,
      start,
      end,
      userId,
      types: types.map((t) => t.toLowerCase()),
      topics: topics.map((t) => t.toLowerCase()),
    });
    return result.records.map((r) => {
      const event = r.get('e')?.properties;
      if (event) {
        event.type = r.get('eventType');
      }
      return event;
    });
  } catch (error) {
    console.error('Error in getFilteredEventsFromDb:', error);
    console.error('Query parameters:', {
      search,
      start,
      end,
      userId,
      types: types.map((t) => t.toLowerCase()),
      topics: topics.map((t) => t.toLowerCase()),
    });
    console.error('Filters:', filters);
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
 * * @param {string} eventId
 * @param {string} username
 * @param {string} feedback
 */
export const addFeedbackToEventFromDb = async (id, username, feedback) => {
  const driver = getDriver();
  const session = driver.session();
  const eventId = parseInt(id);
  const feedbackId = `${eventId}f${username}`;
  feedback.feedback_id = feedbackId; // Add feedback_id to the feedback object
  try {
    const result = await session.run(
      `MATCH (e:Event {event_id: $eventId})
       MATCH (p:Participant {username: $username})
       CREATE (f:Feedback $feedback)
       CREATE (p)-[:GIVES_FEEDBACK]->(f)
       CREATE (f)-[:ABOUT]->(e) 
       RETURN f.feedback_id AS feedbackId`,
      { eventId, username, feedback }
    );
    return result.records[0]?.get('feedbackId');
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
export const createQuestionInEventFromDb = async (username, id, content) => {
  const driver = getDriver();
  const session = driver.session();
  console.log(id, content);
  const eventId = parseInt(id);

  try {
    // Step 1: Get the number of questions the event already has
    const countResult = await session.run(
      `MATCH (q:Question)-[:ASKED_IN]->(e:Event {event_id: $eventId})
       RETURN count(q) AS questionCount`,
      { eventId }
    );

    const questionCount =
      countResult.records[0]?.get('questionCount').toNumber() || 0;

    // Step 2: Generate the question_id based on the event_id and question count
    const questionId = `${eventId}q${questionCount + 1}`;

    // Step 3: Create the Question node with the necessary attributes
    const result = await session.run(
      `MATCH (e:Event {event_id: $eventId})
       MATCH (p:Participant {username: $username})
       CREATE (q:Question {question_id: $questionId, content: $content, likes: 0})
       CREATE (q)-[:ASKED_IN]->(e)
       CREATE (p)-[:ASKS]->(q)
       RETURN q.question_id`,
      { eventId, username, content, questionId }
    );

    // Step 4: Return the question_id
    return result.records[0]?.get('q.question_id');
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
export const likeQuestionInEventFromDb = async (id, questionId, username) => {
  const driver = getDriver();
  const session = driver.session();
  const eventId = parseInt(id);
  try {
    // Step 1: Match the Question and Event, and increment the likes
    const result = await session.run(
      `MATCH (q:Question {question_id:$questionId})-[:ASKED_IN]->(e:Event {event_id:$eventId})
       MATCH (p:Participant {username: $username}) 
       SET q.likes = q.likes + 1 
       CREATE (p)-[:LIKES_QUESTION]->(q)
       RETURN q`,
      { eventId, questionId, username }
    );

    // Step 2: Return the Question with an additional "liked: true" attribute
    const question = result.records[0]?.get('q').properties;
    question.liked = true;
    return question;
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
export const dislikeQuestionInEventFromDb = async (
  id,
  questionId,
  username
) => {
  const driver = getDriver();
  const session = driver.session();
  const eventId = parseInt(id);
  try {
    // Step 1: Match the Question and Event, and decrement the likes
    const result = await session.run(
      `MATCH (q:Question {question_id:$questionId})-[:ASKED_IN]->(e:Event {event_id:$eventId}) 
       MATCH (p:Participant {username: $username}) 
       OPTIONAL MATCH (p)-[r:LIKES_QUESTION]->(q) 
       SET q.likes = q.likes - 1 
       DELETE r
       RETURN q`,
      { eventId, questionId, username }
    );

    // Step 2: Return the Question with an additional "liked: false" attribute
    const question = result.records[0]?.get('q').properties;
    question.liked = false;

    return question;
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
export const getQuestionsFromEventFromDb = async (id, username) => {
  const driver = getDriver();
  const session = driver.session();
  const eventId = parseInt(id);
  try {
    const result = await session.run(
      `MATCH (p:Participant)-[:ASKS]->(q:Question)-[:ASKED_IN]->(e:Event {event_id:$eventId})
       OPTIONAL MATCH (p2:Participant {username: $username})-[:LIKES_QUESTION]->(q)
       RETURN q, p.name AS participantName, p.username AS participantUsername, 
              CASE WHEN p2 IS NOT NULL THEN true ELSE false END AS liked
       ORDER BY q.likes DESC`,
      { eventId, username }
    );

    return result.records.map((r) => {
      const question = r.get('q')?.properties;
      if (question) {
        question.participant = {
          name: r.get('participantName'),
          username: r.get('participantUsername'),
        };
        question.liked = r.get('liked'); // Attach the 'liked' status to the question
      }
      return question;
    });
  } catch (error) {
    return null;
  } finally {
    session.close();
  }
};
