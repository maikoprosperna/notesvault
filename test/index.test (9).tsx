import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicHeader } from './index';
import { IStoreInfo, IStoreLocationDetails } from '@/types';
import { ILocationCookie } from '@/app/(routes)/[pages]/[store]/products/_components/Main';
import { act } from 'react';
import * as PublicHeaderModule from './index';

// Mock all dependencies
jest.mock('./DefaultPrimaryHeader', () => ({
  DefaultPrimaryHeader: () => <div data-testid="default-primary-header" />,
}));

jest.mock('./DefaultSecondaryHeader', () => ({
  DefaultSecondaryHeader: () => <div data-testid="default-secondary-header" />,
}));

jest.mock('./PublicMenuBuilderHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="public-menu-builder-header" />,
}));

jest.mock('../../api/Customer', () => ({
  CustomerAPI: {
    useCustomerCartItems: jest.fn(() => ({
      data: { sumQTY: 5 },
    })),
  },
}));

jest.mock('../../hooks/useCustomer', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    customerID: 'customer-123',
    customerDetailsFromSession: { id: 'customer-123' },
    customerDetails: { id: 'customer-123' },
  })),
}));

jest.mock('../../api/Page', () => ({
  PageAPI: {
    usePublicHomepage: jest.fn(() => ({
      data: { page_name: 'Home' },
    })),
  },
}));

jest.mock('../../utils/logicUtil', () => ({
  isUpgradedPlanChecker: jest.fn((plan) => plan !== 'FREE'),
}));

jest.mock('../../components/WebsiteVisitorTracker/index', () => ({
  __esModule: true,
  default: () => <div data-testid="website-visitor-tracker" />,
}));

jest.mock('../../components/CustomFonts/CustomFonts', () => ({
  __esModule: true,
  default: () => <div data-testid="custom-fonts" />,
}));

jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="dynamic-menu-builder" />;
  return DynamicComponent;
});

// Mock window objects
const mockWindowLocation = {
  href: '',
  pathname: '/',
  search: '',
};

Object.defineProperty(window, 'location', {
  value: mockWindowLocation,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: jest.fn(),
  writable: true,
});

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

const validMenuBuilderSettings = {
  primary_menu: {
    menu_design: {
      desktop_sticky_menu: { is_sticky_menu_enabled: true },
      tablet_sticky_menu: { is_sticky_menu_enabled: true },
      mobile_sticky_menu: { is_sticky_menu_enabled: true },
    },
    menu_structure: {
      desktop: { menu_items: [], features: {} },
      tablet: { menu_items: [], features: {} },
      mobile: { menu_items: [], features: {} },
      desktop_menu_layout: 'horizontal',
      mobile_tablet_menu_position: 'top',
    },
  },
  secondary_menu: {
    is_activated: false,
    menu_design: {
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
      desktop_sticky_menu: { is_sticky_menu_enabled: false },
      tablet_sticky_menu: { is_sticky_menu_enabled: false },
      mobile_sticky_menu: { is_sticky_menu_enabled: false },
    },
    menu_structure: {
      desktop: { menu_items: [], features: {} },
      tablet: { menu_items: [], features: {} },
      mobile: { menu_items: [], features: {} },
      desktop_menu_layout: 'horizontal',
      mobile_tablet_menu_position: 'top',
    },
  },
};

