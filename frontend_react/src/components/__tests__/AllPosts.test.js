import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AllPosts from '../AllPosts';

jest.mock('axios');

describe('AllPosts Component', () => {
  test('renders all posts when API call succeeds', async () => {
    const mockPosts = [
      { id: 1, title: 'All Posts Test 1', content: 'This is all posts test 1' },
      { id: 2, title: 'All Posts Test 2', content: 'This is all posts test 2' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockPosts });

    render(<AllPosts />);

    expect(screen.getByText('All Posts')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('All Posts Test 1')).toBeInTheDocument();
      expect(screen.getByText('All Posts Test 2')).toBeInTheDocument();
    });
  });

  test('renders error message when API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error fetching all posts'));

    render(<AllPosts />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching all posts:')).toBeInTheDocument();
    });
  });
});