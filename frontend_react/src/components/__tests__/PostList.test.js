import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import PostList from '../PostList';

jest.mock('axios');

describe('PostList Component', () => {
  test('renders posts when API call succeeds', async () => {
    const mockPosts = [
      { id: 1, title: 'Test Post 1', content: 'This is test post 1' },
      { id: 2, title: 'Test Post 2', content: 'This is test post 2' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockPosts });

    render(<PostList />);

    expect(screen.getByText('Recent Posts')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });

  test('renders error message when API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error fetching posts'));

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching posts')).toBeInTheDocument();
    });
  });
});
