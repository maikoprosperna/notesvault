/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// Import the component
import { EmptyCart } from '../EmptyCart';

describe('EmptyCart', () => {
  it('renders without crashing', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EmptyCart />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByRole('link', { name: /start shopping/i })).toBeInTheDocument();
  });

  it('renders with correct content', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EmptyCart />
        </MemoryRouter>
      </QueryClientProvider>
    );
    
    // Check for the main content
    expect(screen.getByText('Your cart is empty!')).toBeInTheDocument();
    expect(screen.getByText("Looks like you haven't added anything to your cart yet.")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start shopping/i })).toBeInTheDocument();
  });
});
