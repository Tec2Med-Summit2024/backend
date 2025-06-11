import express from 'express';
import { makeQuery } from '../helpers/functions.mjs';

const router = express.Router();

/**
 * Partners Management Page
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
        WHERE p.name CONTAINS $search 
        OR p.username CONTAINS $search 
        OR p.email CONTAINS $search
      `;
      params.search = search.toLowerCase();
    }

    // Get total count for pagination
    const countResult = await makeQuery(
      `MATCH (p:Partner) ${searchCondition} RETURN count(p) as total`,
      params
    );

    const total = countResult[0]?.low || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const partners = await makeQuery(
      `MATCH (p:Partner) ${searchCondition} RETURN p SKIP toInteger($skip) LIMIT toInteger($limit)`,
      params
    );

    // console.log('Partners =>', partners);

    return res.render('partners/index', {
      title: 'Partners Management',
      partners: [...partners],
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
 * Endpoint to create a new partner
 */
router.post('/', async (req, res) => {
  try {
    const fields = req.body;
    console.log('Creating new partner with fields:', fields);
    // Generate parameterized property assignments for Cypher
    const fieldKeys = Object.keys(fields);
    const propertyAssignments = fieldKeys
      .map((key) => {
        const value = fields[key];
        if (typeof value === 'number') {
          return `${key}: ${value}`;
        } else {
          return `${key}: '${value}'`;
        }
      })
      .join(', ');
    console.log('Property Assignments:', propertyAssignments);
    const result = await makeQuery(`
      MATCH (p:Partner)
      WITH count(p) + 1 AS partnerCount
      CREATE (newPartner:Partner {
        username: '${fields.name.toLowerCase()}-' + toString(partnerCount),
        ${propertyAssignments}
      })
      RETURN newPartner
    `);

    const p = result[0];
    console.log('Created Partner with username:', p.username);
    // Add your creation logic here
    return res.render('partners/details', {
      title: `Partner ${p.username}`,
      partner: p,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Page to create a new partner
 */
router.get('/new', (req, res) => {
  return res.render('partners/new', { title: 'Create New Partner' });
});

/**
 * Page to view partner details
 */
router.get('/:username', async (req, res) => {
  try {
  const username = req.params.username;
  const result = await makeQuery(
    `
    MATCH (p:Partner {username: $username})
    OPTIONAL MATCH (participant:Participant)
    WHERE participant.institution = p.name
    WITH p, COLLECT(participant.username) as participants
    RETURN p {.*, working_participants: participants}
    `,
    { username }
  );
  
  const p = result[0];

  return res.render('partners/details', {
    title: `Partner ${p.username}`,
    partner: p,
  });
} catch (error) {
  console.error(error);
  return res.status(500).send('Internal Server Error');
}

});

/**
 * Endpoint to update partner details
 */
router.post('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const fields = req.body;
    console.log('Updating partner with username:', username);
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
      'MATCH (p:Partner {username: $username}) SET p += $fields RETURN p',
      { username, fields }
    );
    const partnerUpdated = result[0];
    console.log('Updated partner:', partnerUpdated);
    // Redirect to the partner details page after updating
    return res.render('partners/details', {
      title: `Partner ${partnerUpdated.username}`,
      partner: partnerUpdated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Page to edit partner details
 */
router.get('/:username/edit', async (req, res) => {
  try {
    const username = req.params.username;
    const result = await makeQuery(
      'MATCH (p:Partner {username: $username}) RETURN p',
      { username }
    );

    console.log('Partner ', result[0]);

    return res.render('partners/edit', {
      title: `Edit Partner ${result[0].username}`,
      partner: result[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Endpoint to delete an partner
 */
router.post('/:username/delete', async (req, res) => {
  try {
    const username = req.params.username;
    console.log('Deleting partner with username:', username);
    // Add your delete logic here
    const result = await makeQuery(
      'MATCH (p:Partner {username: $username}) DETACH DELETE p',
      { username }
    );
    console.log('Delete result:', result);
    // Redirect to the partners list page after deletion
    return res.redirect('/admin/partners');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
