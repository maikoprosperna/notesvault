/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import Loader from '../Loader';

describe('Loader', () => {
  it('renders without crashing', () => {
    render(<Loader />);
    expect(document.querySelector('.preloader')).toBeInTheDocument();
  });

  it('renders with bouncing loader', () => {
    render(<Loader />);
    expect(document.querySelector('.bouncing-loader')).toBeInTheDocument();
  });

  it('renders with status div', () => {
    render(<Loader />);
    expect(document.querySelector('#status')).toBeInTheDocument();
  });

  it('renders with preloader id', () => {
    render(<Loader />);
    expect(document.querySelector('#preloader')).toBeInTheDocument();
  });
}); 