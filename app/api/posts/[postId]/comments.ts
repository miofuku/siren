import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { postId },
    method,
  } = req;

  const session = await getSession({ req });

  const db = await connectToDatabase();
  const commentsCollection = db.collection('comments');

  switch (method) {
    case 'GET':
      try {
        const comments = await commentsCollection
          .find({ postId: new ObjectId(postId as string) })
          .sort({ createdAt: -1 })
          .toArray();
        res.status(200).json(comments);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
      }
      break;

    case 'POST':
      if (!session) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      try {
        const { content } = req.body;
        const newComment = {
          postId: new ObjectId(postId as string),
          content,
          author: {
            _id: new ObjectId(session.user.id),
            name: session.user.name,
          },
          createdAt: new Date(),
        };
        await commentsCollection.insertOne(newComment);
        res.status(201).json(newComment);
      } catch (error) {
        res.status(500).json({ message: 'Error creating comment' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}