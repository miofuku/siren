import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'

export async function GET() {
  const db = await connectToDatabase()
  const collection = db.collection('posts')
  const posts = await collection.find({}).toArray()
  return NextResponse.json(posts)
}