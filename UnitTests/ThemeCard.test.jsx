/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ThemeCard from '../components/ThemeCard';

describe('ThemeCard', () => {
  const baseTheme = {
    key: 'modern',
    name: 'Modern Theme',
    preview_image_sm: 'modern-theme.jpg',
  };
  const blankTheme = {
    key: 'blank',
    name: 'Blank Theme',
    preview_image_sm: '',
  };

  it('renders the theme card with non-blank theme', () => {
    render(<ThemeCard selectedTheme="modern" data={baseTheme} />);
    expect(screen.getByText('Modern Theme')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeChecked();
    expect(screen.getByAltText('Modern Theme')).toHaveAttribute('src', 'modern-theme.jpg');
  });

  it('renders the theme card with blank theme', () => {
    render(<ThemeCard selectedTheme="blank" data={blankTheme} />);
    expect(screen.getByText('Blank Theme')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeChecked();
    // Should render the blank image
    expect(screen.getByAltText('Blank Theme')).toHaveAttribute('src', expect.stringContaining('blank'));
  });

  it('renders the theme card as unchecked if not selected', () => {
    render(<ThemeCard selectedTheme="other" data={baseTheme} />);
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('applies border-primary class when selected', () => {
    const { container } = render(<ThemeCard selectedTheme="modern" data={baseTheme} />);
    expect(container.querySelector('.border-primary')).toBeInTheDocument();
  });

  it('does not apply border-primary class when not selected', () => {
    const { container } = render(<ThemeCard selectedTheme="other" data={baseTheme} />);
    expect(container.querySelector('.border-primary')).not.toBeInTheDocument();
  });

  it('renders the label with correct theme name', () => {
    render(<ThemeCard selectedTheme="modern" data={baseTheme} />);
    expect(screen.getByText('Modern Theme')).toBeInTheDocument();
  });

  it('renders preview image if data.key is undefined', () => {
    const noKeyTheme = { name: 'No Key Theme', preview_image_sm: 'no-key.jpg' };
    render(<ThemeCard selectedTheme="any" data={noKeyTheme} />);
    expect(screen.getByAltText('No Key Theme')).toHaveAttribute('src', 'no-key.jpg');
  });
});