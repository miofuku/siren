import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const mapTilerKey = process.env.REACT_APP_MAPTILER_KEY;

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

  useEffect(() => {
    if (post && post.locations && post.locations.length > 0 && mapTilerKey) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/bright-v2/style.json?key=${mapTilerKey}`,
        center: post.locations[0].coordinates, // Initially center on the first location
        zoom: 12
      });

      const bounds = new maplibregl.LngLatBounds();

      post.locations.forEach((location, index) => {
        if (location.coordinates && location.coordinates.length === 2) {
          const [lng, lat] = location.coordinates;

          // Add marker for each location
          new maplibregl.Marker({ color: `hsl(${index * 137.5 % 360}, 70%, 50%)` })
            .setLngLat([lng, lat])
            .setPopup(new maplibregl.Popup().setHTML(`<h3>${location.name}</h3><p>${location.address}</p>`))
            .addTo(map.current);

          // Extend bounds to include this location
          bounds.extend([lng, lat]);
        }
      });

      // Fit the map to the bounds of all markers
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [post, mapTilerKey]);

  const renderLocations = () => {
    if (!post.locations || post.locations.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Locations:</h3>
        {post.locations.map((location, index) => (
          <div key={index} className="mb-2 p-4 bg-gray-100 rounded-lg">
            <p className="font-medium text-lg">{location.name}</p>
            <p className="text-sm text-gray-600">{location.address}</p>
            {location.coordinates && (
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
        <div ref={mapContainer} className="map-container" style={{height: "400px", marginBottom: "20px"}} />
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