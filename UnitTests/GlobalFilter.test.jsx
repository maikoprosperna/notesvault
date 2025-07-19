/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import GlobalFilter from '../GlobalFilter';

// Mock react-table
vi.mock('react-table', () => ({
  useAsyncDebounce: (callback, delay) => {
    return (value) => {
      // Simulate debounced callback immediately for testing
      // Convert empty string to undefined to match component behavior
      const processedValue = value === '' ? undefined : value;
      callback(processedValue);
    };
  },
}));

// Mock @mui/icons-material
vi.mock('@mui/icons-material', () => ({
  Search: () => <div data-testid="search-icon">Search Icon</div>,
}));

// Mock classnames
vi.mock('classnames', () => ({
  default: (...args) => args.filter(Boolean).join(' '),
}));

describe('GlobalFilter', () => {
  const defaultProps = {
    globalFilter: '',
    setGlobalFilter: vi.fn(),
    searchBoxClass: 'custom-search',
    isCustomSearch: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Default Search Mode (isCustomSearch: false)', () => {
    it('renders without crashing', () => {
      render(<GlobalFilter {...defaultProps} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with search icon', () => {
      render(<GlobalFilter {...defaultProps} />);
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('renders with custom searchBoxClass', () => {
      render(<GlobalFilter {...defaultProps} searchBoxClass="custom-class" />);
      expect(document.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('renders with empty searchBoxClass', () => {
      render(<GlobalFilter {...defaultProps} searchBoxClass="" />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with null searchBoxClass', () => {
      render(<GlobalFilter {...defaultProps} searchBoxClass={null} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with undefined searchBoxClass', () => {
      render(<GlobalFilter {...defaultProps} searchBoxClass={undefined} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with initial globalFilter value', () => {
      render(<GlobalFilter {...defaultProps} globalFilter="initial search" />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input.value).toBe('initial search');
    });

    it('renders with null globalFilter value', () => {
      render(<GlobalFilter {...defaultProps} globalFilter={null} />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input.value).toBe('');
    });

    it('renders with undefined globalFilter value', () => {
      render(<GlobalFilter {...defaultProps} globalFilter={undefined} />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input.value).toBe('');
    });

    it('handles input change', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...defaultProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'test search' } });
      
      expect(input.value).toBe('test search');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('test search');
    });

    it('handles input change with empty value', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...defaultProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      
      // First set a value, then clear it to ensure the onChange is triggered
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.change(input, { target: { value: '' } });
      
      expect(input.value).toBe('');
      
      // The mock converts empty string to undefined, so it should be called with undefined
      expect(setGlobalFilter).toHaveBeenCalledWith(undefined);
    });

    it('handles input change with special characters', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...defaultProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'test@#$%^&*()' } });
      
      expect(input.value).toBe('test@#$%^&*()');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('test@#$%^&*()');
    });

    it('handles input change with numbers', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...defaultProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: '12345' } });
      
      expect(input.value).toBe('12345');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('12345');
    });

    it('handles input change with very long text', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...defaultProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      const longText = 'A'.repeat(1000);
      fireEvent.change(input, { target: { value: longText } });
      
      expect(input.value).toBe(longText);
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith(longText);
    });

    it('handles input change with emoji', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...defaultProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'search 🎉' } });
      
      expect(input.value).toBe('search 🎉');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('search 🎉');
    });

    it('renders with correct input classes', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input).toHaveClass('form-control', 'w-auto');
    });

    it('renders with correct InputGroup structure', () => {
      render(<GlobalFilter {...defaultProps} />);
      expect(document.querySelector('.input-group')).toBeInTheDocument();
      expect(document.querySelector('.input-group-text')).toBeInTheDocument();
    });

    it('renders with correct InputGroup.Text classes', () => {
      render(<GlobalFilter {...defaultProps} />);
      const inputGroupText = document.querySelector('.input-group-text');
      expect(inputGroupText).toHaveClass('bg-white', 'input-group-no-padding');
    });
  });

  describe('Custom Search Mode (isCustomSearch: true)', () => {
    const customSearchProps = {
      ...defaultProps,
      isCustomSearch: true,
    };

    it('renders custom search mode', () => {
      render(<GlobalFilter {...customSearchProps} />);
      expect(screen.getByText('Search:')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<GlobalFilter {...customSearchProps} />);
      expect(screen.getByText('Search:')).toBeInTheDocument();
    });

    it('renders with Form.Control', () => {
      render(<GlobalFilter {...customSearchProps} />);
      const formControl = document.querySelector('.form-control');
      expect(formControl).toBeInTheDocument();
    });

    it('renders with correct Form.Control attributes', () => {
      render(<GlobalFilter {...customSearchProps} />);
      const formControl = document.querySelector('.form-control');
      expect(formControl).toHaveAttribute('aria-label', 'Search');
      expect(formControl).toHaveAttribute('aria-describedby', 'search-input');
    });

    it('renders with correct Form.Control classes', () => {
      render(<GlobalFilter {...customSearchProps} />);
      const formControl = document.querySelector('.form-control');
      expect(formControl).toHaveClass('form-control', 'w-auto', 'ms-1', 'border-end-0');
    });

    it('renders with search-container class', () => {
      render(<GlobalFilter {...customSearchProps} />);
      expect(document.querySelector('.search-container')).toBeInTheDocument();
    });

    it('renders with d-flex align-items-center mb-3 wrapper', () => {
      render(<GlobalFilter {...customSearchProps} />);
      expect(document.querySelector('.d-flex.align-items-center.mb-3')).toBeInTheDocument();
    });

    it('renders with no-wrap me-4 label', () => {
      render(<GlobalFilter {...customSearchProps} />);
      expect(document.querySelector('.no-wrap.me-4')).toBeInTheDocument();
    });

    it('handles input change in custom search mode', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...customSearchProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'custom search' } });
      
      expect(input.value).toBe('custom search');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('custom search');
    });

    it('handles input change with empty value in custom search mode', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...customSearchProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      
      // First set a value, then clear it to ensure the onChange is triggered
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.change(input, { target: { value: '' } });
      
      expect(input.value).toBe('');
      
      // The mock converts empty string to undefined, so it should be called with undefined
      expect(setGlobalFilter).toHaveBeenCalledWith(undefined);
    });

    it('handles input change with special characters in custom search mode', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...customSearchProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'custom@#$%^&*()' } });
      
      expect(input.value).toBe('custom@#$%^&*()');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('custom@#$%^&*()');
    });

    it('handles input change with numbers in custom search mode', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...customSearchProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: '67890' } });
      
      expect(input.value).toBe('67890');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('67890');
    });

    it('handles input change with very long text in custom search mode', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...customSearchProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      const longText = 'B'.repeat(1000);
      fireEvent.change(input, { target: { value: longText } });
      
      expect(input.value).toBe(longText);
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith(longText);
    });

    it('handles input change with emoji in custom search mode', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...customSearchProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'custom search 🚀' } });
      
      expect(input.value).toBe('custom search 🚀');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('custom search 🚀');
    });

    it('renders with initial globalFilter value in custom search mode', () => {
      render(<GlobalFilter {...customSearchProps} globalFilter="initial custom search" />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input.value).toBe('initial custom search');
    });

    it('renders with null globalFilter value in custom search mode', () => {
      render(<GlobalFilter {...customSearchProps} globalFilter={null} />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input.value).toBe('');
    });

    it('renders with undefined globalFilter value in custom search mode', () => {
      render(<GlobalFilter {...customSearchProps} globalFilter={undefined} />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input.value).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing setGlobalFilter prop', () => {
      const { setGlobalFilter, ...propsWithoutSetGlobalFilter } = defaultProps;
      render(<GlobalFilter {...propsWithoutSetGlobalFilter} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles null setGlobalFilter prop', () => {
      render(<GlobalFilter {...defaultProps} setGlobalFilter={null} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles undefined setGlobalFilter prop', () => {
      render(<GlobalFilter {...defaultProps} setGlobalFilter={undefined} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles missing searchBoxClass prop', () => {
      const { searchBoxClass, ...propsWithoutSearchBoxClass } = defaultProps;
      render(<GlobalFilter {...propsWithoutSearchBoxClass} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles missing isCustomSearch prop', () => {
      const { isCustomSearch, ...propsWithoutIsCustomSearch } = defaultProps;
      render(<GlobalFilter {...propsWithoutIsCustomSearch} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles null isCustomSearch prop', () => {
      render(<GlobalFilter {...defaultProps} isCustomSearch={null} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles undefined isCustomSearch prop', () => {
      render(<GlobalFilter {...defaultProps} isCustomSearch={undefined} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles boolean isCustomSearch prop', () => {
      render(<GlobalFilter {...defaultProps} isCustomSearch={true} />);
      expect(screen.getByText('Search:')).toBeInTheDocument();
    });

    it('handles string isCustomSearch prop', () => {
      render(<GlobalFilter {...defaultProps} isCustomSearch="true" />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles number isCustomSearch prop', () => {
      render(<GlobalFilter {...defaultProps} isCustomSearch={1} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles zero isCustomSearch prop', () => {
      render(<GlobalFilter {...defaultProps} isCustomSearch={0} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles empty string isCustomSearch prop', () => {
      render(<GlobalFilter {...defaultProps} isCustomSearch="" />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles all props as null', () => {
      render(<GlobalFilter globalFilter={null} setGlobalFilter={null} searchBoxClass={null} isCustomSearch={null} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles all props as undefined', () => {
      render(<GlobalFilter globalFilter={undefined} setGlobalFilter={undefined} searchBoxClass={undefined} isCustomSearch={undefined} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('handles input focus', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.focus(input);
      expect(input).toBeInTheDocument();
    });

    it('handles input blur', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.blur(input);
      expect(input).toBeInTheDocument();
    });

    it('handles input keydown', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(input).toBeInTheDocument();
    });

    it('handles input keyup', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.keyUp(input, { key: 'a' });
      expect(input).toBeInTheDocument();
    });

    it('handles input keypress', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.keyPress(input, { key: 'a' });
      expect(input).toBeInTheDocument();
    });

    it('handles input paste', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.paste(input, { clipboardData: { getData: () => 'pasted text' } });
      expect(input).toBeInTheDocument();
    });

    it('handles input cut', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'test text' } });
      fireEvent.cut(input);
      expect(input).toBeInTheDocument();
    });

    it('handles input copy', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'test text' } });
      fireEvent.copy(input);
      expect(input).toBeInTheDocument();
    });

    it('handles input select', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'test text' } });
      fireEvent.select(input);
      expect(input).toBeInTheDocument();
    });

    it('handles input input event', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.input(input, { target: { value: 'input text' } });
      expect(input.value).toBe('input text');
    });

    it('handles input composition events', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.compositionStart(input);
      fireEvent.compositionUpdate(input);
      fireEvent.compositionEnd(input);
      expect(input).toBeInTheDocument();
    });

    it('handles input with touch events', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.touchStart(input);
      fireEvent.touchEnd(input);
      expect(input).toBeInTheDocument();
    });

    it('handles input with mouse events', () => {
      render(<GlobalFilter {...defaultProps} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.mouseEnter(input);
      fireEvent.mouseLeave(input);
      fireEvent.mouseDown(input);
      fireEvent.mouseUp(input);
      expect(input).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('maintains local state correctly', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...defaultProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      
      // Initial state
      expect(input.value).toBe('');
      
      // Change input
      fireEvent.change(input, { target: { value: 'test' } });
      expect(input.value).toBe('test');
      
      // Change again
      fireEvent.change(input, { target: { value: 'updated test' } });
      expect(input.value).toBe('updated test');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('updated test');
    });

    it('handles multiple rapid input changes', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...defaultProps} setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      
      // Rapid changes
      fireEvent.change(input, { target: { value: 'first' } });
      fireEvent.change(input, { target: { value: 'second' } });
      fireEvent.change(input, { target: { value: 'third' } });
      
      expect(input.value).toBe('third');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('third');
    });

    it('handles input with initial value and changes', () => {
      const setGlobalFilter = vi.fn();
      render(<GlobalFilter {...defaultProps} globalFilter="initial" setGlobalFilter={setGlobalFilter} />);
      
      const input = screen.getByPlaceholderText('Search...');
      expect(input.value).toBe('initial');
      
      fireEvent.change(input, { target: { value: 'changed' } });
      expect(input.value).toBe('changed');
      
      // Callback should be called immediately
      expect(setGlobalFilter).toHaveBeenCalledWith('changed');
    });
  });
}); 