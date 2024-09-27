const { MongoClient } = require('mongodb');
require('dotenv').config();

async function updateSchema() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();

    await db.command({
      collMod: 'posts',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'content', 'type', 'locations', 'author', 'createdAt', 'updatedAt'],
          properties: {
            title: { bsonType: 'string' },
            content: { bsonType: 'string' },
            type: { enum: ['missing_person', 'hazard_warning', 'crime_warning', 'other'] },
            locations: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['type', 'coordinates', 'placeName'],
                properties: {
                  type: { bsonType: 'string' },
                  coordinates: { bsonType: 'array', items: { bsonType: 'double' } },
                  placeName: { bsonType: 'string' }
                }
              }
            },
            author: { bsonType: 'objectId' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
            resources: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['title', 'url'],
                properties: {
                  title: { bsonType: 'string' },
                  url: { bsonType: 'string' }
                }
              }
            },
            missingPersonDetails: {
              bsonType: 'object',
              required: ['name', 'age', 'lastSeen'],
              properties: {
                name: { bsonType: 'string' },
                age: { bsonType: 'int' },
                lastSeen: { bsonType: 'string' }
              }
            },
            hazardDetails: {
              bsonType: 'object',
              required: ['hazardType', 'severity'],
              properties: {
                hazardType: { bsonType: 'string' },
                severity: { enum: ['low', 'medium', 'high'] }
              }
            },
            crimeDetails: {
              bsonType: 'object',
              required: ['crimeType'],
              properties: {
                crimeType: { bsonType: 'string' },
                suspectDescription: { bsonType: 'string' }
              }
            }
          }
        }
      }
    });

    console.log('Schema updated successfully');
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

updateSchema();