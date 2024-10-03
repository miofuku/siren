import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const API_URL = process.env.REACT_APP_API_URL;

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const fetchPosts = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/posts/?${params.toString()}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Error fetching posts. Please try again later.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onSubmit = (data) => {
    fetchPosts(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${API_URL}/posts/${id}/`);
        fetchPosts(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Error deleting post. Please try again.');
      }
    }
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">All Posts</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        {/* ... (keep existing form fields) */}
      </form>

      {posts.length === 0 ? (
        <p className="text-center">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-2">{post.content?.substring(0, 100)}...</p>
              <div className="text-sm text-blue-600 hover:text-blue-800 mb-4">
                <a href={post.resource_link} target="_blank" rel="noopener noreferrer">
                  Original Source
                </a>
              </div>
              <p className="text-sm text-gray-500 mb-2">Type: {post.type}</p>
              <p className="text-sm text-gray-500 mb-4">
                Locations: {post.locations?.map(loc => loc.name || 'Unnamed Location').join(', ')}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/post/${post._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Read More
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/create-post"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 text-lg font-semibold"
        >
          Create New Post
        </Link>
      </div>
    </div>
  );
}

export default AllPosts;