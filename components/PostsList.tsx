'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Post from './Post';
import Link from 'next/link';

interface SerializedPost {
  _id: string;
  title: string;
  content: string;
  type: string;
  locations: Array<{
    type: string;
    coordinates: [number, number];
  }>;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface PostsListProps {
  limit?: number;
}

const PostsList: React.FC<PostsListProps> = ({ limit }) => {
  const [posts, setPosts] = useState<SerializedPost[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchPosts() {
      const url = limit ? `/api/posts?limit=${limit}` : '/api/posts';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: SerializedPost[] = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    fetchPosts();
  }, [limit]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
        if (response.ok) {
          setPosts(posts.filter(post => post._id !== id));
        } else {
          throw new Error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div>
      {session && ['admin', 'moderator'].includes(session.user.role) && (
        <Link href="/posts/new" className="btn btn-primary mb-4">
          Create New Post
        </Link>
      )}
      {posts.map((post) => (
        <div key={post._id} className="mb-4">
          <Post {...post} />
          {session && ['admin', 'moderator'].includes(session.user.role) && (
            <div className="mt-2">
              <Link href={`/posts/edit/${post._id}`} className="btn btn-secondary mr-2">
                Edit
              </Link>
              <button onClick={() => handleDelete(post._id)} className="btn btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostsList;