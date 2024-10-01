import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
                 <a href="/" className="flex items-center py-4 px-2">
                   <span className="font-semibold text-gray-500 text-lg">Your App Name</span>
                 </a>
               </div>
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