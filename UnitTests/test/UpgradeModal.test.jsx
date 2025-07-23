/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import UpgradeModal from '../UpgradeModal';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock react-router-dom Link
vi.mock('react-router-dom', () => ({
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

// Mock CloseIcon and rocket image
vi.mock('@mui/icons-material/Close', () => ({
  __esModule: true,
  default: () => <span>CloseIcon</span>,
}));
vi.mock('../../../assets/images/rocket.svg', () => 'rocket.svg');

describe('UpgradeModal', () => {
  it('renders modal content when open', () => {
    render(<UpgradeModal isOpen={true} closeModal={vi.fn()} />);
    expect(screen.getByText(/Upgrade Now!/i)).toBeInTheDocument();
    expect(screen.getByText(/unlock powerful features/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Upgrade Now/i).length).toBeGreaterThan(0);
  });

  it('calls closeModal when close button is clicked', async () => {
    const closeModal = vi.fn();
    render(<UpgradeModal isOpen={true} closeModal={closeModal} />);
    const closeBtn = screen.getByRole('button', { name: 'CloseIcon' });
    await userEvent.click(closeBtn);
    expect(closeModal).toHaveBeenCalled();
  });

  it('calls closeModal when Cancel button is clicked', async () => {
    const closeModal = vi.fn();
    render(<UpgradeModal isOpen={true} closeModal={closeModal} />);
    const cancelBtn = screen.getByText('Cancel');
    await userEvent.click(cancelBtn);
    expect(closeModal).toHaveBeenCalled();
  });

  it('calls closeModal when Upgrade Now link is clicked', async () => {
    const closeModal = vi.fn();
    render(<UpgradeModal isOpen={true} closeModal={closeModal} />);
    const upgradeLinks = screen.getAllByText('Upgrade Now');
    // The first is the header, the second is the link
    const upgradeLink = upgradeLinks[1] || upgradeLinks[0];
    await userEvent.click(upgradeLink);
    expect(closeModal).toHaveBeenCalled();
  });
});
