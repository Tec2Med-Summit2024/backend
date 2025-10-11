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
      speakerInstructor = false,
      questionsAsked = false,
      topics = [],
      types = [],
    } = req.query;

    const startDate = start ? new Date(start) : new Date(2000, 0, 1);
    const endDate = end ? new Date(end) : new Date(2100, 0, 1);

    const user = req.user.username || req.user.id;

    console.log('Searching events for user:', user);
    console.log('Search parameters:', {
      search,
      start: startDate,
      end: endDate,
      registered,
      speakerInstructor,
      questionsAsked,
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
        speakerInstructor: speakerInstructor === 'true',
        questionsAsked: questionsAsked === 'true',
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
    const { id } = req.params;
    const { feedback } = req.body;
    const username = req.user.username;

    console.log('=== ADD FEEDBACK DEBUG LOGS ===');
    console.log('Request params:', { id, username });
    console.log('Request body:', feedback);
    console.log('User object:', req.user);

    // Validate required parameters
    if (!id) {
      console.error('Missing event ID');
      return res.status(400).json({ error: 'Event ID is required' });
    }
    if (!username) {
      console.error('Missing username');
      return res.status(400).json({ error: 'Username is required' });
    }
    if (!feedback) {
      console.error('Missing feedback content');
      return res.status(400).json({ error: 'Feedback content is required' });
    }

    console.log('Calling addFeedbackToEvent with:', { id, username, feedback });
    const result = await addFeedbackToEvent(id, username, feedback);
    console.log('addFeedbackToEvent result:', result);

    if (result.ok) {
      console.log('Feedback added successfully:', result.value);
      return res.status(200).json(result.value);
    }

    console.error('Failed to add feedback:', { error: result.error, errorMsg: result.errorMsg });
    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    console.error('Unexpected error in addFeedback:', error);
    console.error('Error stack:', error.stack);
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
    const content = req.body.content;
    const username = req.user.username;

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
    const { id, questionId } = req.params;
    const username = req.user.username;

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
    const { id, questionId } = req.params;
    const username = req.user.username;

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
    const { id } = req.params;
    const username = req.user.username;

    const result = await getQuestionsFromEvent(id, username);
    if (result.ok) {
      return res.status(200).json(result.value);
    }

    return res.status(result.error).json({ error: result.errorMsg });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
