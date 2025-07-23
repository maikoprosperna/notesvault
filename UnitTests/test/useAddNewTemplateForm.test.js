/* eslint-disable */
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAddNewTemplateForm } from '../useAddNewTemplateForm';

// Mock the validator import
vi.mock('../../../components/BootstrapFormik/CustomFormsValidators/CustomValidators', () => ({
  REQUIRED_VALIDATOR: 'required',
}));

describe('useAddNewTemplateForm', () => {
  it('returns fields, schema, and initialValues', () => {
    const data = {
      template_name: 'Test Template',
      template_type: 'Header',
      page_applied: 'home',
      selected_pages: ['home', 'about'],
    };
    const { result } = renderHook(() => useAddNewTemplateForm(data));
    expect(result.current.fields).toBeDefined();
    expect(result.current.schema).toBeDefined();
    expect(result.current.initialValues).toBeDefined();
    expect(result.current.fields.template_name.value).toBe('Test Template');
    expect(result.current.fields.template_type.value).toBe('Header');
    expect(result.current.fields.page_applied.value).toBe('home');
    expect(result.current.fields.selected_pages.value).toEqual(['home', 'about']);
  });

  it('returns default values if no data is provided', () => {
    const { result } = renderHook(() => useAddNewTemplateForm(undefined));
    expect(result.current.fields.template_name.value).toBe('');
    expect(result.current.fields.template_type.value).toBe('Footer');
    expect(result.current.fields.selected_pages.value).toEqual([]);
  });
});