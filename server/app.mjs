import express from 'express';
import { initDriver } from './database/connector.mjs';

import attendeesRouter from './api/attendees/attendees.route.mjs';
import eventsRouter from './api/events/events.route.mjs';
import partnersRouter from './api/partners/partners.route.mjs';
import usersRouter from './api/users/users.route.mjs';

const app = express();
// initDriver();
app.get('/', (req, res) => res.json('Hello World!'));

// app.param('username', verifyUsername);

app.use('/api/attendees', attendeesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/users', usersRouter);

app.use('*', (_, res) => res.status(404).json({ error: 'Not found' }));

app.listen(9999, () => console.log(`Server ready at http://localhost:9999`));
