import {
  getFilteredEventsFromDb,
  getEventByIdFromDb,
  createQuestionInEventFromDb,
  getQuestionsFromEventFromDb,
} from './events.db.mjs';

/**
 *
 * @param {string} search
 * @param {Date} start
 * @param {Date} end
 */
export const searchEvents = async (search, start, end) => {
  try {
    const events = await getFilteredEventsFromDb(search, start, end);
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
export const createQuestionInEvent = async (eventId, question) => {
  try {
    const result = await createQuestionInEventFromDb(eventId, question);
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
