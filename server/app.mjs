import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import { closeDriver, initDriver } from './database/connector.mjs';
import { verifyUsername } from './middleware/verifier.mjs';

import participantsRouter from './api/participants/participants.route.mjs';
import eventsRouter from './api/events/events.route.mjs';
import partnersRouter from './api/partners/partners.route.mjs';
import usersRouter from './api/users/users.route.mjs';

const app = express();

initDriver(process.env.DB_URI, process.env.DB_USER, process.env.DB_PWD);

app.get('/', (req, res) => res.json('Hello World!'));


app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.param('username', verifyUsername);

app.use('/api/participants', participantsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/users', usersRouter);

app.use('*', (_, res) => res.status(404).json({ error: 'Not found' }));

const server = app.listen(9999, () =>
  console.log(`Server ready at http://localhost:9999`)
);

// Function to gracefully shut down the server and close the database connection
const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully.');

  server.close(() => {
    console.log('Closed out remaining connections.');
    closeDriver()
      .then(() => {
        console.log('Closed Neo4j connection.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error closing Neo4j connection:', err);
        process.exit(1);
      });
  });

  // If after 10 seconds, the server hasn't finished, shut down forcefully
  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
