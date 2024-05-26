import express from 'express';
import attendeesRouter from './api/attendees/attendees.route.mjs';
import eventsRouter from './api/events/events.route.mjs';
import partnersRouter from './api/partners/partners.route.mjs';
import usersRouter from './api/users/users.route.mjs';

const app = express();

app.get('/', (req, res) => res.json('Hello World!'));

app.use('/api/attendees', attendeesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/users', usersRouter);

app.listen(9999, () => console.log(`Server ready at http://localhost:9999`));
