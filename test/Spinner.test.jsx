/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import Spinner from '../Spinner';

describe('Spinner', () => {
  it('renders without crashing', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<Spinner size="sm" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('avatar-sm');
  });

  it('renders with custom color', () => {
    render(<Spinner color="success" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-success');
  });

  it('renders with custom className', () => {
    render(<Spinner className="custom-spinner" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-spinner');
  });
}); 