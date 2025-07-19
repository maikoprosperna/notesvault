import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik, Form } from 'formik';
import FormBody from '../BillingInfo.FormBody';
import { IStoreLocationDetails } from '@/types';

// Mock the FormTextField component
jest.mock('@/components/FormikTextField', () => ({
  __esModule: true,
  default: ({ label, controlId, type, name, placeholder, required }: any) => (
    <div data-testid={`form-field-${name}`}>
      <label htmlFor={controlId}>{label}</label>
      <input
        id={controlId}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        data-testid={`input-${name}`}
      />
    </div>
  ),
}));

// Mock the InternationalPhoneFormikInput component
jest.mock(
  '@/components/InternationalPhoneFormikInput/InternationalPhoneFormikInput',
  () => ({
    InternationalPhoneFormikInput: ({ label, id, name, required }: any) => (
      <div data-testid={`phone-field-${name}`}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          name={name}
          type="tel"
          required={required}
          data-testid={`input-${name}`}
        />
      </div>
    ),
  }),
);

// Mock the AppButton component
jest.mock('@/components/AppButton/AppButton', () => ({
  __esModule: true,
  default: ({
    children,
    variant,
    className,
    type,
    onClick,
    disabled,
    loading,
  }: any) => (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-testid="submit-button"
      data-variant={variant}
      data-loading={loading}
    >
      {children}
    </button>
  ),
}));

// Mock the MobileButtonPortal component
jest.mock('../../Summary/MobileButtonPortal', () => ({
  __esModule: true,
  default: ({ children, isMobile, isActive }: any) => (
    <div
      data-testid="mobile-button-portal"
      data-mobile={isMobile}
      data-active={isActive}
    >
      {children}
    </div>
  ),
}));

// Mock the useMediaQuery hook
jest.mock('@mui/material', () => ({
  useMediaQuery: jest.fn(() => false),
}));

// Mock the useQueryClient hook
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}));

// Mock the getLocationURL utility
jest.mock('@/utils/logicUtil', () => ({
  getLocationURL: jest.fn(() => 'test-location'),
}));

// Import mocked modules
import { useMediaQuery } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

