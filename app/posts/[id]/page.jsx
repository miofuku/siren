import { notFound } from 'next/navigation'
import { connectToDatabase } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import ClientPostPage from './ClientPostPage'

async function getPost(id) {
  const db = await connectToDatabase()
  const collection = db.collection('posts')
  return await collection.findOne({ _id: new ObjectId(id) })
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.id)
  return { title: post?.title || 'Post Not Found' }
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return <ClientPostPage post={post} />
}