import dotenv from 'dotenv';
import { MongoClient, Db, ObjectId, MongoError } from 'mongodb';

dotenv.config();

interface Location {
  type: "Point";
  coordinates: [number, number];
  placeName: string;
}

interface Resource {
  title: string;
  url: string;
}

interface Post {
  title: string;
  content: string;
  type: "missing_person" | "hazard_warning" | "crime_warning" | "other";
  locations: Location[];
  author: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  resources: Resource[];
  missingPersonDetails?: {
    name: string;
    age: number;
    lastSeen: string;
  };
  hazardDetails?: {
    hazardType: string;
    severity: 'low' | 'medium' | 'high';
  };
  crimeDetails?: {
    crimeType: string;
    suspectDescription?: string;
  };
}

const cities: { name: string; coordinates: [number, number] }[] = [
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522] },
  { name: "Chicago", coordinates: [-87.6298, 41.8781] },
  { name: "Houston", coordinates: [-95.3698, 29.7604] },
  { name: "Phoenix", coordinates: [-112.0740, 33.4484] },
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

const generateDummyResource = (): Resource => {
  const resources = [
    { title: "Local Police Department", url: "https://www.police.gov" },
    { title: "Missing Persons Database", url: "https://www.missingpersons.gov" },
    { title: "Weather Service", url: "https://www.weather.gov" },
    { title: "Emergency Services", url: "https://www.emergency.gov" },
    { title: "Crime Stoppers", url: "https://www.crimestoppers.org" }
  ];
  return resources[Math.floor(Math.random() * resources.length)];
};

const generateDummyPost = (): Post => {
  const types = ["missing_person", "hazard_warning", "crime_warning", "other"] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const numLocations = Math.floor(Math.random() * 3) + 1; // 1 to 3 locations
  const locations = Array.from({ length: numLocations }, generateDummyLocation);
  const numResources = Math.floor(Math.random() * 3) + 1; // 1 to 3 resources
  const resources = Array.from({ length: numResources }, generateDummyResource);
  
  const basePost: Post = {
    title: `Dummy ${type.replace('_', ' ')} Post ${Math.floor(Math.random() * 1000)}`,
    content: `This is a dummy ${type.replace('_', ' ')} post content. ${Math.random().toString(36).substring(7)}`,
    type,
    locations,
    author: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    resources
  };

  switch (type) {
    case 'missing_person':
      basePost.missingPersonDetails = {
        name: `John Doe ${Math.floor(Math.random() * 100)}`,
        age: Math.floor(Math.random() * 80) + 1,
        lastSeen: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
      };
      break;
    case 'hazard_warning':
      basePost.hazardDetails = {
        hazardType: ['Flood', 'Fire', 'Earthquake', 'Hurricane', 'Tornado'][Math.floor(Math.random() * 5)],
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
      };
      break;
    case 'crime_warning':
      basePost.crimeDetails = {
        crimeType: ['Theft', 'Assault', 'Burglary', 'Vandalism'][Math.floor(Math.random() * 4)],
        suspectDescription: Math.random() > 0.5 ? `Suspect is approximately ${Math.floor(Math.random() * 40) + 20} years old, ${Math.floor(Math.random() * 50) + 150}cm tall` : undefined
      };
      break;
  }

  return basePost;
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
    } catch (error) {
      if (error instanceof MongoError) {
        console.error('MongoDB Error inserting documents:', error.message);
        if (error.code === 121) {  // Document validation error
          console.error('Document validation failed. Error details:');
          const bulkWriteError = error as any;  // Type assertion
          if (bulkWriteError.writeErrors) {
            bulkWriteError.writeErrors.forEach((writeError: any, index: number) => {
              console.error(`Error in document ${index}:`, writeError.errmsg);
            });
          }
        }
      } else {
        console.error('Unknown error inserting documents:', error);
      }
    }
  } catch (error) {
    console.error('Error generating dummy data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Usage: Call this function with the number of dummy posts you want to generate
generateDummyData(10);

export { generateDummyData };