'use client'

import { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '100%'
}

interface Location {
  type: string
  coordinates: [number, number]
}

interface Post {
  _id: string
  title: string
  locations: Location[]
}

interface MapProps {
  posts: Post[]
}

export default function Map({ posts }: MapProps) {
  const [map, setMap] = useState(null)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  })

  const center = posts.length > 0 && posts[0].locations.length > 0
    ? { lat: posts[0].locations[0].coordinates[1], lng: posts[0].locations[0].coordinates[0] }
    : { lat: 0, lng: 0 }

  useEffect(() => {
    if (isLoaded && map) {
      // You can perform any map-related operations here
    }
  }, [isLoaded, map, posts])

  const onLoad = (map: any) => {
    setMap(map)
  }

  const onUnmount = () => {
    setMap(null)
  }

  if (!isLoaded) return <div>Loading map...</div>

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {posts.flatMap((post) =>
        post.locations.map((location, index) => (
          <Marker
            key={`${post._id}-${index}`}
            position={{
              lat: location.coordinates[1],
              lng: location.coordinates[0]
            }}
            title={post.title}
          />
        ))
      )}
    </GoogleMap>
  )
}