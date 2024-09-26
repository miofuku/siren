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
      const response = await fetch(url);
      const data = await response.json();
      setPosts(data);
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