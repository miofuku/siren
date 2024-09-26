import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('posts');
    
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let posts;
    if (limit) {
      posts = await collection.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } else {
      posts = await collection.find({}).toArray();
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
