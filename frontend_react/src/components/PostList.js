import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PostList() {
 const [posts, setPosts] = useState([]);
 const [error, setError] = useState(null);

 useEffect(() => {
   const fetchPosts = async () => {
     try {
       const response = await axios.get('http://localhost:8000/api/posts/');
       setPosts(Array.isArray(response.data) ? response.data : response.data.results || []);
     } catch (error) {
       console.error('Error fetching posts:', error);
       setError('Error fetching posts. Please try again later.');
     }
   };
   fetchPosts();
 }, []);

 if (error) {
   return <div className="text-red-500 text-center p-4">{error}</div>;
 }

 return (
   <div className="container mx-auto px-4">
     <h1 className="text-3xl font-bold mb-8 text-center">Recent Posts</h1>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {posts.map(post => (
         <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
           <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
           <p className="text-gray-600 mb-4">{post.content.substring(0, 100)}...</p>
           <p className="text-sm text-gray-500 mb-4">Type: {post.type}</p>
           <Link
             to={`/post/${post.id}`}
             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
           >
             Read More
           </Link>
         </div>
       ))}
     </div>
   </div>
 );
}

export default PostList;