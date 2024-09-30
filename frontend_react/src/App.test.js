import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

test('renders Recent Posts heading', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const headingElement = screen.getByText(/Recent Posts/i);
  expect(headingElement).toBeInTheDocument();
});