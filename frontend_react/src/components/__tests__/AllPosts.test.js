import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import AllPosts from '../AllPosts';

describe('AllPosts component', () => {
  const mockPosts = [
    { id: '1', title: 'Test Post 1', content: 'This is test content 1', type: 'alert', locations: [{ lat: 40.7128, lng: -74.0060 }] },
    { id: '2', title: 'Test Post 2', content: 'This is test content 2', type: 'info', locations: [{ lat: 34.0522, lng: -118.2437 }] },
  ];

  test('renders all posts', async () => {
    axios.get.mockResolvedValue({ data: mockPosts });

    await act(async () => {
      render(
        <Router>
          <AllPosts />
        </Router>
      );
    });

    expect(screen.getByText('All Posts')).toBeInTheDocument();

    await waitFor(() => {
      mockPosts.forEach(post => {
        expect(screen.getByText(post.title)).toBeInTheDocument();
        expect(screen.getByText(post.content)).toBeInTheDocument();
        expect(screen.getByText(`Type: ${post.type}`)).toBeInTheDocument();
      });
    });
  });

  // ... other tests ...
});