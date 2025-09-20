/* eslint-disable */
import React from 'react';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useTagsModal } from '../useTagsModal';

describe('useTagsModal', () => {
  it('should return fields with correct structure', () => {
    const { result } = renderHook(() => useTagsModal());

    expect(result.current.fields).toBeDefined();
    expect(result.current.schema).toBeDefined();
    expect(result.current.initialValues).toBeDefined();
  });

  it('should have correct field configuration for tag field', () => {
    const { result } = renderHook(() => useTagsModal());

    const { fields } = result.current;

    expect(fields.tag).toEqual({
      type: 'text',
      id: 'tags',
      label: 'Tags',
      value: '',
      validator: expect.any(Object),
      required: false,
      placeholder: '',
    });
  });

  it('should have correct initial values', () => {
    const { result } = renderHook(() => useTagsModal());

    const { initialValues } = result.current;

    expect(initialValues).toEqual({
      tag: '',
    });
  });

  it('should have correct schema validation', () => {
    const { result } = renderHook(() => useTagsModal());

    const { schema } = result.current;

    expect(schema).toBeDefined();
    expect(typeof schema.validate).toBe('function');
    expect(typeof schema.validateSync).toBe('function');
    expect(typeof schema.isValid).toBe('function');
  });

  it('should return validators for the tag field', () => {
    const { result } = renderHook(() => useTagsModal());

    const { fields } = result.current;

    expect(fields.tag.validator).toBeDefined();
    expect(typeof fields.tag.validator).toBe('object');
  });

  it('should have tag field as not required', () => {
    const { result } = renderHook(() => useTagsModal());

    const { fields } = result.current;

    expect(fields.tag.required).toBe(false);
  });

  it('should have correct field type', () => {
    const { result } = renderHook(() => useTagsModal());

    const { fields } = result.current;

    expect(fields.tag.type).toBe('text');
  });

  it('should have correct field id', () => {
    const { result } = renderHook(() => useTagsModal());

    const { fields } = result.current;

    expect(fields.tag.id).toBe('tags');
  });

  it('should have correct field label', () => {
    const { result } = renderHook(() => useTagsModal());

    const { fields } = result.current;

    expect(fields.tag.label).toBe('Tags');
  });

  it('should have empty placeholder', () => {
    const { result } = renderHook(() => useTagsModal());

    const { fields } = result.current;

    expect(fields.tag.placeholder).toBe('');
  });

  it('should return consistent results on multiple calls', () => {
    const { result: result1 } = renderHook(() => useTagsModal());
    const { result: result2 } = renderHook(() => useTagsModal());

    expect(result1.current.fields).toEqual(result2.current.fields);
    expect(result1.current.initialValues).toEqual(result2.current.initialValues);
    expect(result1.current.schema).toBeDefined();
    expect(result2.current.schema).toBeDefined();
  });

  it('should have schema that can validate empty string', async () => {
    const { result } = renderHook(() => useTagsModal());

    const { schema } = result.current;

    // Test with empty string (should be valid since required is false)
    const validationResult = await schema.validate({ tag: '' });
    expect(validationResult).toEqual({ tag: '' });
  });

  it('should have schema that can validate non-empty string', async () => {
    const { result } = renderHook(() => useTagsModal());

    const { schema } = result.current;

    // Test with non-empty string
    const validationResult = await schema.validate({ tag: 'test tag' });
    expect(validationResult).toEqual({ tag: 'test tag' });
  });

  it('should have schema that can validate undefined value', async () => {
    const { result } = renderHook(() => useTagsModal());

    const { schema } = result.current;

    // Test with undefined (should be valid since required is false)
    const validationResult = await schema.validate({ tag: undefined });
    expect(validationResult).toEqual({ tag: undefined });
  });

  it('should return object with all required properties', () => {
    const { result } = renderHook(() => useTagsModal());

    const hookResult = result.current;

    expect(hookResult).toHaveProperty('fields');
    expect(hookResult).toHaveProperty('schema');
    expect(hookResult).toHaveProperty('initialValues');
  });

  it('should have fields object with correct structure', () => {
    const { result } = renderHook(() => useTagsModal());

    const { fields } = result.current;

    expect(fields).toHaveProperty('tag');
    expect(typeof fields.tag).toBe('object');
    expect(fields.tag).toHaveProperty('type');
    expect(fields.tag).toHaveProperty('id');
    expect(fields.tag).toHaveProperty('label');
    expect(fields.tag).toHaveProperty('value');
    expect(fields.tag).toHaveProperty('validator');
    expect(fields.tag).toHaveProperty('required');
    expect(fields.tag).toHaveProperty('placeholder');
  });
});