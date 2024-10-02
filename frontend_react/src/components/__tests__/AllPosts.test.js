import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import AllPosts from '../AllPosts';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe('AllPosts component', () => {
  const mockPosts = [
    { _id: '1', title: 'Test Post 1', content: 'This is test content 1', type: 'alert' },
    { _id: '2', title: 'Test Post 2', content: 'This is test content 2', type: 'info' },
  ];

  beforeEach(() => {
    axios.get.mockReset();
  });

  test('renders all posts', async () => {
    axios.get.mockResolvedValue({ data: mockPosts });

    await act(async () => {
      render(<AllPosts />);
    });

    // Wait for the loading state to change
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('All Posts')).toBeInTheDocument();

    mockPosts.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(`${post.content.substring(0, 100)}...`)).toBeInTheDocument();
      expect(screen.getByText(`Type: ${post.type}`)).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    const errorMessage = 'Error fetching posts. Please try again later.';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await act(async () => {
      render(<AllPosts />);
    });

    // Wait for the loading state to change
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });
});