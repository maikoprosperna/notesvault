/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { render, screen } from '@testing-library/react';
import * as Columns from '../MyOrdersTableSection.Columns';

jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  return (...args: any[]) => actualMoment(...args);
});

jest.mock('lodash', () => ({
  startCase: (str: string) => `StartCase(${str})`,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    <img {...props} alt="" data-testid="next-image-mock" />
  ),
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('MyOrdersTableSection.Columns', () => {
  const baseInfo = (overrides: any = {}) => ({
    getValue: jest.fn(() => overrides.value ?? 'test-value'),
    row: {
      original: {
        shipping_information: { type: '' },
        payment_information: { type: '', status: '', reference_id: '' },
        order_id: 'OID123',
        order_total_amount: 123.45,
        createdAt: '2024-01-01T12:00:00Z',
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
        ...overrides.original,
      },
    },
    ...overrides,
  });

  it('ItemColumn renders link with product image', () => {
    const info = baseInfo({ value: 'item-id' });
    render(Columns.ItemColumn(info));
    expect(screen.getByText('item-id')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href');
    expect(screen.getByTestId('next-image-mock')).toBeInTheDocument();
    expect(screen.getByTestId('next-image-mock')).toHaveAttribute(
      'src',
      '/test-image.jpg',
    );
  });

  it('MobileItemColumn renders link with product image and date', () => {
    const info = baseInfo({ value: 'item-id' });
    render(Columns.MobileItemColumn(info));
    expect(screen.getByText('item-id')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href');
    expect(screen.getByTestId('next-image-mock')).toBeInTheDocument();
    expect(screen.getByTestId('next-image-mock')).toHaveAttribute(
      'src',
      '/test-image.jpg',
    );
    expect(screen.getByText(/01-01-2024/)).toBeInTheDocument();
  });

  it('ItemColumn renders with variant image when available', () => {
    const info = baseInfo({
      value: 'item-id',
      original: {
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
      },
    });
    render(Columns.ItemColumn(info));
    expect(screen.getByTestId('next-image-mock')).toHaveAttribute(
      'src',
      '/variant-image.jpg',
    );
  });

  it('MobileItemColumn renders with variant image when available', () => {
    const info = baseInfo({
      value: 'item-id',
      original: {
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
      },
    });
    render(Columns.MobileItemColumn(info));
    expect(screen.getByTestId('next-image-mock')).toHaveAttribute(
      'src',
      '/variant-image.jpg',
    );
  });

  it('ItemColumn renders with fallback image when no product image', () => {
    const info = baseInfo({
      value: 'item-id',
      original: {
        ordered_items_list: [],
      },
    });
    render(Columns.ItemColumn(info));
    expect(screen.getByTestId('next-image-mock')).toHaveAttribute(
      'src',
      '/Images/no-image.png',
    );
  });

  it('MobileItemColumn renders with fallback image when no product image', () => {
    const info = baseInfo({
      value: 'item-id',
      original: {
        ordered_items_list: [],
      },
    });
    render(Columns.MobileItemColumn(info));
    expect(screen.getByTestId('next-image-mock')).toHaveAttribute(
      'src',
      '/Images/no-image.png',
    );
  });

  it('DateColumn renders formatted date', () => {
    const info = baseInfo({ value: '2024-01-01T12:00:00Z' });
    render(Columns.DateColumn(info));
    expect(screen.getByText(/\d{2}-\d{2}-\d{4}/)).toBeInTheDocument();
  });

  describe('DeliveryTimeColumn', () => {
    it('renders N/A for Store Pickup', () => {
      const info = baseInfo({
        value: '2024-01-01T12:00:00Z',
        original: { shipping_information: { type: 'Store Pickup' } },
      });
      render(Columns.DeliveryTimeColumn(info));
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
    it('renders N/A for Book My Own', () => {
      const info = baseInfo({
        value: '2024-01-01T12:00:00Z',
        original: { shipping_information: { type: 'Book My Own' } },
      });
      render(Columns.DeliveryTimeColumn(info));
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
    it('renders Deliver Now for empty value', () => {
      const info = baseInfo({ value: '' });
      render(Columns.DeliveryTimeColumn(info));
      expect(screen.getByText('Deliver Now')).toBeInTheDocument();
    });
    it('renders formatted date otherwise', () => {
      const info = baseInfo({ value: '2024-01-01T12:00:00Z' });
      render(Columns.DeliveryTimeColumn(info));
      expect(screen.getByText(/\d{2}-\d{2}-\d{4}/)).toBeInTheDocument();
    });
  });

  it('PriceColumn renders formatted price', () => {
    const info = baseInfo({ value: 123.45 });
    render(Columns.PriceColumn(info));
    expect(screen.getByText(/123.45/)).toBeInTheDocument();
  });

  it('StatusColumn renders badge with correct class', () => {
    const info = baseInfo({ value: 'Pending' });
    render(Columns.StatusColumn(info));
    expect(screen.getByText('Pending')).toHaveClass(
      'badge',
      'pending',
      'status',
    );
  });

  describe('PaymentLinkColumn', () => {
    it('renders N/A for COP', () => {
      const info = baseInfo({
        original: { payment_information: { type: 'COP' } },
      });
      render(Columns.PaymentLinkColumn(info));
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
    it('renders N/A for COD', () => {
      const info = baseInfo({
        original: { payment_information: { type: 'COD' } },
      });
      render(Columns.PaymentLinkColumn(info));
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
    it('renders Payment Link as div for Paid', () => {
      const info = baseInfo({
        original: { payment_information: { type: 'OTHER', status: 'Paid' } },
      });
      render(Columns.PaymentLinkColumn(info));
      expect(screen.getByText('Payment Link')).toBeInTheDocument();
      expect(screen.getByText('Payment Link').tagName).toBe('DIV');
    });
    it('renders Payment Link as div for PAID', () => {
      const info = baseInfo({
        original: { payment_information: { type: 'OTHER', status: 'PAID' } },
      });
      render(Columns.PaymentLinkColumn(info));
      expect(screen.getByText('Payment Link')).toBeInTheDocument();
    });
    it('renders Payment Link as link for OTC with all params', () => {
      const info = baseInfo({
        original: {
          payment_information: {
            type: 'OVER_THE_COUNTER',
            reference_id: 'OTC123',
            status: '',
          },
          order_id: 'OID123',
          order_total_amount: 100,
        },
      });
      render(Columns.PaymentLinkColumn(info));
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        expect.stringContaining('/checkout/thank-you?otc=OTC123'),
      );
    });
    it('renders N/A for OTC with missing params', () => {
      const info = baseInfo({
        original: {
          payment_information: {
            type: 'OVER_THE_COUNTER',
            reference_id: undefined,
            status: '',
          },
          order_id: undefined,
          order_total_amount: undefined,
        },
      });
      render(Columns.PaymentLinkColumn(info));
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  it('PaymentStatusColumn renders badge with correct class', () => {
    const info = baseInfo({ value: 'Paid' });
    render(Columns.PaymentStatusColumn(info));
    expect(screen.getByText('Paid')).toHaveClass('badge', 'paid', 'status');
  });

  it('PaymentTypeColumn renders start case', () => {
    const info = baseInfo({ value: 'over_the_counter' });
    render(Columns.PaymentTypeColumn(info));
    expect(screen.getByText('StartCase(over_the_counter)')).toBeInTheDocument();
  });

  describe('LocationColumn', () => {
    it('renders all location statuses', () => {
      const info = baseInfo({
        value: [
          { location_name: 'Loc1+Extra', status: 'inactive' },
          { location_name: 'Loc2+Extra', status: 'soft_deleted' },
          { location_name: 'Loc3+Extra', status: 'active' },
        ],
      });
      render(Columns.LocationColumn(info));
      expect(screen.getByText('Loc1 (Deactivated)')).toBeInTheDocument();
      expect(screen.getByText('Loc2 (No Longer Exists)')).toBeInTheDocument();
      expect(screen.getByText('Loc3')).toBeInTheDocument();
    });
    it('renders nothing for empty value', () => {
      const info = baseInfo({ value: [] });
      render(Columns.LocationColumn(info));
      // Should not throw
    });
  });
});
