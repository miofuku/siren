import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import AllPosts from '../AllPosts';

jest.mock('axios');

describe('AllPosts component', () => {
  const mockPosts = [
    { id: '1', title: 'Test Post 1', content: 'This is test content 1', type: 'alert', locations: [{ lat: 40.7128, lng: -74.0060 }] },
    { id: '2', title: 'Test Post 2', content: 'This is test content 2', type: 'info', locations: [{ lat: 34.0522, lng: -118.2437 }] },
  ];

  test('renders all posts', async () => {
    axios.get.mockResolvedValue({ data: mockPosts });

    render(
      <Router>
        <AllPosts />
      </Router>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      mockPosts.forEach(post => {
        expect(screen.getByText(post.title)).toBeInTheDocument();
        expect(screen.getByText(post.content)).toBeInTheDocument();
        expect(screen.getByText(`Type: ${post.type}`)).toBeInTheDocument();
      });
    });
  });

  test('displays loading state', async () => {
    axios.get.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ data: mockPosts }), 100)));

    render(
      <Router>
        <AllPosts />
      </Router>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <Router>
        <AllPosts />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Error fetching posts. Please try again later.')).toBeInTheDocument();
    });
  });

  test('renders "Read More" links', async () => {
    axios.get.mockResolvedValue({ data: mockPosts });

    render(
      <Router>
        <AllPosts />
      </Router>
    );

    await waitFor(() => {
      const readMoreLinks = screen.getAllByText('Read More');
      expect(readMoreLinks).toHaveLength(mockPosts.length);
      readMoreLinks.forEach((link, index) => {
        expect(link).toHaveAttribute('href', `/post/${mockPosts[index].id}`);
      });
    });
  });
});