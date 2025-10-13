/* eslint-disable camelcase */
import express from 'express';
import { makeQuery } from '../helpers/functions.mjs';

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const partners = await makeQuery(`MATCH (p:Partner)
    WITH p AS partner
    RETURN partner`);
    return res.status(200).json({ partners });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
        WHERE toLower(p.name) CONTAINS '${search.toLowerCase()}' 
        OR toLower(p.user_id) CONTAINS '${search.toLowerCase()}' 
        OR toLower(p.email) CONTAINS '${search.toLowerCase()}' 
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

    // Handle arrays properly
    if (fields.interests) {
      fields.interests = Array.isArray(fields.interests)
        ? fields.interests
        : [fields.interests];
    }

    // Store country_code and phone separately (don't combine them)
    // The country_code field will be stored as is, phone field will be stored as is

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
    const result = await makeQuery(
      `
      CREATE (newPartner:Partner {
        user_id: $user_id,
        ${propertyAssignments}
      })
      RETURN newPartner
    `, { user_id });

    const p = result[0];
    console.log('Created Partner with user_id:', p.user_id);
    // Add your creation logic here
    return res.render('partners/details', {
      title: `Partner ${p.user_id}`,
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
router.get('/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await makeQuery(
      `
    MATCH (p:Partner {user_id: $user_id})
    OPTIONAL MATCH (participant:Participant)-[:WORKS_AT]->(p)
    WITH p, COLLECT({user_id: participant.username, name: participant.name}) as participants
    RETURN p {.*, working_participants: participants}
    `,
      { user_id }
    );

    const p = result[0];

    return res.render('partners/details', {
      title: `Partner ${p.user_id}`,
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
router.post('/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const fields = req.body;
    console.log('Updating partner with user_id:', user_id);
    console.log('Fields:', fields);

    // Handle arrays properly
    if (fields.interests) {
      fields.interests = Array.isArray(fields.interests)
        ? fields.interests
        : [fields.interests];
    }

    // Store country_code and phone separately (don't combine them)
    // The country_code field will be stored as is, phone field will be stored as is

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
      'MATCH (p:Partner {user_id: $user_id}) SET p += $fields RETURN p',
      { user_id, fields }
    );
    const partnerUpdated = result[0];
    console.log('Updated partner:', partnerUpdated);
    // Redirect to the partner details page after updating
    return res.render('partners/details', {
      title: `Partner ${partnerUpdated.user_id}`,
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
router.get('/:user_id/edit', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await makeQuery(
      'MATCH (p:Partner {user_id: $user_id}) RETURN p',
      { user_id }
    );

    const partner = result[0];
    console.log('Partner ', partner);

    // Ensure arrays are properly handled and initialized
    partner.interests = partner.interests || [];

    // Convert to arrays if they're not already
    if (!Array.isArray(partner.interests)) {
      partner.interests = [partner.interests];
    }

    return res.render('partners/edit', {
      title: `Edit Partner ${partner.user_id}`,
      partner: partner,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * Endpoint to delete an partner
 */
router.post('/:user_id/delete', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    console.log('Deleting partner with user_id:', user_id);
    // Add your delete logic here
    const result = await makeQuery(
      'MATCH (p:Partner {user_id: $user_id}) DETACH DELETE p',
      { user_id }
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