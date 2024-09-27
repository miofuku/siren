import dotenv from 'dotenv';
import { MongoClient, Db, ObjectId } from 'mongodb';
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

const ResourceSchema = z.object({
  title: z.string(),
  url: z.string().url()
});

const MissingPersonDetailsSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
  lastSeen: z.string()
});

const HazardDetailsSchema = z.object({
  hazardType: z.string(),
  severity: z.enum(['low', 'medium', 'high'])
});

const CrimeDetailsSchema = z.object({
  crimeType: z.string(),
  suspectDescription: z.string().optional()
});

const PostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  type: z.enum(["missing_person", "hazard_warning", "crime_warning", "other"]),
  locations: z.array(LocationSchema).min(1).max(5),
  author: z.instanceof(ObjectId),
  createdAt: z.date(),
  updatedAt: z.date(),
  resources: z.array(ResourceSchema),
  missingPersonDetails: MissingPersonDetailsSchema.optional(),
  hazardDetails: HazardDetailsSchema.optional(),
  crimeDetails: CrimeDetailsSchema.optional()
});

type Post = z.infer<typeof PostSchema>;
type Location = z.infer<typeof LocationSchema>;

type City = {
  name: string;
  coordinates: [number, number];
};

const cities: City[] = [
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522] },
  { name: "Chicago", coordinates: [-87.6298, 41.8781] },
  { name: "Houston", coordinates: [-95.3698, 29.7604] },
  { name: "Phoenix", coordinates: [-112.0740, 33.4484] }
];

const generateDummyLocation = (): Location => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  return {
    type: "Point",
    coordinates: city.coordinates,
    placeName: city.name
  };
};

const generateDummyResource = (): z.infer<typeof ResourceSchema> => {
  return {
    title: `Resource ${Math.floor(Math.random() * 100)}`,
    url: `https://example.com/resource${Math.floor(Math.random() * 100)}`
  };
};

const generateDummyPost = (): Post => {
  const types = ["missing_person", "hazard_warning", "crime_warning", "other"] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const numLocations = Math.floor(Math.random() * 3) + 1; // 1 to 3 locations
  const locations = Array.from({ length: numLocations }, generateDummyLocation);
  const numResources = Math.floor(Math.random() * 3); // 0 to 2 resources
  const resources = Array.from({ length: numResources }, generateDummyResource);

  const post: Post = {
    title: `Dummy ${type} Post ${Math.floor(Math.random() * 1000)}`,
    content: `This is a dummy ${type} post content. ${Math.random().toString(36).substring(7)}`,
    type,
    locations,
    author: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    resources
  };

  switch (type) {
    case "missing_person":
      post.missingPersonDetails = {
        name: `John Doe ${Math.floor(Math.random() * 100)}`,
        age: Math.floor(Math.random() * 50) + 10,
        lastSeen: new Date().toISOString()
      };
      break;
    case "hazard_warning":
      post.hazardDetails = {
        hazardType: ["Flood", "Fire", "Earthquake"][Math.floor(Math.random() * 3)],
        severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high"
      };
      break;
    case "crime_warning":
      post.crimeDetails = {
        crimeType: ["Theft", "Assault", "Vandalism"][Math.floor(Math.random() * 3)],
        suspectDescription: `Suspect is approximately ${Math.floor(Math.random() * 50) + 20} years old, ${Math.floor(Math.random() * 50) + 150}cm tall`
      };
      break;
  }

  return post;
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
    const postsCollection = db.collection('posts');

    const dummyPosts = Array.from({ length: count }, generateDummyPost);

    console.log('Generated dummy posts:');
    console.log(JSON.stringify(dummyPosts, null, 2));

    try {
      const result = await postsCollection.insertMany(dummyPosts);
      console.log(`${result.insertedCount} dummy posts inserted successfully`);
    } catch (insertError) {
      console.error('Error inserting documents:', insertError);
    }
  } catch (error) {
    console.error('Error generating dummy data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Usage: Call this function with the number of dummy posts you want to generate
generateDummyData(5);

export { generateDummyData };