import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts/');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts. Please try again later.');
      }
    };
    fetchPosts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Recent Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Type: {post.type}</p>
            <Link to={`/post/${post.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Read More
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/all-posts" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 text-lg font-semibold">
          View All Posts
        </Link>
      </div>
    </div>
  );
}

export default PostList;