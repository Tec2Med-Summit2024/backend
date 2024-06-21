import { getDriver } from '../../database/connector.mjs';

/**
 * 
 * @returns 
 */
export const getAllEvents = async () => {
    const driver = getDriver();
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (e:Event) RETURN e`
        );

        return result.records.map(r => r.get(0)?.properties);
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
export const getFilteredEvents = async (search, start, end) => { };

/**
 * 
 * @param {string} id 
 */
export const getEventById = async (id) => { };

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