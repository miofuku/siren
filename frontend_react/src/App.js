import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import AllPosts from './components/AllPosts';

function App() {
 return (
   <Router>
     <div className="min-h-screen bg-gray-100">
       <nav className="bg-white shadow-lg">
         <div className="max-w-6xl mx-auto px-4">
           <div className="flex justify-between">
             <div className="flex space-x-7">
               <div>
                 <Link to="/" className="flex items-center py-4 px-2">
                   <span className="font-semibold text-gray-500 text-lg">Your App Name</span>
                 </Link>
               </div>
             </div>
             <div className="flex items-center space-x-3">
               <Link
                 to="/all-posts"
                 className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300"
               >
                 All Posts
               </Link>
             </div>
           </div>
         </div>
       </nav>
       <div className="max-w-6xl mx-auto mt-8 px-4">
         <Routes>
           <Route path="/" element={<PostList />} />
           <Route path="/post/:id" element={<PostDetail />} />
           <Route path="/all-posts" element={<AllPosts />} />
         </Routes>
       </div>
     </div>
   </Router>
 );
}

export default App;