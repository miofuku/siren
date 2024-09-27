// scripts/generateDummyData.ts

import dotenv from 'dotenv';
import { MongoClient, Db, ObjectId } from 'mongodb';
import { z } from 'zod';

dotenv.config();

const LocationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90)
  ])
});

const PostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  type: z.enum(["alert", "missing_person", "event", "other"]),
  locations: z.array(LocationSchema).min(1).max(5),
  author: z.instanceof(ObjectId),
  createdAt: z.date(),
  updatedAt: z.date()
});

type Post = z.infer<typeof PostSchema>;
type Location = z.infer<typeof LocationSchema>;

const generateDummyLocation = (): Location => ({
  type: "Point",
  coordinates: [
    Number((Math.random() * 360 - 180).toFixed(6)),
    Number((Math.random() * 180 - 90).toFixed(6))
  ]
});

const generateDummyPost = (): Post => {
  const types = ["alert", "missing_person", "event", "other"] as const;
  const numLocations = Math.floor(Math.random() * 5) + 1;
  return {
    title: `Dummy Post ${Math.floor(Math.random() * 1000)}`,
    content: `This is a dummy post content. ${Math.random().toString(36).substring(7)}`,
    type: types[Math.floor(Math.random() * types.length)],
    locations: Array.from({ length: numLocations }, generateDummyLocation),
    author: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

async function cleanupDatabase(db: Db): Promise<void> {
  console.log('Cleaning up existing data...');
  await db.collection('posts').deleteMany({});
  console.log('Existing data cleaned up.');
}

async function generateDummyData(count: number): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Clean up existing data
    await cleanupDatabase(db);

    const postsCollection = db.collection('posts');

    const dummyPosts = Array.from({ length: count }, generateDummyPost);

    const result = await postsCollection.insertMany(dummyPosts);
    console.log(`${result.insertedCount} dummy posts inserted successfully`);
  } catch (error) {
    console.error('Error generating dummy data:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Usage: Call this function with the number of dummy posts you want to generate
generateDummyData(50);

export { generateDummyData };