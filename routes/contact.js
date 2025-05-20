const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find().toArray(); 
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get a single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(req.params.id) }); 

    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// route POST
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await db.collection('contacts').insertOne({
      firstName, lastName, email, favoriteColor, birthday
    });

    res.status(201).json({ message: 'Contact created', contactId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// PUT contact by ID routes
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid contact ID' });

  try {
    const db = getDb();
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    const result = await db.collection('contacts').replaceOne(
      { _id: new ObjectId(id) },
      { firstName, lastName, email, favoriteColor, birthday }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Contact not found or unchanged' });
    }

    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});


// DELETE contact by ID route
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid contact ID' });

  try {
    const db = getDb();
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});


module.exports = router;
 