import express from 'express';
// remove this comment and add your controller functions
import {} from './partners.controller.mjs';

const router = express.Router();

/**
 *
 */
router.get('/:username', (req, res) => {
  res.json({ message: 'Hello World' });
});

/**
 *
 */
router.post('/:username/cvs', (req, res) => {
  res.send('User List');
});

/**
 *
 */
router.get('/:username/cvs/:cvId', (req, res) => {
  res.send(`Returning CV with id=${req.params.id}`);
});

/**
 *
 */
router.get('/:username/cvs', (req, res) => {
  res.send('User List');
});

export default router;
