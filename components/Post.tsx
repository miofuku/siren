'use client';

import React from 'react';
import Link from 'next/link';

interface PostProps {
  id: string;
  title: string;
  content: string;
  type: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  author: string;
  createdAt: Date;
}

const Post: React.FC<PostProps> = ({ id, title, content, type, location, author, createdAt }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">
        <Link href={`/posts/${id}`}>
          {title}
        </Link>
      </h2>
      <p className="text-gray-600 mb-2">{content.substring(0, 150)}...</p>
      <div className="text-sm text-gray-500">
        <span className="mr-2">Type: {type}</span>
        <span className="mr-2">Location: {location.coordinates.join(', ')}</span>
        <span className="mr-2">By: {author}</span>
        <span>Posted on: {new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default Post;