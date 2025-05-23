import express from 'express';

import attendeesRouter from './attendees.mjs';
import eventsRouter from './events.mjs';
import partnersRouter from './partners.mjs';
import ticketsRouter from './tickets.mjs';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/static', express.static('server/admin/public'));

router.use('/attendees', attendeesRouter);
router.use('/events', eventsRouter);
router.use('/partners', partnersRouter);
router.use('/tickets', ticketsRouter);

router.get('/', (req, res) => {
  return res.render('home', { title: 'Admin Panel' });
});

export default router;
