import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';
import AppButton from './index';

describe('AppButton Component', () => {
  it('renders button with correct text', () => {
    render(<AppButton>Click me</AppButton>);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<AppButton onClick={handleClick}>Click me</AppButton>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    render(<AppButton disabled>Click me</AppButton>);
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<AppButton className="custom-class">Click me</AppButton>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('custom-class');
  });
});
