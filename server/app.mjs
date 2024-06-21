import express from 'express';
import { closeDriver, initDriver } from './database/connector.mjs';

import adminRouter from './admin/router/index.mjs';

import attendeesRouter from './api/attendees/attendees.route.mjs';
import eventsRouter from './api/events/events.route.mjs';
import partnersRouter from './api/partners/partners.route.mjs';
import usersRouter from './api/users/users.route.mjs';
import { engine } from 'express-handlebars';

const app = express();

// initDriver(process.env.DB_URI, process.env.DB_USER, process.env.DB_PWD);


// app.param('username', verifyUsername);
app.engine('.hbs', engine({
  extname: '.hbs',
  layoutsDir: './server/admin/views/_layouts',
  partialsDir: './server/admin/views/_partials',
}));
app.set('view engine', '.hbs');
app.set('views', './server/admin/views');


app.use('/admin', adminRouter)

app.use('/api/attendees', attendeesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => res.json('Hello World!'));
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
