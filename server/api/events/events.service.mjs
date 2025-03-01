import {
  getFilteredEventsFromDb,
  getEventByIdFromDb,
  createQuestionInEventFromDb,
  likeQuestionInEventFromDb,
  dislikeQuestionInEventFromDb,
  getQuestionsFromEventFromDb,
} from './events.db.mjs';

/**
 *
 * @param {string} search
 * @param {Date} start
 * @param {Date} end
 */
export const searchEvents = async (search, type, start, end) => {
  try {
    const events = await getFilteredEventsFromDb(search, type, start, end);
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
 * @param {string} eventId
 * @param {*} question
 */
export const createQuestionInEvent = async (username, eventId, question) => {
  try {
    const result = await createQuestionInEventFromDb(username, eventId, question);
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
export const likeQuestionInEvent = async (eventId, questionId) => {
  try {
    const result = await likeQuestionInEventFromDb(eventId, questionId);
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
export const dislikeQuestionInEvent = async (eventId, questionId) => {
  try {
    const result = await dislikeQuestionInEventFromDb(eventId, questionId);
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
export const getQuestionsFromEvent = async (eventId) => {
  try {
    const questions = await getQuestionsFromEventFromDb(eventId);
    if (questions) {
      return { ok: true, value: questions };
    }

    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  } catch (err) {
    return { ok: false, error: 500, errorMsg: 'Internal Server Error' };
  }
};
