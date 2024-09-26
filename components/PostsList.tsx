'use client';

import { useEffect, useState } from 'react';
import Post from './Post';

interface PostsListProps {
  limit?: number;
}

const PostsList: React.FC<PostsListProps> = ({ limit }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const url = limit ? `/api/posts?limit=${limit}` : '/api/posts';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // You might want to set an error state here and display it to the user
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