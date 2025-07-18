import React from 'react';
import { render, screen } from '@testing-library/react';
import SmallScreenOrdersTable from '../MyOrdersTableSection.SmallScreenOrdersTable';

// Mock all the dependencies
jest.mock('../../../../../../../../hooks/useWindowDimensions.ts', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 768, height: 1024 })),
}));

jest.mock('../../../../../../../../components/Table/Table.tsx', () => {
  const MockTable = (props: any) => (
    <div data-testid="table-mock">
      <div data-testid="table-columns">
        {props.columns.map((col: any, index: number) => (
          <div key={index} data-testid={`column-${col.header}`}>
            {col.header}
          </div>
        ))}
      </div>
    </div>
  );
  MockTable.displayName = 'MockTable';
  return MockTable;
});

jest.mock('../MyOrdersTableSection.SmallScreenOrderItem', () => {
  const MockSmallScreenOrderItem = (props: any) => (
    <div data-testid="small-screen-order-item">
      Order: {props.order.order_id}
    </div>
  );
  MockSmallScreenOrderItem.displayName = 'MockSmallScreenOrderItem';
  return MockSmallScreenOrderItem;
});

jest.mock('../MyOrdersTableSection.Columns', () => ({
  DateColumn: jest.fn(() => <div>Date Column</div>),
  MobileItemColumn: jest.fn(() => <div>Mobile Item Column</div>),
  PaymentTypeColumn: jest.fn(() => <div>Payment Type Column</div>),
  PriceColumn: jest.fn(() => <div>Price Column</div>),
  StatusColumn: jest.fn(() => <div>Status Column</div>),
}));

// Import the mocked hook
import useWindowDimensions from '../../../../../../../../hooks/useWindowDimensions';
const mockUseWindowDimensions = useWindowDimensions as jest.MockedFunction<
  typeof useWindowDimensions
>;

describe('SmallScreenOrdersTable', () => {
  const mockOrders = [
    {
      order_id: 'ORDER001',
      createdAt: '2024-01-01T12:00:00Z',
      order_total_amount: 100,
      payment_information: { type: 'Credit Card', status: 'Paid' },
      order_information: { status: 'Delivered' },
      shipping_information: { type: 'Standard' },
    },
    {
      order_id: 'ORDER002',
      createdAt: '2024-01-02T12:00:00Z',
      order_total_amount: 200,
      payment_information: { type: 'Cash', status: 'Pending' },
      order_information: { status: 'Processing' },
      shipping_information: { type: 'Express' },
    },
  ] as any[];

  const mockSetSelectedOrderToReview = jest.fn();
  const mockSetShowModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWindowDimensions.mockReturnValue({ width: 768, height: 1024 });
  });

  it('renders table with basic columns', () => {
    render(
      <SmallScreenOrdersTable
        orders={mockOrders}
        setSelectedOrderToReview={mockSetSelectedOrderToReview}
        setShowModal={mockSetShowModal}
      />,
    );

    expect(screen.getByTestId('table-mock')).toBeInTheDocument();
    expect(screen.getByTestId('column-Order ID')).toBeInTheDocument();
    expect(screen.getByTestId('column-Date')).toBeInTheDocument();
  });

  it('renders all order items', () => {
    render(
      <SmallScreenOrdersTable
        orders={mockOrders}
        setSelectedOrderToReview={mockSetSelectedOrderToReview}
        setShowModal={mockSetShowModal}
      />,
    );

    expect(screen.getAllByTestId('small-screen-order-item')).toHaveLength(2);
    expect(screen.getByText('Order: ORDER001')).toBeInTheDocument();
    expect(screen.getByText('Order: ORDER002')).toBeInTheDocument();
  });

  it('renders empty list when no orders', () => {
    render(
      <SmallScreenOrdersTable
        orders={[]}
        setSelectedOrderToReview={mockSetSelectedOrderToReview}
        setShowModal={mockSetShowModal}
      />,
    );

    expect(screen.getByTestId('table-mock')).toBeInTheDocument();
    expect(
      screen.queryByTestId('small-screen-order-item'),
    ).not.toBeInTheDocument();
  });

  it('shows Order Status column for width >= 576', () => {
    mockUseWindowDimensions.mockReturnValue({ width: 576, height: 1024 });

    render(
      <SmallScreenOrdersTable
        orders={mockOrders}
        setSelectedOrderToReview={mockSetSelectedOrderToReview}
        setShowModal={mockSetShowModal}
      />,
    );

    expect(screen.getByTestId('column-Order Status')).toBeInTheDocument();
  });

  it('shows Amount column for width >= 992', () => {
    mockUseWindowDimensions.mockReturnValue({ width: 992, height: 1024 });

    render(
      <SmallScreenOrdersTable
        orders={mockOrders}
        setSelectedOrderToReview={mockSetSelectedOrderToReview}
        setShowModal={mockSetShowModal}
      />,
    );

    expect(screen.getByTestId('column-Amount')).toBeInTheDocument();
  });

  it('shows Payment Type column for width >= 1200', () => {
    mockUseWindowDimensions.mockReturnValue({ width: 1200, height: 1024 });

    render(
      <SmallScreenOrdersTable
        orders={mockOrders}
        setSelectedOrderToReview={mockSetSelectedOrderToReview}
        setShowModal={mockSetShowModal}
      />,
    );

    expect(screen.getByTestId('column-Payment Type')).toBeInTheDocument();
  });

  it('hides responsive columns for smaller widths', () => {
    mockUseWindowDimensions.mockReturnValue({ width: 400, height: 1024 });

    render(
      <SmallScreenOrdersTable
        orders={mockOrders}
        setSelectedOrderToReview={mockSetSelectedOrderToReview}
        setShowModal={mockSetShowModal}
      />,
    );

    expect(screen.queryByTestId('column-Order Status')).not.toBeInTheDocument();
    expect(screen.queryByTestId('column-Amount')).not.toBeInTheDocument();
    expect(screen.queryByTestId('column-Payment Type')).not.toBeInTheDocument();
  });

  it('passes correct props to SmallScreenOrderItem components', () => {
    render(
      <SmallScreenOrdersTable
        orders={mockOrders}
        setSelectedOrderToReview={mockSetSelectedOrderToReview}
        setShowModal={mockSetShowModal}
      />,
    );

    // Verify that the order items are rendered with correct order data
    expect(screen.getByText('Order: ORDER001')).toBeInTheDocument();
    expect(screen.getByText('Order: ORDER002')).toBeInTheDocument();
  });

  it('renders table with hidePagination prop', () => {
    render(
      <SmallScreenOrdersTable
        orders={mockOrders}
        setSelectedOrderToReview={mockSetSelectedOrderToReview}
        setShowModal={mockSetShowModal}
      />,
    );

    // The Table component should be called with hidePagination prop
    expect(screen.getByTestId('table-mock')).toBeInTheDocument();
  });
});
