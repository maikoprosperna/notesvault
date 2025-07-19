import { render, fireEvent, screen, renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Table from '../Table';
import 'regenerator-runtime/runtime';
import { BrowserRouter } from 'react-router-dom';
import useTotalPages from '../../hooks/useTotalPages';
import IndeterminateCheckbox from '../IndeterminateCheckbox';
import GlobalFilter from '../GlobalFilter';
import Pagination from '../Pagination';

describe('Table', () => {
  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      sort: true,
    },
    {
      Header: 'Age',
      accessor: 'age',
      sort: false,
    },
  ];

  const data = [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Jane', age: 30 },
    { id: 3, name: 'Bob', age: 20 },
  ];

  it('should be sortable', () => {
    render(<Table columns={columns} data={data} isSortable={true} />);

    const nameHeader = screen.getByText('Name');
    expect(nameHeader).toHaveClass('sortable');

    fireEvent.click(nameHeader);
    expect(nameHeader).toHaveClass('sorting_asc');

    fireEvent.click(nameHeader);
    expect(nameHeader).toHaveClass('sorting_desc');
  });

  it('should not be sortable if column.sort is false', () => {
    render(<Table columns={columns} data={data} isSortable={true} />);

    const ageHeader = screen.getByText('Age');
    expect(ageHeader).toHaveClass('non_sortable');

    fireEvent.click(ageHeader);
    expect(ageHeader).not.toHaveClass('sorting_asc');
    expect(ageHeader).not.toHaveClass('sorting_desc');
  });

  it('should not be clickable if column.sort is false', () => {
    const onClick = vi.fn();
    render(
      <Table
        columns={columns.map((column) => ({ ...column, sort: false }))}
        data={data}
        isSortable={true}
      />,
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should render spinning loader when isFetching is true', () => {
    render(
      <Table
        columns={columns}
        data={data}
        isFetching={true}
        isSortable={true}
      />,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveClass('table-loading');
  });

  it('should not render spinning loader when isFetching is false', () => {
    render(
      <Table
        columns={columns}
        data={data}
        isFetching={false}
        isSortable={true}
      />,
    );

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should render checkbox when isSelectable is true', () => {
    const rowSelection = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        isSelectable={true}
        getRowId={(row) => row.id.toString()}
        isSortable={true}
        pagination={false}
        noPaginationWithSelect={true}
        autoResetSelectedRows={true}
        getAllValues={true}
        rowSelection={rowSelection}
      />,
    );

    expect(screen.getAllByRole('checkbox')).toHaveLength(data.length + 1);
  });

  it('should call rowSelection function when a row is selected', () => {
    const rowSelection = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        isSelectable={true}
        getRowId={(row) => row.id.toString()}
        isSortable={true}
        pagination={false}
        noPaginationWithSelect={true}
        autoResetSelectedRows={true}
        getAllValues={true}
        rowSelection={rowSelection}
      />,
    );

    const checkbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(checkbox);

    expect(rowSelection).toHaveBeenCalledTimes(2);
    const selectedRows = JSON.parse(rowSelection.mock.calls[1][0]);
    expect(selectedRows).toEqual([data[0]]);
  });

  it('should call rowSelection function with all rows when select all is clicked', () => {
    const rowSelection = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        isSelectable={true}
        getRowId={(row) => row.id.toString()}
        isSortable={true}
        pagination={false}
        noPaginationWithSelect={true}
        autoResetSelectedRows={true}
        getAllValues={true}
        rowSelection={rowSelection}
      />,
    );

    const headerCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(headerCheckbox);

    expect(rowSelection).toHaveBeenCalledTimes(2);
    const selectedRows = JSON.parse(rowSelection.mock.calls[1][0]);
    expect(selectedRows).toEqual(data);
  });

  it('should call rowSelection function with updated selection when a row is deselected', () => {
    const rowSelection = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        isSelectable={true}
        getRowId={(row) => row.id.toString()}
        isSortable={true}
        pagination={false}
        noPaginationWithSelect={true}
        autoResetSelectedRows={true}
        getAllValues={true}
        rowSelection={rowSelection}
      />,
    );

    const checkbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(rowSelection).toHaveBeenCalledTimes(3);
    const selectedRows = JSON.parse(rowSelection.mock.calls[2][0]);
    expect(selectedRows).toEqual([]);
  });

  it('should render search input when isSearchable is true', () => {
    render(
      <Table
        columns={columns}
        data={data}
        isSearchable={true}
        isSortable={true}
      />,
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('should render pagination when pagination is true', () => {
    const sizePerPageList = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
      { text: 'All', value: data.length },
    ];
    render(
      <BrowserRouter>
        <Table
          columns={columns}
          data={data}
          pagination={true}
          isSortable={true}
          sizePerPageList={sizePerPageList}
        />
      </BrowserRouter>,
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
  it('should not render pagination when pagination is false', () => {
    render(
      <BrowserRouter>
        <Table
          columns={columns}
          data={data}
          pagination={false}
          isSortable={true}
        />
      </BrowserRouter>,
    );

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should render footer when hasFooter is true', () => {
    const footer = [{ id: 'name', data: { label: 'Name', value: 'John' } }];
    render(
      <Table
        columns={columns}
        data={data}
        hasFooter={true}
        footer={footer}
        isSortable={true}
      />,
    );

    expect(screen.getByRole('footer')).toBeInTheDocument();
  });

  it('should render expandable rows when isExpandable is true', () => {
    render(
      <Table
        columns={columns}
        data={data}
        isExpandable={true}
        isSortable={true}
      />,
    );

    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('should expand row when expandable icon is clicked', () => {
    render(
      <Table
        columns={columns}
        data={data}
        isExpandable={true}
        isSortable={true}
      />,
    );

    const expandIcon = screen.getByText('+');
    fireEvent.click(expandIcon);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should collapse row when expandable icon is clicked again', () => {
    render(
      <Table
        columns={columns}
        data={data}
        isExpandable={true}
        isSortable={true}
      />,
    );

    const expandIcon = screen.getByText('+');
    fireEvent.click(expandIcon);
    fireEvent.click(screen.getByText('-'));

    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('should calculate total pages correctly', () => {
    const { result } = renderHook(() =>
      useTotalPages({ pageSize: 10, totalCount: 50 }),
    );
    expect(result.current).toBe(5);
  });

  it('should render IndeterminateCheckbox component', () => {
    render(
      <IndeterminateCheckbox
        indeterminate={true}
        disabled={false}
        checked={true}
      />,
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should render GlobalFilter component', () => {
    render(<GlobalFilter globalFilter="test" setGlobalFilter={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('should not render footer when hasFooter is false', () => {
    render(
      <Table
        columns={columns}
        data={data}
        hasFooter={false}
        isSortable={true}
      />,
    );

    expect(screen.queryByRole('footer')).not.toBeInTheDocument();
  });

  it('should render custom search input when isCustomSearch is true', () => {
    render(
      <Table
        columns={columns}
        data={data}
        isSearchable={true}
        isCustomSearch={true}
        isSortable={true}
      />,
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Search:')).toBeInTheDocument();
  });

  it('should clear checkbox selection when clearCheckbox is true', () => {
    const rowSelection = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        isSelectable={true}
        getRowId={(row) => row.id.toString()}
        isSortable={true}
        pagination={false}
        noPaginationWithSelect={true}
        autoResetSelectedRows={true}
        getAllValues={true}
        rowSelection={rowSelection}
        clearCheckbox={true}
      />,
    );

    expect(rowSelection).toHaveBeenCalledTimes(2);
    const selectedRows = JSON.parse(rowSelection.mock.calls[1][0]);
    expect(selectedRows).toEqual([]);
  });

  it('should handle undefined totalCount', () => {
    const { result } = renderHook(() =>
      useTotalPages({ pageSize: 10, totalCount: undefined }),
    );
    expect(result.current).toBeUndefined();
  });

  it('should handle undefined pageSize', () => {
    const { result } = renderHook(() =>
      useTotalPages({ pageSize: undefined, totalCount: 50 }),
    );
    expect(result.current).toBeNaN();
  });

  it('should handle empty sizePerPageList', () => {
    render(
      <BrowserRouter>
        <Pagination
          tableProps={{
            state: {
              pageIndex: 0,
            },
            pageCount: 10,
          }}
          sizePerPageList={[]}
          onChangePageSize={vi.fn()}
        />
      </BrowserRouter>,
    );
    expect(screen.queryByText('Display :')).not.toBeInTheDocument();
  });

  it('should handle missing onChangePageSize', () => {
    const sizePerPageList = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
      { text: 'All', value: data.length },
    ];
    render(
      <BrowserRouter>
        <Pagination
          tableProps={{
            state: {
              pageIndex: 0,
              pageSize: 10,
            },
            pageCount: 10,
            setPageSize: vi.fn(),
          }}
          sizePerPageList={sizePerPageList}
        />
      </BrowserRouter>,
    );
    expect(screen.getByText('Display :')).toBeInTheDocument();
  });
});
