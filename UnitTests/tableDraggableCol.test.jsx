/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TableDraggableCol from '../tableDraggableCol';

// Mock react-table
vi.mock('react-table', () => ({
  useTable: vi.fn(({ columns, data, reorderData }) => {
    // Create dynamic headers based on columns
    const headers = (columns || []).map((col, index) => ({
      getHeaderProps: () => ({}),
      getSortByToggleProps: () => ({}),
      render: () => col.Header || `Header ${index + 1}`,
      sort: col.sort || false,
      isSortedDesc: false,
    }));

    // Create dynamic rows based on data
    const rows = (data || []).map((item, index) => ({
      getRowProps: () => ({}),
      cells: (columns || []).map((col, cellIndex) => ({
        getCellProps: () => ({}),
        render: () => item[col.accessor] || `Cell ${index + 1}-${cellIndex + 1}`,
      })),
      original: item,
      index: index,
    }));

    return {
      getTableProps: () => ({ className: 'table table-centered react-table' }),
      headerGroups: [
        {
          getHeaderGroupProps: () => ({}),
          headers: headers,
        },
      ],
      prepareRow: vi.fn(),
      rows: rows,
    };
  }),
  useSortBy: vi.fn(),
}));

// Mock react-beautiful-dnd with a very simple implementation
vi.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }) => <div data-testid="drag-drop-context">{children}</div>,
  Droppable: ({ children }) => <div data-testid="droppable">{children({ innerRef: vi.fn(), droppableProps: {} })}</div>,
  Draggable: ({ children, index }) => {
    // Create multiple draggable elements based on the index
    return (
      <div data-testid="draggable" data-index={index}>
        {children({ 
          draggableProps: {}, 
          dragHandleProps: {}, 
          innerRef: vi.fn(), 
          isDragging: false, 
          isDraggingOver: false, 
          snapshot: { 
            isDragging: false, 
            isDraggingOver: false,
            draggingOverWith: null,
            draggingFromThisWith: null,
            draggingWith: null
          } 
        }, { 
          isDragging: false, 
          isDraggingOver: false,
          draggingOverWith: null,
          draggingFromThisWith: null,
          draggingWith: null
        })}
      </div>
    );
  },
}));

// Mock classnames
vi.mock('classnames', () => ({
  default: (...args) => args.filter(Boolean).join(' '),
}));

// Mock SpinningLoader
vi.mock('../ProspernaLoader/SpinningLoader', () => ({
  SpinningLoader: () => <div data-testid="spinning-loader">Loading...</div>,
}));

