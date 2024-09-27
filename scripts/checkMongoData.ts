// scripts/checkMongoData.ts

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function checkData() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const postsCollection = db.collection('posts');

    // Count total documents
    const totalCount = await postsCollection.countDocuments();
    console.log(`Total number of posts: ${totalCount}`);

    // Get a sample of documents
    const samplePosts = await postsCollection.find().limit(5).toArray();
    console.log('Sample posts:');
    console.log(JSON.stringify(samplePosts, null, 2));

    // Count posts by type
    const typeCounts = await postsCollection.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]).toArray();
    console.log('Posts count by type:');
    console.log(typeCounts);

    // Find posts with more than 2 locations
    const multiLocationPosts = await postsCollection.countDocuments({
      $expr: { $gt: [{ $size: "$locations" }, 2] }
    });
    console.log(`Posts with more than 2 locations: ${multiLocationPosts}`);

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

checkData();