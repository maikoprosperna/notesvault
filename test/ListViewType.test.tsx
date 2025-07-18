import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListViewType } from '../ListViewType';

describe('ListViewType', () => {
  let setViewType: jest.Mock;
  let setShowFilter: jest.Mock;

  beforeEach(() => {
    setViewType = jest.fn();
    setShowFilter = jest.fn();
  });

  const getDefaultProps = () => ({
    viewType: 'grid',
    setViewType,
    setShowFilter,
    allowListView: true,
    allowGridView: true,
    allowMenuView: true,
  });

  it('renders grid view buttons when viewType is grid', () => {
    render(<ListViewType {...getDefaultProps()} />);
    const spans = screen.getAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(3); // list, grid, menu
  });

  it('renders list view buttons when viewType is list', () => {
    render(<ListViewType {...getDefaultProps()} viewType="list" />);
    const spans = screen.getAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(3); // list, grid, menu
  });

  it('renders menu view buttons when viewType is menu', () => {
    render(<ListViewType {...getDefaultProps()} viewType="menu" />);
    const spans = screen.getAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(3); // list, grid, menu
  });

  it('calls setViewType when list button is clicked in grid view', () => {
    render(<ListViewType {...getDefaultProps()} />);
    const spans = screen.getAllByText('', { selector: 'span' });
    fireEvent.click(spans[0]);
    expect(setViewType).toHaveBeenCalledWith('list');
  });

  it('calls setViewType when grid button is clicked in grid view', () => {
    render(<ListViewType {...getDefaultProps()} />);
    const spans = screen.getAllByText('', { selector: 'span' });
    fireEvent.click(spans[1]);
    expect(setViewType).toHaveBeenCalledWith('grid');
  });

  it('calls setViewType and setShowFilter when menu button is clicked in grid view', () => {
    render(<ListViewType {...getDefaultProps()} />);
    const spans = screen.getAllByText('', { selector: 'span' });
    fireEvent.click(spans[2]);
    expect(setViewType).toHaveBeenCalledWith('menu');
    expect(setShowFilter).toHaveBeenCalledWith(false);
  });

  it('calls setViewType when list button is clicked in list view', () => {
    render(<ListViewType {...getDefaultProps()} viewType="list" />);
    const spans = screen.getAllByText('', { selector: 'span' });
    fireEvent.click(spans[0]);
    expect(setViewType).toHaveBeenCalledWith('list');
  });

  it('calls setViewType when grid button is clicked in list view', () => {
    render(<ListViewType {...getDefaultProps()} viewType="list" />);
    const spans = screen.getAllByText('', { selector: 'span' });
    fireEvent.click(spans[1]);
    expect(setViewType).toHaveBeenCalledWith('grid');
  });

  it('calls setViewType and setShowFilter when menu button is clicked in list view', () => {
    render(<ListViewType {...getDefaultProps()} viewType="list" />);
    const spans = screen.getAllByText('', { selector: 'span' });
    fireEvent.click(spans[2]);
    expect(setViewType).toHaveBeenCalledWith('menu');
    expect(setShowFilter).toHaveBeenCalledWith(false);
  });

  it('calls setViewType when list button is clicked in menu view', () => {
    render(<ListViewType {...getDefaultProps()} viewType="menu" />);
    const spans = screen.getAllByText('', { selector: 'span' });
    fireEvent.click(spans[0]);
    expect(setViewType).toHaveBeenCalledWith('list');
  });

  it('calls setViewType when grid button is clicked in menu view', () => {
    render(<ListViewType {...getDefaultProps()} viewType="menu" />);
    const spans = screen.getAllByText('', { selector: 'span' });
    fireEvent.click(spans[1]);
    expect(setViewType).toHaveBeenCalledWith('grid');
  });

  it('calls setViewType when menu button is clicked in menu view', () => {
    render(<ListViewType {...getDefaultProps()} viewType="menu" />);
    const spans = screen.getAllByText('', { selector: 'span' });
    fireEvent.click(spans[2]);
    expect(setViewType).toHaveBeenCalledWith('menu');
  });

  it('does not render list button when allowListView is false', () => {
    render(<ListViewType {...getDefaultProps()} allowListView={false} />);
    const spans = screen.getAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(2); // grid, menu
  });

  it('does not render grid button when allowGridView is false', () => {
    render(<ListViewType {...getDefaultProps()} allowGridView={false} />);
    const spans = screen.getAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(2); // list, menu
  });

  it('does not render menu button when allowMenuView is false', () => {
    render(<ListViewType {...getDefaultProps()} allowMenuView={false} />);
    const spans = screen.getAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(2); // list, grid
  });

  it('renders only grid button when only allowGridView is true', () => {
    render(
      <ListViewType
        {...getDefaultProps()}
        allowListView={false}
        allowMenuView={false}
      />,
    );
    const spans = screen.getAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(1); // only grid
  });

  it('renders only list button when only allowListView is true', () => {
    render(
      <ListViewType
        {...getDefaultProps()}
        allowGridView={false}
        allowMenuView={false}
      />,
    );
    const spans = screen.getAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(1); // only list
  });

  it('renders only menu button when only allowMenuView is true', () => {
    render(
      <ListViewType
        {...getDefaultProps()}
        allowListView={false}
        allowGridView={false}
      />,
    );
    const spans = screen.getAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(1); // only menu
  });

  it('renders empty div when no view types are allowed', () => {
    render(
      <ListViewType
        {...getDefaultProps()}
        allowListView={false}
        allowGridView={false}
        allowMenuView={false}
      />,
    );
    const spans = screen.queryAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(0);
  });

  it('renders empty div when viewType is not grid, list, or menu', () => {
    render(<ListViewType {...getDefaultProps()} viewType="unknown" />);
    const spans = screen.queryAllByText('', { selector: 'span' });
    expect(spans).toHaveLength(0);
  });

  it('has correct class names for the container', () => {
    const { container } = render(<ListViewType {...getDefaultProps()} />);
    expect(container.firstChild).toHaveClass(
      'd-flex',
      'flex-gap-1/2',
      'view_type__hidden',
    );
  });

  it('has correct class names for spans', () => {
    render(<ListViewType {...getDefaultProps()} />);
    const spans = screen.getAllByText('', { selector: 'span' });
    spans.forEach((span) => {
      expect(span).toHaveClass('cursor-pointer');
    });
  });

  it('handles multiple clicks on different buttons', () => {
    render(<ListViewType {...getDefaultProps()} />);
    const spans = screen.getAllByText('', { selector: 'span' });

    // Click list button
    fireEvent.click(spans[0]);
    expect(setViewType).toHaveBeenCalledWith('list');

    // Click grid button
    fireEvent.click(spans[1]);
    expect(setViewType).toHaveBeenCalledWith('grid');

    // Click menu button
    fireEvent.click(spans[2]);
    expect(setViewType).toHaveBeenCalledWith('menu');
    expect(setShowFilter).toHaveBeenCalledWith(false);
  });

  it('handles different view type combinations', () => {
    // Test grid view with all buttons
    const { rerender } = render(
      <ListViewType {...getDefaultProps()} viewType="grid" />,
    );
    expect(screen.getAllByText('', { selector: 'span' })).toHaveLength(3);

    // Test list view with all buttons
    rerender(<ListViewType {...getDefaultProps()} viewType="list" />);
    expect(screen.getAllByText('', { selector: 'span' })).toHaveLength(3);

    // Test menu view with all buttons
    rerender(<ListViewType {...getDefaultProps()} viewType="menu" />);
    expect(screen.getAllByText('', { selector: 'span' })).toHaveLength(3);
  });

  it('handles different allow combinations', () => {
    // Test with only list and grid
    const { rerender } = render(
      <ListViewType {...getDefaultProps()} allowMenuView={false} />,
    );
    expect(screen.getAllByText('', { selector: 'span' })).toHaveLength(2);

    // Test with only list and menu
    rerender(<ListViewType {...getDefaultProps()} allowGridView={false} />);
    expect(screen.getAllByText('', { selector: 'span' })).toHaveLength(2);

    // Test with only grid and menu
    rerender(<ListViewType {...getDefaultProps()} allowListView={false} />);
    expect(screen.getAllByText('', { selector: 'span' })).toHaveLength(2);
  });
});
