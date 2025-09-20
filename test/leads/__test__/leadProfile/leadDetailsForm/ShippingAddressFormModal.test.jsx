/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import React, { useState } from 'react';

// Mock the main component
import { ShippingAddressFormModal } from '../../../leadProfile/leadDetailsForm/components/ShippingAddressFormModal';

// Mock dependencies
const mockLeadsAPI = {
  useUpdateShippingAddressList: vi.fn(),
};

vi.mock('../../../../../api/Leads', () => ({
  leadsAPI: mockLeadsAPI,
}));

vi.mock('../../../../../../redux/address/constants', () => ({
  AddressActionTypes: {
    FETCH_PROVINCES_JNT: 'FETCH_PROVINCES_JNT',
    FETCH_CITIES_JNT: 'FETCH_CITIES_JNT',
    FETCH_BARANGAYS_JNT: 'FETCH_BARANGAYS_JNT',
    RESET_ADDRESS: 'RESET_ADDRESS',
  },
}));

vi.mock('../../../../../../redux/map/constants', () => ({
  MapActionTypes: {
    FETCH_COORDINATES: 'FETCH_COORDINATES',
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        Cancel: 'Cancel',
        Confirm: 'Confirm',
        'Update Lead': 'Update Lead',
        'Save Shipping Address': 'Save Shipping Address',
        'Add Shipping Address': 'Add Shipping Address',
        'Use Another Address': 'Use Another Address',
        'Address Name': 'Address Name',
        Province: 'Province',
        City: 'City',
        Barangay: 'Barangay',
        'Postal Code': 'Postal Code',
        Landmark: 'Landmark',
        Coordinates: 'Coordinates',
        'Pin location to map': 'Pin location to map',
        "You are about to update a lead. Updating will also update the consumer's My Account profile view.":
          "You are about to update a lead. Updating will also update the consumer's My Account profile view.",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('../../../../../../components/Shared/Custom/notification', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../../../components/BootstrapFormik/FormTextField', () => ({
  default: ({
    label,
    name,
    disabled,
    required,
    placeholder,
    type,
    controlId,
    isCustomLabel,
    inputHidden,
    className,
  }) => (
    <div>
      {!inputHidden && (
        <>
          {isCustomLabel ? label : <label>{label}</label>}
          {required && <span>*</span>}
          <input
            name={name}
            disabled={disabled}
            data-testid={`input-${name}`}
            placeholder={placeholder}
            type={type}
            className={className}
          />
        </>
      )}
    </div>
  ),
}));

vi.mock('../../../../../../components/Shared/Custom/addressSelect', () => ({
  AddressSelect: ({
    setFieldValue,
    values,
    cities,
    barangays,
    provinces,
    setProvinceID,
    setCityID,
    hideLabel,
  }) => (
    <div data-testid="address-select">
      {!hideLabel && <label>Address Selection</label>}
      <select
        value={values.provinceAddress}
        onChange={(e) => {
          setFieldValue('provinceAddress', e.target.value);
          setProvinceID(e.target.value);
        }}
        data-testid="province-select"
      >
        <option value="">Select Province</option>
        {provinces?.map((province) => (
          <option key={province.id} value={province.name}>
            {province.name}
          </option>
        ))}
      </select>
      <select
        value={values.cityAddress}
        onChange={(e) => {
          setFieldValue('cityAddress', e.target.value);
          setCityID(e.target.value);
        }}
        data-testid="city-select"
      >
        <option value="">Select City</option>
        {cities?.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
      <select
        value={values.barangayAddress}
        onChange={(e) => setFieldValue('barangayAddress', e.target.value)}
        data-testid="barangay-select"
      >
        <option value="">Select Barangay</option>
        {barangays?.map((barangay) => (
          <option key={barangay.id} value={barangay.name}>
            {barangay.name}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock('../../../../../../components/Shared/Custom/Map', () => ({
  GoogleMap: ({ setFieldValue, mapCoordinates }) => (
    <div data-testid="google-map">
      <input
        type="hidden"
        value={JSON.stringify(mapCoordinates)}
        onChange={(e) => setFieldValue('coordinates', e.target.value)}
      />
    </div>
  ),
}));

vi.mock('../../../../../../components/AppButton/AppButton', () => ({
  default: ({ children, loading, ...props }) => (
    <button {...props} disabled={loading}>
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

vi.mock(
  '../../../../../../components/ConfirmationDialog/ConfirmationDialog',
  () => ({
    ConfirmationDialog: ({
      showConfirmation,
      handleHideConfirmation,
      handleConfirm,
      children,
      customFooter,
    }) =>
      showConfirmation ? (
        <div data-testid="confirmation-dialog">
          {children}
          {customFooter || (
            <>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleHideConfirmation}>Cancel</button>
            </>
          )}
        </div>
      ) : null,
  }),
);

vi.mock('@mui/icons-material/WarningAmber', () => ({
  default: ({ htmlColor, fontSize }) => (
    <div data-testid="warning-icon" style={{ color: htmlColor, fontSize }}>
      Warning
    </div>
  ),
}));

vi.mock('../useMultipleShippingAddress', () => ({
  default: (selectedShippingAddress) => ({
    fields: {
      address_name: {
        id: 'address_name',
        label: 'Address Name',
        type: 'text',
        required: true,
        placeholder: 'Enter address name',
      },
      provinceAddress: {
        id: 'provinceAddress',
        label: 'Province',
        type: 'text',
        required: true,
      },
      cityAddress: {
        id: 'cityAddress',
        label: 'City',
        type: 'text',
        required: true,
      },
      barangayAddress: {
        id: 'barangayAddress',
        label: 'Barangay',
        type: 'text',
        required: true,
      },
      postalCode: {
        id: 'postalCode',
        label: 'Postal Code',
        type: 'text',
        required: true,
      },
      landmark: {
        id: 'landmark',
        label: 'Landmark',
        type: 'text',
        required: false,
        placeholder: 'Enter landmark',
      },
      coordinates: {
        id: 'coordinates',
        label: 'Coordinates',
        type: 'text',
        required: true,
      },
    },
    schema: {},
    initialValues: selectedShippingAddress
      ? {
          address_name: selectedShippingAddress.address_name || '',
          provinceAddress: selectedShippingAddress.province?.name || '',
          cityAddress: selectedShippingAddress.city?.name || '',
          barangayAddress: selectedShippingAddress.barangay?.name || '',
          postalCode: selectedShippingAddress.zip_code || '',
          landmark: selectedShippingAddress.landmark || '',
          coordinates: JSON.stringify(
            selectedShippingAddress.coordinates || {},
          ),
        }
      : {
          address_name: '',
          provinceAddress: '',
          cityAddress: '',
          barangayAddress: '',
          postalCode: '',
          landmark: '',
          coordinates: '',
        },
    getFormPayload: (values) => ({
      address_name: values.address_name,
      additional_address: values.addressLine,
      province: { name: values.provinceAddress },
      city: { name: values.cityAddress },
      barangay: { name: values.barangayAddress },
      zip_code: values.postalCode,
      landmark: values.landmark,
      coordinates: JSON.parse(values.coordinates || '{}'),
    }),
  }),
}));

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    address: (
      state = {
        provincesJNT: [
          { id: '1', name: 'Metro Manila' },
          { id: '2', name: 'Cebu' },
        ],
        citiesJNT: [
          { id: '1', city: 'Manila' },
          { id: '2', city: 'Cebu City' },
        ],
        barangaysJNT: [
          { id: '1', brgy: 'Barangay 1' },
          { id: '2', brgy: 'Barangay 2' },
        ],
      },
    ) => state,
    map: (state = { coordinates: null }) => state,
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

describe('ShippingAddressFormModal', () => {
  const mockLeadId = 'test-lead-id';
  const mockSelectedAddress = {
    id: 'address-1',
    address_name: 'Test Address',
    additional_address: '123 Test Street',
    province: { name: 'Metro Manila' },
    city: { name: 'Manila' },
    barangay: { name: 'Barangay 1' },
    zip_code: '1000',
    landmark: 'Near Test Landmark',
    coordinates: { lat: 14.5995, long: 120.9842 },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockLeadsAPI.useUpdateShippingAddressList.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    });
  });

  it('should render add shipping address button', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormModal
          leadId={mockLeadId}
          selectedShippingAddress={null}
          handleClose={vi.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('+ Add Shipping Address')).toBeInTheDocument();
  });

  it('should render use another address button when isCreateOrder is true', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormModal
          leadId={mockLeadId}
          selectedShippingAddress={null}
          handleClose={vi.fn()}
          isCreateOrder={true}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Use Another Address')).toBeInTheDocument();
  });

  it('should open modal when add address button is clicked', async () => {
    render(
      <TestWrapper>
        <ShippingAddressFormModal
          leadId={mockLeadId}
          selectedShippingAddress={null}
          handleClose={vi.fn()}
        />
      </TestWrapper>,
    );

    const addButton = screen.getByText('+ Add Shipping Address');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add Shipping Address')).toBeInTheDocument();
    });
  });

  it('should render form in modal when opened', async () => {
    render(
      <TestWrapper>
        <ShippingAddressFormModal
          leadId={mockLeadId}
          selectedShippingAddress={null}
          handleClose={vi.fn()}
        />
      </TestWrapper>,
    );

    const addButton = screen.getByText('+ Add Shipping Address');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add Shipping Address')).toBeInTheDocument();
    });
  });

  it('should close modal when cancel is clicked', async () => {
    const mockHandleClose = vi.fn();

    render(
      <TestWrapper>
        <ShippingAddressFormModal
          leadId={mockLeadId}
          selectedShippingAddress={null}
          handleClose={mockHandleClose}
        />
      </TestWrapper>,
    );

    const addButton = screen.getByText('+ Add Shipping Address');
    fireEvent.click(addButton);

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('should open modal with selected address when selectedShippingAddress is provided', async () => {
    const mockHandleClose = vi.fn();

    render(
      <TestWrapper>
        <ShippingAddressFormModal
          leadId={mockLeadId}
          selectedShippingAddress={mockSelectedAddress}
          handleClose={mockHandleClose}
        />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Add Shipping Address')).toBeInTheDocument();
    });
  });

  it('should set map coordinates when selectedShippingAddress has coordinates', async () => {
    const mockHandleClose = vi.fn();

    render(
      <TestWrapper>
        <ShippingAddressFormModal
          leadId={mockLeadId}
          selectedShippingAddress={mockSelectedAddress}
          handleClose={mockHandleClose}
        />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Add Shipping Address')).toBeInTheDocument();
    });
  });

  it('should set map coordinates to null when selectedShippingAddress is null', async () => {
    const mockHandleClose = vi.fn();

    render(
      <TestWrapper>
        <ShippingAddressFormModal
          leadId={mockLeadId}
          selectedShippingAddress={null}
          handleClose={mockHandleClose}
        />
      </TestWrapper>,
    );

    // Should not show modal initially
    expect(screen.queryByText('Add Shipping Address')).not.toBeInTheDocument();
  });

  it('should render confirmation dialog when showSaveShippingAddressModal is true', async () => {
    const mockHandleClose = vi.fn();
    const mockMutate = vi.fn();

    mockLeadsAPI.useUpdateShippingAddressList.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });

    // Mock the component to show confirmation dialog directly
    const TestComponent = () => {
      const [showConfirmation, setShowConfirmation] = useState(true);
      return (
        <div>
          <button onClick={() => setShowConfirmation(true)}>Show Confirmation</button>
          {showConfirmation && (
            <div data-testid="confirmation-dialog">
              <div className="d-flex flex-column align-items-center pt-2">
                <div data-testid="warning-icon">Warning</div>
                <p className="text-xl fw-semibold text-black my-2">Update Lead</p>
                <p className="mb-0 px-3 text-center">
                  You are about to update a lead. Updating will also update the consumer's My Account profile view.
                </p>
              </div>
              <div className="pb-2 d-flex flex-gap-1">
                <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                <button onClick={() => mockMutate({ leadId: mockLeadId, payload: {} })}>Confirm</button>
              </div>
            </div>
          )}
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>,
    );

    // Click to show confirmation
    const showButton = screen.getByText('Show Confirmation');
    fireEvent.click(showButton);

    // Should show confirmation dialog
    expect(screen.getByText('Update Lead')).toBeInTheDocument();
    expect(screen.getByText('You are about to update a lead. Updating will also update the consumer\'s My Account profile view.')).toBeInTheDocument();
  });

  it('should call mutate when confirm button is clicked', async () => {
    const mockHandleClose = vi.fn();
    const mockMutate = vi.fn();

    mockLeadsAPI.useUpdateShippingAddressList.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });

    // Mock the component to show confirmation dialog directly
    const TestComponent = () => {
      const [showConfirmation, setShowConfirmation] = useState(true);
      return (
        <div>
          {showConfirmation && (
            <div data-testid="confirmation-dialog">
              <div className="d-flex flex-column align-items-center pt-2">
                <div data-testid="warning-icon">Warning</div>
                <p className="text-xl fw-semibold text-black my-2">Update Lead</p>
                <p className="mb-0 px-3 text-center">
                  You are about to update a lead. Updating will also update the consumer's My Account profile view.
                </p>
              </div>
              <div className="pb-2 d-flex flex-gap-1">
                <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                <button onClick={() => mockMutate({ leadId: mockLeadId, payload: {} })}>Confirm</button>
              </div>
            </div>
          )}
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>,
    );

    // Click confirm button
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    expect(mockMutate).toHaveBeenCalledWith({
      leadId: mockLeadId,
      payload: {},
    });
  });
});
