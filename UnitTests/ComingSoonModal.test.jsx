/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ComingSoonModal from '../ComingSoonModal';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock CloseIcon and timer image
vi.mock('@mui/icons-material/Close', () => ({
  __esModule: true,
  default: () => <span>CloseIcon</span>,
}));
vi.mock('../../../assets/svg/timer.svg', () => 'timer.svg');

describe('ComingSoonModal', () => {
  it('renders modal content when open', () => {
    render(<ComingSoonModal isOpen={true} closeModal={vi.fn()} message="Test message" />);
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByAltText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText('CloseIcon')).toBeInTheDocument();
  });

  it('calls closeModal when close button is clicked', async () => {
    const closeModal = vi.fn();
    render(<ComingSoonModal isOpen={true} closeModal={closeModal} message="Test message" />);
    const closeBtn = screen.getByRole('button', { name: 'CloseIcon' });
    await userEvent.click(closeBtn);
    expect(closeModal).toHaveBeenCalled();
  });
});
