/* eslint-disable camelcase */
import express from 'express';
import { makeQuery } from '../helpers/functions.mjs';

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const participants = await makeQuery(`MATCH (p:Participant)
    WITH p { .* , password: null } AS participant
    RETURN participant`);
    return res.status(200).json({ participants });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Participants Management Page
 */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 50);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const type = req.query.type || '';

    // Build the search condition
    let searchCondition = '';
    const params = { skip, limit };

    if (search || type) {
      searchCondition = 'WHERE ';
      const conditions = [];

      if (search) {
        conditions.push(`(
          toLower(p.name) CONTAINS '${search.toLowerCase()}' 
          OR toLower(p.username) CONTAINS '${search.toLowerCase()}' 
          OR toLower(p.email) CONTAINS '${search.toLowerCase()}'
        )`);
        params.search = search.toLowerCase();
      }

      if (type && type !== '') {
        conditions.push(
          `any(t IN p.type WHERE toLower(t) = toLower('${type}'))`
        );
        params.type = type;
      }

      if (conditions.length > 0) {
        searchCondition += conditions.join(' AND ');
      } else {
        searchCondition = '';
      }
    }

    // Get total count for pagination
    const countResult = await makeQuery(
      `MATCH (p:Participant) ${searchCondition} RETURN count(p) as total`,
      params
    );

    const total = countResult[0]?.low || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Get paginated participants
    const query = `MATCH (p:Participant) ${searchCondition} RETURN p SKIP toInteger($skip) LIMIT toInteger($limit)`;

    const participants = await makeQuery(query, params);

    return res.render('participants/index', {
      title: 'Participants Management',
      participants: [...participants],
      pagination: {
        currentPage: page,
        totalPages,
        total,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      search,
      type,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Endpoint to create a new participant
 */
router.post('/', async (req, res) => {
  try {
    const fields = req.body;
    console.log('Creating new participant with fields:', fields);

    // Handle arrays properly
    if (fields.type) {
      fields.type = Array.isArray(fields.type) ? fields.type : [fields.type];
    }
    if (fields.interests) {
      fields.interests = Array.isArray(fields.interests)
        ? fields.interests
        : [fields.interests];
    }
    if (fields.expertise) {
      fields.expertise = Array.isArray(fields.expertise)
        ? fields.expertise
        : [fields.expertise];
    }
    // Generate parameterized property assignments for Cypher
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
    const user_id = crypto.randomUUID();
    const result = await makeQuery(`
      CREATE (newParticipant:Participant {
        username: $user_id,
        ${propertyAssignments}
      })
      RETURN newParticipant
    `, { user_id });

    const p = result[0];
    console.log('Created Participant with username:', p.username);
    return res.render('participants/details', {
      title: `Participant ${p.username}`,
      participant: p,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Page to create a new participant
 */
router.get('/new', (req, res) => {
  return res.render('participants/new', { title: 'Create New Participant' });
});

/**
 * Page to view participant details
 */
router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    console.log('Viewing participant with username:', username);
    const result = await makeQuery(
      'MATCH (p:Participant {username: $username}) RETURN p',
      { username }
    );
    const p = result[0];
    console.log('participant ', p);

    return res.render('participants/details', {
      title: `Participant ${p.username}`,
      participant: p,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Endpoint to update participant details
 */
router.post('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const fields = req.body;
    console.log('Updating participant with username:', username);
    console.log('Fields:', fields);
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
      'MATCH (p:Participant {username: $username}) SET p += $fields RETURN p',
      { username, fields }
    );
    const participantUpdated = result[0];
    console.log('Updated participant:', participantUpdated);
    // Redirect to the participant details page after updating
    return res.render('participants/details', {
      title: `Participant ${participantUpdated.username}`,
      participant: participantUpdated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Page to edit participant details
 */
router.get('/:username/edit', async (req, res) => {
  try {
    const username = req.params.username;
    const result = await makeQuery(
      'MATCH (p:Participant {username: $username}) RETURN p',
      { username }
    );

    const participant = result[0];
    console.log(
      'Participant data from DB:',
      JSON.stringify(participant, null, 2)
    );

    // Ensure arrays are properly handled and initialized
    participant.interests = participant.interests || [];
    participant.type = participant.type || [];
    participant.expertise = participant.expertise || [];

    // Convert to arrays if they're not already
    if (!Array.isArray(participant.interests)) {
      participant.interests = [participant.interests];
    }
    if (!Array.isArray(participant.type)) {
      participant.type = [participant.type];
    }
    if (!Array.isArray(participant.expertise)) {
      participant.expertise = [participant.expertise];
    }

    return res.render('participants/edit', {
      title: `Edit Participant ${participant.username}`,
      participant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Endpoint to delete an participant
 */
router.post('/:username/delete', async (req, res) => {
  try {
    const username = req.params.username;
    console.log('Deleting participant with username:', username);
    // Add your delete logic here
    const result = await makeQuery(
      'MATCH (p:Participant {username: $username}) DETACH DELETE p',
      { username }
    );
    console.log('Delete result:', result);
    // Redirect to the participants list page after deletion
    return res.redirect('/admin/participants');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
