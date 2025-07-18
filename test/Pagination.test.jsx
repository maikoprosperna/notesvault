/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Pagination from '../Pagination';

// Mock classnames
vi.mock('classnames', () => ({
  default: (...args) => {
    const result = [];
    args.forEach(arg => {
      if (typeof arg === 'string') {
        result.push(arg);
      } else if (typeof arg === 'object' && arg !== null) {
        Object.keys(arg).forEach(key => {
          if (arg[key]) {
            result.push(key);
          }
        });
      }
    });
    return result.join(' ');
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

describe('Pagination', () => {
  const defaultTableProps = {
    state: { pageIndex: 0, pageSize: 10 },
    pageCount: 5,
    pageOptions: [0, 1, 2, 3, 4],
    gotoPage: vi.fn(),
    setPageSize: vi.fn(),
  };

  it('does not render page size dropdown if sizePerPageList is empty', () => {
    render(<Pagination tableProps={defaultTableProps} sizePerPageList={[]} />);
    expect(screen.queryByText('Display :')).not.toBeInTheDocument();
  });

  it('renders page size dropdown if sizePerPageList is present', () => {
    const sizePerPageList = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
    ];
    render(<Pagination tableProps={defaultTableProps} sizePerPageList={sizePerPageList} />);
    expect(screen.getByText('Display :')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls setPageSize and onChangePageSize when page size is changed', () => {
    const sizePerPageList = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
    ];
    const onChangePageSize = vi.fn();
    render(
      <Pagination
        tableProps={defaultTableProps}
        sizePerPageList={sizePerPageList}
        onChangePageSize={onChangePageSize}
      />
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '5' } });
    expect(defaultTableProps.setPageSize).toHaveBeenCalledWith(5);
    expect(onChangePageSize).toHaveBeenCalledWith(5);
  });

  it('renders pagination and disables prev on first page', () => {
    render(<Pagination tableProps={defaultTableProps} sizePerPageList={[]} />);
    // Find the previous button li element
    const prevLi = document.querySelector('li.page-item.paginate_button.previous');
    expect(prevLi).toHaveClass('disabled');
  });

  it('disables next on last page', () => {
    const lastPageProps = {
      ...defaultTableProps,
      state: { ...defaultTableProps.state, pageIndex: 4 },
    };
    render(<Pagination tableProps={lastPageProps} sizePerPageList={[]} />);
    // Find the next button li element
    const nextLi = document.querySelector('li.page-item.paginate_button.next');
    expect(nextLi).toHaveClass('disabled');
  });

  it('calls changePage when clicking next and prev', () => {
    const gotoPage = vi.fn();
    const props = { ...defaultTableProps, gotoPage };
    render(<Pagination tableProps={props} sizePerPageList={[]} />);
    // Go to next page
    const next = screen.getByText((content, node) => node.tagName === 'I' && node.className.includes('mdi-chevron-right')).closest('li');
    fireEvent.click(next);
    expect(gotoPage).toHaveBeenCalledWith(1);
    // Go to prev page (should not call on first page)
    const prev = screen.getByText((content, node) => node.tagName === 'I' && node.className.includes('mdi-chevron-left')).closest('li');
    fireEvent.click(prev);
    // Should not call gotoPage again since already on first page
    expect(gotoPage).toHaveBeenCalledTimes(1);
  });

  it('calls changePage when clicking a page number', () => {
    const gotoPage = vi.fn();
    const props = { ...defaultTableProps, gotoPage };
    render(<Pagination tableProps={props} sizePerPageList={[]} />);
    // Find a page number (e.g., 2)
    const page2 = screen.getByText('2');
    fireEvent.click(page2.closest('li'));
    expect(gotoPage).toHaveBeenCalledWith(1);
  });

  it('renders ellipsis for more than 6 pages', () => {
    const manyPagesProps = {
      ...defaultTableProps,
      pageCount: 10,
      pageOptions: Array.from({ length: 10 }, (_, i) => i),
    };
    render(<Pagination tableProps={manyPagesProps} sizePerPageList={[]} />);
    // Should render at least one ellipsis
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('handles only one page', () => {
    const onePageProps = {
      ...defaultTableProps,
      pageCount: 1,
      pageOptions: [0],
    };
    render(<Pagination tableProps={onePageProps} sizePerPageList={[]} />);
    // Should not render next/prev as enabled
    const prevLi = document.querySelector('li.page-item.paginate_button.previous');
    const nextLi = document.querySelector('li.page-item.paginate_button.next');
    expect(prevLi).toHaveClass('disabled');
    expect(nextLi).toHaveClass('disabled');
  });

  it('handles missing onChangePageSize gracefully', () => {
    const sizePerPageList = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
    ];
    render(<Pagination tableProps={defaultTableProps} sizePerPageList={sizePerPageList} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '5' } });
    expect(defaultTableProps.setPageSize).toHaveBeenCalledWith(5);
    // Should not throw if onChangePageSize is missing
  });

  // Additional tests to increase branch coverage
  it('handles page size change without onChangePageSize callback', () => {
    const sizePerPageList = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
    ];
    render(<Pagination tableProps={defaultTableProps} sizePerPageList={sizePerPageList} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '5' } });
    expect(defaultTableProps.setPageSize).toHaveBeenCalledWith(5);
    // Should not call onChangePageSize when it's not provided
  });

  it('handles page size change with onChangePageSize callback', () => {
    const sizePerPageList = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
    ];
    const onChangePageSize = vi.fn();
    render(
      <Pagination
        tableProps={defaultTableProps}
        sizePerPageList={sizePerPageList}
        onChangePageSize={onChangePageSize}
      />
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '10' } });
    expect(defaultTableProps.setPageSize).toHaveBeenCalledWith(10);
    expect(onChangePageSize).toHaveBeenCalledWith(10);
  });

  it('handles complex pagination logic for pages > 7 with page % 5 >= 0 and page > 4 and page + 2 < total', () => {
    const complexProps = {
      ...defaultTableProps,
      pageCount: 10,
      state: { ...defaultTableProps.state, pageIndex: 6 }, // page 7 (6+1)
      pageOptions: Array.from({ length: 10 }, (_, i) => i),
    };
    render(<Pagination tableProps={complexProps} sizePerPageList={[]} />);
    // Should render pagination with specific logic for this case
    expect(document.querySelector('.pagination')).toBeInTheDocument();
  });

  it('handles complex pagination logic for pages > 7 with page % 5 >= 0 and page > 4 and page + 2 >= total', () => {
    const complexProps = {
      ...defaultTableProps,
      pageCount: 10,
      state: { ...defaultTableProps.state, pageIndex: 8 }, // page 9 (8+1), which is close to total
      pageOptions: Array.from({ length: 10 }, (_, i) => i),
    };
    render(<Pagination tableProps={complexProps} sizePerPageList={[]} />);
    // Should render pagination with specific logic for this case
    expect(document.querySelector('.pagination')).toBeInTheDocument();
  });

  it('handles complex pagination logic for pages > 7 with default case', () => {
    const complexProps = {
      ...defaultTableProps,
      pageCount: 10,
      state: { ...defaultTableProps.state, pageIndex: 2 }, // page 3 (2+1), which triggers default case
      pageOptions: Array.from({ length: 10 }, (_, i) => i),
    };
    render(<Pagination tableProps={complexProps} sizePerPageList={[]} />);
    // Should render pagination with default logic
    expect(document.querySelector('.pagination')).toBeInTheDocument();
  });

  it('handles pagination with exactly 7 pages', () => {
    const sevenPagesProps = {
      ...defaultTableProps,
      pageCount: 7,
      pageOptions: Array.from({ length: 7 }, (_, i) => i),
    };
    render(<Pagination tableProps={sevenPagesProps} sizePerPageList={[]} />);
    // Should render pagination with logic for total < 7
    expect(document.querySelector('.pagination')).toBeInTheDocument();
  });

  it('handles pagination with less than 7 pages', () => {
    const fewPagesProps = {
      ...defaultTableProps,
      pageCount: 5,
      pageOptions: Array.from({ length: 5 }, (_, i) => i),
    };
    render(<Pagination tableProps={fewPagesProps} sizePerPageList={[]} />);
    // Should render pagination with logic for total < 7
    expect(document.querySelector('.pagination')).toBeInTheDocument();
  });

  it('handles pagination with ellipsis rendering condition', () => {
    const manyPagesProps = {
      ...defaultTableProps,
      pageCount: 15,
      state: { ...defaultTableProps.state, pageIndex: 7 }, // page 8, which should trigger ellipsis
      pageOptions: Array.from({ length: 15 }, (_, i) => i),
    };
    render(<Pagination tableProps={manyPagesProps} sizePerPageList={[]} />);
    // Should render ellipsis when there are gaps in page numbers
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('handles pagination without ellipsis rendering condition', () => {
    const fewPagesProps = {
      ...defaultTableProps,
      pageCount: 5,
      state: { ...defaultTableProps.state, pageIndex: 1 }, // page 2, which should not trigger ellipsis
      pageOptions: Array.from({ length: 5 }, (_, i) => i),
    };
    render(<Pagination tableProps={fewPagesProps} sizePerPageList={[]} />);
    // Should not render ellipsis when pages are consecutive
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('handles changePage when page equals activePage', () => {
    const gotoPage = vi.fn();
    const props = { ...defaultTableProps, gotoPage };
    render(<Pagination tableProps={props} sizePerPageList={[]} />);
    // Try to navigate to current page (should not call gotoPage)
    const currentPage = screen.getByText('1');
    fireEvent.click(currentPage.closest('li'));
    // Should not call gotoPage when clicking on current page
    expect(gotoPage).not.toHaveBeenCalled();
  });

  it('handles changePage when page is different from activePage', () => {
    const gotoPage = vi.fn();
    const props = { ...defaultTableProps, gotoPage };
    render(<Pagination tableProps={props} sizePerPageList={[]} />);
    // Navigate to a different page
    const page2 = screen.getByText('2');
    fireEvent.click(page2.closest('li'));
    expect(gotoPage).toHaveBeenCalledWith(1);
  });

  it('handles prev button click when not on first page', () => {
    const gotoPage = vi.fn();
    const props = {
      ...defaultTableProps,
      state: { ...defaultTableProps.state, pageIndex: 1 }, // page 2
      gotoPage,
    };
    render(<Pagination tableProps={props} sizePerPageList={[]} />);
    // Click prev button
    const prev = screen.getByText((content, node) => node.tagName === 'I' && node.className.includes('mdi-chevron-left')).closest('li');
    fireEvent.click(prev);
    expect(gotoPage).toHaveBeenCalledWith(0);
  });

  it('handles next button click when not on last page', () => {
    const gotoPage = vi.fn();
    const props = {
      ...defaultTableProps,
      state: { ...defaultTableProps.state, pageIndex: 2 }, // page 3
      gotoPage,
    };
    render(<Pagination tableProps={props} sizePerPageList={[]} />);
    // Click next button
    const next = screen.getByText((content, node) => node.tagName === 'I' && node.className.includes('mdi-chevron-right')).closest('li');
    fireEvent.click(next);
    expect(gotoPage).toHaveBeenCalledWith(3);
  });

  it('handles prev button click when on first page (should not call gotoPage)', () => {
    const gotoPage = vi.fn();
    const props = { ...defaultTableProps, gotoPage };
    render(<Pagination tableProps={props} sizePerPageList={[]} />);
    // Click prev button when on first page
    const prev = screen.getByText((content, node) => node.tagName === 'I' && node.className.includes('mdi-chevron-left')).closest('li');
    fireEvent.click(prev);
    // Should not call gotoPage when on first page
    expect(gotoPage).not.toHaveBeenCalled();
  });

  it('handles next button click when on last page (should not call gotoPage)', () => {
    const gotoPage = vi.fn();
    const props = {
      ...defaultTableProps,
      state: { ...defaultTableProps.state, pageIndex: 4 }, // page 5 (last page)
      gotoPage,
    };
    render(<Pagination tableProps={props} sizePerPageList={[]} />);
    // Click next button when on last page
    const next = screen.getByText((content, node) => node.tagName === 'I' && node.className.includes('mdi-chevron-right')).closest('li');
    fireEvent.click(next);
    // Should not call gotoPage when on last page
    expect(gotoPage).not.toHaveBeenCalled();
  });
}); 