describe('TableDraggableCol', () => {
  const defaultProps = {
    columns: [
      { Header: 'Name', accessor: 'name', sort: true },
      { Header: 'Age', accessor: 'age', sort: false },
    ],
    data: [
      { id: '1', name: 'John', age: 25 },
      { id: '2', name: 'Jane', age: 30 },
    ],
    reorderData: vi.fn(),
    isSortable: true,
    isFetching: false,
  };

  it('renders without crashing', () => {
    render(<TableDraggableCol {...defaultProps} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders table with correct structure', () => {
    render(<TableDraggableCol {...defaultProps} />);
    
    expect(document.querySelector('.table')).toBeInTheDocument();
    expect(document.querySelector('.table-centered')).toBeInTheDocument();
    expect(document.querySelector('.react-table')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<TableDraggableCol {...defaultProps} />);
    
    expect(document.querySelector('thead')).toBeInTheDocument();
    expect(document.querySelector('.table-light')).toBeInTheDocument();
  });

  it('renders table body with drag drop context', () => {
    render(<TableDraggableCol {...defaultProps} />);
    
    expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument();
    expect(screen.getByTestId('droppable')).toBeInTheDocument();
  });

  it('renders draggable rows', () => {
    render(<TableDraggableCol {...defaultProps} />);
    
    const draggables = screen.getAllByTestId('draggable');
    expect(draggables).toHaveLength(2);
  });

  it('renders with isSortable true', () => {
    render(<TableDraggableCol {...defaultProps} isSortable={true} />);
    expect(document.querySelector('.table')).toBeInTheDocument();
  });

  it('renders with isSortable false', () => {
    render(<TableDraggableCol {...defaultProps} isSortable={false} />);
    expect(document.querySelector('.table')).toBeInTheDocument();
  });

  it('renders loading spinner when isFetching is true', () => {
    render(<TableDraggableCol {...defaultProps} isFetching={true} />);
    expect(screen.getByTestId('spinning-loader')).toBeInTheDocument();
  });

  it('does not render loading spinner when isFetching is false', () => {
    render(<TableDraggableCol {...defaultProps} isFetching={false} />);
    expect(screen.queryByTestId('spinning-loader')).not.toBeInTheDocument();
  });

  it('renders with empty data array', () => {
    render(<TableDraggableCol {...defaultProps} data={[]} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with single data item', () => {
    const singleData = [{ id: '1', name: 'John', age: 25 }];
    render(<TableDraggableCol {...defaultProps} data={singleData} />);
    
    const draggables = screen.getAllByTestId('draggable');
    expect(draggables).toHaveLength(1);
  });

  it('renders with multiple data items', () => {
    const multipleData = [
      { id: '1', name: 'John', age: 25 },
      { id: '2', name: 'Jane', age: 30 },
      { id: '3', name: 'Bob', age: 35 },
    ];
    render(<TableDraggableCol {...defaultProps} data={multipleData} />);
    
    const draggables = screen.getAllByTestId('draggable');
    expect(draggables).toHaveLength(3);
  });

  it('renders with columns that have sort enabled', () => {
    const columnsWithSort = [
      { Header: 'Name', accessor: 'name', sort: true },
      { Header: 'Age', accessor: 'age', sort: true },
    ];
    render(<TableDraggableCol {...defaultProps} columns={columnsWithSort} />);
    expect(document.querySelector('.table')).toBeInTheDocument();
  });

  it('renders with columns that have sort disabled', () => {
    const columnsWithoutSort = [
      { Header: 'Name', accessor: 'name', sort: false },
      { Header: 'Age', accessor: 'age', sort: false },
    ];
    render(<TableDraggableCol {...defaultProps} columns={columnsWithoutSort} />);
    expect(document.querySelector('.table')).toBeInTheDocument();
  });

  it('renders with empty columns array', () => {
    render(<TableDraggableCol {...defaultProps} columns={[]} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with single column', () => {
    const singleColumn = [{ Header: 'Name', accessor: 'name', sort: true }];
    render(<TableDraggableCol {...defaultProps} columns={singleColumn} />);
    expect(document.querySelector('.table')).toBeInTheDocument();
  });

  it('renders with multiple columns', () => {
    const multipleColumns = [
      { Header: 'Name', accessor: 'name', sort: true },
      { Header: 'Age', accessor: 'age', sort: false },
      { Header: 'Email', accessor: 'email', sort: true },
      { Header: 'Phone', accessor: 'phone', sort: false },
    ];
    render(<TableDraggableCol {...defaultProps} columns={multipleColumns} />);
    expect(document.querySelector('.table')).toBeInTheDocument();
  });

  it('renders with custom className on table', () => {
    render(<TableDraggableCol {...defaultProps} />);
    expect(document.querySelector('.table.table-centered.react-table')).toBeInTheDocument();
  });

  it('renders with table-responsive wrapper', () => {
    render(<TableDraggableCol {...defaultProps} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with thead and tbody structure', () => {
    render(<TableDraggableCol {...defaultProps} />);
    expect(document.querySelector('thead')).toBeInTheDocument();
    expect(document.querySelector('tbody')).toBeInTheDocument();
  });

  it('renders with table-light class on thead', () => {
    render(<TableDraggableCol {...defaultProps} />);
    expect(document.querySelector('thead.table-light')).toBeInTheDocument();
  });

  it('renders with droppableId "table-body"', () => {
    render(<TableDraggableCol {...defaultProps} />);
    const droppable = screen.getByTestId('droppable');
    expect(droppable).toBeInTheDocument();
  });

  it('renders with null data', () => {
    render(<TableDraggableCol {...defaultProps} data={null} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with undefined data', () => {
    render(<TableDraggableCol {...defaultProps} data={undefined} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with null columns', () => {
    render(<TableDraggableCol {...defaultProps} columns={null} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with undefined columns', () => {
    render(<TableDraggableCol {...defaultProps} columns={undefined} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with null reorderData', () => {
    render(<TableDraggableCol {...defaultProps} reorderData={null} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with undefined reorderData', () => {
    render(<TableDraggableCol {...defaultProps} reorderData={undefined} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with null isSortable', () => {
    render(<TableDraggableCol {...defaultProps} isSortable={null} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with undefined isSortable', () => {
    render(<TableDraggableCol {...defaultProps} isSortable={undefined} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with null isFetching', () => {
    render(<TableDraggableCol {...defaultProps} isFetching={null} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with undefined isFetching', () => {
    render(<TableDraggableCol {...defaultProps} isFetching={undefined} />);
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with very large data array', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      name: `User ${i}`,
      age: 20 + i,
    }));
    render(<TableDraggableCol {...defaultProps} data={largeData} />);
    
    const draggables = screen.getAllByTestId('draggable');
    expect(draggables).toHaveLength(100);
  });

  it('renders with data containing special characters in IDs', () => {
    const dataWithSpecialIds = [
      { id: 'user-123', name: 'John', age: 25 },
      { id: 'user_456', name: 'Jane', age: 30 },
      { id: 'user@789', name: 'Bob', age: 35 },
    ];
    render(<TableDraggableCol {...defaultProps} data={dataWithSpecialIds} />);
    
    const draggables = screen.getAllByTestId('draggable');
    expect(draggables).toHaveLength(3);
  });

  it('renders with data containing numeric IDs', () => {
    const dataWithNumericIds = [
      { id: 1, name: 'John', age: 25 },
      { id: 2, name: 'Jane', age: 30 },
      { id: 3, name: 'Bob', age: 35 },
    ];
    render(<TableDraggableCol {...defaultProps} data={dataWithNumericIds} />);
    
    const draggables = screen.getAllByTestId('draggable');
    expect(draggables).toHaveLength(3);
  });

  it('renders with data containing null IDs', () => {
    const dataWithNullIds = [
      { id: null, name: 'John', age: 25 },
      { id: undefined, name: 'Jane', age: 30 },
    ];
    render(<TableDraggableCol {...defaultProps} data={dataWithNullIds} />);
    
    // Should handle gracefully
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with columns containing special characters in headers', () => {
    const columnsWithSpecialHeaders = [
      { Header: 'User Name & ID', accessor: 'name', sort: true },
      { Header: 'Age (Years)', accessor: 'age', sort: false },
      { Header: 'Email@Domain.com', accessor: 'email', sort: true },
    ];
    render(<TableDraggableCol {...defaultProps} columns={columnsWithSpecialHeaders} />);
    expect(document.querySelector('.table')).toBeInTheDocument();
  });

  it('renders with columns containing emoji in headers', () => {
    const columnsWithEmoji = [
      { Header: '👤 Name', accessor: 'name', sort: true },
      { Header: '🎂 Age', accessor: 'age', sort: false },
      { Header: '📧 Email', accessor: 'email', sort: true },
    ];
    render(<TableDraggableCol {...defaultProps} columns={columnsWithEmoji} />);
    expect(document.querySelector('.table')).toBeInTheDocument();
  });

  it('renders with columns containing numbers in headers', () => {
    const columnsWithNumbers = [
      { Header: 'Column 1', accessor: 'col1', sort: true },
      { Header: 'Column 2', accessor: 'col2', sort: false },
      { Header: 'Column 3', accessor: 'col3', sort: true },
    ];
    render(<TableDraggableCol {...defaultProps} columns={columnsWithNumbers} />);
    expect(document.querySelector('.table')).toBeInTheDocument();
  });

  it('renders with empty string IDs', () => {
    const dataWithEmptyIds = [
      { id: '', name: 'John', age: 25 },
      { id: '', name: 'Jane', age: 30 },
    ];
    render(<TableDraggableCol {...defaultProps} data={dataWithEmptyIds} />);
    
    // Should handle gracefully
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with boolean IDs', () => {
    const dataWithBooleanIds = [
      { id: true, name: 'John', age: 25 },
      { id: false, name: 'Jane', age: 30 },
    ];
    render(<TableDraggableCol {...defaultProps} data={dataWithBooleanIds} />);
    
    const draggables = screen.getAllByTestId('draggable');
    expect(draggables).toHaveLength(2);
  });

  it('renders with object IDs', () => {
    const dataWithObjectIds = [
      { id: { primary: '1' }, name: 'John', age: 25 },
      { id: { primary: '2' }, name: 'Jane', age: 30 },
    ];
    render(<TableDraggableCol {...defaultProps} data={dataWithObjectIds} />);
    
    // Should handle gracefully
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with array IDs', () => {
    const dataWithArrayIds = [
      { id: [1, 2, 3], name: 'John', age: 25 },
      { id: [4, 5, 6], name: 'Jane', age: 30 },
    ];
    render(<TableDraggableCol {...defaultProps} data={dataWithArrayIds} />);
    
    // Should handle gracefully
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with function IDs', () => {
    const dataWithFunctionIds = [
      { id: () => '1', name: 'John', age: 25 },
      { id: () => '2', name: 'Jane', age: 30 },
    ];
    render(<TableDraggableCol {...defaultProps} data={dataWithFunctionIds} />);
    
    // Should handle gracefully
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    const allProps = {
      columns: [
        { Header: 'Name', accessor: 'name', sort: true },
        { Header: 'Age', accessor: 'age', sort: false },
      ],
      data: [
        { id: '1', name: 'John', age: 25 },
        { id: '2', name: 'Jane', age: 30 },
      ],
      reorderData: vi.fn(),
      isSortable: true,
      isFetching: false,
    };
    render(<TableDraggableCol {...allProps} />);
    
    expect(document.querySelector('.table-responsive')).toBeInTheDocument();
    expect(document.querySelector('.table')).toBeInTheDocument();
    expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument();
    expect(screen.getByTestId('droppable')).toBeInTheDocument();
    expect(screen.getAllByTestId('draggable')).toHaveLength(2);
  });
}); 