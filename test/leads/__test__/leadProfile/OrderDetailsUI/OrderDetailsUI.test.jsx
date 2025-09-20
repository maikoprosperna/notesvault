/* eslint-disable */
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import OrderDetailsUI from '../../../leadProfile/OrderDetailsUI/OrderDetailsUI';

// Mock dependencies
vi.mock('../../../../../components/Shared/Custom/utilities', () => ({
  Section: ({ children, className }) => (
    <div className={className} data-testid="section">
      {children}
    </div>
  ),
  ToCurrencyFormat: (value) => `$${value}`,
}));

vi.mock('../../../../../constants/currency', () => ({
  CURRENCY: '₱',
}));

vi.mock('lodash', () => ({
  default: {
    find: (array, predicate) => {
      return array.find(predicate);
    },
  },
}));

describe('OrderDetailsUI', () => {
  const mockOrderData = {
    order_id: 'order-123',
    order_information: {
      status: 'Completed',
    },
    payment_information: {
      type: 'CREDIT_CARD',
    },
    order_total_amount: 1000,
    order_subtotal_amount: 900,
    fees: {
      shipping_fee: 50,
      payment_gateway_fee: 30,
      convenience_fee: 20,
    },
    ordered_items_list: [
      {
        id: 'item-1',
        cart_quantity: 2,
        product_data: {
          product_specification: {
            name: 'Test Product 1',
          },
          product_price: {
            regular_price: 400,
          },
        },
      },
      {
        id: 'item-2',
        cart_quantity: 1,
        product_data: {
          product_specification: {
            name: 'Test Product 2',
          },
          product_price: {
            regular_price: 100,
          },
        },
      },
    ],
  };

  const mockOrdersData = [mockOrderData];

  it('should render order details with correct information', () => {
    render(
      <OrderDetailsUI
        orderDetailsView="order-123"
        dataGetLeadOrders={mockOrdersData}
      />,
    );

    expect(screen.getByText('Order Details')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getAllByText('Variant')).toHaveLength(2);
  });

  it('should display order totals correctly', () => {
    render(
      <OrderDetailsUI
        orderDetailsView="order-123"
        dataGetLeadOrders={mockOrdersData}
      />,
    );

    expect(screen.getByText('Grand Total:')).toBeInTheDocument();
    expect(screen.getByText('Shipping Fee:')).toBeInTheDocument();
    expect(screen.getByText('Payment Gateway Fee:')).toBeInTheDocument();
    expect(screen.getByText('Convenience Fee:')).toBeInTheDocument();
    expect(screen.getByText('TOTAL AMOUNT')).toBeInTheDocument();
  });

  it('should display order status and payment method', () => {
    render(
      <OrderDetailsUI
        orderDetailsView="order-123"
        dataGetLeadOrders={mockOrdersData}
      />,
    );

    expect(screen.getByText('ORDER STATUS')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('PAYMENT METHOD')).toBeInTheDocument();
    expect(screen.getByText('CREDIT CARD')).toBeInTheDocument();
  });

  it('should format payment method by replacing underscores with spaces', () => {
    const orderWithUnderscores = {
      ...mockOrderData,
      payment_information: {
        type: 'CREDIT_CARD_DEBIT',
      },
    };

    render(
      <OrderDetailsUI
        orderDetailsView="order-123"
        dataGetLeadOrders={[orderWithUnderscores]}
      />,
    );

    expect(screen.getByText('CREDIT CARD DEBIT')).toBeInTheDocument();
  });

  it('should handle empty ordered items list', () => {
    const orderWithNoItems = {
      ...mockOrderData,
      ordered_items_list: [],
    };

    render(
      <OrderDetailsUI
        orderDetailsView="order-123"
        dataGetLeadOrders={[orderWithNoItems]}
      />,
    );

    expect(screen.getByText('Order Details')).toBeInTheDocument();
    // Should not crash with empty items list
  });

  it('should handle multiple items in order', () => {
    const orderWithMultipleItems = {
      ...mockOrderData,
      ordered_items_list: [
        {
          id: 'item-1',
          cart_quantity: 3,
          product_data: {
            product_specification: {
              name: 'Product A',
            },
            product_price: {
              regular_price: 200,
            },
          },
        },
        {
          id: 'item-2',
          cart_quantity: 1,
          product_data: {
            product_specification: {
              name: 'Product B',
            },
            product_price: {
              regular_price: 500,
            },
          },
        },
        {
          id: 'item-3',
          cart_quantity: 2,
          product_data: {
            product_specification: {
              name: 'Product C',
            },
            product_price: {
              regular_price: 150,
            },
          },
        },
      ],
    };

    render(
      <OrderDetailsUI
        orderDetailsView="order-123"
        dataGetLeadOrders={[orderWithMultipleItems]}
      />,
    );

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
    expect(screen.getByText('Product C')).toBeInTheDocument();
    expect(screen.getByText('x3')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
  });


  it('should handle different order statuses', () => {
    const testCases = [
      { status: 'Pending', expected: 'Pending' },
      { status: 'Processing', expected: 'Processing' },
      { status: 'Shipped', expected: 'Shipped' },
      { status: 'Delivered', expected: 'Delivered' },
      { status: 'Cancelled', expected: 'Cancelled' },
    ];

    testCases.forEach(({ status, expected }) => {
      const orderWithStatus = {
        ...mockOrderData,
        order_information: { status },
      };

      const { unmount } = render(
        <OrderDetailsUI
          orderDetailsView="order-123"
          dataGetLeadOrders={[orderWithStatus]}
        />,
      );

      expect(screen.getByText(expected)).toBeInTheDocument();
      unmount();
    });
  });

  it('should handle different payment methods', () => {
    const testCases = [
      { type: 'CREDIT_CARD', expected: 'CREDIT CARD' },
      { type: 'DEBIT_CARD', expected: 'DEBIT CARD' },
      { type: 'PAYPAL', expected: 'PAYPAL' },
      { type: 'BANK_TRANSFER', expected: 'BANK TRANSFER' },
      { type: 'CASH_ON_DELIVERY', expected: 'CASH ON DELIVERY' },
    ];

    testCases.forEach(({ type, expected }) => {
      const orderWithPaymentType = {
        ...mockOrderData,
        payment_information: { type },
      };

      const { unmount } = render(
        <OrderDetailsUI
          orderDetailsView="order-123"
          dataGetLeadOrders={[orderWithPaymentType]}
        />,
      );

      expect(screen.getByText(expected)).toBeInTheDocument();
      unmount();
    });
  });


  it('should render all required sections', () => {
    render(
      <OrderDetailsUI
        orderDetailsView="order-123"
        dataGetLeadOrders={mockOrdersData}
      />,
    );

    // Check for all major sections
    expect(screen.getByText('Order Details')).toBeInTheDocument();
    expect(screen.getByText('Grand Total:')).toBeInTheDocument();
    expect(screen.getByText('Shipping Fee:')).toBeInTheDocument();
    expect(screen.getByText('Payment Gateway Fee:')).toBeInTheDocument();
    expect(screen.getByText('Convenience Fee:')).toBeInTheDocument();
    expect(screen.getByText('TOTAL AMOUNT')).toBeInTheDocument();
    expect(screen.getByText('ORDER STATUS')).toBeInTheDocument();
    expect(screen.getByText('PAYMENT METHOD')).toBeInTheDocument();
  });
});