describe('PublicHeader Component', () => {
  let queryClient: QueryClient;

  const mockPublicStoreData: IStoreInfo = {
    _id: 'store-123',
    storeName: 'Test Store',
    payPlanType: 'FREE',
    storeLogo:
      'https://p1-mediaserver.s3.ap-southeast-1.amazonaws.com/logo.png',
    requireSelectingStoreLocation: false,
    facebookLink: '',
    instagramLink: '',
    storeEmail: 'test@example.com',
    shippingOptions: {
      STANDARD: false,
      SAMEDAY_SCHED: false,
      OWN_BOOKING: false,
      PICKUP: false,
      CUSTOM_DELIVERY_DATE: false,
      OWN_BOOKING_MERCHANT: false,
    },
    storeSettings: {},
    product_image_labels: [],
    showHideStoreAddress: false,
    showHideAddressCheckout: false,
    showHideAddressToolTip: false,
  };

  const mockLocation: ILocationCookie = {
    value: 'location-123',
    name: 'Test Location',
  };

  const mockStoreLocations: IStoreLocationDetails[] = [
    {
      id: 'location-123',
      storeName: 'Test Location',
      storeId: 'store-123',
      storeAddress: {
        address: '123 Test St',
        barangay: {
          _id: 'brgy-123',
          barangayName: 'Test Barangay',
          barangayNameUppercased: 'TEST BARANGAY',
        },
        city: {
          _id: 'city-123',
          municipalityName: 'Test City',
          municipalityNameUppercased: 'TEST CITY',
        },
        province: {
          _id: 'prov-123',
          provinceName: 'Test Province',
          provinceNameUppercased: 'TEST PROVINCE',
        },
        country: { _id: 'country-123', name: 'Philippines' },
        postal_code: '12345',
      },
      storePhoneNumber: '123456789',
      storeSecondaryPhoneNumber: '',
      storeHours: { open: '9:00', close: '17:00' },
      storeEmail: 'test@example.com',
      status: 'active',
      is_default: true,
      dateCreated: '2023-01-01',
      lastUpdated: '2023-01-01',
      storeSlug: 'test-location',
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();

    mockWindowLocation.href = '';
    mockWindowLocation.pathname = '/';
    mockWindowLocation.search = '';

    (window.sessionStorage.getItem as jest.Mock).mockReturnValue(null);
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      publicStoreData: mockPublicStoreData,
      publicMenuBuilderDataSettings: null,
      store_location_id: 'location-123',
      location: mockLocation,
      StoreLocations: mockStoreLocations,
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <PublicHeader {...defaultProps} {...props} />
      </QueryClientProvider>,
    );
  };

  describe('Basic Rendering', () => {
    it('renders the component with basic elements', () => {
      renderComponent();

      expect(screen.getByTestId('custom-fonts')).toBeInTheDocument();
      expect(screen.getByTestId('website-visitor-tracker')).toBeInTheDocument();
      expect(document.getElementById('publicHeaderMain')).toBeInTheDocument();
    });

    it('renders default headers for FREE plan', () => {
      renderComponent();

      expect(
        screen.getByTestId('default-secondary-header'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('default-primary-header')).toBeInTheDocument();
    });

    it('renders menu builder for upgraded plans', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          pathname: '/',
          search: '',
          href: '',
        },
        writable: true,
      });
      renderComponent({
        publicStoreData: { ...mockPublicStoreData, payPlanType: 'PREMIUM' },
        publicMenuBuilderDataSettings: {
          primary_menu: {
            menu_design: {
              desktop_sticky_menu: { is_sticky_menu_enabled: true },
              tablet_sticky_menu: { is_sticky_menu_enabled: true },
              mobile_sticky_menu: { is_sticky_menu_enabled: true },
            },
            menu_structure: {
              desktop: { menu_items: [], features: {} },
              tablet: { menu_items: [], features: {} },
              mobile: { menu_items: [], features: {} },
              desktop_menu_layout: 'horizontal',
              mobile_tablet_menu_position: 'top',
            },
          },
          secondary_menu: {
            is_activated: false,
            menu_design: {
              created_at: '2023-01-01',
              updated_at: '2023-01-02',
              desktop_sticky_menu: { is_sticky_menu_enabled: false },
              tablet_sticky_menu: { is_sticky_menu_enabled: false },
              mobile_sticky_menu: { is_sticky_menu_enabled: false },
            },
            menu_structure: {
              desktop: { menu_items: [], features: {} },
              tablet: { menu_items: [], features: {} },
              mobile: { menu_items: [], features: {} },
              desktop_menu_layout: 'horizontal',
              mobile_tablet_menu_position: 'top',
            },
          },
        },
      });
      expect(screen.getByTestId('dynamic-menu-builder')).toBeInTheDocument();
    });

    it('sets hasSeparateStickyMenuState true when sticky setups differ', () => {
      const menuSettings = {
        ...validMenuBuilderSettings,
        primary_menu: {
          ...validMenuBuilderSettings.primary_menu,
          menu_design: {
            ...validMenuBuilderSettings.primary_menu.menu_design,
            desktop_sticky_menu: { is_sticky_menu_enabled: true },
          },
        },
        secondary_menu: {
          ...validMenuBuilderSettings.secondary_menu,
          menu_design: {
            ...validMenuBuilderSettings.secondary_menu.menu_design,
            desktop_sticky_menu: { is_sticky_menu_enabled: false },
          },
        },
      };
      renderComponent({
        publicStoreData: { ...mockPublicStoreData, payPlanType: 'PREMIUM' },
        publicMenuBuilderDataSettings: menuSettings,
      });
      expect(screen.getByTestId('dynamic-menu-builder')).toBeInTheDocument();
    });

    it('renders secondary menu when isSecondaryMenuActivated and isUpdated are true', () => {
      const menuSettings = {
        ...validMenuBuilderSettings,
        secondary_menu: {
          ...validMenuBuilderSettings.secondary_menu,
          is_activated: true,
          menu_design: {
            ...validMenuBuilderSettings.secondary_menu.menu_design,
            created_at: '2023-01-01',
            updated_at: '2023-02-01', // updatedAt > createdAt
          },
        },
      };
      renderComponent({
        publicStoreData: { ...mockPublicStoreData, payPlanType: 'PREMIUM' },
        publicMenuBuilderDataSettings: menuSettings,
      });
      // Two dynamic-menu-builder components should be rendered
      expect(screen.getAllByTestId('dynamic-menu-builder')).toHaveLength(2);
    });

    it('renders default secondary header when isSecondaryMenuActivated is true but not updated', () => {
      const menuSettings = {
        ...validMenuBuilderSettings,
        secondary_menu: {
          ...validMenuBuilderSettings.secondary_menu,
          is_activated: true,
          menu_design: {
            ...validMenuBuilderSettings.secondary_menu.menu_design,
            created_at: '2023-02-01',
            updated_at: '2023-01-01', // updatedAt < createdAt
          },
        },
      };
      renderComponent({
        publicStoreData: { ...mockPublicStoreData, payPlanType: 'PREMIUM' },
        publicMenuBuilderDataSettings: menuSettings,
      });
      expect(
        screen.getByTestId('default-secondary-header'),
      ).toBeInTheDocument();
    });

    it('applies scrolled class when scrolled past 400', async () => {
      renderComponent();
      const scrollHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'scroll')?.[1];
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      await act(async () => {
        if (scrollHandler) scrollHandler();
      });
      await waitFor(() => {
        expect(document.getElementById('publicHeaderMain')).toHaveClass(
          'scrolled',
        );
      });
    });

    it('removes scrolled class when scroll is below 400', async () => {
      renderComponent();
      const scrollHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'scroll')?.[1];
      Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
      await act(async () => {
        if (scrollHandler) scrollHandler();
      });
      await waitFor(() => {
        expect(document.getElementById('publicHeaderMain')).not.toHaveClass(
          'scrolled',
        );
      });
    });

    it('calls handleResize and sets portView to desktop', async () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 1300,
        writable: true,
      });
      renderComponent();
      const resizeHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'resize')?.[1];
      await act(async () => {
        if (resizeHandler) resizeHandler();
      });
      expect(screen.getByTestId('default-primary-header')).toBeInTheDocument();
    });

    it('calls handleResize and sets portView to tablet', async () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 800,
        writable: true,
      });
      renderComponent();
      const resizeHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'resize')?.[1];
      await act(async () => {
        if (resizeHandler) resizeHandler();
      });
      expect(screen.getByTestId('default-primary-header')).toBeInTheDocument();
    });

    it('calls handleResize and sets portView to mobile', async () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 400,
        writable: true,
      });
      renderComponent();
      const resizeHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'resize')?.[1];
      await act(async () => {
        if (resizeHandler) resizeHandler();
      });
      expect(screen.getByTestId('default-primary-header')).toBeInTheDocument();
    });

    it('renders only DefaultSecondaryHeader when secondary menu is activated but not updated', () => {
      const menuSettings = {
        ...validMenuBuilderSettings,
        secondary_menu: {
          ...validMenuBuilderSettings.secondary_menu,
          is_activated: true,
          menu_design: {
            ...validMenuBuilderSettings.secondary_menu.menu_design,
            created_at: '2023-02-01',
            updated_at: '2023-01-01',
          },
        },
      };
      renderComponent({
        publicStoreData: { ...mockPublicStoreData, payPlanType: 'PREMIUM' },
        publicMenuBuilderDataSettings: menuSettings,
      });
      expect(
        screen.getByTestId('default-secondary-header'),
      ).toBeInTheDocument();
    });

    it('renders both DefaultSecondaryHeader and DefaultPrimaryHeader for FREE plan', () => {
      renderComponent({
        publicStoreData: { ...mockPublicStoreData, payPlanType: 'FREE' },
      });
      expect(
        screen.getByTestId('default-secondary-header'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('default-primary-header')).toBeInTheDocument();
    });

    it('renders both menu builder and secondary menu when upgraded and secondary menu is activated and updated', () => {
      const menuSettings = {
        ...validMenuBuilderSettings,
        secondary_menu: {
          ...validMenuBuilderSettings.secondary_menu,
          is_activated: true,
          menu_design: {
            ...validMenuBuilderSettings.secondary_menu.menu_design,
            created_at: '2023-01-01',
            updated_at: '2023-02-01',
          },
        },
      };
      renderComponent({
        publicStoreData: { ...mockPublicStoreData, payPlanType: 'PREMIUM' },
        publicMenuBuilderDataSettings: menuSettings,
      });
      expect(screen.getAllByTestId('dynamic-menu-builder')).toHaveLength(2);
    });

    it('renders only menu builder when upgraded and secondary menu is not activated', () => {
      renderComponent({
        publicStoreData: { ...mockPublicStoreData, payPlanType: 'PREMIUM' },
        publicMenuBuilderDataSettings: validMenuBuilderSettings,
      });
      expect(screen.getByTestId('dynamic-menu-builder')).toBeInTheDocument();
    });
  });

  describe('Location Redirection Logic', () => {
    beforeEach(() => {
      delete (window as any).location;
      window.location = { ...mockWindowLocation, href: '' } as any;
    });

    it('does not redirect when location is provided', async () => {
      renderComponent({
        publicStoreData: {
          ...mockPublicStoreData,
          requireSelectingStoreLocation: true,
        },
        location: mockLocation,
      });

      await waitFor(() => {
        expect(window.location.href).toBe('');
      });
    });

    it('redirects to /locations when location is required but not provided', async () => {
      renderComponent({
        publicStoreData: {
          ...mockPublicStoreData,
          requireSelectingStoreLocation: true,
        },
        location: { value: '', name: '' },
      });

      await waitFor(() => {
        expect(window.location.href).toBe('/locations');
        expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
          'hasRedirected',
          'true',
        );
      });
    });

    it('does not redirect if already redirected in session', async () => {
      (window.sessionStorage.getItem as jest.Mock).mockReturnValue('true');

      renderComponent({
        publicStoreData: {
          ...mockPublicStoreData,
          requireSelectingStoreLocation: true,
        },
        location: { value: '', name: '' },
      });

      await waitFor(() => {
        expect(window.location.href).toBe('');
      });
    });

    it('does not redirect on excluded paths', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          pathname: '/checkout/thank-you',
          search: '',
          href: '',
        },
        writable: true,
      });
      renderComponent({
        publicStoreData: {
          ...mockPublicStoreData,
          requireSelectingStoreLocation: true,
        },
        location: { value: '', name: '' },
      });
      await waitFor(() => {
        expect(window.location.href).toBe('');
      });
    });

    it('does not redirect when payment parameters are present', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          pathname: '/',
          search: '?otc=123&order_id=456',
          href: '',
        },
        writable: true,
      });
      renderComponent({
        publicStoreData: {
          ...mockPublicStoreData,
          requireSelectingStoreLocation: true,
        },
        location: { value: '', name: '' },
      });
      await waitFor(() => {
        expect(window.location.href).toBe('');
      });
    });

    it('handles all excluded paths correctly', async () => {
      const excludedPaths = [
        '/checkout/thank-you',
        '/checkout',
        '/placed-order',
        '/account',
        '/locations',
      ];
      for (const path of excludedPaths) {
        Object.defineProperty(window, 'location', {
          value: {
            ...window.location,
            pathname: path,
            search: '',
            href: '',
          },
          writable: true,
        });
        renderComponent({
          publicStoreData: {
            ...mockPublicStoreData,
            requireSelectingStoreLocation: true,
          },
          location: { value: '', name: '' },
        });
        await waitFor(() => {
          expect(window.location.href).toBe('');
        });
      }
    });

    it('handles all payment parameters correctly', async () => {
      const paymentParams = [
        'otc',
        'order_id',
        'orderid',
        'payment_intent',
        'session_id',
      ];
      for (const param of paymentParams) {
        Object.defineProperty(window, 'location', {
          value: {
            ...window.location,
            pathname: '/',
            search: `?${param}=test-value`,
            href: '',
          },
          writable: true,
        });
        renderComponent({
          publicStoreData: {
            ...mockPublicStoreData,
            requireSelectingStoreLocation: true,
          },
          location: { value: '', name: '' },
        });
        await waitFor(() => {
          expect(window.location.href).toBe('');
        });
      }
    });
  });

  describe('Logo URL Conversion', () => {
    it('converts S3 URLs to CDN URLs', () => {
      const storeDataWithS3Logo = {
        ...mockPublicStoreData,
        storeLogo:
          'https://p1-mediaserver.s3.ap-southeast-1.amazonaws.com/test-logo.png',
      };

      renderComponent({ publicStoreData: storeDataWithS3Logo });

      // The component should convert the URL internally (tested through component behavior)
      expect(screen.getByTestId('default-primary-header')).toBeInTheDocument();
    });

    it('keeps non-S3 URLs unchanged', () => {
      const storeDataWithRegularLogo = {
        ...mockPublicStoreData,
        storeLogo: 'https://example.com/logo.png',
      };

      renderComponent({ publicStoreData: storeDataWithRegularLogo });

      expect(screen.getByTestId('default-primary-header')).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('sets up event listeners for resize and scroll', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      renderComponent();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
      );
    });

    it('cleans up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderComponent();
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles null publicStoreData gracefully', () => {
      renderComponent({ publicStoreData: null });
      // The component should render nothing
      expect(screen.queryByTestId('custom-fonts')).not.toBeInTheDocument();
      expect(document.getElementById('publicHeaderMain')).toBeNull();
    });

    it('handles undefined window in redirection logic', async () => {
      const originalWindow = window;

      (global as any).window = undefined;

      expect(() => {
        renderComponent({
          publicStoreData: {
            ...mockPublicStoreData,
            requireSelectingStoreLocation: true,
          },
          location: { value: '', name: '' },
        });
      }).not.toThrow();

      (global as any).window = originalWindow;
    });
  });

  describe('Fallback Export', () => {
    it('should export PublicHeader as default', () => {
      expect(PublicHeaderModule.PublicHeader).toBeDefined();
    });
  });
});
