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
export const getFilteredEventsFromDb = async (search, start, end) => {
    const driver = getDriver();
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (e:Event) WHERE e.title CONTAINS $search AND e.start >= $start AND e.end <= $end RETURN e`,
            { search, start, end }
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
 * @param {string} id 
 */
export const getEventByIdFromDb = async (id) => {
    const driver = getDriver();
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (e:Event) WHERE e.id = $id RETURN e`,
            { id }
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
export const createQuestionInEventFromDb = async (eventId, question) => {
    const driver = getDriver();
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (e:Event) WHERE e.id = $eventId CREATE (q:Question $question)-[:ASKED_IN]->(e) RETURN q`,
            { eventId, question }
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
export const getQuestionsFromEventFromDb = async (eventId) => {
    const driver = getDriver();
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (e:Event)-[:ASKED_IN]->(q:Question) WHERE e.id = $eventId RETURN q`,
            { eventId }
        );

        return result.records.map(r => r.get(0)?.properties);
    } catch (error) {
        return null;
    } finally {
        session.close();
    }
};