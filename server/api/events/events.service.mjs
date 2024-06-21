import { } from './events.db.mjs';

/**
 * 
 * @param {string} search 
 * @param {Date} start 
 * @param {Date} end 
 */
export const getEventsFromDb = async (search, start, end) => {
    try {

    } catch (err) {
        return { ok: false, error: 500, errorMsg: "Internal Server Error" }
    }
};

/**
 * 
 * @param {string} id 
 */
export const getEventFromDb = async (id) => { };

/**
 * 
 * @param {string} eventId 
 * @param {*} question 
 */
export const createQuestionInEvent = async (eventId, question) => { };

/**
 * 
 * @param {string} eventId 
 */
export const getQuestionsFromEvent = async (eventId) => { };
