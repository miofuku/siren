'use client';

import React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  posts: Array<{
    id: string;
    title: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  }>;
}

const MapComponent: React.FC<MapProps> = ({ posts }) => {
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{width: '100%', height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    >
      {posts.map((post) => (
        <Marker
          key={post.id}
          longitude={post.location.coordinates[0]}
          latitude={post.location.coordinates[1]}
        >
          <div className="marker">{post.title}</div>
        </Marker>
      ))}
    </Map>
  );
};

export default MapComponent;