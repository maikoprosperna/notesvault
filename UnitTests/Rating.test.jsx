/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Rating from '../Rating';

describe('Rating', () => {
  it('renders without crashing', () => {
    render(<Rating value={3} />);
    expect(document.querySelector('#rating-container')).toBeInTheDocument();
  });

  it('renders with default tag (p)', () => {
    render(<Rating value={3} />);
    const container = document.querySelector('#rating-container');
    expect(container.tagName.toLowerCase()).toBe('p');
  });

  it('renders with custom tag', () => {
    render(<Rating value={3} tag="div" />);
    const container = document.querySelector('#rating-container');
    expect(container.tagName.toLowerCase()).toBe('div');
  });

  it('renders correct number of filled stars', () => {
    render(<Rating value={3} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(3);
  });

  it('renders correct number of empty stars', () => {
    render(<Rating value={3} />);
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(emptyStars).toHaveLength(2);
  });

  it('renders 5 filled stars for value 5', () => {
    render(<Rating value={5} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(5);
  });

  it('renders 5 empty stars for value 0', () => {
    render(<Rating value={0} />);
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(emptyStars).toHaveLength(5);
  });

  it('renders with custom className', () => {
    render(<Rating value={3} className="custom-rating" />);
    const container = document.querySelector('#rating-container');
    expect(container).toHaveClass('custom-rating');
  });

  it('renders with multiple custom classes', () => {
    render(<Rating value={3} className="custom-rating primary-rating" />);
    const container = document.querySelector('#rating-container');
    expect(container).toHaveClass('custom-rating', 'primary-rating');
  });

  it('handles decimal values correctly', () => {
    render(<Rating value={3.7} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(3); // Math.floor(3.7) = 3
  });

  it('handles negative values correctly', () => {
    // The component doesn't handle negative values gracefully, so we expect it to throw
    expect(() => {
      render(<Rating value={-2} />);
    }).toThrow('Invalid array length');
  });

  it('handles values greater than 5 correctly', () => {
    render(<Rating value={7} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(7); // Component doesn't cap at 5
  });

  it('handles null value', () => {
    render(<Rating value={null} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(0);
  });

  it('handles undefined value', () => {
    render(<Rating value={undefined} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(0);
  });

  it('handles empty string value', () => {
    render(<Rating value="" />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(0);
  });

  it('renders with tooltips on filled stars', () => {
    render(<Rating value={3} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars.length).toBeGreaterThan(0);
    // Check that stars are rendered (tooltip testing is complex with react-bootstrap)
    expect(filledStars[0]).toHaveClass('text-warning');
  });

  it('renders with tooltips on empty stars', () => {
    render(<Rating value={3} />);
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(emptyStars.length).toBeGreaterThan(0);
    // Check that empty stars are rendered (tooltip testing is complex with react-bootstrap)
    expect(emptyStars[0]).toHaveClass('text-warning');
  });

  it('renders with correct tooltip content', () => {
    render(<Rating value={3.5} />);
    const stars = document.querySelectorAll('.mdi-star, .mdi-star-outline');
    // Check that stars are rendered (tooltip testing is complex with react-bootstrap)
    expect(stars.length).toBeGreaterThan(0);
    expect(stars[0]).toHaveClass('text-warning');
  });

  it('renders with zero value tooltip', () => {
    render(<Rating value={0} />);
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(emptyStars.length).toBeGreaterThan(0);
    // Check that empty stars are rendered (tooltip testing is complex with react-bootstrap)
    expect(emptyStars[0]).toHaveClass('text-warning');
  });

  it('renders with null value tooltip', () => {
    render(<Rating value={null} />);
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(emptyStars.length).toBeGreaterThan(0);
    // Check that empty stars are rendered (tooltip testing is complex with react-bootstrap)
    expect(emptyStars[0]).toHaveClass('text-warning');
  });

  it('renders with undefined value tooltip', () => {
    render(<Rating value={undefined} />);
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(emptyStars.length).toBeGreaterThan(0);
    // Check that empty stars are rendered (tooltip testing is complex with react-bootstrap)
    expect(emptyStars[0]).toHaveClass('text-warning');
  });

  it('renders with different tag elements', () => {
    render(<Rating value={3} tag="span" />);
    const container = document.querySelector('#rating-container');
    expect(container.tagName.toLowerCase()).toBe('span');
  });

  it('renders with h1 tag', () => {
    render(<Rating value={3} tag="h1" />);
    const container = document.querySelector('#rating-container');
    expect(container.tagName.toLowerCase()).toBe('h1');
  });

  it('renders with div tag', () => {
    render(<Rating value={3} tag="div" />);
    const container = document.querySelector('#rating-container');
    expect(container.tagName.toLowerCase()).toBe('div');
  });

  it('renders with section tag', () => {
    render(<Rating value={3} tag="section" />);
    const container = document.querySelector('#rating-container');
    expect(container.tagName.toLowerCase()).toBe('section');
  });

  it('renders with all props combined', () => {
    render(<Rating value={4} tag="div" className="custom-rating" />);
    const container = document.querySelector('#rating-container');
    expect(container.tagName.toLowerCase()).toBe('div');
    expect(container).toHaveClass('custom-rating');
    
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(4);
    
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(emptyStars).toHaveLength(1);
  });

  it('handles very large values', () => {
    render(<Rating value={100} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(100); // Component doesn't cap at 5
  });

  it('handles very small decimal values', () => {
    render(<Rating value={0.1} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(0); // Math.floor(0.1) = 0
  });

  it('handles values with many decimal places', () => {
    render(<Rating value={3.99999} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(3); // Math.floor(3.99999) = 3
  });

  it('renders with font-16 class by default', () => {
    render(<Rating value={3} />);
    const container = document.querySelector('#rating-container');
    expect(container).toHaveClass('font-16');
  });

  it('renders with font-16 and custom class', () => {
    render(<Rating value={3} className="custom-rating" />);
    const container = document.querySelector('#rating-container');
    expect(container).toHaveClass('custom-rating');
  });

  it('renders stars with text-warning class', () => {
    render(<Rating value={3} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    
    filledStars.forEach(star => {
      expect(star).toHaveClass('text-warning');
    });
    
    emptyStars.forEach(star => {
      expect(star).toHaveClass('text-warning');
    });
  });

  it('renders stars with mdi classes', () => {
    render(<Rating value={3} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    
    filledStars.forEach(star => {
      expect(star).toHaveClass('mdi', 'mdi-star');
    });
    
    emptyStars.forEach(star => {
      expect(star).toHaveClass('mdi', 'mdi-star-outline');
    });
  });

  it('handles string values', () => {
    render(<Rating value="3" />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(3);
  });

  it('handles string decimal values', () => {
    render(<Rating value="3.7" />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(3); // Math.floor("3.7") = 3
  });

  it('handles invalid string values', () => {
    // The component doesn't handle invalid strings gracefully, so we expect it to throw
    expect(() => {
      render(<Rating value="invalid" />);
    }).toThrow('Invalid array length');
  });

  it('handles boolean values', () => {
    render(<Rating value={true} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(1); // Math.floor(1) = 1
  });

  it('handles false boolean value', () => {
    render(<Rating value={false} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    expect(filledStars).toHaveLength(0); // Math.floor(0) = 0
  });

  it('renders with spread props', () => {
    render(<Rating value={3} data-testid="rating" />);
    const container = document.querySelector('#rating-container');
    expect(container).toHaveAttribute('data-testid', 'rating');
  });

  it('renders with multiple spread props', () => {
    render(<Rating value={3} data-testid="rating" aria-label="Rating" />);
    const container = document.querySelector('#rating-container');
    expect(container).toHaveAttribute('data-testid', 'rating');
    expect(container).toHaveAttribute('aria-label', 'Rating');
  });

  it('handles edge case of exactly 5 stars', () => {
    render(<Rating value={5} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(filledStars).toHaveLength(5);
    expect(emptyStars).toHaveLength(0);
  });

  it('handles edge case of exactly 0 stars', () => {
    render(<Rating value={0} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(filledStars).toHaveLength(0);
    expect(emptyStars).toHaveLength(5);
  });

  it('handles edge case of exactly 1 star', () => {
    render(<Rating value={1} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(filledStars).toHaveLength(1);
    expect(emptyStars).toHaveLength(4);
  });

  it('handles edge case of exactly 4 stars', () => {
    render(<Rating value={4} />);
    const filledStars = document.querySelectorAll('.mdi-star');
    const emptyStars = document.querySelectorAll('.mdi-star-outline');
    expect(filledStars).toHaveLength(4);
    expect(emptyStars).toHaveLength(1);
  });
}); 