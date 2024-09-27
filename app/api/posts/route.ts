import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { getToken } from 'next-auth/jwt'
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
  locations: z.array(z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
    placeName: z.string()
  })).min(1).max(5),
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
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token || !['admin', 'moderator'].includes(token.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await connectToDatabase()
    const collection = db.collection('posts')
    
    const body = await request.json()
    const validatedData = PostSchema.parse(body)
    
    const postToInsert = {
      ...validatedData,
      author: new ObjectId(token.sub),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await collection.insertOne(postToInsert)
    
    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token || !['admin', 'moderator'].includes(token.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await connectToDatabase()
    const collection = db.collection('posts')
    
    const body = await request.json()
    const { id, ...updateData } = PostSchema.parse(body)
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Post updated successfully' })
  } catch (error) {
    console.error('Error updating post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await connectToDatabase()
    const collection = db.collection('posts')
    
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 })
    }
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}