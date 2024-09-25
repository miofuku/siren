require('dotenv').config();
const { MongoClient } = require('mongodb');
const { z } = require('zod');

const PostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  type: z.enum(["alert", "missing_person", "event", "other"]),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([
      z.number().min(-180).max(180),
      z.number().min(-90).max(90)
    ])
  }),
  createdAt: z.date(),
  updatedAt: z.date()
});

type Post = z.infer<typeof PostSchema>;

const generateDummyPost = (): Post => {
  const types = ["alert", "missing_person", "event", "other"];
  return {
    title: `Dummy Post ${Math.floor(Math.random() * 1000)}`,
    content: `This is a dummy post content. ${Math.random().toString(36).substring(7)}`,
    type: types[Math.floor(Math.random() * types.length)] as Post['type'],
    location: {
      type: "Point",
      coordinates: [
        Math.random() * 360 - 180,
        Math.random() * 180 - 90
      ]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

async function generateDummyData(count: number) {
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

    const dummyPosts = Array.from({ length: count }, generateDummyPost);

    const result = await postsCollection.insertMany(dummyPosts);
    console.log(`${result.insertedCount} dummy posts inserted successfully`);
  } catch (error) {
    console.error('Error generating dummy data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Usage: Call this function with the number of dummy posts you want to generate
generateDummyData(50);

module.exports = { generateDummyData };