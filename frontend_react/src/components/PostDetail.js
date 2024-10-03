import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const API_URL = process.env.REACT_APP_API_URL;

function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const mapTilerKey = process.env.REACT_APP_MAPTILER_KEY;

  const fetchPost = useCallback(async () => {
    if (!id || id === 'undefined') {
      console.error('Invalid post ID:', id);
      setError('Invalid post ID');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/posts/${id}/`);
      setPost(response.data);
      setEditedPost(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(error.response?.data?.detail || 'Error fetching post. Please try again later.');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (post && post.locations && post.locations.length > 0 && mapTilerKey && !map.current && mapContainer.current) {
      const firstValidLocation = post.locations.find(loc =>
        loc.coordinates &&
        Array.isArray(loc.coordinates) &&
        loc.coordinates.length === 2 &&
        loc.coordinates.every(coord => typeof coord === 'number')
      );

      if (!firstValidLocation) {
        console.error('No valid location coordinates found');
        return;
      }

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/bright-v2/style.json?key=${mapTilerKey}`,
        center: firstValidLocation.coordinates,
        zoom: 12
      });

      const bounds = new maplibregl.LngLatBounds();

      post.locations.forEach((location, index) => {
        if (location.coordinates &&
            Array.isArray(location.coordinates) &&
            location.coordinates.length === 2 &&
            location.coordinates.every(coord => typeof coord === 'number')) {
          const [lng, lat] = location.coordinates;

          new maplibregl.Marker({ color: `hsl(${index * 137.5 % 360}, 70%, 50%)` })
            .setLngLat([lng, lat])
            .setPopup(new maplibregl.Popup().setHTML(`<h3>${location.name || 'Unnamed Location'}</h3><p>${location.address || 'No address provided'}</p>`))
            .addTo(map.current);

          bounds.extend([lng, lat]);
        }
      });

      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [post, mapTilerKey]);

  const renderLocations = () => {
    if (!post?.locations || post.locations.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Locations:</h3>
        {post.locations.map((location, index) => (
          <div key={index} className="mb-2 p-4 bg-gray-100 rounded-lg">
            <p className="font-medium text-lg">{location.name || 'Unnamed Location'}</p>
            <p className="text-sm text-gray-600">{location.address || 'No address provided'}</p>
            {location.coordinates && Array.isArray(location.coordinates) && location.coordinates.length === 2 && (
              <p className="text-xs text-gray-500">
                Coordinates: {location.coordinates[1]}, {location.coordinates[0]}
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

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_URL}/posts/${id}/`, editedPost);
      setPost(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Error updating post. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${API_URL}/posts/${id}/`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Error deleting post. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost(prev => ({ ...prev, [name]: value }));
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
        {editing ? (
          <input
            type="text"
            name="title"
            value={editedPost.title}
            onChange={handleInputChange}
            className="text-3xl font-bold mb-4 w-full"
          />
        ) : (
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>
        )}
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
            {post.type}
          </span>
          <span className="text-sm text-gray-600">
            Posted on {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="prose max-w-none mb-2">
          {editing ? (
            <textarea
              name="content"
              value={editedPost.content}
              onChange={handleInputChange}
              className="w-full h-40"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
          )}
        </div>
        {editing ? (
          <input
            type="text"
            name="resource_link"
            value={editedPost.resource_link}
            onChange={handleInputChange}
            className="text-sm text-blue-600 w-full mb-6"
          />
        ) : (
          <div className="text-sm text-blue-600 hover:text-blue-800 mb-6">
            <a href={post.resource_link} target="_blank" rel="noopener noreferrer">
              Original Source
            </a>
          </div>
        )}
        {/* ... (keep the existing location rendering and map) */}
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span>Author: {post.author}</span>
        </div>
      </div>
      <div className="bg-gray-50 px-8 py-4 flex justify-between">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ← Back to Posts
        </Link>
        <div>
          {editing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded mr-2"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;