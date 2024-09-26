import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Comment {
    _id: string;
    content: string;
    author: {
      _id: string;
      name: string;
    };
    createdAt: string;
  }
  
  interface CommentSectionProps {
    postId: string;
  }
  
  const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const { data: session } = useSession();
  
    useEffect(() => {
      fetchComments();
    }, [postId]);
  
    const fetchComments = async () => {
      const response = await fetch(`/api/posts/${postId}/comments`);
      const data = await response.json();
      setComments(data);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!session) {
        alert('You must be logged in to comment.');
        return;
      }
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    };
  
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        {comments.map((comment) => (
          <div key={comment._id} className="mb-4 p-4 bg-gray-100 rounded">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-600 mt-2">
              By {comment.author.name} on {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            className="w-full p-2 border rounded"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!session}
          >
            Post Comment
          </button>
        </form>
      </div>
    );
  };
  
  export default CommentSection;