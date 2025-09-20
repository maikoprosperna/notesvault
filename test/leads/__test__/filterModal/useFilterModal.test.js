/* eslint-disable */
import React from 'react';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useFilterModal } from '../../filterModal/useFilterModal';

describe('useFilterModal', () => {
  it('should return fields with correct structure', () => {
    const { result } = renderHook(() => useFilterModal([]));

    expect(result.current.fields).toBeDefined();
    expect(result.current.fields.source_scope).toBeDefined();
    expect(result.current.fields.source).toBeDefined();
    expect(result.current.fields.customer_type).toBeDefined();
  });

  it('should have correct field configurations', () => {
    const { result } = renderHook(() => useFilterModal([]));

    const { fields } = result.current;

    // Test source_scope field
    expect(fields.source_scope).toEqual({
      type: 'text',
      id: 'source_scope',
      label: 'Source Scope',
      value: '',
      validator: '',
      required: false,
      placeholder: '',
      options: [
        { value: 'is', label: 'Is' },
        { value: 'is_not', label: 'Is Not' },
      ],
    });

    // Test source field
    expect(fields.source).toEqual({
      type: 'text',
      id: 'source',
      label: 'Source',
      value: '',
      validator: '',
      required: false,
      placeholder: '',
      options: [
        { value: 'facebook', label: 'Facebook' },
        { value: 'guest_checkout', label: 'Guest Checkout' },
        { value: 'google', label: 'Google' },
        { value: 'store', label: 'Store' },
      ],
    });

    // Test customer_type field
    expect(fields.customer_type).toEqual({
      type: 'text',
      id: 'customer_type',
      label: 'Customer Type',
      value: '',
      validator: '',
      required: false,
      placeholder: '',
      options: [
        { value: 'individual', label: 'Individual' },
        { value: 'wholesale', label: 'Wholesaler' },
      ],
    });
  });

  it('should have correct initial values', () => {
    const { result } = renderHook(() => useFilterModal([]));

    const { initialValues } = result.current;

    expect(initialValues).toEqual({
      source_scope: '',
      source: '',
      customer_type: '',
      is_tags: [],
      is_not_tags: [],
      order_slider: [0, 0],
      amount_slider: [0, 0],
      created_date_from: '',
      created_date_to: '',
      order_date_from: '',
      order_date_to: '',
      email_contact_date_from: '',
      email_contact_date_to: '',
      email_not_contacted: false,
    });
  });

  it('should have correct schema validation', () => {
    const { result } = renderHook(() => useFilterModal([]));

    const { schema } = result.current;

    expect(schema).toBeDefined();
    expect(typeof schema.validate).toBe('function');
  });

  it('should return consistent results on multiple calls', () => {
    const { result: result1 } = renderHook(() => useFilterModal([]));
    const { result: result2 } = renderHook(() => useFilterModal([]));

    expect(result1.current.fields).toEqual(result2.current.fields);
    expect(result1.current.initialValues).toEqual(result2.current.initialValues);
  });

  it('should handle different selectedFilter inputs', () => {
    const selectedFilter1 = [];
    const selectedFilter2 = [{ label: 'No. of Orders', value: 'orders' }];

    const { result: result1 } = renderHook(() => useFilterModal(selectedFilter1));
    const { result: result2 } = renderHook(() => useFilterModal(selectedFilter2));

    // Both should return the same structure regardless of selectedFilter
    expect(result1.current.fields).toBeDefined();
    expect(result2.current.fields).toBeDefined();
    expect(result1.current.initialValues).toEqual(result2.current.initialValues);
  });
});
