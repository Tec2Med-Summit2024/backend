import express from 'express'
import attendeesRouter from './api/attendees/attendees.route.mjs'
import eventsRouter from './api/events/events.route.mjs'
import usersRouter from './api/users/users.route.mjs'

const app = express();

app.get("/", (req, res) => res.json("Hello World!"));

app.listen(9999, () => console.log(`Server ready at http://localhost:9999`))