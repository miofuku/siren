import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import PostList from '../PostList';

jest.mock('axios');

describe('PostList Component', () => {
  const mockPosts = [
    { _id: '1', title: 'Test Post 1', content: 'This is test post 1', type: 'alert' },
    { _id: '2', title: 'Test Post 2', content: 'This is test post 2', type: 'info' },
  ];

  beforeEach(() => {
    axios.get.mockReset();
  });

  test('renders posts when API call succeeds', async () => {
    axios.get.mockResolvedValue({ data: mockPosts });

    render(
      <Router>
        <PostList />
      </Router>
    );

    expect(screen.getByText('Latest Posts')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
      expect(screen.getByText('Type: alert')).toBeInTheDocument();
      expect(screen.getByText('Type: info')).toBeInTheDocument();
    });
  });

  test('renders loading state initially', () => {
    axios.get.mockResolvedValue(new Promise(() => {})); // Never resolves

    render(
      <Router>
        <PostList />
      </Router>
    );

    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error fetching posts'));

    render(
      <Router>
        <PostList />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Error fetching posts. Please try again later.')).toBeInTheDocument();
    });
  });
});