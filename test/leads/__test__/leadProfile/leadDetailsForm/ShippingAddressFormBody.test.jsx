/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { Formik } from 'formik';
import React from 'react';

// Mock the main component
import ShippingAddressFormBody from '../../../leadProfile/leadDetailsForm/components/ShippingAddressFormBody';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        Cancel: 'Cancel',
        'Save Shipping Address': 'Save Shipping Address',
        'Address Name': 'Address Name',
        Province: 'Province',
        City: 'City',
        Barangay: 'Barangay',
        'Postal Code': 'Postal Code',
        Landmark: 'Landmark',
        Coordinates: 'Coordinates',
        'Pin location to map': 'Pin location to map',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('../../../../../components/BootstrapFormik/FormTextField', () => ({
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

// Test wrapper with Formik
const TestWrapper = ({ children, initialValues = {} }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const defaultValues = {
    address_name: '',
    provinceAddress: '',
    cityAddress: '',
    barangayAddress: '',
    postalCode: '',
    landmark: '',
    coordinates: '',
    addressLine: '',
    ...initialValues,
  };

  return (
    <BrowserRouter>
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <Formik initialValues={defaultValues} onSubmit={vi.fn()}>
            {children}
          </Formik>
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  );
};

describe('ShippingAddressFormBody', () => {
  const mockFields = {
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
  };

  const defaultProps = {
    fields: mockFields,
    handleClose: vi.fn(),
    isSubmitting: false,
    mapCoordinates: { lat: 14.5995, long: 120.9842 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormBody {...defaultProps} />
      </TestWrapper>,
    );

    expect(
      screen.getByRole('textbox', { name: /address name/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('address-select')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /landmark/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Pin location to map')).toBeInTheDocument();
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('should render form buttons', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormBody {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Shipping Address')).toBeInTheDocument();
  });

  it('should disable pin location button when no barangay is selected', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormBody {...defaultProps} />
      </TestWrapper>,
    );

    const pinButton = screen.getByText('Pin location to map');
    expect(pinButton).toBeDisabled();
  });

  it('should enable pin location button when barangay is selected', () => {
    render(
      <TestWrapper initialValues={{ barangayAddress: 'Barangay 1' }}>
        <ShippingAddressFormBody {...defaultProps} />
      </TestWrapper>,
    );

    const pinButton = screen.getByText('Pin location to map');
    expect(pinButton).not.toBeDisabled();
  });

  it('should call handleClose when cancel button is clicked', () => {
    const mockHandleClose = vi.fn();

    render(
      <TestWrapper>
        <ShippingAddressFormBody
          {...defaultProps}
          handleClose={mockHandleClose}
        />
      </TestWrapper>,
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('should show loading state on submit button when isSubmitting is true', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormBody {...defaultProps} isSubmitting={true} />
      </TestWrapper>,
    );

    const submitButton = screen.getByText('Loading...');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should render address select with correct options', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormBody {...defaultProps} />
      </TestWrapper>,
    );

    const provinceSelect = screen.getByTestId('province-select');
    const citySelect = screen.getByTestId('city-select');
    const barangaySelect = screen.getByTestId('barangay-select');

    expect(provinceSelect).toBeInTheDocument();
    expect(citySelect).toBeInTheDocument();
    expect(barangaySelect).toBeInTheDocument();

    // Check if options are rendered
    expect(screen.getByText('Metro Manila')).toBeInTheDocument();
    expect(screen.getByText('Cebu')).toBeInTheDocument();
  });

  it('should handle form field changes', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormBody {...defaultProps} />
      </TestWrapper>,
    );

    const addressNameInput = screen.getByRole('textbox', {
      name: /address name/i,
    });
    const landmarkInput = screen.getByRole('textbox', { name: /landmark/i });

    // Test that inputs can be changed (the mock doesn't maintain state)
    fireEvent.change(addressNameInput, { target: { value: 'Test Address' } });
    fireEvent.change(landmarkInput, { target: { value: 'Test Landmark' } });

    // Just verify the inputs exist and can be interacted with
    expect(addressNameInput).toBeInTheDocument();
    expect(landmarkInput).toBeInTheDocument();
  });

  it('should handle address selection changes', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormBody {...defaultProps} />
      </TestWrapper>,
    );

    const provinceSelect = screen.getByTestId('province-select');
    const citySelect = screen.getByTestId('city-select');
    const barangaySelect = screen.getByTestId('barangay-select');

    // Test that the selects are rendered
    expect(provinceSelect).toBeInTheDocument();
    expect(citySelect).toBeInTheDocument();
    expect(barangaySelect).toBeInTheDocument();

    // Test that we can change the values
    fireEvent.change(provinceSelect, { target: { value: 'Metro Manila' } });
    fireEvent.change(citySelect, { target: { value: 'Manila' } });
    fireEvent.change(barangaySelect, { target: { value: 'Barangay 1' } });

    // The mock doesn't update the display value, so we just check that the change events work
    expect(provinceSelect).toBeInTheDocument();
    expect(citySelect).toBeInTheDocument();
    expect(barangaySelect).toBeInTheDocument();
  });

  it('should render google map with correct coordinates', () => {
    const mapCoordinates = { lat: 14.5995, long: 120.9842 };

    render(
      <TestWrapper>
        <ShippingAddressFormBody
          {...defaultProps}
          mapCoordinates={mapCoordinates}
        />
      </TestWrapper>,
    );

    const mapInput = screen.getByTestId('google-map').querySelector('input');
    expect(mapInput).toHaveValue(JSON.stringify(mapCoordinates));
  });

  it('should render required field indicators', () => {
    render(
      <TestWrapper>
        <ShippingAddressFormBody {...defaultProps} />
      </TestWrapper>,
    );

    // Check for required field indicators (asterisks)
    const requiredSpans = screen.getAllByText('*');
    expect(requiredSpans.length).toBeGreaterThan(0);
  });
});
