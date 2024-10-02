import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

// Mock maplibre-gl
jest.mock('maplibre-gl', () => ({
  Map: jest.fn(),
  Marker: jest.fn(),
  Popup: jest.fn(),
  LngLatBounds: jest.fn(),
}));

test('renders Latest Posts heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Latest Posts/i);
  expect(headingElement).toBeInTheDocument();
});