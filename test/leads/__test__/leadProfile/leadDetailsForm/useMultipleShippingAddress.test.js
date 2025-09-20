/* eslint-disable */
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the hook
import useMultipleShippingAddress from '../../../leadProfile/leadDetailsForm/useMultipleShippingAddress';

describe('useMultipleShippingAddress', () => {
  const mockSelectedShippingAddress = {
    id: 'address-1',
    address_name: 'Home',
    additional_address: '123 Main St',
    province: { name: 'California' },
    city: { name: 'Los Angeles' },
    barangay: { name: 'Downtown' },
    zip_code: '90210',
    landmark: 'Near Mall',
    coordinates: { lat: 34.0522, long: -118.2437 },
  };

  it('should return fields, schema, initialValues, and getFormPayload', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    
    expect(result.current.fields).toBeDefined();
    expect(result.current.schema).toBeDefined();
    expect(result.current.initialValues).toBeDefined();
    expect(result.current.getFormPayload).toBeDefined();
  });

  it('should have correct field configurations', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    const { fields } = result.current;

    // Check provinceAddress field
    expect(fields.provinceAddress).toMatchObject({
      type: 'text',
      id: 'provinceAddress',
      label: 'State / Province',
      value: '',
      required: true,
      placeholder: 'Select your State / Province',
      isFull: false,
    });
    expect(fields.provinceAddress.validator).toBeDefined();

    // Check addressLine field
    expect(fields.addressLine).toMatchObject({
      type: 'text',
      id: 'addressLine',
      label: 'Address Line',
      value: '',
      required: true,
      placeholder: 'Type your address',
      isFull: true,
    });
    expect(fields.addressLine.validator).toBeDefined();

    // Check cityAddress field
    expect(fields.cityAddress).toMatchObject({
      type: 'text',
      id: 'cityAddress',
      label: 'City / Town',
      value: '',
      required: true,
      placeholder: 'Select your City / Town',
      isFull: false,
    });
    expect(fields.cityAddress.validator).toBeDefined();

    // Check barangayAddress field
    expect(fields.barangayAddress).toMatchObject({
      type: 'text',
      id: 'barangayAddress',
      label: 'Barangay',
      value: '',
      required: true,
      placeholder: 'Select your Barangay',
      isFull: false,
    });
    expect(fields.barangayAddress.validator).toBeDefined();

    // Check postalCode field
    expect(fields.postalCode).toMatchObject({
      type: 'text',
      id: 'postalCode',
      label: 'Zip Code',
      value: '',
      required: true,
      placeholder: 'Type your Postal Code',
      isFull: false,
    });
    expect(fields.postalCode.validator).toBeDefined();

    // Check landmark field
    expect(fields.landmark).toMatchObject({
      type: 'text',
      id: 'landmark',
      label: 'Landmark',
      value: '',
      required: false,
      placeholder: 'Type your landmark',
      isFull: true,
    });
    expect(fields.landmark.validator).toBeDefined();

    // Check coordinates field
    expect(fields.coordinates).toMatchObject({
      type: 'type',
      id: 'coordinates',
      label: 'Please Pin Your Exact Location',
      value: '',
      required: true,
      isAddress: true,
      autoComplete: '',
    });
    expect(fields.coordinates.validator).toBeDefined();

    // Check address_name field
    expect(fields.address_name).toMatchObject({
      type: 'type',
      id: 'address_name',
      label: 'Address Name',
      value: '',
      required: true,
    });
    expect(fields.address_name.validator).toBeDefined();
  });

  it('should have correct initial values when no selected address', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    const { initialValues } = result.current;

    expect(initialValues).toEqual({
      provinceAddress: '',
      addressLine: '',
      cityAddress: '',
      barangayAddress: '',
      postalCode: '',
      landmark: '',
      coordinates: '',
      address_name: '',
    });
  });

  it('should have correct initial values when selected address is provided', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(mockSelectedShippingAddress));
    const { initialValues } = result.current;

    expect(initialValues).toEqual({
      provinceAddress: 'California',
      addressLine: '123 Main St',
      cityAddress: 'Los Angeles',
      barangayAddress: 'Downtown',
      postalCode: '90210',
      landmark: 'Near Mall',
      coordinates: JSON.stringify({
        lat: 34.0522,
        lng: -118.2437,
      }),
      address_name: 'Home',
    });
  });

  it('should have schema with validation functions', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    const { schema } = result.current;

    expect(schema).toBeDefined();
    expect(typeof schema.validate).toBe('function');
    expect(typeof schema.validateSync).toBe('function');
    expect(typeof schema.isValid).toBe('function');
  });

  it('should have getFormPayload function that transforms form values correctly', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    const { getFormPayload } = result.current;

    const formValues = {
      address_name: 'Test Address',
      addressLine: '456 Test St',
      provinceAddress: 'Test Province',
      cityAddress: 'Test City',
      barangayAddress: 'Test Barangay',
      postalCode: '12345',
      landmark: 'Test Landmark',
      coordinates: JSON.stringify({ lat: 40.7128, lng: -74.0060 }),
    };

    const payload = getFormPayload(formValues);

    expect(payload).toEqual({
      address_name: 'Test Address',
      additional_address: '456 Test St',
      province: { id: '', name: 'Test Province' },
      city: { id: '', name: 'Test City' },
      barangay: { id: '', name: 'Test Barangay' },
      zip_code: 12345,
      landmark: 'Test Landmark',
      coordinates: { lat: 40.7128, long: -74.0060 },
    });
  });

  it('should include id in payload when selected address is provided', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(mockSelectedShippingAddress));
    const { getFormPayload } = result.current;

    const formValues = {
      address_name: 'Updated Address',
      addressLine: '789 Updated St',
      provinceAddress: 'Updated Province',
      cityAddress: 'Updated City',
      barangayAddress: 'Updated Barangay',
      postalCode: '54321',
      landmark: 'Updated Landmark',
      coordinates: JSON.stringify({ lat: 41.8781, lng: -87.6298 }),
    };

    const payload = getFormPayload(formValues);

    expect(payload).toEqual({
      id: 'address-1',
      address_name: 'Updated Address',
      additional_address: '789 Updated St',
      province: { id: '', name: 'Updated Province' },
      city: { id: '', name: 'Updated City' },
      barangay: { id: '', name: 'Updated Barangay' },
      zip_code: 54321,
      landmark: 'Updated Landmark',
      coordinates: { lat: 41.8781, long: -87.6298 },
    });
  });

  it('should handle empty coordinates gracefully', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    const { getFormPayload } = result.current;

    const formValues = {
      address_name: 'Test Address',
      addressLine: '456 Test St',
      provinceAddress: 'Test Province',
      cityAddress: 'Test City',
      barangayAddress: 'Test Barangay',
      postalCode: '12345',
      landmark: 'Test Landmark',
      coordinates: '{}', // Empty coordinates object
    };

    expect(() => getFormPayload(formValues)).not.toThrow();
  });

  it('should have required fields marked as required', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    const { fields } = result.current;

    const requiredFields = [
      'provinceAddress',
      'addressLine',
      'cityAddress',
      'barangayAddress',
      'postalCode',
      'coordinates',
      'address_name',
    ];
    
    requiredFields.forEach(fieldName => {
      expect(fields[fieldName].required).toBe(true);
    });
  });

  it('should have optional fields marked as not required', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    const { fields } = result.current;

    expect(fields.landmark.required).toBe(false);
  });

  it('should have correct field types', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    const { fields } = result.current;

    expect(fields.provinceAddress.type).toBe('text');
    expect(fields.addressLine.type).toBe('text');
    expect(fields.cityAddress.type).toBe('text');
    expect(fields.barangayAddress.type).toBe('text');
    expect(fields.postalCode.type).toBe('text');
    expect(fields.landmark.type).toBe('text');
    expect(fields.coordinates.type).toBe('type');
    expect(fields.address_name.type).toBe('type');
  });

  it('should have correct field labels', () => {
    const { result } = renderHook(() => useMultipleShippingAddress(null));
    const { fields } = result.current;

    expect(fields.provinceAddress.label).toBe('State / Province');
    expect(fields.addressLine.label).toBe('Address Line');
    expect(fields.cityAddress.label).toBe('City / Town');
    expect(fields.barangayAddress.label).toBe('Barangay');
    expect(fields.postalCode.label).toBe('Zip Code');
    expect(fields.landmark.label).toBe('Landmark');
    expect(fields.coordinates.label).toBe('Please Pin Your Exact Location');
    expect(fields.address_name.label).toBe('Address Name');
  });

  it('should return consistent results on multiple calls', () => {
    const { result: result1 } = renderHook(() => useMultipleShippingAddress(null));
    const { result: result2 } = renderHook(() => useMultipleShippingAddress(null));

    // Compare field properties (excluding validator functions)
    Object.keys(result1.current.fields).forEach(fieldName => {
      const field1 = result1.current.fields[fieldName];
      const field2 = result2.current.fields[fieldName];
      
      expect(field1.type).toBe(field2.type);
      expect(field1.id).toBe(field2.id);
      expect(field1.label).toBe(field2.label);
      expect(field1.value).toBe(field2.value);
      expect(field1.required).toBe(field2.required);
      expect(field1.placeholder).toBe(field2.placeholder);
    });
    
    expect(result1.current.initialValues).toEqual(result2.current.initialValues);
  });
});
