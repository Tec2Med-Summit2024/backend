import express from 'express';
import {
  getEvent,
  addFeedback,
  getEvents,
  createQuestion,
  likeQuestion,
  dislikeQuestion,
  getQuestions,
} from './events.controller.mjs';

const router = express.Router();

/**
 * @brief Gets all events
 * @GET /api/events
 */
router.get('/', getEvents);

/**
 * @brief Gets a specific event of the authorized user
 * @GET /api/events/:id
 */
router.get('/:id', getEvent);

/**
 * @brief Add event feedback
 * @POST /api/events/:id/score/:username
 */
router.post('/:id/feedback/:username', addFeedback);

/**
 * @brief Creates a new question for the event
 * @POST /api/events/:id/questions
 */
router.post('/:id/questions/:username', createQuestion);

/**
 * @brief Likes a question
 * @PUT /api/events/:id/questions/:questionId/like
 */
router.put('/:id/questions/:questionId/:username', likeQuestion);

/**
 * @brief Dislikes a question
 * @DELETE /api/events/:id/questions/:questionId
 */
router.delete('/:id/questions/:questionId/:username', dislikeQuestion);

/**
 * @brief Gets all questions of the event. Username is used to check if the user liked the question
 * @GET /api/events/:id/questions/:username
 */
router.get('/:id/questions/:username', getQuestions);

export default router;
