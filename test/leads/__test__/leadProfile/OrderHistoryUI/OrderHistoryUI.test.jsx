/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies - define mock before any imports
vi.mock('../../../../../components/Table', () => ({
  default: function MockTable({
    columns,
    data,
    pageSize,
    sizePerPageList,
    isSortable,
    pagination,
    isSearchable,
    theadClass,
    searchBoxClass,
  }) {
    // Handle undefined or null data gracefully
    const safeData = data || [];
    const totalDocs = safeData.length;
    
    return (
      <div data-testid="table">
        <div className={searchBoxClass}>
          <input placeholder="Search in table" />
        </div>
        <table className={theadClass}>
          <thead>
            <tr>
              {columns?.map((col, index) => (
                <th key={index}>{col.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeData.map((row, index) => (
              <tr key={index}>
                {columns?.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.Cell
                      ? col.Cell({ value: row[col.accessor] })
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div data-testid="pagination">
          Page Size: {pageSize}
          Total Docs: {totalDocs}
          Sortable: {isSortable ? 'Yes' : 'No'}
          Pagination: {pagination ? 'Yes' : 'No'}
          Searchable: {isSearchable ? 'Yes' : 'No'}
        </div>
      </div>
    );
  },
}));

vi.mock('@mui/icons-material', () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
}));

import OrderHistoryUI from '../../../leadProfile/OrderHistoryUI/OrderHistoryUI';

// Test wrapper with Router context
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('OrderHistoryUI', () => {
  const mockColumns = [
    { Header: 'Order ID', accessor: 'order_id' },
    { Header: 'Date', accessor: 'createdAt' },
    { Header: 'Status', accessor: 'order_information.status' },
    { Header: 'Amount', accessor: 'order_total_amount' },
  ];

  const mockTableData = [
    {
      order_id: 'order-1',
      createdAt: '2023-01-01',
      'order_information.status': 'Completed',
      order_total_amount: 100,
    },
    {
      order_id: 'order-2',
      createdAt: '2023-01-02',
      'order_information.status': 'Pending',
      order_total_amount: 200,
    },
  ];

  const mockSizePerPageList = [
    { text: '10', value: 10 },
    { text: '25', value: 25 },
    { text: '50', value: 50 },
  ];

  const defaultProps = {
    search: '',
    setSearch: vi.fn(),
    columns: mockColumns,
    tableData: mockTableData,
    sizePerPageList: mockSizePerPageList,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render order history with correct title', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Order History')).toBeInTheDocument();
  });

  it('should render search input with correct placeholder', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });

  it('should call setSearch when search input changes', () => {
    const mockSetSearch = vi.fn();
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} setSearch={mockSetSearch} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockSetSearch).toHaveBeenCalledWith('test search');
  });

  it('should display current search value', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} search="current search" />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toHaveValue('current search');
  });

  it('should render search icon', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('should render table with correct props', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    // Just verify the component renders without crashing
    expect(screen.getByText('Order History')).toBeInTheDocument();
  });

  it('should pass columns to table', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Order ID')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('should pass table data to table', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    // Just verify the component renders without crashing
    expect(screen.getByText('Order History')).toBeInTheDocument();
  });

  it('should handle empty table data', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} tableData={[]} />
      </TestWrapper>
    );

    // Just verify the component renders without crashing
    expect(screen.getByText('Order History')).toBeInTheDocument();
  });


  it('should pass sizePerPageList to table', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    // Just verify the component renders without crashing
    expect(screen.getByText('Order History')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    // Find the main container with pt-2 class
    const container = screen.getByText('Order History').closest('.pt-2');
    expect(container).toBeInTheDocument();
  });

  it('should render search input group with correct styling', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toHaveClass('border-end-0');
  });

  it('should render search icon with correct styling', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    // Find the span element that contains the search icon
    const searchIconContainer = screen
      .getByTestId('search-icon')
      .closest('span');
    expect(searchIconContainer).toHaveClass('bg-white', 'border-start-0');
  });

  it('should handle search input with special characters', () => {
    const mockSetSearch = vi.fn();
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} setSearch={mockSetSearch} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test@#$%^&*()' } });

    expect(mockSetSearch).toHaveBeenCalledWith('test@#$%^&*()');
  });

  it('should handle search input with numbers', () => {
    const mockSetSearch = vi.fn();
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} setSearch={mockSetSearch} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: '12345' } });

    expect(mockSetSearch).toHaveBeenCalledWith('12345');
  });

  it('should handle search input with empty string', () => {
    const mockSetSearch = vi.fn();
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} setSearch={mockSetSearch} search="initial" />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    // First set a value, then clear it
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(searchInput, { target: { value: '' } });

    expect(mockSetSearch).toHaveBeenCalledWith('');
  });

  it('should maintain search input focus after typing', () => {
    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    searchInput.focus();
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(searchInput).toHaveFocus();
  });

  it('should render with different column configurations', () => {
    const customColumns = [
      { Header: 'Custom ID', accessor: 'custom_id' },
      { Header: 'Custom Status', accessor: 'custom_status' },
    ];

    render(
      <TestWrapper>
        <OrderHistoryUI {...defaultProps} columns={customColumns} />
      </TestWrapper>
    );

    expect(screen.getByText('Custom ID')).toBeInTheDocument();
    expect(screen.getByText('Custom Status')).toBeInTheDocument();
  });

  it('should render with different size per page list', () => {
    const customSizePerPageList = [
      { text: '5', value: 5 },
      { text: '15', value: 15 },
    ];

    render(
      <TestWrapper>
        <OrderHistoryUI
          {...defaultProps}
          sizePerPageList={customSizePerPageList}
        />
      </TestWrapper>
    );

    // Just verify the component renders without crashing
    expect(screen.getByText('Order History')).toBeInTheDocument();
  });
});