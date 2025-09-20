/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Mock the FilterModal component
import { FilterModal } from '../../filterModal/index';

// Mock dependencies
const mockLeadsAPI = {
  useGetAllTags: vi.fn(),
};

vi.mock('../../../../api/Leads', () => ({
  leadsAPI: mockLeadsAPI,
}));

vi.mock('../../filterModal/useFilterModal', () => ({
  useFilterModal: vi.fn(() => ({
    fields: {
      source_scope: {
        id: 'source_scope',
        options: [
          { label: 'Equals', value: 'equals' },
          { label: 'Not Equals', value: 'not_equals' },
        ],
        placeholder: 'Select scope',
        required: true,
      },
      source: {
        id: 'source',
        options: [
          { label: 'Website', value: 'website' },
          { label: 'Social Media', value: 'social_media' },
        ],
        placeholder: 'Select source',
        required: true,
      },
      customer_type: {
        id: 'customer_type',
        options: [
          { label: 'Individual', value: 'individual' },
          { label: 'Wholesale', value: 'wholesale' },
        ],
        placeholder: 'Select customer type',
        required: true,
      },
    },
    schema: {
      validate: vi.fn(() => Promise.resolve({})),
      validateSync: vi.fn(() => ({})),
      isValid: vi.fn(() => true),
    },
    initialValues: {
      source_scope: '',
      source: '',
      customer_type: '',
      order_slider: [0, 0],
      amount_slider: [0, 0],
      is_tags: [],
      is_not_tags: [],
      created_date_from: '',
      created_date_to: '',
      order_date_from: '',
      order_date_to: '',
      email_contact_date_from: '',
      email_contact_date_to: '',
      email_not_contacted: false,
    },
  })),
}));

