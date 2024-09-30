import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import PostList from '../PostList';

describe('PostList Component', () => {
  const mockPosts = [
    { id: '1', title: 'Test Post 1', content: 'This is test post 1', type: 'alert', locations: [{ lat: 40.7128, lng: -74.0060 }] },
    { id: '2', title: 'Test Post 2', content: 'This is test post 2', type: 'info', locations: [{ lat: 34.0522, lng: -118.2437 }] },
  ];

  test('renders posts when API call succeeds', async () => {
    axios.get.mockResolvedValue({ data: mockPosts });

    await act(async () => {
      render(
        <Router>
          <PostList />
        </Router>
      );
    });

    expect(screen.getByText('Recent Posts')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });

  test('renders error message when API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error fetching posts'));

    await act(async () => {
      render(
        <Router>
          <PostList />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Error fetching posts/i)).toBeInTheDocument();
    });
  });

  // ... other tests ...
});