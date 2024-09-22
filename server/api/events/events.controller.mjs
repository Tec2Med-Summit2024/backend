import {
  searchEvents,
  getEventById,
  createQuestionInEvent,
  getQuestionsFromEvent,
} from './events.service.mjs';

/**
 * Get all events of the authorized user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @query {string} [search] - Search query
 * @query {Date} [start] - Limit the events by start date
 * @query {Date} [end] - Limit the events by end date
 */
export const getEvents = async (req, res) => {
  try {
    console.log(req.query);
    const { search, start, end } = req.query;
    console.log(search, start, end);
    const searchName = search || '';
    const startDate = start ? new Date(start) : new Date(2000, 0, 1, 0, 0, 0);
    const endDate = end ? new Date(end) : new Date(2100, 0, 1, 0, 0, 0);

    const result = await searchEvents(
      searchName,
      startDate.toISOString(),
      endDate.toISOString()
    );
    if (result.ok) {
      return res.status(200).json(result.value);
    }

    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Get a specific event of the authorized user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getEventById(id);
    if (result.ok) {
      return res.status(200).json(result);
    }

    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Creates a new question for the event
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = {
      question_id: req.body.question_id,
      content: req.body.content,
    };

    const result = await createQuestionInEvent(id, question);
    if (result.ok) {
      return res.status(201).json(result.value);
    }

    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getQuestions = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getQuestionsFromEvent(id);
    if (result.ok) {
      return res.status(200).json(result.value);
    }

    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
