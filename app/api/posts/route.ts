import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

const LocationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90)
  ])
});

// Custom Zod schema for ObjectId
const ObjectIdSchema = z.string().refine(
  (val) => ObjectId.isValid(val),
  { message: "Invalid ObjectId" }
);

const PostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  type: z.enum(["alert", "missing_person", "event", "other"]),
  locations: z.array(LocationSchema).min(1).max(5),
  author: ObjectIdSchema,
  createdAt: z.string().transform(str => new Date(str)),
  updatedAt: z.string().transform(str => new Date(str))
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