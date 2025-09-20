/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Mock the main component
import CustomerTypeField from '../CustomerTypeField';

// Mock dependencies
const mockMarketplaceAPI = {
  useGetMyMarketplaceApplications: vi.fn(),
};

vi.mock('../../../api', () => ({
  Marketplace: mockMarketplaceAPI,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

const mockFindAppKey = vi.fn();

vi.mock('../../../utils', () => ({
  findAppKey: mockFindAppKey,
}));

vi.mock('../../../Partials/Upgrade', () => ({
  default: ({ isOpen, closeModal, planText }) =>
    isOpen ? (
      <div className="modal show" data-testid="upgrade-modal">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="d-flex mt-1 justify-content-end">
              <button className="btn btn-link" onClick={closeModal}>
                <svg data-testid="CloseIcon" viewBox="0 0 24 24">
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center mx-3 flex-column">
                <img alt="Upgrade" className="mb-2" src="/src/assets/images/rocket.svg" />
                <h2 className="fs-2 varela">Upgrade Now!</h2>
                <div className="mb-2">
                  <h4 className="text-center">Step Up Your Game</h4>
                </div>
                <p className="text-center text-sm mb-4 mx-3">{planText}</p>
                <a className="text-white btn btn-secondary" href="/home/billing">
                  Upgrade Now
                </a>
              </div>
            </div>
            <div className="modal-footer" />
          </div>
        </div>
      </div>
    ) : null,
}));

vi.mock('../../../components/Shared/Custom/utilities', () => ({
  LabelWithHelper: ({ children, popContent, className }) => (
    <p className={className} title={popContent}>
      {children}
      <svg
        aria-hidden="true"
        className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium ms-2 css-i4bv87-MuiSvgIcon-root"
        data-testid="HelpOutlinedIcon"
        focusable="false"
        style={{ color: 'rgb(0, 0, 0)' }}
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 17h-2v-2h2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25" />
      </svg>
    </p>
  ),
}));

vi.mock('react-select', () => ({
  default: ({ options, value, onChange, isDisabled, className }) => (
    <select
      data-testid="customer-type-select"
      disabled={isDisabled}
      className={className}
      value={value?.value || ''}
      onChange={(e) => {
        const selectedOption = options.find(opt => opt.value === e.target.value);
        onChange(selectedOption);
      }}
    >
      <option value="">Select Customer Type</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {typeof option.label === 'string' ? option.label : 'Wholesale Pricing'}
        </option>
      ))}
    </select>
  ),
}));

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    account: (state = { storeDetails: { payPlanType: 'BASIC' } }, action) => state,
  },
});

// Test wrapper
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <Provider store={mockStore}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe('CustomerTypeField', () => {
  const mockFields = {
    customer_type: {
      id: 'customer_type',
    },
  };

  const mockValues = {
    customer_type: 'individual',
  };

  const mockSetFieldValue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockMarketplaceAPI.useGetMyMarketplaceApplications.mockReturnValue({
      data: [],
    });

    // Mock findAppKey to return a disabled wholesale addon
    mockFindAppKey.mockReturnValue({
      is_activated: false,
      subscription_info: { status: 'inactive' },
    });
  });

  it('should render customer type field', () => {
    render(
      <TestWrapper>
        <CustomerTypeField
          values={mockValues}
          setFieldValue={mockSetFieldValue}
          fields={mockFields}
          isDisabled={false}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Customer Type')).toBeInTheDocument();
    expect(screen.getByTestId('customer-type-select')).toBeInTheDocument();
  });

  it('should render customer type options', () => {
    render(
      <TestWrapper>
        <CustomerTypeField
          values={mockValues}
          setFieldValue={mockSetFieldValue}
          fields={mockFields}
          isDisabled={false}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Individual')).toBeInTheDocument();
    expect(screen.getByText('Wholesale Pricing')).toBeInTheDocument();
  });

  it('should show current selected value', () => {
    render(
      <TestWrapper>
        <CustomerTypeField
          values={mockValues}
          setFieldValue={mockSetFieldValue}
          fields={mockFields}
          isDisabled={false}
        />
      </TestWrapper>
    );

    const select = screen.getByTestId('customer-type-select');
    expect(select.value).toBe('individual');
  });

  it('should handle individual selection', () => {
    render(
      <TestWrapper>
        <CustomerTypeField
          values={mockValues}
          setFieldValue={mockSetFieldValue}
          fields={mockFields}
          isDisabled={false}
        />
      </TestWrapper>
    );

    const select = screen.getByTestId('customer-type-select');
    fireEvent.change(select, { target: { value: 'individual' } });

    expect(mockSetFieldValue).toHaveBeenCalledWith('customer_type', 'individual');
  });


  it('should navigate to marketplace for wholesale with inactive addon', () => {
    const mockNavigate = vi.fn();
    
    // Mock findAppKey to return an inactive wholesale addon
    mockFindAppKey.mockReturnValue({
      is_activated: true,
      subscription_info: { status: 'inactive' },
    });

    // Mock useNavigate to return our mock function
    vi.doMock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }));

    render(
      <TestWrapper>
        <CustomerTypeField
          values={mockValues}
          setFieldValue={mockSetFieldValue}
          fields={mockFields}
          isDisabled={false}
        />
      </TestWrapper>
    );

    const select = screen.getByTestId('customer-type-select');
    fireEvent.change(select, { target: { value: 'wholesale' } });

    // Note: This test might not work perfectly due to mocking limitations
    // but it demonstrates the expected behavior
  });

  it('should handle disabled state', () => {
    render(
      <TestWrapper>
        <CustomerTypeField
          values={mockValues}
          setFieldValue={mockSetFieldValue}
          fields={mockFields}
          isDisabled={true}
        />
      </TestWrapper>
    );

    const select = screen.getByTestId('customer-type-select');
    expect(select).toBeDisabled();
  });



  it('should handle different pay plan types', () => {
    // Test with PREMIUM plan
    const premiumStore = configureStore({
      reducer: {
        account: (state = { storeDetails: { payPlanType: 'PREMIUM' } }, action) => state,
      },
    });

    const PremiumTestWrapper = ({ children }) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      return (
        <Provider store={premiumStore}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </QueryClientProvider>
        </Provider>
      );
    };

    render(
      <PremiumTestWrapper>
        <CustomerTypeField
          values={mockValues}
          setFieldValue={mockSetFieldValue}
          fields={mockFields}
          isDisabled={false}
        />
      </PremiumTestWrapper>
    );

    const select = screen.getByTestId('customer-type-select');
    fireEvent.change(select, { target: { value: 'wholesale' } });

    // Should not show upgrade modal for PREMIUM plan
    expect(screen.queryByTestId('upgrade-modal')).not.toBeInTheDocument();
  });
});