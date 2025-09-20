/* eslint-disable */
import React from 'react';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useEmail } from '../../emailModal/useEmail';

describe('useEmail', () => {
  it('should return emailSender with correct structure', () => {
    const { result } = renderHook(() => useEmail());

    expect(result.current.emailSender).toBeDefined();
    expect(result.current.emailSender.fields).toBeDefined();
    expect(result.current.emailSender.initialValues).toBeDefined();
    expect(result.current.emailSender.schema).toBeDefined();
  });

  it('should have correct field configurations', () => {
    const { result } = renderHook(() => useEmail());

    const { fields } = result.current.emailSender;

    // Test 'to' field
    expect(fields.to).toEqual({
      type: 'text',
      id: 'to',
      label: 'To',
      value: '',
      validator: expect.any(Object),
      required: true,
      placeholder: '',
    });

    // Test 'subject' field
    expect(fields.subject).toEqual({
      type: 'text',
      id: 'subject',
      label: 'Subject',
      value: '',
      validator: expect.any(Object),
      required: true,
      placeholder: '',
    });

    // Test 'main_body' field
    expect(fields.main_body).toEqual({
      type: 'text',
      id: 'main_body',
      label: '',
      value: '',
      validator: expect.any(Object),
      required: true,
      placeholder: '',
    });

    // Test 'bcc' field
    expect(fields.bcc).toEqual({
      type: 'text',
      id: 'bcc',
      label: 'BCC',
      value: '',
      validator: '',
      required: false,
      placeholder: '',
    });

    // Test 'cc' field
    expect(fields.cc).toEqual({
      type: 'text',
      id: 'cc',
      label: 'CC',
      value: '',
      required: false,
      placeholder: '',
    });
  });

  it('should have correct initial values', () => {
    const { result } = renderHook(() => useEmail());

    const { initialValues } = result.current.emailSender;

    expect(initialValues).toEqual({
      to: '',
      subject: '',
      main_body: '',
      bcc: '',
      cc: '',
    });
  });

  it('should have correct schema validation', () => {
    const { result } = renderHook(() => useEmail());

    const { schema } = result.current.emailSender;

    expect(schema).toBeDefined();
    expect(typeof schema.validate).toBe('function');
  });

  it('should return validators for required fields', () => {
    const { result } = renderHook(() => useEmail());

    const { fields } = result.current.emailSender;

    expect(fields.to.validator).toBeDefined();
    expect(fields.subject.validator).toBeDefined();
    expect(fields.main_body.validator).toBeDefined();
  });
});