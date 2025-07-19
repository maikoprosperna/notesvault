/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderDetails from '../OrderDetails';
import { IStoreInfo, IStoreLocationDetails } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    <img {...props} alt="" data-testid="next-image-mock" />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} data-testid="next-link-mock">
      {children}
    </a>
  ),
}));

// Mock react-barcode
jest.mock('react-barcode', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="barcode-mock">{props.value}</div>,
}));

// Mock DesignSettings component
jest.mock('@/components/DesignSettings', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="design-settings-mock">
      {JSON.stringify(props.storeData)}
    </div>
  ),
}));

// Mock PageTitleAndBreadcrumb component
jest.mock(
  '../../../../../_components/PageTitleAndBreadCrumb/PageTitleAndBreadCrumb.tsx',
  () => ({
    __esModule: true,
    default: (props: any) => (
      <div data-testid="page-title-mock">
        <h1>{props.pageTitle}</h1>
        <div data-testid="breadcrumbs">{JSON.stringify(props.breadcrumbs)}</div>
      </div>
    ),
  }),
);

// Mock InvoiceOrdersTable component
jest.mock(
  '../../../../../../(protected)/my-orders/[orderId]/_components/InvoiceOrdersTable/InvoiceOrdersTable.tsx',
  () => ({
    __esModule: true,
    default: (props: any) => (
      <div data-testid="invoice-orders-table-mock">
        {JSON.stringify({ items: props.orderItems })}
      </div>
    ),
  }),
);

// Mock OrderComments component
jest.mock('../OrderDetails.Comments', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="order-comments-mock">
      <div data-testid="comment-text">{props.commentText}</div>
      <div data-testid="product-imgs">{JSON.stringify(props.productImgs)}</div>
    </div>
  ),
}));

// Mock constants
jest.mock('../../../../../../../../../constants/index.ts', () => ({
  CURRENCY: '₱',
  MEDIA_URL: 'https://test.media.url',
}));

// Mock useOrderDetails hook
jest.mock('../useOrderDetails', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    storeName: 'Test Store',
    storeLogo: 'test-logo.png',
    facebookLink: 'https://facebook.com/test',
    instagramLink: 'https://instagram.com/test',
    storeEmail: 'test@store.com',
    billingAddress: '123 Test St, Test City',
    customerName: 'John Doe',
    orderDetails: {
      orderDate: '2024-03-20',
      orderStatus: 'Pending',
      orderDeliveryDate: '2024-03-21',
      orderItems: [],
      orderNotes: 'Test notes',
      discountAmount: '10.00',
      orderSubTotal: '100.00',
      orderConvenienceFee: '5.00',
      orderAdditionalFee: '2.00',
      orderGrandTotal: '97.00',
      hasDownloadAllLinks: true,
      downloadLinkAll: '/download/all',
      showOrderComments: true,
      orderComment: 'Test comment',
      orderCommentAttachments: ['img1.jpg'],
    },
    orderData: {
      delivery_information: {
        meta_data: {
          shareLink: 'https://tracking.test',
        },
      },
      store_locations: [
        {
          location_name: 'Main Branch',
          storeAddress: {
            address: '123 Main St',
            barangay: { barangayName: 'Test Brgy' },
            city: { municipalityName: 'Test City' },
            postal_code: '1234',
            province: { provinceName: 'Test Province' },
          },
        },
      ],
      payment_information: {
        type: 'OVER_THE_COUNTER',
        reference_id: '123456789',
      },
      reference_number: 'REF123',
      table_number: 'T1',
      fees: {
        customer_shipping_fee: 50,
      },
      order_coupon: [],
    },
  }),
}));

