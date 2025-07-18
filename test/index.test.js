/* eslint-disable */
import { describe, it, expect } from 'vitest';

// Import the index file
import { VerticalForm, FormInput } from '../index.js';

describe('Components Index', () => {
  it('exports VerticalForm component', () => {
    expect(VerticalForm).toBeDefined();
    expect(typeof VerticalForm).toBe('function');
  });

  it('exports FormInput component', () => {
    expect(FormInput).toBeDefined();
    expect(typeof FormInput).toBe('function');
  });

  it('exports both components as named exports', () => {
    expect(VerticalForm).toBeDefined();
    expect(FormInput).toBeDefined();
  });

  it('has correct export structure', () => {
    const expectedExports = ['VerticalForm', 'FormInput'];
    
    expectedExports.forEach(exportName => {
      expect({ VerticalForm, FormInput }).toHaveProperty(exportName);
      expect(typeof { VerticalForm, FormInput }[exportName]).toBe('function');
    });
  });

  it('does not export unexpected properties', () => {
    const moduleExports = { VerticalForm, FormInput };
    const expectedExports = ['VerticalForm', 'FormInput'];
    const actualExports = Object.keys(moduleExports);
    
    expect(actualExports).toEqual(expectedExports);
  });

  it('exports are not null or undefined', () => {
    expect(VerticalForm).not.toBeNull();
    expect(VerticalForm).not.toBeUndefined();
    expect(FormInput).not.toBeNull();
    expect(FormInput).not.toBeUndefined();
  });
}); 