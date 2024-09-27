import dotenv from 'dotenv';
import { MongoClient, Db, ObjectId, MongoError } from 'mongodb';
import { z } from 'zod';

dotenv.config();

const LocationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90)
  ]),
  placeName: z.string()
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

type City = {
  name: string;
  coordinates: [number, number]; // This is now explicitly a tuple
};

const cities: City[] = [
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522] },
  { name: "Chicago", coordinates: [-87.6298, 41.8781] },
  { name: "Houston", coordinates: [-95.3698, 29.7604] },
  { name: "Phoenix", coordinates: [-112.0740, 33.4484] },
  { name: "Philadelphia", coordinates: [-75.1652, 39.9526] },
  { name: "San Antonio", coordinates: [-98.4936, 29.4241] },
  { name: "San Diego", coordinates: [-117.1611, 32.7157] },
  { name: "Dallas", coordinates: [-96.7969, 32.7767] },
  { name: "San Jose", coordinates: [-121.8863, 37.3382] }
];

async function cleanupDatabase(db: Db): Promise<void> {
  console.log('Cleaning up existing data...');
  await db.collection('posts').deleteMany({});
  console.log('Existing data cleaned up.');
}

const generateDummyLocation = (): Location => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  return {
    type: "Point",
    coordinates: city.coordinates,
    placeName: city.name
  };
};

const generateDummyPost = (): Post => {
  const types = ["alert", "missing_person", "event", "other"] as const;
  const numLocations = Math.floor(Math.random() * 3) + 1; // 1 to 3 locations
  const locations = Array.from({ length: numLocations }, generateDummyLocation);
  
  return {
    title: `Dummy Post ${Math.floor(Math.random() * 1000)}`,
    content: `This is a dummy post content. ${Math.random().toString(36).substring(7)}`,
    type: types[Math.floor(Math.random() * types.length)],
    locations,
    author: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

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

    console.log('Generated dummy posts:');
    console.log(JSON.stringify(dummyPosts, null, 2));

    try {
      const result = await postsCollection.insertMany(dummyPosts);
      console.log(`${result.insertedCount} dummy posts inserted successfully`);
    } catch (insertError) {
      console.error('Error inserting documents:');
      if (insertError instanceof z.ZodError) {
        console.error('Zod validation error:', JSON.stringify(insertError.errors, null, 2));
      } else if (insertError instanceof MongoError) {
        console.error('MongoDB error:', insertError.message);
        if (insertError.code === 121) {  // Document validation error
          console.error('Document validation failed. Error details:');
          console.error(JSON.stringify(insertError, null, 2));
        }
      } else {
        console.error('Unknown error:', insertError);
      }
    }
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
generateDummyData(5);

export { generateDummyData };