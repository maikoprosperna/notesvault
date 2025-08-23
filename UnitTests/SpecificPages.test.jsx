/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock react-bootstrap Form.Check
vi.mock('react-bootstrap', async () => {
  const actual = await vi.importActual('react-bootstrap');
  return {
    ...actual,
    Form: {
      ...actual.Form,
      Check: ({ checked, label, onChange, ...props }) => (
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            data-testid="checkbox"
            {...props}
          />
          {label}
        </label>
      ),
    },
  };
});

const defaultFields = {
  selected_pages: { id: 'selected_pages' },
};

const defaultValues = {
  selected_pages: [],
};

describe('SpecificPages', () => {
  let setFieldValue;
  beforeEach(() => {
    setFieldValue = vi.fn();
  });

  it('renders with label and unchecked state', () => {
    const { container } = render(
      <SpecificPages
        id={1}
        label="Page 1"
        slug="page-1"
        fields={defaultFields}
        setFieldValue={setFieldValue}
        values={defaultValues}
      />
    );
    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox')).not.toBeChecked();
  });

  it('renders as checked if page is in selected_pages', () => {
    const values = {
      selected_pages: [{ page_id: 1, slug: 'page-1', page_name: 'Page 1' }],
    };
    render(
      <SpecificPages
        id={1}
        label="Page 1"
        slug="page-1"
        fields={defaultFields}
        setFieldValue={setFieldValue}
        values={values}
      />
    );
    expect(screen.getByTestId('checkbox')).toBeChecked();
  });

  it('calls setFieldValue to add page when checked', () => {
    render(
      <SpecificPages
        id={2}
        label="Page 2"
        slug="page-2"
        fields={defaultFields}
        setFieldValue={setFieldValue}
        values={defaultValues}
      />
    );
    fireEvent.click(screen.getByTestId('checkbox'));
    expect(setFieldValue).toHaveBeenCalledWith('selected_pages', [
      { page_id: 2, slug: 'page-2', page_name: 'Page 2' },
    ]);
  });

  it('calls setFieldValue to remove page when unchecked', () => {
    const values = {
      selected_pages: [
        { page_id: 3, slug: 'page-3', page_name: 'Page 3' },
      ],
    };
    render(
      <SpecificPages
        id={3}
        label="Page 3"
        slug="page-3"
        fields={defaultFields}
        setFieldValue={setFieldValue}
        values={values}
      />
    );
    fireEvent.click(screen.getByTestId('checkbox'));
    expect(setFieldValue).toHaveBeenCalledWith('selected_pages', []);
  });
});

import SpecificPages from '../components/SpecificPages';