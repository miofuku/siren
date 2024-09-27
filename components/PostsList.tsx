'use client';

import { useEffect, useState } from 'react';
import Post from './Post';

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

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} {...post} />
      ))}
    </div>
  );
};

export default PostsList;