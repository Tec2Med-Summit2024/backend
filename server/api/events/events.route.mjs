import express from 'express';
import {
  getEvent,
  addFeedback,
  getEvents,
  createQuestion,
  likeQuestion,
  dislikeQuestion,
  getQuestions,
  getEventsWithUserQuestionsController,
  getEventsWithQuestionsForUserController,
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
 * @POST /api/events/:id/feedback
 */
router.post('/:id/feedback', addFeedback);

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
 * @brief Gets all questions of the event. Username is used to check if the user liked the question
 * @GET /api/events/:id/questions
 */
router.get('/:id/questions', getQuestions);

/**
 * @brief Gets all questions of the event. Username is used to check if the user liked the question
 * @GET /api/events/:id/questions
 */
router.get('/:id/questions', getQuestions);

/**
 * @brief Gets events where the user has asked questions
 * @GET /api/events/questions/sent
 */
router.get('/questions/sent', getEventsWithUserQuestionsController);

/**
 * @brief Gets events where the user is a speaker/instructor and has received questions
 * @GET /api/events/questions/received
 */
router.get('/questions/received', getEventsWithQuestionsForUserController);

export default router;
