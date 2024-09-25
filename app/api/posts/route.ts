import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const posts = await db.collection('posts').find({}).toArray();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const data = await request.json();
    const result = await db.collection('posts').insertOne(data);
    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}