import express from 'express';
import {
  getEvent,
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
 * @brief Creates a new question for the event
 * @POST /api/events/:id/questions
 */
router.post('/:id/questions', createQuestion);

/**
 * @brief Likes a question
 * @PUT /api/events/:id/questions/:questionId/like
 */
router.put('/:id/questions/:questionId', likeQuestion);

/**
 * @brief Dislikes a question
 * @DELETE /api/events/:id/questions/:questionId
 */
router.delete('/:id/questions/:questionId', dislikeQuestion);

/**
 * @brief Gets all questions of the event
 * @GET /api/events/:id/questions
 */
router.get('/:id/questions', getQuestions);

export default router;
