import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock maplibre-gl before importing PostDetail
jest.mock('maplibre-gl', () => ({
  Map: jest.fn(() => ({
    remove: jest.fn(),
    on: jest.fn(),
    fitBounds: jest.fn(),
  })),
  Marker: jest.fn().mockImplementation(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setPopup: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
  })),
  Popup: jest.fn(() => ({
    setHTML: jest.fn().mockReturnThis(),
  })),
  LngLatBounds: jest.fn(() => ({
    extend: jest.fn().mockReturnThis(),
  })),
}));

// Import PostDetail after mocking maplibre-gl
import PostDetail from '../PostDetail';

jest.mock('axios');

describe('PostDetail Component', () => {
  const mockPost = {
    _id: '1',
    title: 'Test Post',
    content: 'This is a test post',
    author: 'Test Author',
    type: 'test',
    created_at: '2023-05-01T12:00:00Z',
    locations: [
      { name: 'Location 1', address: 'Address 1', coordinates: [-73.9855, 40.7580] },
      { name: 'Location 2', address: 'Address 2', coordinates: [-74.0060, 40.7128] }
    ]
  };

  beforeEach(() => {
    axios.get.mockReset();
    jest.clearAllMocks();
  });

  test('renders post details when API call succeeds', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPost });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/post/1']}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });

    expect(screen.getByText('This is a test post')).toBeInTheDocument();
    expect(screen.getByText('Author: Test Author')).toBeInTheDocument();
    expect(screen.getByText('Type: test')).toBeInTheDocument();
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByText('Location 2')).toBeInTheDocument();

    // Check if markers were created for each location
    const { Marker } = require('maplibre-gl');
    expect(Marker).toHaveBeenCalledTimes(2);
    expect(Marker().setLngLat).toHaveBeenCalledTimes(2);
    expect(Marker().setPopup).toHaveBeenCalledTimes(2);
    expect(Marker().addTo).toHaveBeenCalledTimes(2);
  });

  test('handles error state', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch post'));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/post/1']}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error fetching post. Please try again later.')).toBeInTheDocument();
    });
  });
});