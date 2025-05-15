const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let db;

const initDb = async () => {
  if (db) return db;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('contactDB'); 
  console.log('Connected to MongoDB');
  return db;
};

const getDb = () => db;

module.exports = { initDb, getDb };

