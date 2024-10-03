import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function CreatePost() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    type: 'community_event',
    resource_link: '',
    locations: []
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/posts/`, post);
      navigate(`/post/${response.data._id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error creating post. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title:</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Content:</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded h-40"
          />
        </div>
        <div>
          <label className="block mb-1">Type:</label>
          <select
            name="type"
            value={post.type}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="community_event">Community Event</option>
            <option value="public_service">Public Service</option>
            <option value="crime_warning">Crime Warning</option>
            <option value="traffic_update">Traffic Update</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Resource Link:</label>
          <input
            type="url"
            name="resource_link"
            value={post.resource_link}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;