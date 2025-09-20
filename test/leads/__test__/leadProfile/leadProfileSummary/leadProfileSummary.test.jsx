/* eslint-disable */
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import LeadProfileSummary from '../../../leadProfile/leadProfileSummary/leadProfileSummary';

// Mock dependencies
vi.mock('../../../../../components/Shared/Custom/utilities', () => ({
  Section: ({ children, className }) => (
    <div className={className} data-testid="section">
      {children}
    </div>
  ),
  ToStandardNumberFormat: (value) => value?.toString() || '0',
}));

vi.mock('../../../../../constants/currency', () => ({
  CURRENCY: '₱',
}));

vi.mock('../../../../../constants/dateConstants', () => ({
  dateConstants: {
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  },
}));

vi.mock('moment', () => ({
  default: (date) => ({
    format: (format) => {
      if (format === 'hh:mm A') {
        return '10:30 AM';
      }
      return date;
    },
  }),
}));

vi.mock('@mui/icons-material', () => ({
  PersonAddAltOutlined: () => (
    <div data-testid="person-add-icon">PersonAddAltOutlined</div>
  ),
  VisibilityOffOutlined: () => (
    <div data-testid="visibility-off-icon">VisibilityOffOutlined</div>
  ),
  ShoppingBasketOutlined: () => (
    <div data-testid="shopping-basket-icon">ShoppingBasketOutlined</div>
  ),
  AccountBalanceWalletOutlined: () => (
    <div data-testid="wallet-icon">AccountBalanceWalletOutlined</div>
  ),
  EmailOutlined: () => <div data-testid="email-icon">EmailOutlined</div>,
}));

describe('LeadProfileSummary', () => {
  const mockLeadDetails = {
    id: 'test-lead-id',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    createdAt: '2023-01-01T00:00:00Z',
    lead_activity: {
      last_seen: '2023-01-15T00:00:00Z',
      total_number_of_orders: 5,
      total_amount_spent: 1000,
    },
    lead_contact_activity: {
      last_email_date: '2023-01-10T00:00:00Z',
    },
  };

  it('should render lead profile summary with data', () => {
    render(
      <LeadProfileSummary
        isFetchingData={true}
        leadDetails={mockLeadDetails}
      />,
    );

    expect(screen.getByText('Lead Profile Summary')).toBeInTheDocument();
    expect(screen.getByText('Lead Activity')).toBeInTheDocument();
    expect(screen.getByText('Contact Activity')).toBeInTheDocument();
    expect(screen.getByText('Created Date')).toBeInTheDocument();
    expect(screen.getByText('Last Seen')).toBeInTheDocument();
    expect(screen.getByText('Total No. of Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Amount Spent')).toBeInTheDocument();
    expect(screen.getByText('Last Email')).toBeInTheDocument();
  });

  it('should render with isFetchingData false', () => {
    render(
      <LeadProfileSummary
        isFetchingData={false}
        leadDetails={mockLeadDetails}
      />,
    );

    expect(screen.getByText('Lead Profile Summary')).toBeInTheDocument();
    expect(screen.getByText('Total No. of Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Amount Spent')).toBeInTheDocument();
  });

  it('should handle missing lead details', () => {
    render(<LeadProfileSummary isFetchingData={true} leadDetails={null} />);

    expect(screen.getByText('Lead Profile Summary')).toBeInTheDocument();
    // Check for at least one N/A element (there will be multiple)
    expect(screen.getAllByText('N/A')).toHaveLength(3);
  });

  it('should handle empty lead details', () => {
    render(<LeadProfileSummary isFetchingData={true} leadDetails={{}} />);

    expect(screen.getByText('Lead Profile Summary')).toBeInTheDocument();
    // Check for at least one N/A element (there will be multiple)
    expect(screen.getAllByText('N/A')).toHaveLength(3);
  });

  it('should display order count correctly', () => {
    const leadWithOrders = {
      ...mockLeadDetails,
      lead_activity: {
        total_number_of_orders: 10,
        total_amount_spent: 2500,
      },
    };

    render(
      <LeadProfileSummary isFetchingData={true} leadDetails={leadWithOrders} />,
    );

    expect(screen.getByText('10')).toBeInTheDocument();
  });


  it('should handle missing lead activity', () => {
    const leadWithoutActivity = {
      ...mockLeadDetails,
      lead_activity: null,
    };

    render(
      <LeadProfileSummary
        isFetchingData={true}
        leadDetails={leadWithoutActivity}
      />,
    );

    expect(screen.getByText('Lead Profile Summary')).toBeInTheDocument();
  });

  it('should handle missing contact activity', () => {
    const leadWithoutContact = {
      ...mockLeadDetails,
      lead_contact_activity: null,
    };

    render(
      <LeadProfileSummary
        isFetchingData={true}
        leadDetails={leadWithoutContact}
      />,
    );

    expect(screen.getByText('Lead Profile Summary')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should render all icons', () => {
    render(
      <LeadProfileSummary
        isFetchingData={true}
        leadDetails={mockLeadDetails}
      />,
    );

    expect(screen.getByTestId('person-add-icon')).toBeInTheDocument();
    expect(screen.getByTestId('visibility-off-icon')).toBeInTheDocument();
    expect(screen.getByTestId('shopping-basket-icon')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-icon')).toBeInTheDocument();
    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
  });

  it('should format dates correctly', () => {
    render(
      <LeadProfileSummary
        isFetchingData={true}
        leadDetails={mockLeadDetails}
      />,
    );

    // The dates should be formatted and displayed
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2023')).toBeInTheDocument();
    expect(screen.getByText('January 10, 2023')).toBeInTheDocument();
  });

  it('should display time for last email', () => {
    render(
      <LeadProfileSummary
        isFetchingData={true}
        leadDetails={mockLeadDetails}
      />,
    );

    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
  });
});
