import React from 'react';
import { render, screen } from '@testing-library/react';
import Main from '../Main';
import { IStoreLocationDetails } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock hooks without requiring resolution
jest.mock(
  '@/hooks/useStoreRegistration',
  () => {
    return {
      __esModule: true,
      default: jest.fn().mockReturnValue({
        storeID: 'store-123',
        publicStoreData: { data: { store: { storeName: 'Test Store' } } },
      }),
    };
  },
  { virtual: true },
);

// Mock API calls without requiring resolution
jest.mock(
  '@/api/Order',
  () => {
    return {
      OrderAPI: {
        useGetSingleOrder: jest.fn(),
      },
    };
  },
  { virtual: true },
);

// Mock child components
jest.mock('../OverTheCounter', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="over-the-counter-mock">
        <div data-testid="otc-publicStoreData">{'{}'}</div>
        <div data-testid="otc-code">1234567890</div>
        <div data-testid="otc-total">100</div>
        <div data-testid="otc-paymentStatus">Pending</div>
      </div>
    ),
  };
});

jest.mock('../OrderSummary', () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <div data-testid="order-summary-mock">
        <div data-testid="os-storeID">{props.storeID}</div>
        <div data-testid="os-orderID">{props.orderID}</div>
        <div data-testid="os-type">{props.type}</div>
        <div data-testid="os-table">{props.table}</div>
        <div data-testid="os-paymentType">{props.paymentType}</div>
      </div>
    ),
  };
});

jest.mock(
  '@/components/DesignSettings',
  () => {
    return {
      __esModule: true,
      default: (props: any) => (
        <div data-testid="design-settings-mock">
          {JSON.stringify(props.storeData)}
        </div>
      ),
    };
  },
  { virtual: true },
);

jest.mock(
  '@/components/AppButton/AppButton',
  () => {
    return {
      __esModule: true,
      default: (props: any) => (
        <button
          data-testid="app-button-mock"
          data-href={props.href}
          data-variant={props.variant}
        >
          {props.children}
        </button>
      ),
    };
  },
  { virtual: true },
);

describe('Main Component', () => {
  const mockLocation = { name: 'Test Location', value: '123' };
  const mockStoreLocations = [
    {
      id: '123',
      storeName: 'Test Location',
      storeId: 'store-123',
      storeAddress: {},
      storePhoneNumber: '123456789',
      storeSecondaryPhoneNumber: '',
      storeHours: { open: '9:00', close: '17:00' },
      storeEmail: 'test@example.com',
      status: 'active',
      is_default: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    // Mock all hooks and components to always return static/fake data
    jest.mock('next/navigation', () => ({
      useSearchParams: jest.fn(() => ({
        get: jest.fn(() => 'mock-value'),
      })),
    }));
    jest.mock('@/api/Order', () => ({
      OrderAPI: {
        useGetSingleOrder: jest.fn(() => ({
          data: {
            payment_information: {
              status: 'Pending',
            },
          },
        })),
      },
    }));
  });

  test('renders OTC flow when otc param exists', () => {
    const mockSearchParams = {
      get: jest.fn((key) => {
        if (key === 'otc') return '1234567890';
        if (key === 'total') return '100';
        if (key === 'orderid') return 'order-123';
        return '';
      }),
    };

    const mockUseSearchParams =
      jest.requireMock('next/navigation').useSearchParams;
    mockUseSearchParams.mockReturnValue(mockSearchParams);

    const mockOrderAPI = jest.requireMock('@/api/Order').OrderAPI;
    mockOrderAPI.useGetSingleOrder.mockReturnValue({
      data: {
        payment_information: {
          status: 'Pending',
        },
      },
    });

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Main
          location={mockLocation}
          StoreLocations={mockStoreLocations as IStoreLocationDetails[]}
        />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('design-settings-mock')).toBeInTheDocument();
    expect(screen.getByTestId('over-the-counter-mock')).toBeInTheDocument();
    expect(screen.getByTestId('otc-code')).toHaveTextContent('1234567890');
    expect(screen.getByTestId('otc-total')).toHaveTextContent('100');
    expect(screen.getByTestId('otc-paymentStatus')).toHaveTextContent(
      'Pending',
    );
    expect(screen.getByTestId('app-button-mock')).toBeInTheDocument();
  });

  test('renders OrderSummary when otc param does not exist', () => {
    const mockSearchParams = {
      get: jest.fn((key) => {
        if (key === 'orderid') return 'order-123';
        if (key === 'type') return 'delivery';
        if (key === 'table') return 'table-1';
        if (key === 'paymentType') return 'credit';
        return '';
      }),
    };

    const mockUseSearchParams =
      jest.requireMock('next/navigation').useSearchParams;
    mockUseSearchParams.mockReturnValue(mockSearchParams);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Main
          location={mockLocation}
          StoreLocations={mockStoreLocations as IStoreLocationDetails[]}
        />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('design-settings-mock')).toBeInTheDocument();
    expect(screen.getByTestId('order-summary-mock')).toBeInTheDocument();
    expect(screen.getByTestId('os-type')).toHaveTextContent('delivery');
    expect(screen.getByTestId('os-table')).toHaveTextContent('table-1');
    expect(screen.getByTestId('os-paymentType')).toHaveTextContent('credit');
  });

  test('handles case when searchParams is undefined', () => {
    const mockUseSearchParams =
      jest.requireMock('next/navigation').useSearchParams;
    mockUseSearchParams.mockReturnValue(undefined);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Main
          location={mockLocation}
          StoreLocations={mockStoreLocations as IStoreLocationDetails[]}
        />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('design-settings-mock')).toBeInTheDocument();
    expect(screen.getByTestId('order-summary-mock')).toBeInTheDocument();
  });

  test('handles case when OrderAPI returns undefined', () => {
    const mockSearchParams = {
      get: jest.fn((key) => {
        if (key === 'otc') return '1234567890';
        if (key === 'orderid') return 'order-123';
        return '';
      }),
    };

    const mockUseSearchParams =
      jest.requireMock('next/navigation').useSearchParams;
    mockUseSearchParams.mockReturnValue(mockSearchParams);

    const mockOrderAPI = jest.requireMock('@/api/Order').OrderAPI;
    mockOrderAPI.useGetSingleOrder.mockReturnValue({
      data: undefined,
    });

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Main
          location={mockLocation}
          StoreLocations={mockStoreLocations as IStoreLocationDetails[]}
        />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('over-the-counter-mock')).toBeInTheDocument();
    expect(screen.getByTestId('otc-paymentStatus')).toHaveTextContent(
      'Pending',
    );
  });
});
