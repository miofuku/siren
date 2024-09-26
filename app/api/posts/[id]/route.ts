import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await connectToDatabase()
  const collection = db.collection('posts')
  const post = await collection.findOne({ _id: new ObjectId(params.id) })
  
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  
  return NextResponse.json(post)
}