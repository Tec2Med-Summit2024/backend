import {
  searchEvents,
  getEventById,
  addFeedbackToEvent,
  createQuestionInEvent,
  likeQuestionInEvent,
  dislikeQuestionInEvent,
  getQuestionsFromEvent,
} from './events.service.mjs';

export const getEvents = async (req, res) => {
  try {
    const {
      search = '',
      start,
      end,
      registered = false,
      speaker_instructor = false,
      questions_asked = false,
      topics = [],
      types = [],
    } = req.query;

    const startDate = start ? new Date(start) : new Date(2000, 0, 1);
    const endDate = end ? new Date(end) : new Date(2100, 0, 1);

    const user = req.user ?? 'sarah98@tec2med.com'; // assuming authorized user info is available here

    console.log('Searching events for user:', user);
    console.log('Search parameters:', {
      search,
      start: startDate,
      end: endDate,
      registered,
      speaker_instructor,
      questions_asked,
      topics,
      types,
    });

    const result = await searchEvents(
      search,
      startDate.toISOString(),
      endDate.toISOString(),
      {
        userId: user,
        registered: registered === 'true',
        speaker_instructor: speaker_instructor === 'true',
        questions_asked: questions_asked === 'true',
        topics: Array.isArray(topics) ? topics : topics ? [topics] : [],
        types: Array.isArray(types) ? types : types ? [types] : [],
      }
    );

    if (result.ok) {
      return res.status(200).json(result.value);
    }
    console.log('Error searching events:', result.errorMsg);
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    console.log(error);
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
 * Add event feedback
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const addFeedback = async (req, res) => {
  try {
    const { id, username } = req.params;
    const { feedback } = req.body;

    const result = await addFeedbackToEvent(id, username, feedback);
    if (result.ok) {
      return res.status(200).json(result.value);
    }

    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    console.log(error);
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
    const { id, username } = req.params;
    const content = req.body.content;

    const result = await createQuestionInEvent(username, id, content);
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
 * Likes a question
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const likeQuestion = async (req, res) => {
  try {
    const { id, questionId, username } = req.params;

    const result = await likeQuestionInEvent(id, questionId, username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }

    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Dislikes a question
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const dislikeQuestion = async (req, res) => {
  try {
    const { id, questionId, username } = req.params;

    const result = await dislikeQuestionInEvent(id, questionId, username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }

    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
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
    const { id, username } = req.params;

    const result = await getQuestionsFromEvent(id, username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }

    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
