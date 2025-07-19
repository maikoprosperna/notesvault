/* eslint-disable */
import { render, screen } from '@testing-library/react';
import BetaBadge from '../BetaBadge';
import React from 'react';

describe('BetaBadge', () => {
  it('renders the BETA badge with correct class', () => {
    render(<BetaBadge />);
    const badge = screen.getByText('BETA');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('beta-badge');
  });
});
