import {
  getFilteredEventsFromDb,
  getEventByIdFromDb,
  addFeedbackToEventFromDb,
  createQuestionInEventFromDb,
  likeQuestionInEventFromDb,
  dislikeQuestionInEventFromDb,
  getQuestionsFromEventFromDb,
} from './events.db.mjs';

export const searchEvents = async (search, type, start, end, filters) => {
  try {
    const events = await getFilteredEventsFromDb(
      search,
      type,
      start,
      end,
      filters
    );
    if (events) {
      return { ok: true, value: events };
    }
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  } catch (err) {
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  }
};

/**
 *
 * @param {string} id
 */
export const getEventById = async (id) => {
  try {
    const event = await getEventByIdFromDb(id);
    if (event) {
      return { ok: true, value: event };
    }

    return { ok: false, error: 404, errorMsg: 'Event not found' };
  } catch (err) {
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  }
};

/**
 *
 * @param {string} username
 * @param {string} eventId
 * @param {string} feedback
 */
export const addFeedbackToEvent = async (eventId, username, feedback) => {
  try {
    const result = await addFeedbackToEventFromDb(eventId, username, feedback);
    if (result) {
      return { ok: true, value: result };
    }

    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  } catch (err) {
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  }
};

/**
 *
 * @param {string} eventId
 * @param {*} content
 */
export const createQuestionInEvent = async (username, eventId, content) => {
  try {
    const result = await createQuestionInEventFromDb(
      username,
      eventId,
      content
    );
    if (result) {
      return { ok: true, value: result };
    }
    console.log('Failed to create question');
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  } catch (err) {
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  }
};

/**
 * @brief
 * @param {string} eventId
 * @param {string} questionId
 */
export const likeQuestionInEvent = async (eventId, questionId, username) => {
  try {
    const result = await likeQuestionInEventFromDb(
      eventId,
      questionId,
      username
    );
    if (result) {
      return { ok: true, value: result };
    }
    console.log('Failed to like question');
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  } catch (err) {
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  }
};

/**
 * @brief
 * @param {string} eventId
 * @param {string} questionId
 */
export const dislikeQuestionInEvent = async (eventId, questionId, username) => {
  try {
    const result = await dislikeQuestionInEventFromDb(
      eventId,
      questionId,
      username
    );
    if (result) {
      return { ok: true, value: result };
    }
    console.log('Failed to dislike question');
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  } catch (err) {
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  }
};

/**
 *
 * @param {string} eventId
 */
export const getQuestionsFromEvent = async (eventId, username) => {
  try {
    const questions = await getQuestionsFromEventFromDb(eventId, username);
    if (questions) {
      return { ok: true, value: questions };
    }

    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  } catch (err) {
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  }
};