describe('FormBody', () => {
  const mockFields = {
    fname: {
      id: 'fname',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your first name',
      validator: jest.fn(),
    },
    lname: {
      id: 'lname',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your last name',
      validator: jest.fn(),
    },
    email: {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
      validator: jest.fn(),
    },
    phone: {
      id: 'phone',
      label: 'Phone',
      type: 'text',
      required: true,
      placeholder: '',
      validator: jest.fn(),
    },
  };

  const mockLocation = {
    name: 'location',
    value: 'US-CA-San Francisco',
    country: 'US',
    state: 'CA',
    city: 'San Francisco',
  };

  const mockStoreLocations: IStoreLocationDetails[] = [
    {
      id: '1',
      storeId: 'store1',
      storeName: 'Test Store',
      storeSlug: 'test-store',
      storeAddress: {
        address: '123 Test St',
        barangay: {
          _id: '1',
          barangayName: 'Test Barangay',
          barangayNameUppercased: 'TEST BARANGAY',
        },
        city: {
          _id: '1',
          municipalityName: 'Test City',
          municipalityNameUppercased: 'TEST CITY',
        },
        province: {
          _id: '1',
          provinceName: 'Test Province',
          provinceNameUppercased: 'TEST PROVINCE',
        },
        country: {
          _id: '1',
          name: 'Test Country',
        },
        postal_code: '1234',
      },
      storePhoneNumber: '123-456-7890',
      storeSecondaryPhoneNumber: '098-765-4321',
      storeHours: {
        open: '09:00',
        close: '18:00',
      },
      storeEmail: 'test@example.com',
      dateCreated: '2024-01-01',
      lastUpdated: '2024-01-01',
      status: 'active',
      is_default: true,
    },
  ];

  const defaultProps = {
    customerLoginStatus: false,
    cartHasDigitalProduct: false,
    cartHasOnlyDigitalProduct: false,
    fields: mockFields,
    location: mockLocation,
    StoreLocations: mockStoreLocations,
    isQRCodeActive: false,
    referenceQRNumber: undefined,
    isActive: true,
  };

  const renderWithFormik = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    return render(
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          phone: '',
          accountRadio: 'guest',
        }}
        onSubmit={jest.fn()}
      >
        <Form>
          <FormBody {...mergedProps} />
        </Form>
      </Formik>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    renderWithFormik();

    expect(screen.getByTestId('form-field-fname')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-lname')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-email')).toBeInTheDocument();
    expect(screen.getByTestId('phone-field-phone')).toBeInTheDocument();
  });

  it('renders form field labels', () => {
    renderWithFormik();

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('renders form field inputs with correct attributes', () => {
    renderWithFormik();

    const fnameInput = screen.getByTestId('input-fname');
    const lnameInput = screen.getByTestId('input-lname');
    const emailInput = screen.getByTestId('input-email');
    const phoneInput = screen.getByTestId('input-phone');

    expect(fnameInput).toHaveAttribute('type', 'text');
    expect(fnameInput).toHaveAttribute('required');
    expect(fnameInput).toHaveAttribute('placeholder', 'Enter your first name');

    expect(lnameInput).toHaveAttribute('type', 'text');
    expect(lnameInput).toHaveAttribute('required');
    expect(lnameInput).toHaveAttribute('placeholder', 'Enter your last name');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');

    expect(phoneInput).toHaveAttribute('type', 'tel');
    expect(phoneInput).toHaveAttribute('required');
  });

  it('renders guest checkout radio button when customer is not logged in', () => {
    renderWithFormik({ customerLoginStatus: false });

    expect(screen.getByText('Guest Checkout')).toBeInTheDocument();
    expect(screen.getByDisplayValue('guest')).toBeInTheDocument();
  });

  it('does not render guest checkout radio button when customer is logged in', () => {
    renderWithFormik({ customerLoginStatus: true });

    expect(screen.queryByText('Guest Checkout')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('guest')).not.toBeInTheDocument();
  });

  it('renders digital terms checkbox when cart has digital products', () => {
    renderWithFormik({ cartHasDigitalProduct: true });

    // Use getAllByText to avoid multiple elements error
    const dmcaLabels = screen.getAllByText(
      /I agree to adhere to the Digital Millennium Copyright Act/,
    );
    expect(dmcaLabels.length).toBeGreaterThan(0);
    expect(dmcaLabels[0]).toBeInTheDocument();
    expect(screen.getAllByText('Terms of Service')[0]).toBeInTheDocument();
  });

  it('does not render digital terms checkbox when cart has no digital products', () => {
    renderWithFormik({ cartHasDigitalProduct: false });

    expect(
      screen.queryByText(
        /I agree to adhere to the Digital Millennium Copyright Act/,
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Terms of Service')).not.toBeInTheDocument();
  });

  it('renders submit button with correct text for digital-only cart', () => {
    renderWithFormik({ cartHasOnlyDigitalProduct: true });

    const submitButtons = screen.getAllByTestId('submit-button');
    const firstSubmitButton = submitButtons[0];
    expect(firstSubmitButton).toHaveTextContent('Proceed to Payment');
  });

  it('renders submit button with correct text for mixed cart', () => {
    renderWithFormik({ cartHasOnlyDigitalProduct: false });

    const submitButtons = screen.getAllByTestId('submit-button');
    const firstSubmitButton = submitButtons[0];
    expect(firstSubmitButton).toHaveTextContent('Proceed to Shipping');
  });

  it('renders submit button with correct text when QR code is active', () => {
    renderWithFormik({ isQRCodeActive: true, referenceQRNumber: 'QR123' });

    const submitButtons = screen.getAllByTestId('submit-button');
    const firstSubmitButton = submitButtons[0];
    expect(firstSubmitButton).toHaveTextContent('Proceed to Payment');
  });

  it('disables submit button when digital terms are not accepted', () => {
    renderWithFormik({ cartHasDigitalProduct: true });

    const submitButtons = screen.getAllByTestId('submit-button');
    const firstSubmitButton = submitButtons[0];
    expect(firstSubmitButton).toBeDisabled();
  });

  it('enables submit button when digital terms are accepted', () => {
    renderWithFormik({ cartHasDigitalProduct: true });

    const digitalTermsCheckboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = digitalTermsCheckboxes[0];
    fireEvent.click(firstCheckbox);

    const submitButtons = screen.getAllByTestId('submit-button');
    const firstSubmitButton = submitButtons[0];
    expect(firstSubmitButton).not.toBeDisabled();
  });

  it('renders back to cart link', () => {
    renderWithFormik();

    const backLinks = screen.getAllByText('Back to Shopping Cart');
    expect(backLinks[0]).toBeInTheDocument();
    expect(backLinks[0]).toHaveAttribute('href', '/test-locationcart');
  });

  it('renders mobile button portal when on mobile', () => {
    const mockedUseMediaQuery = jest.mocked(useMediaQuery);
    mockedUseMediaQuery.mockReturnValue(true);

    renderWithFormik();

    expect(screen.getByTestId('mobile-button-portal')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-button-portal')).toHaveAttribute(
      'data-mobile',
      'true',
    );
  });

  it('does not render mobile button portal when on desktop', () => {
    const mockedUseMediaQuery = jest.mocked(useMediaQuery);
    mockedUseMediaQuery.mockReturnValue(false);

    renderWithFormik();

    expect(screen.getByTestId('mobile-button-portal')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-button-portal')).toHaveAttribute(
      'data-mobile',
      'false',
    );
  });

  it('handles form submission correctly', async () => {
    const mockOnSubmit = jest.fn();
    const mockedUseQueryClient = jest.mocked(useQueryClient);
    const mockInvalidateQueries = jest.fn();
    mockedUseQueryClient.mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    } as any);

    render(
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          phone: '',
          accountRadio: 'guest',
        }}
        onSubmit={mockOnSubmit}
      >
        <Form>
          <FormBody {...defaultProps} />
        </Form>
      </Formik>,
    );

    const submitButtons = screen.getAllByTestId('submit-button');
    const firstSubmitButton = submitButtons[0];
    fireEvent.click(firstSubmitButton);

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['CustomerCartItems'],
      });
    });
  });

  it('handles mobile scroll behavior on submit', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const mockScrollTo = jest.fn();
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      configurable: true,
      value: mockScrollTo,
    });

    renderWithFormik();

    const submitButtons = screen.getAllByTestId('submit-button');
    const firstSubmitButton = submitButtons[0];
    fireEvent.click(firstSubmitButton);

    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('handles desktop scroll behavior on submit', () => {
    // Mock window.innerWidth for desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const mockScrollTo = jest.fn();
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      configurable: true,
      value: mockScrollTo,
    });

    renderWithFormik();

    const submitButtons = screen.getAllByTestId('submit-button');
    const firstSubmitButton = submitButtons[0];
    fireEvent.click(firstSubmitButton);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it('renders digital terms in both mobile and desktop views', () => {
    renderWithFormik({ cartHasDigitalProduct: true });

    const digitalTermsCheckboxes = screen.getAllByRole('checkbox');
    expect(digitalTermsCheckboxes).toHaveLength(3); // One for mobile, one for desktop, one for responsive view
  });

  it('handles different isActive states', () => {
    // Test active state
    const { rerender } = renderWithFormik({ isActive: true });
    expect(screen.getByTestId('mobile-button-portal')).toHaveAttribute(
      'data-active',
      'true',
    );

    // Test inactive state
    rerender(
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          phone: '',
          accountRadio: 'guest',
        }}
        onSubmit={jest.fn()}
      >
        <Form>
          <FormBody {...defaultProps} isActive={false} />
        </Form>
      </Formik>,
    );
    expect(screen.getByTestId('mobile-button-portal')).toHaveAttribute(
      'data-active',
      'false',
    );
  });

  it('handles different cart product scenarios', () => {
    // Test with digital products
    const { rerender } = renderWithFormik({ cartHasDigitalProduct: true });
    expect(
      screen.getAllByText(
        /I agree to adhere to the Digital Millennium Copyright Act/,
      ),
    ).toHaveLength(3); // Three instances: mobile, desktop, and responsive view

    // Test without digital products
    rerender(
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          phone: '',
          accountRadio: 'guest',
        }}
        onSubmit={jest.fn()}
      >
        <Form>
          <FormBody {...defaultProps} cartHasDigitalProduct={false} />
        </Form>
      </Formik>,
    );
    expect(
      screen.queryByText(
        /I agree to adhere to the Digital Millennium Copyright Act/,
      ),
    ).not.toBeInTheDocument();
  });

  it('handles different customer login statuses', () => {
    // Test logged out customer
    const { rerender } = renderWithFormik({ customerLoginStatus: false });
    expect(screen.getByText('Guest Checkout')).toBeInTheDocument();

    // Test logged in customer
    rerender(
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          phone: '',
          accountRadio: 'guest',
        }}
        onSubmit={jest.fn()}
      >
        <Form>
          <FormBody {...defaultProps} customerLoginStatus={true} />
        </Form>
      </Formik>,
    );
    expect(screen.queryByText('Guest Checkout')).not.toBeInTheDocument();
  });

  it('handles different QR code scenarios', () => {
    // Test without QR code
    const { rerender } = renderWithFormik({ isQRCodeActive: false });
    const submitButtons = screen.getAllByTestId('submit-button');
    const firstSubmitButton = submitButtons[0];
    expect(firstSubmitButton).toHaveTextContent('Proceed to Shipping');

    // Test with QR code
    rerender(
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          phone: '',
          accountRadio: 'guest',
        }}
        onSubmit={jest.fn()}
      >
        <Form>
          <FormBody
            {...defaultProps}
            isQRCodeActive={true}
            referenceQRNumber="QR123"
          />
        </Form>
      </Formik>,
    );
    const newSubmitButtons = screen.getAllByTestId('submit-button');
    const newFirstSubmitButton = newSubmitButtons[0];
    expect(newFirstSubmitButton).toHaveTextContent('Proceed to Payment');
  });

  it('handles mobile portal rendering correctly', () => {
    const mockedUseMediaQuery = jest.mocked(useMediaQuery);
    mockedUseMediaQuery.mockReturnValue(true);

    renderWithFormik();

    const mobilePortal = screen.getByTestId('mobile-button-portal');
    expect(mobilePortal).toBeInTheDocument();

    // Check that mobile portal contains the submit button
    const submitButton = mobilePortal.querySelector(
      '[data-testid="submit-button"]',
    );
    expect(submitButton).toBeInTheDocument();
  });

  it('handles desktop portal rendering correctly', () => {
    const mockedUseMediaQuery = jest.mocked(useMediaQuery);
    mockedUseMediaQuery.mockReturnValue(false);

    renderWithFormik();

    const mobilePortal = screen.getByTestId('mobile-button-portal');
    expect(mobilePortal).toBeInTheDocument();

    // Check that desktop portal contains the submit button
    const submitButton = mobilePortal.querySelector(
      '[data-testid="submit-button"]',
    );
    expect(submitButton).toBeInTheDocument();
  });

  it('handles mobile portal with different states', () => {
    const mockedUseMediaQuery = jest.mocked(useMediaQuery);
    mockedUseMediaQuery.mockReturnValue(true);

    // Test active state
    const { rerender } = renderWithFormik({ isActive: true });
    const mobilePortal = screen.getByTestId('mobile-button-portal');
    expect(mobilePortal).toHaveAttribute('data-active', 'true');

    // Test inactive state
    rerender(
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          phone: '',
          accountRadio: 'guest',
        }}
        onSubmit={jest.fn()}
      >
        <Form>
          <FormBody {...defaultProps} isActive={false} />
        </Form>
      </Formik>,
    );
    const newMobilePortal = screen.getByTestId('mobile-button-portal');
    expect(newMobilePortal).toHaveAttribute('data-active', 'false');
  });

  it('handles mobile portal with different mobile states', () => {
    // Test mobile state
    const mockedUseMediaQuery = jest.mocked(useMediaQuery);
    mockedUseMediaQuery.mockReturnValue(true);

    const { rerender } = renderWithFormik();
    const mobilePortal = screen.getByTestId('mobile-button-portal');
    expect(mobilePortal).toHaveAttribute('data-mobile', 'true');

    // Test desktop state
    mockedUseMediaQuery.mockReturnValue(false);
    rerender(
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          phone: '',
          accountRadio: 'guest',
        }}
        onSubmit={jest.fn()}
      >
        <Form>
          <FormBody {...defaultProps} />
        </Form>
      </Formik>,
    );
    const newMobilePortal = screen.getByTestId('mobile-button-portal');
    expect(newMobilePortal).toHaveAttribute('data-mobile', 'false');
  });
});
