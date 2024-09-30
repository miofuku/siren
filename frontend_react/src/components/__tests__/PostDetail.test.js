import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PostDetail from '../PostDetail';

jest.mock('axios');

describe('PostDetail Component', () => {
  test('renders post details when API call succeeds', async () => {
    const mockPost = {
      id: 1,
      title: 'Test Post',
      content: 'This is a test post',
      author: 'Test Author',
      created_at: '2023-05-01T12:00:00Z',
    };

    axios.get.mockResolvedValueOnce({ data: mockPost });

    render(
      <MemoryRouter initialEntries={['/post/1']}>
        <Routes>
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
      expect(screen.getByText('This is a test post')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/post/1']}>
        <Routes>
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
