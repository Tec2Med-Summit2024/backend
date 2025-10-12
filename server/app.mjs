import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import { closeDriver, initDriver } from './database/connector.mjs';
import { authenticateToken, verifyUsername } from './middleware/verifier.mjs';

import participantsRouter from './api/participants/participants.route.mjs';
import eventsRouter from './api/events/events.route.mjs';
import partnersRouter from './api/partners/partners.route.mjs';
import usersRouter from './api/users/users.route.mjs';
import authRouter from './auth/auth.route.mjs';
import { handleFileUploadErrors } from './middleware/fileUploadValidation.mjs';

const app = express();

initDriver(process.env.DB_URI, process.env.DB_USER, process.env.DB_PWD);

app.get('/', cors({ origin: '*' }), (req, res) => res.json('Hello World!'));


app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

app.param('username', verifyUsername);

// Apply authentication middleware to all API routes
app.use('/api/participants', authenticateToken, participantsRouter);
app.use('/api/events', authenticateToken, eventsRouter);
app.use('/api/partners', authenticateToken, partnersRouter);
app.use('/api/users', authenticateToken, usersRouter);
app.use('/api', authRouter);

// Add file upload error handling middleware
app.use(handleFileUploadErrors);

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
