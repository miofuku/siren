'use client';

import { useEffect, useState } from 'react';
import Post from './Post';
import MapComponent from './Map';

const PostsList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <>
      <MapComponent posts={posts} />
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </>
  );
};

export default PostsList;