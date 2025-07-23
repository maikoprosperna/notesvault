/* eslint-disable */
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAddNewPageForm } from '../useAddNewPageForm';

// Mock the validator import
vi.mock('../../../components/BootstrapFormik/CustomFormsValidators/CustomValidators', () => ({
  REQUIRED_VALIDATOR: 'required',
}));

describe('useAddNewPageForm', () => {
  it('returns fields, schema, and initialValues', () => {
    const data = {
      page_name: 'Test Page',
      slug: 'test-page',
      page_seo: {
        google: { meta_image: 'gimg', meta_title: 'gtitle', meta_description: 'gdesc' },
        facebook: { meta_image: 'fimg', meta_title: 'ftitle', meta_description: 'fdesc' },
        twitter: { meta_image: 'timg', meta_title: 'ttitle', meta_description: 'tdesc' },
      },
      theme: 'modern',
    };
    const { result } = renderHook(() => useAddNewPageForm(data));
    expect(result.current.fields).toBeDefined();
    expect(result.current.schema).toBeDefined();
    expect(result.current.initialValues).toBeDefined();
    expect(result.current.fields.page_name.value).toBe('Test Page');
    expect(result.current.fields.page_slug.value).toBe('test-page');
    expect(result.current.fields.google_meta_image.value).toBe('gimg');
    expect(result.current.fields.theme_selection.value).toBe('modern');
  });

  it('returns default values if no data is provided', () => {
    const { result } = renderHook(() => useAddNewPageForm(undefined));
    expect(result.current.fields.page_name.value).toBe('');
    expect(result.current.fields.theme_selection.value).toBe('blank');
  });
});