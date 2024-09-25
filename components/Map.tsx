'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.7749, // San Francisco latitude
  lng: -122.4194 // San Francisco longitude
};

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
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {posts.map((post) => (
        <Marker
          key={post.id}
          position={{
            lat: post.location.coordinates[1],
            lng: post.location.coordinates[0]
          }}
          title={post.title}
        />
      ))}
    </GoogleMap>
  ) : <></>
};

export default React.memo(MapComponent);