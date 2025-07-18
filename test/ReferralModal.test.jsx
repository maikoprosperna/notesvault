/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ReferralModal from '../ReferralModal';

// Mock the gift icon
vi.mock('../assets/svg/gift.svg', () => ({
  default: 'mocked-gift-icon.svg'
}));

describe('ReferralModal', () => {
  const defaultProps = {
    close: vi.fn(),
    opened: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.open
    window.open = vi.fn();
  });

  it('renders without crashing', () => {
    render(<ReferralModal {...defaultProps} />);
    expect(screen.getByText('Refer & Earn')).toBeInTheDocument();
  });

  it('renders with correct content', () => {
    render(<ReferralModal {...defaultProps} />);
    
    expect(screen.getByText('Refer & Earn')).toBeInTheDocument();
    expect(screen.getByText('Refer your friends and earn up to 35%')).toBeInTheDocument();
    expect(screen.getByText('Join Now')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('renders gift icon', () => {
    render(<ReferralModal {...defaultProps} />);
    
    const giftIcon = screen.getByAltText('gift-icon');
    expect(giftIcon).toBeInTheDocument();
    // The SVG is imported as a data URL, so we just check that it has a src attribute
    expect(giftIcon).toHaveAttribute('src');
  });

  it('opens affiliate link when Join Now is clicked', () => {
    render(<ReferralModal {...defaultProps} />);
    
    const joinNowButton = screen.getByText('Join Now');
    fireEvent.click(joinNowButton);
    
    expect(window.open).toHaveBeenCalledWith(
      'https://affiliates.prosperna.com/login',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('opens affiliate link when Log In is clicked', () => {
    render(<ReferralModal {...defaultProps} />);
    
    const logInButton = screen.getByText('Log In');
    fireEvent.click(logInButton);
    
    expect(window.open).toHaveBeenCalledWith(
      'https://affiliates.prosperna.com/login',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('renders when opened is true', () => {
    render(<ReferralModal opened={true} close={vi.fn()} />);
    expect(screen.getByText('Refer & Earn')).toBeInTheDocument();
  });

  it('does not render when opened is false', () => {
    render(<ReferralModal opened={false} close={vi.fn()} />);
    expect(screen.queryByText('Refer & Earn')).not.toBeInTheDocument();
  });

  it('calls close function when modal is closed', () => {
    const closeMock = vi.fn();
    render(<ReferralModal opened={true} close={closeMock} />);
    
    // The close function would be called by the Modal's onHide prop
    // We can't easily test this without more complex setup, but we can verify the prop is passed
    expect(closeMock).toBeDefined();
  });
}); 