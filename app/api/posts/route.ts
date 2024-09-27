import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

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

function serializeDocument(doc: any) {
  return Object.entries(doc).reduce((acc: any, [key, value]) => {
    if (value instanceof ObjectId) {
      acc[key] = value.toHexString()
    } else if (value instanceof Date) {
      acc[key] = value.toISOString()
    } else if (Array.isArray(value)) {
      acc[key] = value.map(item => 
        typeof item === 'object' ? serializeDocument(item) : item
      )
    } else if (typeof value === 'object' && value !== null) {
      acc[key] = serializeDocument(value)
    } else {
      acc[key] = value
    }
    return acc
  }, {})
}

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('posts')
    
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)
    
    const posts = await collection.find({}).limit(limit).toArray()
    
    const serializedPosts = posts.map(serializeDocument)
    
    return NextResponse.json(serializedPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('posts')
    
    const body = await request.json()
    const validatedData = PostSchema.parse(body)
    
    // Convert author string to ObjectId
    const postToInsert = {
      ...validatedData,
      author: new ObjectId(validatedData.author)
    }
    
    const result = await collection.insertOne(postToInsert)
    
    // Serialize the inserted document for the response
    const insertedDoc = await collection.findOne({ _id: result.insertedId })
    const serializedDoc = serializeDocument(insertedDoc)
    
    return NextResponse.json(serializedDoc, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}