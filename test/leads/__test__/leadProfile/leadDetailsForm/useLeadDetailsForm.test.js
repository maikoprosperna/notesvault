/* eslint-disable */
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the hook
import { useLeadDetailsForm } from '../../../leadProfile/leadDetailsForm/useLeadDetailsForm';

describe('useLeadDetailsForm', () => {
  it('should return fields with correct structure', () => {
    const { result } = renderHook(() => useLeadDetailsForm());
    
    expect(result.current.fields).toBeDefined();
    expect(result.current.schema).toBeDefined();
    expect(result.current.initialValues).toBeDefined();
  });

  it('should have correct field configurations', () => {
    const { result } = renderHook(() => useLeadDetailsForm());
    const { fields } = result.current;

    // Check first_name field
    expect(fields.first_name).toMatchObject({
      type: 'text',
      id: 'first_name',
      label: 'First Name',
      value: '',
      required: true,
      placeholder: '',
    });
    expect(fields.first_name.validator).toBeDefined();

    // Check last_name field
    expect(fields.last_name).toMatchObject({
      type: 'text',
      id: 'last_name',
      label: 'Last Name',
      value: '',
      required: true,
      placeholder: '',
    });
    expect(fields.last_name.validator).toBeDefined();

    // Check email field
    expect(fields.email).toMatchObject({
      type: 'email',
      id: 'email',
      label: 'Email',
      value: '',
      required: true,
      placeholder: '',
    });
    expect(fields.email.validator).toBeDefined();

    // Check mobile_number field
    expect(fields.mobile_number).toMatchObject({
      type: 'text',
      id: 'mobile_number',
      label: 'Mobile Number',
      value: '',
      required: true,
      placeholder: '',
    });
    expect(fields.mobile_number.validator).toBeDefined();

    // Check customer_type field
    expect(fields.customer_type).toMatchObject({
      type: 'checkbox',
      id: 'customer_type',
      label: 'Customer Type',
      value: 'individual',
      required: false,
      placeholder: '',
    });
    expect(fields.customer_type.validator).toBeDefined();
  });

  it('should have correct initial values', () => {
    const { result } = renderHook(() => useLeadDetailsForm());
    const { initialValues } = result.current;

    expect(initialValues).toEqual({
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      additional_address: '',
      provinceAddress: '',
      cityAddress: '',
      barangayAddress: '',
      postalCode: 0,
      landmark: '',
      customer_type: 'individual',
    });
  });

  it('should have schema with validation functions', () => {
    const { result } = renderHook(() => useLeadDetailsForm());
    const { schema } = result.current;

    expect(schema).toBeDefined();
    expect(typeof schema.validate).toBe('function');
    expect(typeof schema.validateSync).toBe('function');
    expect(typeof schema.isValid).toBe('function');
  });

  it('should have required fields marked as required', () => {
    const { result } = renderHook(() => useLeadDetailsForm());
    const { fields } = result.current;

    const requiredFields = ['first_name', 'last_name', 'email', 'mobile_number'];
    
    requiredFields.forEach(fieldName => {
      expect(fields[fieldName].required).toBe(true);
    });
  });

  it('should have optional fields marked as not required', () => {
    const { result } = renderHook(() => useLeadDetailsForm());
    const { fields } = result.current;

    expect(fields.landmark.required).toBe(false);
    expect(fields.customer_type.required).toBe(false);
  });

  it('should have correct field types', () => {
    const { result } = renderHook(() => useLeadDetailsForm());
    const { fields } = result.current;

    expect(fields.first_name.type).toBe('text');
    expect(fields.last_name.type).toBe('text');
    expect(fields.email.type).toBe('email');
    expect(fields.mobile_number.type).toBe('text');
    expect(fields.customer_type.type).toBe('checkbox');
  });

  it('should have correct field labels', () => {
    const { result } = renderHook(() => useLeadDetailsForm());
    const { fields } = result.current;

    expect(fields.first_name.label).toBe('First Name');
    expect(fields.last_name.label).toBe('Last Name');
    expect(fields.email.label).toBe('Email');
    expect(fields.mobile_number.label).toBe('Mobile Number');
    expect(fields.customer_type.label).toBe('Customer Type');
  });

  it('should have correct field IDs', () => {
    const { result } = renderHook(() => useLeadDetailsForm());
    const { fields } = result.current;

    expect(fields.first_name.id).toBe('first_name');
    expect(fields.last_name.id).toBe('last_name');
    expect(fields.email.id).toBe('email');
    expect(fields.mobile_number.id).toBe('mobile_number');
    expect(fields.customer_type.id).toBe('customer_type');
  });

  it('should return consistent results on multiple calls', () => {
    const { result: result1 } = renderHook(() => useLeadDetailsForm());
    const { result: result2 } = renderHook(() => useLeadDetailsForm());

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