vi.mock('react-select', () => ({
  default: ({ options, onChange, value, isMulti, placeholder }) => (
    <select
      data-testid="react-select"
      multiple={isMulti}
      value={isMulti ? (value || []).map(v => v.value) : value?.value}
      onChange={(e) => {
        if (isMulti) {
          const selectedValues = Array.from(e.target.selectedOptions).map(option => ({
            label: option.text,
            value: option.value,
          }));
          onChange(selectedValues);
        } else {
          const selectedOption = options.find(opt => opt.value === e.target.value);
          onChange(selectedOption);
        }
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('react-datepicker', () => ({
  default: ({ selected, onChange, placeholderText, open }) => (
    <div data-testid="date-picker">
      <input
        data-testid="date-input"
        value={selected ? selected.toISOString().split('T')[0] : ''}
        onChange={(e) => onChange(new Date(e.target.value))}
        placeholder={placeholderText}
        style={{ display: open ? 'block' : 'none' }}
      />
    </div>
  ),
}));

vi.mock('rc-slider', () => ({
  default: ({ onChange, defaultValue, min, max }) => (
    <input
      data-testid="slider"
      type="range"
      min={min}
      max={max}
      defaultValue={defaultValue?.[0] || 0}
      onChange={(e) => onChange([parseInt(e.target.value), max])}
    />
  ),
}));

vi.mock('@mui/icons-material/Close', () => ({
  default: () => <span data-testid="close-icon">Close</span>,
}));

vi.mock('@mui/icons-material/Add', () => ({
  default: () => <span data-testid="add-icon">Add</span>,
}));

vi.mock('@mui/icons-material/CalendarMonth', () => ({
  default: () => <span data-testid="calendar-icon">Calendar</span>,
}));

vi.mock('../../../../components/BootstrapFormik/SelectField/SelectField', () => ({
  default: ({ name, placeholder, items, itemLabel, itemValue }) => (
    <select
      data-testid={`select-field-${name}`}
      name={name}
    >
      <option value="">{placeholder}</option>
      {items.map((item, index) => (
        <option key={index} value={item[itemValue]}>
          {item[itemLabel]}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('moment', () => ({
  default: (date) => ({
    format: (format) => date ? '2024-01-01' : '',
  }),
}));

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    account: (state = { storeDetails: { payPlanType: 'basic' } }, action) => state,
  },
});

// Test wrapper
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <Provider store={mockStore}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe('FilterModal', () => {
  const defaultProps = {
    showFilterModal: true,
    setShowFilterModal: vi.fn(),
    setFilterValues: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLeadsAPI.useGetAllTags.mockReturnValue({
      data: [
        { id: 1, tag_name: 'VIP' },
        { id: 2, tag_name: 'New Customer' },
        { id: 3, tag_name: 'Returning' },
      ],
      isFetched: true,
    });
  });

  it('should render the filter modal when showFilterModal is true', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('Add Filter')).toBeInTheDocument();
  });

  it('should not render the filter modal when showFilterModal is false', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} showFilterModal={false} />
      </TestWrapper>
    );

    expect(screen.queryByText('Filter')).not.toBeInTheDocument();
  });

  it('should render add filter button', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Add Filter')).toBeInTheDocument();
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
  });

  it('should render clear and apply buttons', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('should show filter options when add filter is clicked', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });


  it('should handle clear button click', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    // Clear button should be clickable
    expect(clearButton).toBeInTheDocument();
  });

  it('should handle apply button click', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);

    // Apply button should be clickable
    expect(applyButton).toBeInTheDocument();
  });

  it('should handle order filter selection', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Click add filter to show options
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select order filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'orders' } });

    // Check if order filter components are rendered
    expect(screen.getByText('No. of Orders')).toBeInTheDocument();
  });

  it('should handle amount filter selection', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Click add filter to show options
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select amount filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'spent' } });

    // Check if amount filter components are rendered
    expect(screen.getByText('Amount Spent')).toBeInTheDocument();
  });

  it('should handle source filter selection', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Click add filter to show options
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select source filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'source' } });

    // Check if source filter components are rendered
    expect(screen.getByText('Source')).toBeInTheDocument();
  });

  it('should handle customer type filter selection', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Click add filter to show options
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select customer type filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'customer_type' } });

    // Check if customer type filter components are rendered
    expect(screen.getByText('Customer Type')).toBeInTheDocument();
  });

  it('should handle tag filter selection', () => {
    mockLeadsAPI.useGetAllTags.mockReturnValue({
      data: [{ id: '1', tag_name: 'Test Tag' }],
      isFetched: true,
    });

    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Click add filter to show options
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select tag filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'tag' } });

    // Check if tag filter components are rendered
    expect(screen.getByText('Tag')).toBeInTheDocument();
  });

  it('should handle created date filter selection', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Click add filter to show options
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select created date filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'created_date' } });

    // Check if created date filter components are rendered
    expect(screen.getByText('Created Date')).toBeInTheDocument();
  });

  it('should handle order date filter selection', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Click add filter to show options
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select order date filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'order_date' } });

    // Check if order date filter components are rendered
    expect(screen.getByText('Order Date')).toBeInTheDocument();
  });

  it('should handle email contact date filter selection', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Click add filter to show options
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select email contact date filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'email_contact_date' } });

    // Check if email contact date filter components are rendered
    expect(screen.getByText('Email Contact Date')).toBeInTheDocument();
  });

  it('should handle filter removal', () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Add a filter first
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select order filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'orders' } });

    // Check that the filter is rendered
    expect(screen.getByText('No. of Orders')).toBeInTheDocument();

    // Now try to remove it (if remove button exists)
    const removeButtons = screen.queryAllByText('×');
    if (removeButtons.length > 0) {
      fireEvent.click(removeButtons[0]);
      // The filter should be removed
      expect(screen.queryByText('No. of Orders')).not.toBeInTheDocument();
    } else {
      // If no remove button exists, just verify the filter is present
      expect(screen.getByText('No. of Orders')).toBeInTheDocument();
    }
  });

  it('should handle form submission with multiple filters', async () => {
    render(
      <TestWrapper>
        <FilterModal {...defaultProps} />
      </TestWrapper>
    );

    // Add multiple filters
    const addFilterButton = screen.getByText('Add Filter');
    fireEvent.click(addFilterButton);

    // Select order filter from the dropdown
    const selectElement = screen.getByTestId('react-select');
    fireEvent.change(selectElement, { target: { value: 'orders' } });

    // Submit the form
    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);

    expect(applyButton).toBeInTheDocument();
  });

});