describe('OrderDetails Component', () => {
  const mockProps = {
    store: {
      data: {
        store: {} as IStoreInfo,
      },
    },
    orderId: 'order-123',
    location: {
      name: 'Test Location',
      value: 'test-value',
    },
    StoreLocations: [] as IStoreLocationDetails[],
  };

  const queryClient = new QueryClient();

  const renderWithQueryClient = (ui: React.ReactElement) =>
    render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );

  test('renders all components and basic information', () => {
    renderWithQueryClient(<OrderDetails {...mockProps} />);

    // Check if all major components are rendered
    expect(screen.getByTestId('design-settings-mock')).toBeInTheDocument();
    expect(screen.getByTestId('page-title-mock')).toBeInTheDocument();
    expect(screen.getByTestId('invoice-orders-table-mock')).toBeInTheDocument();
    expect(screen.getAllByTestId('next-image-mock')).toHaveLength(4); // Logo, 7-11, FB, IG
    expect(screen.getAllByText('Invoice')).toHaveLength(2); // Both h1 and h2
    expect(screen.getByText('Main Branch')).toBeInTheDocument();
  });

  test('renders order details and status information', () => {
    renderWithQueryClient(<OrderDetails {...mockProps} />);

    // Check order date
    const orderDateLabel = screen.getByText(/^Order Date:$/i);
    expect(orderDateLabel).toBeInTheDocument();
    expect(orderDateLabel.parentElement).toHaveTextContent('2024-03-20');

    // Check order status
    const orderStatusLabel = screen.getByText(/^Order Status:$/i);
    expect(orderStatusLabel).toBeInTheDocument();
    expect(orderStatusLabel.parentElement).toHaveTextContent('Pending');

    // Check order ID
    const orderIdLabel = screen.getByText(/^Order ID:$/i);
    expect(orderIdLabel).toBeInTheDocument();
    expect(orderIdLabel.parentElement).toHaveTextContent('order-123');
  });

  test('renders payment and shipping information', () => {
    renderWithQueryClient(<OrderDetails {...mockProps} />);

    // Check billing address
    const billingAddressSection = screen
      .getByText(/^Billing Address$/i)
      .closest('.col-sm-6');
    expect(billingAddressSection).toBeInTheDocument();
    expect(billingAddressSection?.querySelector('span')).toHaveTextContent(
      '123 Test St, Test City',
    );

    // Check shipping address
    const shippingAddressSection = screen
      .getByText(/^Shipping Address$/i)
      .closest('.col-sm-6');
    expect(shippingAddressSection).toBeInTheDocument();
    expect(shippingAddressSection?.querySelector('span')).toHaveTextContent(
      '123 Test St, Test City',
    );
  });

  test('renders tracking link when available', () => {
    renderWithQueryClient(<OrderDetails {...mockProps} />);

    const riderText = screen.getByText(/See real-time location of rider/i);
    expect(riderText).toBeInTheDocument();
    const trackingLink = screen.getByRole('link', { name: 'here' });
    expect(trackingLink).toHaveAttribute('href', 'https://tracking.test');
  });

  test('renders OTC payment information when available', () => {
    renderWithQueryClient(<OrderDetails {...mockProps} />);

    expect(screen.getByText(/^Payment Code$/)).toBeInTheDocument();
    expect(screen.getByTestId('barcode-mock')).toHaveTextContent('123456789');
  });

  test('renders order totals and fees', () => {
    renderWithQueryClient(<OrderDetails {...mockProps} />);

    // Check subtotal
    const subtotalRow = screen.getByText(/^Subtotal:$/i).closest('.row');
    expect(subtotalRow).toBeInTheDocument();
    expect(
      subtotalRow?.querySelector('.justify-content-end'),
    ).toHaveTextContent('100.00');

    // Check convenience fee
    const convenienceFeeRow = screen
      .getByText(/^Convenience Fee:$/i)
      .closest('.row');
    expect(convenienceFeeRow).toBeInTheDocument();
    expect(
      convenienceFeeRow?.querySelector('.justify-content-end'),
    ).toHaveTextContent('5.00');

    // Check additional fee
    const additionalFeeRow = screen
      .getByText(/^Additional Fee:$/i)
      .closest('.row');
    expect(additionalFeeRow).toBeInTheDocument();
    expect(
      additionalFeeRow?.querySelector('.justify-content-end'),
    ).toHaveTextContent('2.00');

    // Check grand total
    const grandTotalText = screen.getByText(/₱\s*97\.00/);
    expect(grandTotalText).toBeInTheDocument();
  });

  test('renders order comments when available', () => {
    renderWithQueryClient(<OrderDetails {...mockProps} />);

    expect(screen.getByTestId('order-comments-mock')).toBeInTheDocument();
    expect(screen.getByTestId('comment-text')).toHaveTextContent(
      'Test comment',
    );
  });

  test('renders QR menu information when available', () => {
    renderWithQueryClient(<OrderDetails {...mockProps} />);

    expect(screen.getByText('Reference Number')).toBeInTheDocument();
    expect(screen.getByText('REF123')).toBeInTheDocument();
    expect(screen.getByText('Table Number')).toBeInTheDocument();
    expect(screen.getByText('Table #T1')).toBeInTheDocument();
    expect(screen.getByText('Ordered via QR Menu')).toBeInTheDocument();
  });

  test('renders with free shipping when coupon is applied', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderData: {
        ...useOrderDetailsMock().orderData,
        order_coupon: [
          {
            coupon_data: {
              coupon_type: {
                type: 'FREE_SHIPPING',
              },
            },
          },
        ],
      },
    });

    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.getByText('Free Shipping')).toBeInTheDocument();
  });

  test('renders without customer name when N/A', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      customerName: 'N/A',
    });

    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.queryByText(/Hi, N\/A/)).not.toBeInTheDocument();
  });

  test('renders without table number when N/A', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderData: {
        ...useOrderDetailsMock().orderData,
        table_number: 'N/A',
      },
    });

    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.queryByText(/Table #N\/A/)).not.toBeInTheDocument();
  });

  test('renders without tracking link when not available', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderData: {
        ...useOrderDetailsMock().orderData,
        delivery_information: {
          meta_data: {
            shareLink: '',
          },
        },
      },
    });

    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(
      screen.queryByText('See real-time location of rider'),
    ).not.toBeInTheDocument();
  });

  test('renders without OTC payment information when not available', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderData: {
        ...useOrderDetailsMock().orderData,
        payment_information: {
          type: 'CREDIT_CARD',
        },
      },
    });

    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.queryByText('Payment Code')).not.toBeInTheDocument();
    expect(screen.queryByTestId('barcode-mock')).not.toBeInTheDocument();
  });

  test('does not render download all link when hasDownloadAllLinks is false', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderDetails: {
        ...useOrderDetailsMock().orderDetails,
        hasDownloadAllLinks: false,
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.queryByText('DOWNLOAD ALL')).not.toBeInTheDocument();
  });

  test('does not render order comments when showOrderComments is false', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderDetails: {
        ...useOrderDetailsMock().orderDetails,
        showOrderComments: false,
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.queryByTestId('order-comments-mock')).not.toBeInTheDocument();
  });

  test('does not render discount row when discountAmount is null', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderDetails: {
        ...useOrderDetailsMock().orderDetails,
        discountAmount: null,
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.queryByText('Discount:')).not.toBeInTheDocument();
  });

  test('does not render scheduled date of arrival when orderDeliveryDate is undefined', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderDetails: {
        ...useOrderDetailsMock().orderDetails,
        orderDeliveryDate: undefined,
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(
      screen.queryByText('Scheduled Date of Arrival:'),
    ).not.toBeInTheDocument();
  });

  test('renders gracefully when store_locations is empty', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderData: {
        ...useOrderDetailsMock().orderData,
        store_locations: [],
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    // Should not throw and should render Invoice
    expect(screen.getAllByText('Invoice').length).toBeGreaterThan(0);
  });

  test('renders gracefully when store_locations is undefined', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderData: {
        ...useOrderDetailsMock().orderData,
        store_locations: undefined,
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.getAllByText('Invoice').length).toBeGreaterThan(0);
  });

  test('renders gracefully when storeAddress is undefined', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderData: {
        ...useOrderDetailsMock().orderData,
        store_locations: [
          {
            location_name: 'Main Branch',
            storeAddress: undefined,
          },
        ],
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.getAllByText('Invoice').length).toBeGreaterThan(0);
  });

  test('renders shipping fee as 0 when hasFreeShipping is false and customer_shipping_fee is 0', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderData: {
        ...useOrderDetailsMock().orderData,
        order_coupon: [],
        fees: { customer_shipping_fee: 0 },
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    const shippingFeeRow = screen.getByText('Shipping Fee:').closest('.row');
    expect(shippingFeeRow).toBeInTheDocument();
    expect(shippingFeeRow?.textContent).toMatch(/0(\.00)?/);
  });

  test('renders shipping fee as 0 when hasFreeShipping is false and customer_shipping_fee is undefined', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderData: {
        ...useOrderDetailsMock().orderData,
        order_coupon: [],
        fees: {},
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    const shippingFeeRow = screen.getByText('Shipping Fee:').closest('.row');
    expect(shippingFeeRow).toBeInTheDocument();
    expect(shippingFeeRow?.textContent).toMatch(/0(\.00)?/);
  });

  test('renders with empty facebookLink, instagramLink, and storeEmail', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      facebookLink: '',
      instagramLink: '',
      storeEmail: '',
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.getByTestId('design-settings-mock')).toBeInTheDocument();
  });

  test('does not render download all link when downloadLinkAll is empty', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderDetails: {
        ...useOrderDetailsMock().orderDetails,
        hasDownloadAllLinks: true,
        downloadLinkAll: '',
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    expect(screen.queryByText('DOWNLOAD ALL')).not.toBeInTheDocument();
  });

  test('renders InvoiceOrdersTable with mapped orderItems', () => {
    const useOrderDetailsMock = jest.requireMock('../useOrderDetails').default;
    const customOrderItems = [
      { id: 1, name: 'Product 1', order_status: '', extra: 'test' },
      { id: 2, name: 'Product 2', order_status: '', extra: 'test2' },
    ];
    useOrderDetailsMock.mockReturnValueOnce({
      ...useOrderDetailsMock(),
      orderDetails: {
        ...useOrderDetailsMock().orderDetails,
        orderItems: customOrderItems,
      },
    });
    renderWithQueryClient(<OrderDetails {...mockProps} />);
    // The InvoiceOrdersTable mock renders the items as JSON
    expect(screen.getByTestId('invoice-orders-table-mock')).toHaveTextContent(
      JSON.stringify({
        items: [
          { id: 1, name: 'Product 1', order_status: 'Pending', extra: 'test' },
          { id: 2, name: 'Product 2', order_status: 'Pending', extra: 'test2' },
        ],
      }),
    );
  });
});
