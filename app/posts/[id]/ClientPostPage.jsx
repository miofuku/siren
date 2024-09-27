'use client'

import React from 'react'
import Map from '../../../components/Map'

const ClientPostPage = ({ post }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-4">{post.title}</h1>
            <p className="mb-4">{post.content}</p>
            <p className="mb-2"><span className="font-semibold">Type:</span> {post.type}</p>
            <p className="mb-4">
              <span className="font-semibold">Created at:</span> 
              {new Date(post.createdAt).toLocaleString()}
            </p>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Locations:</h2>
              <ul>
                {post.locations.map((location, index) => (
                  <li key={index}>
                    Latitude: {location.coordinates[1]}, Longitude: {location.coordinates[0]}
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-64 w-full mb-4">
              <Map posts={[post]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientPostPage