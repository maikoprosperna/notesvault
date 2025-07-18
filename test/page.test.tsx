// __tests__/Checkout.test.tsx
import React from 'react';
import Checkout, { generateMetadata } from './page';
import { render, screen } from '@testing-library/react';
import { getPublicStoreDetailsRequest } from '@/api/Store';
import { getLocation } from '@/hooks/useGetLocationID';
import { headers } from 'next/headers';

// Mock the necessary modules
jest.mock('@/api/Store', () => ({
  getPublicStoreDetailsRequest: jest.fn(),
}));

jest.mock('@/hooks/useGetLocationID', () => ({
  getLocation: jest.fn(),
}));

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

jest.mock('./_components/CheckoutMain', () => {
  return function MockCheckoutMain(props: any) {
    return <div data-testid="mock-checkout-main">{JSON.stringify(props)}</div>;
  };
});

describe('Checkout Component', () => {
  const mockStoreData = {
    data: {
      store: {
        _id: 'store123',
        storeName: 'Test Store',
      },
    },
  };

  const mockLocationData = {
    store_location_id: 'loc123',
    StoreLocations: [{ id: 'loc123', name: 'Test Location' }],
    location: { lat: 0, lng: 0 },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'host') return 'test-host';
        return null;
      }),
    });

    (getPublicStoreDetailsRequest as jest.Mock).mockResolvedValue(
      mockStoreData,
    );
    (getLocation as jest.Mock).mockResolvedValue(mockLocationData);
  });

  describe('generateMetadata', () => {
    it('should generate metadata with store name', async () => {
      const metadata = await generateMetadata();
      expect(metadata).toEqual({
        title: 'Test Store | Checkout',
        description: 'Test Store',
      });
    });

    it('should use default "my" when store name is not available', async () => {
      (getPublicStoreDetailsRequest as jest.Mock).mockResolvedValueOnce({
        data: { store: {} },
      });

      const metadata = await generateMetadata();
      expect(metadata).toEqual({
        title: 'my | Checkout',
        description: 'my',
      });
    });
  });

  describe('Checkout Page', () => {
    it('should render CheckoutMain with correct props', async () => {
      const searchParams = { slid: 'test-slid' };
      const Component = await Checkout({ searchParams });

      render(Component);

      const checkoutMain = screen.getByTestId('mock-checkout-main');
      expect(checkoutMain).toBeInTheDocument();

      const props = JSON.parse(checkoutMain.textContent || '{}');
      expect(props.storeData).toEqual(mockStoreData.data.store);
      expect(props.store_location_id).toBe(mockLocationData.store_location_id);
      expect(props.StoreLocations).toEqual(mockLocationData.StoreLocations);
      expect(props.location).toEqual(mockLocationData.location);
      expect(props.querySlid).toBe('test-slid');
    });

    it('should handle undefined searchParams', async () => {
      const Component = await Checkout({ searchParams: undefined });
      render(Component);

      const checkoutMain = screen.getByTestId('mock-checkout-main');
      const props = JSON.parse(checkoutMain.textContent || '{}');
      expect(props.querySlid).toBeUndefined();
    });

    it('should handle undefined slid in searchParams', async () => {
      const Component = await Checkout({ searchParams: {} });
      render(Component);

      const checkoutMain = screen.getByTestId('mock-checkout-main');
      const props = JSON.parse(checkoutMain.textContent || '{}');
      expect(props.querySlid).toBeUndefined();
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    it('should handle getPublicStoreDetailsRequest error', async () => {
      (getPublicStoreDetailsRequest as jest.Mock).mockRejectedValueOnce(
        new Error('API Error'),
      );

      const Component = await Checkout({ searchParams: {} });
      render(Component);

      // In a real app, you might want to test error boundaries or fallback UI
      const checkoutMain = screen.getByTestId('mock-checkout-main');
      expect(checkoutMain).toBeInTheDocument();
    });

    it('should handle getLocation error', async () => {
      (getLocation as jest.Mock).mockRejectedValueOnce(
        new Error('Location Error'),
      );

      const Component = await Checkout({ searchParams: {} });
      render(Component);

      // Verify the component still renders (with potentially undefined location data)
      const checkoutMain = screen.getByTestId('mock-checkout-main');
      expect(checkoutMain).toBeInTheDocument();
    });
  });
});
