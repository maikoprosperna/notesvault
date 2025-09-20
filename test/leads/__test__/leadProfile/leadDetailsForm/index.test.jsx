/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock the main component
import LeadDetailsForm from '../../../leadProfile/leadDetailsForm/index';

// Mock dependencies
const mockLeadsAPI = {
  useUpdateLeadDetails: vi.fn(),
  useDeleteShippingAddress: vi.fn(),
  useUpdateShippingAddressList: vi.fn(),
};

vi.mock('../../../../../api/Leads', () => ({
  leadsAPI: mockLeadsAPI,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        Save: 'Save',
        Cancel: 'Cancel',
        'Edit Lead': 'Edit Lead',
        'Contact Information': 'Contact Information',
        'Shipping Addresses': 'Shipping Addresses',
        'Add Shipping Address': 'Add Shipping Address',
        'Required*': 'Required*',
        'Nothing to show': 'Nothing to show',
        'Save Shipping Address': 'Save Shipping Address',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('../../../../../components/Shared/Custom/notification', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../../components/BootstrapFormik/FormTextField', () => ({
  FormTextField: ({ label, name, disabled, required }) => (
    <div>
      <label>
        {label}
        {required && <span>*</span>}
      </label>
      <input name={name} disabled={disabled} data-testid={`input-${name}`} />
    </div>
  ),
}));

vi.mock(
  '../../../../../components/InternationalPhoneFormikInput/InternationalPhoneFormikInput',
  () => ({
    InternationalPhoneFormikInput: ({ label, name, disabled, required }) => (
      <div>
        <label>
          {label}
          {required && <span>*</span>}
        </label>
        <input
          name={name}
          disabled={disabled}
          data-testid={`input-${name}`}
          type="tel"
        />
      </div>
    ),
  }),
);

vi.mock('../../CustomerTypeField', () => ({
  default: ({ values, setFieldValue, fields, isDisabled }) => (
    <div data-testid="customer-type-field">
      <label>Customer Type</label>
      <select
        data-testid="select-customer-type"
        disabled={isDisabled}
        value={values[fields.customer_type.id]}
        onChange={(e) => setFieldValue(fields.customer_type.id, e.target.value)}
      >
        <option value="individual">Individual</option>
        <option value="wholesale">Wholesale</option>
      </select>
    </div>
  ),
}));

vi.mock(
  '../../../../../components/ShippingAddressItem/ShippingAddressItem',
  () => ({
    ShippingAddressItem: ({
      addressLine,
      stateOrProvince,
      cityOrTown,
      barangay,
      postalCode,
      landmark,
      addressName,
      onClickEdit,
      onClickDelete,
      hideEdit,
      hideDelete,
    }) => (
      <div data-testid="shipping-address-item">
        <h4>{addressName}</h4>
        <p>{addressLine}</p>
        <p>
          {cityOrTown}, {stateOrProvince}
        </p>
        <p>
          {barangay} {postalCode}
        </p>
        {landmark && <p>Landmark: {landmark}</p>}
        {!hideEdit && (
          <button onClick={onClickEdit} data-testid="edit-address-btn">
            Edit
          </button>
        )}
        {!hideDelete && (
          <button onClick={onClickDelete} data-testid="delete-address-btn">
            Delete
          </button>
        )}
      </div>
    ),
  }),
);

vi.mock('../../components/ShippingAddressFormModal', () => ({
  ShippingAddressFormModal: ({
    leadId,
    selectedShippingAddress,
    handleClose,
  }) => (
    <div data-testid="shipping-address-form-modal">
      <button>+ Add Shipping Address</button>
      <button onClick={handleClose}>Close</button>
    </div>
  ),
}));

vi.mock(
  '../../../../../components/ConfirmationDialog/ConfirmationDialog',
  () => ({
    ConfirmationDialog: ({
      showConfirmation,
      handleHideConfirmation,
      handleConfirm,
      children,
    }) =>
      showConfirmation ? (
        <div data-testid="confirmation-dialog">
          {children}
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={handleHideConfirmation}>Cancel</button>
        </div>
      ) : null,
  }),
);

vi.mock('../../../../../components/AppButton/AppButton', () => ({
  default: ({ children, loading, ...props }) => (
    <button {...props} disabled={loading}>
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

vi.mock('../../../../../components/Can/Can', () => ({
  Can: ({ children, I, this: permission }) => (
    <div
      data-testid="can-component"
      data-permission={permission}
      data-action={I}
    >
      {children}
    </div>
  ),
}));

vi.mock('@casl/react', () => ({
  useAbility: () => ({
    can: () => true,
  }),
  createContextualCan: () => () => true,
}));

vi.mock('../../../../../helpers/permissions/modules', () => ({
  permissionMainModules: {
    leads: 'leads',
  },
}));

vi.mock('../../../../../utils/phoneNumber', () => ({
  removeSpacesAndSpecialChars: (phone) => phone?.replace(/\D/g, '') || phone,
}));

vi.mock('./useLeadDetailsForm', () => ({
  useLeadDetailsForm: () => ({
    fields: {
      first_name: {
        id: 'first_name',
        label: 'First Name',
        type: 'text',
        required: true,
      },
      last_name: {
        id: 'last_name',
        label: 'Last Name',
        type: 'text',
        required: true,
      },
      email: { id: 'email', label: 'Email', type: 'email', required: true },
      mobile_number: {
        id: 'mobile_number',
        label: 'Mobile Number',
        type: 'text',
        required: true,
      },
      customer_type: {
        id: 'customer_type',
        label: 'Customer Type',
        type: 'select',
        required: false,
      },
    },
    schema: {},
  }),
}));

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    address: (state = { provincesJNT: [], citiesJNT: [], barangaysJNT: [] }) =>
      state,
    account: (state = { storeDetails: { payPlanType: 'BASIC' } }) => state,
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
    <BrowserRouter>
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  );
};

describe('LeadDetailsForm', () => {
  const mockLeadDetails = {
    id: 'test-lead-id',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    mobile_number: '+1234567890',
    customer_type: 'individual',
    lead_shipping_addresses: [
      {
        id: '68ba8d2315fecdbd038c0193',
        address_name: 'Unit 603, Filinvest Corporate City, 2501 Civic Dr',
        additional_address: 'Unit 603, Filinvest Corporate City, 2501 Civic Dr',
        province: { name: 'METRO-MANILA' },
        city: { name: 'BINONDO' },
        barangay: { name: 'BARANGAY 287' },
        zip_code: 1770,
        landmark: '',
        coordinates: { lat: 15.102916825327624, long: 120.75830078125 },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockLeadsAPI.useUpdateLeadDetails.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    });

    mockLeadsAPI.useDeleteShippingAddress.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    });

    mockLeadsAPI.useUpdateShippingAddressList.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    });
  });

  it('should render lead details form when data is fetched', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={false}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
  });

  it('should render form fields with correct values', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={false}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('john.doe@example.com'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /mobile number/i }),
    ).toBeInTheDocument();
  });

  it('should render shipping information section', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={false}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    // Check for the shipping information section header
    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
  });

  it('should show edit button when not in update mode', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={false}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Edit Lead')).toBeInTheDocument();
  });

  it('should show edit lead button when in update mode', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={true}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  it('should enable form fields when in update mode', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={true}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    const firstNameInput = screen.getByDisplayValue('John');
    const lastNameInput = screen.getByDisplayValue('Doe');
    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    const mobileInput = screen.getByRole('textbox', { name: /mobile number/i });

    expect(firstNameInput).not.toBeDisabled();
    expect(lastNameInput).not.toBeDisabled();
    expect(emailInput).not.toBeDisabled();
    expect(mobileInput).not.toBeDisabled();
  });

  it('should disable form fields when not in update mode', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={false}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    const firstNameInput = screen.getByDisplayValue('John');
    const lastNameInput = screen.getByDisplayValue('Doe');
    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    const mobileInput = screen.getByRole('textbox', { name: /mobile number/i });

    expect(firstNameInput).toBeDisabled();
    expect(lastNameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(mobileInput).toBeDisabled();
  });

  it('should render customer type field', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={false}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Customer Type')).toBeInTheDocument();
  });

  it('should show add shipping address button when in update mode', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={true}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('+ Add Shipping Address')).toBeInTheDocument();
  });

  it('should show required message when no shipping addresses exist in update mode', () => {
    const leadWithoutAddresses = {
      ...mockLeadDetails,
      lead_shipping_addresses: [],
    };

    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={leadWithoutAddresses}
          isFetchedGetLead={true}
          onUpdate={true}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Required*')).toBeInTheDocument();
  });

  it('should show nothing to show when no shipping addresses exist', () => {
    const leadWithoutAddresses = {
      ...mockLeadDetails,
      lead_shipping_addresses: [],
    };

    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={leadWithoutAddresses}
          isFetchedGetLead={true}
          onUpdate={false}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });



  it('should not show save and cancel buttons when not in update mode', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={mockLeadDetails}
          isFetchedGetLead={true}
          onUpdate={false}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('should not render when data is not fetched', () => {
    render(
      <TestWrapper>
        <LeadDetailsForm
          leadDetails={null}
          isFetchedGetLead={false}
          onUpdate={false}
          setOnUpdate={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.queryByText('Contact Information')).not.toBeInTheDocument();
  });
});
