import express from 'express';
import { makeQuery } from '../helpers/functions.mjs';

const router = express.Router();

/**
 * Events Management Page
 */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 50);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Build the search condition
    let searchCondition = '';
    const params = { skip, limit };

    if (search) {
      searchCondition = `
        WHERE toLower(e.name) CONTAINS '${search.toLowerCase()}' 
        OR e.event_id CONTAINS $search
      `;
      params.search = search.toLowerCase();
    }

    const countResult = await makeQuery(
      `MATCH (e:Event) ${searchCondition} RETURN count(e) as total`,
      params
    );

    const total = countResult[0]?.low || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const events = await makeQuery(
      `MATCH (e:Event)-[:IN_TYPE]->(et:EventType)
      ${searchCondition}
      WITH e, et
      RETURN e {.*, event_type: et.name}
      ORDER BY e.start DESC
      SKIP toInteger($skip) LIMIT toInteger($limit)`,
      params
    );

    // console.log('Events =>', events);

    return res.render('events/index', {
      title: 'Events Management',
      events: [...events],
      pagination: {
        currentPage: page,
        totalPages,
        total,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      search,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Endpoint to create a new event
 */
router.post('/', async (req, res) => {
  try {
    const fields = req.body;
    console.log('Creating new event with fields:', fields);
    
    // Handle arrays properly
    if (fields.topics_covered) {
      fields.topics_covered = Array.isArray(fields.topics_covered) ? fields.topics_covered : [fields.topics_covered];
    }
    
    // Generate parameterized property assignments for Cypher
    const eventType = fields.event_type;
    delete fields.event_type;
    console.log('Event Type:', eventType);
    const fieldKeys = Object.keys(fields);
    const propertyAssignments = fieldKeys
      .map((key) => {
        const value = fields[key];
        if (Array.isArray(value)) {
          return `${key}: ${JSON.stringify(value)}`;
        }
        if (typeof value === 'number') {
          return `${key}: ${value}`;
        } else {
          return `${key}: '${value}'`;
        }
      })
      .join(', ');
    console.log('Property Assignments:', propertyAssignments);
    const result = await makeQuery(
      `
      MATCH (e:Event)
      WITH count(e) + 1 AS newEventId
      CREATE (newEvent:Event {
        event_id: newEventId,
        ${propertyAssignments}
      })
      CREATE (newEvent)-[:IN_TYPE]->(et:EventType {name: $eventType})
      RETURN newEvent {.*, event_type: et.name}
    `,
      { eventType }
    );
    const e = result[0];

    console.log('Created Event:', e);
    const start = e.start;
    const end = e.end;

    const startDate = start.split('T')[0];
    const startTime = start.split('T')[1].split(':').slice(0, 2).join(':');
    const endDate = end.split('T')[0];
    const endTime = end.split('T')[1].split(':').slice(0, 2).join(':');
    e.startDate = startDate;
    e.startTime = startTime;
    e.endDate = endDate;
    e.endTime = endTime;

    console.log('Created Event with event_id:', e.event_id);
    // Add your creation logic here
    return res.render('events/details', {
      title: `Event ${e.event_id}`,
      event: e,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Page to create a new event
 */
router.get('/new', (req, res) => {
  return res.render('events/new', { title: 'Create New Event' });
});

/**
 * Page to view event details
 */
router.get('/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const result = await makeQuery(
      `MATCH (e:Event {event_id: $eventId})-[:IN_TYPE]->(et:EventType)
      OPTIONAL MATCH (q:Question)-[:ASKED_IN]->(e)
      OPTIONAL MATCH (e)-[:ORGANIZED_BY]->(p:Partner)
      WITH e, et, COLLECT(DISTINCT q {.*}) AS questions, p
      RETURN e {.*, event_type: et.name, questions_asked: questions, company_username: p.username}`,
      { eventId }
    );
    const e = result[0];
    console.log('Event ', e);

    const start = e.start;
    const end = e.end;

    const startDate = start.split('T')[0];
    const startTime = start.split('T')[1].split(':').slice(0, 2).join(':');
    const endDate = end.split('T')[0];
    const endTime = end.split('T')[1].split(':').slice(0, 2).join(':');
    e.startDate = startDate;
    e.startTime = startTime;
    e.endDate = endDate;
    e.endTime = endTime;
    console.log('Event with formatted date and time:', e);

    return res.render('events/details', {
      title: `Event ${e.event_id}`,
      event: e,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Endpoint to update event details
 */
router.post('/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const fields = req.body;
    console.log('Updating event with ID:', eventId);
    console.log('Fields:', fields);
    
    // Handle arrays properly
    if (fields.topics_covered) {
      fields.topics_covered = Array.isArray(fields.topics_covered) ? fields.topics_covered : [fields.topics_covered];
    }
    
    // Add your update logic here
    for (const field in fields) {
      const value = fields[field];
      console.log(`Field: ${field}, Value: ${value}`);
      if (value === '') {
        console.log(`Field ${field} is empty`);
        // Remove the field from the object
        delete fields[field];
      }
    }
    console.log('Updated fields:', fields);
    const result = await makeQuery(
      'MATCH (e:Event {event_id: $eventId}) SET e += $fields RETURN e',
      { eventId, fields }
    );
    const eventUpdated = result[0];
    console.log('Updated event:', eventUpdated);
    // Redirect to the event details page after updating
    return res.render('events/details', {
      title: `Event ${eventUpdated.event_id}`,
      event: eventUpdated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Page to edit event details
 */
router.get('/:id/edit', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const result = await makeQuery(
      'MATCH (e:Event {event_id: $eventId}) RETURN e',
      { eventId }
    );

    const event = result[0];
    console.log('Event ', event);

    // Ensure arrays are properly handled and initialized
    event.topics_covered = event.topics_covered || [];

    // Convert to arrays if they're not already
    if (!Array.isArray(event.topics_covered)) {
      event.topics_covered = [event.topics_covered];
    }

    return res.render('events/edit', {
      title: `Edit Event ${event.event_id}`,
      event: event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Endpoint to delete an event
 */
router.post('/:id/delete', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    console.log('Deleting event with ID:', eventId);
    // Add your delete logic here
    const result = await makeQuery(
      'MATCH (e:Event {event_id: $eventId}) DETACH DELETE e',
      { eventId }
    );
    console.log('Delete result:', result);
    // Redirect to the events list page after deletion
    return res.redirect('/admin/events');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/:id/questions/:qid/delete', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const questionId = req.params.qid;
    console.log(
      'Deleting question with ID:',
      questionId,
      'from event:',
      eventId
    );

    const result = await makeQuery(
      'MATCH (q:Question {question_id: $questionId})-[:ASKED_IN]->(e:Event {event_id: $eventId}) DETACH DELETE q',
      { questionId, eventId }
    );
    console.log('Delete result:', result);
    // Redirect to the events list page after deletion
    return res.redirect(`/admin/events/${eventId}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
