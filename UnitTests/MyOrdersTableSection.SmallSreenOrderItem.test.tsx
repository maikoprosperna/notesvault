/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SmallScreenOrderItem from '../MyOrdersTableSection.SmallScreenOrderItem';

jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  return (...args: any[]) => actualMoment(...args);
});

jest.mock('@/components/AppButton/AppButton', () => {
  const MockAppButton = (props: any) => (
    <button data-testid="app-button" onClick={props.onClick}>
      {props.title}
    </button>
  );
  MockAppButton.displayName = 'MockAppButton';
  return MockAppButton;
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    <img {...props} alt="" data-testid="next-image-mock" />
  ),
}));

describe('SmallScreenOrderItem', () => {
  const baseOrder = {
    order_id: 'OID123',
    createdAt: '2024-01-01T12:00:00Z',
    order_total_amount: 123.45,
    payment_information: { type: 'Credit Card', status: 'Paid' },
    order_information: { status: 'Delivered' },
    shipping_information: { type: '' },
    order_delivery_date: '2024-01-02T15:00:00Z',
    ordered_items_list: [
      {
        product_data: {
          product_specification: {
            images: [{ image: '/test-image.jpg' }],
          },
        },
        product_variant_combination_id: null,
        selected_variant_combination_data: null,
      },
    ],
  };
  const setSelectedOrderToReview = jest.fn();
  const setShowModal = jest.fn();

  it('renders all main fields with product image', () => {
    render(
      <SmallScreenOrderItem
        order={baseOrder as any}
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.getByText('OID123')).toBeInTheDocument();
    expect(screen.getAllByText('Credit Card').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Paid').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/01-01-2024/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/123.45/).length).toBeGreaterThan(0);
    expect(screen.getByTestId('next-image-mock')).toBeInTheDocument();
    expect(screen.getByTestId('next-image-mock')).toHaveAttribute(
      'src',
      '/test-image.jpg',
    );
  });

  it('renders with variant image when available', () => {
    const orderWithVariant = {
      ...baseOrder,
      ordered_items_list: [
        {
          product_variant_combination_id: 'variant-id',
          selected_variant_combination_data: {
            variant_combination_image: { image: '/variant-image.jpg' },
          },
          product_data: {
            product_specification: {
              images: [{ image: '/test-image.jpg' }],
            },
          },
        },
      ],
    };
    render(
      <SmallScreenOrderItem
        order={orderWithVariant as any}
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.getByTestId('next-image-mock')).toHaveAttribute(
      'src',
      '/variant-image.jpg',
    );
  });

  it('renders with fallback image when no product image', () => {
    const orderWithoutImage = {
      ...baseOrder,
      ordered_items_list: [],
    };
    render(
      <SmallScreenOrderItem
        order={orderWithoutImage as any}
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.getByTestId('next-image-mock')).toHaveAttribute(
      'src',
      '/Images/no-image.png',
    );
  });

  it('renders N/A for Store Pickup delivery time', () => {
    render(
      <SmallScreenOrderItem
        order={
          {
            ...baseOrder,
            shipping_information: { type: 'Store Pickup' },
          } as any
        }
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders N/A for Book My Own delivery time', () => {
    render(
      <SmallScreenOrderItem
        order={
          { ...baseOrder, shipping_information: { type: 'Book My Own' } } as any
        }
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders Deliver Now for empty order_delivery_date', () => {
    render(
      <SmallScreenOrderItem
        order={{ ...baseOrder, order_delivery_date: '' } as any}
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.getByText('Deliver Now')).toBeInTheDocument();
  });

  it('renders formatted delivery date otherwise', () => {
    render(
      <SmallScreenOrderItem
        order={
          { ...baseOrder, order_delivery_date: '2024-01-02T15:00:00Z' } as any
        }
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.getByText(/01-02-2024/)).toBeInTheDocument();
  });

  it('renders badge for order status', () => {
    render(
      <SmallScreenOrderItem
        order={
          { ...baseOrder, order_information: { status: 'Completed' } } as any
        }
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
  });

  it('renders Add Review button only for Completed status and triggers callbacks', () => {
    render(
      <SmallScreenOrderItem
        order={
          { ...baseOrder, order_information: { status: 'Completed' } } as any
        }
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    const button = screen.getByTestId('app-button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(setSelectedOrderToReview).toHaveBeenCalledWith({
      ...baseOrder,
      order_information: { status: 'Completed' },
    });
    expect(setShowModal).toHaveBeenCalledWith(true);
  });

  it('does not render Add Review button for non-Completed status', () => {
    render(
      <SmallScreenOrderItem
        order={
          { ...baseOrder, order_information: { status: 'Delivered' } } as any
        }
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.queryByTestId('app-button')).not.toBeInTheDocument();
  });

  it('renders all responsive fields', () => {
    render(
      <SmallScreenOrderItem
        order={baseOrder as any}
        setSelectedOrderToReview={setSelectedOrderToReview}
        setShowModal={setShowModal}
      />,
    );
    expect(screen.getByText('Order Status')).toBeInTheDocument();
    expect(screen.getByText('Product Type')).toBeInTheDocument();
    expect(screen.getAllByText('Amount').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Payment Type').length).toBeGreaterThan(0);
    expect(screen.getByText('Payment Status')).toBeInTheDocument();
  });
});
