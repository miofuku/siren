import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id || id === 'undefined') {
        console.error('Invalid post ID:', id);
        setError('Invalid post ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/api/posts/${id}/`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error.response?.data?.detail || 'Error fetching post. Please try again later.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const renderLocations = () => {
    if (!post.locations) return null;

    let locationsArray = post.locations;
    if (!Array.isArray(locationsArray)) {
      // If it's not an array, try to parse it as JSON
      try {
        locationsArray = JSON.parse(post.locations);
      } catch (e) {
        console.error('Failed to parse locations:', e);
        return <p>Error displaying locations</p>;
      }
    }

    if (!Array.isArray(locationsArray)) {
      // If it's still not an array, it might be a single location object
      locationsArray = [locationsArray];
    }

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Locations:</h3>
        {locationsArray.map((location, index) => (
          <div key={index} className="mb-2">
            <p className="font-medium">{location.name}</p>
            {location.coordinates && (
              <p className="text-sm text-gray-600">
                Coordinates: {location.coordinates[0]}, {location.coordinates[1]}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="text-center text-2xl mt-8">Loading...</div>;
  if (error) {
    return (
      <div className="text-red-500 text-center text-2xl mt-8">
        {error}
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go back to posts
          </button>
        </div>
      </div>
    );
  }
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
            {post.type}
          </span>
          <span className="text-sm text-gray-600">
            Posted on {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        </div>
        {renderLocations()}
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span>Author: {post.author}</span>
        </div>
      </div>
      <div className="bg-gray-50 px-8 py-4">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ← Back to Posts
        </Link>
      </div>
    </div>
  );
}

export default PostDetail;