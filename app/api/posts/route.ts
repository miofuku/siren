import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { z } from 'zod';

// Define the schema for post creation
const PostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  content: z.string().min(1, "Content is required").max(1000, "Content must be 1000 characters or less"),
  type: z.enum(["alert", "missing_person", "event", "other"]),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([
      z.number().min(-180).max(180), // longitude
      z.number().min(-90).max(90)    // latitude
    ])
  })
});

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const posts = await db.collection('posts').find({}).toArray();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const data = await request.json();

    // Validate the input data
    const validationResult = PostSchema.safeParse(data);

    if (!validationResult.success) {
      // If validation fails, return the error messages
      return NextResponse.json({ error: validationResult.error.issues }, { status: 400 });
    }

    // If validation succeeds, insert the post
    const validatedData = validationResult.data;
    const result = await db.collection('posts').insertOne({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}