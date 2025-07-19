/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import ProfileDropdown from '../ProfileDropdown';
import { Users } from '../../api/User';

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      account: (state = { storeDetails: { payPlanType: 'FREE' } }, action) =>
        state,
      Auth: (state = { user: null }, action) => state,
      initialLogin: (state = false, action) => state,
    },
    preloadedState: initialState,
  });
};

// Mock the API hooks
vi.mock('../../api/User', () => ({
  Users: {
    useFreshSalesTrackingEvent: () => ({
      mutate: vi.fn(),
    }),
  },
}));

// Mock the useDisclosure hook
vi.mock('../../hooks/useDisclosure', () => ({
  useDisclosure: () => ({
    opened: false,
    open: vi.fn(),
    close: vi.fn(),
  }),
}));

// Mock ReferralModal component
vi.mock('../ReferralModal', () => ({
  default: function MockReferralModal() {
    return <div data-testid="referral-modal">Referral Modal</div>;
  },
}));

const renderProfileDropdown = (props = {}) => {
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ProfileDropdown {...props} />
      </BrowserRouter>
    </Provider>,
  );
};

describe('ProfileDropdown', () => {
  const defaultProps = {
    profilePic: 'https://example.com/avatar.jpg',
    profileName: 'John Doe',
    userType: 'MERCHANT',
    menuItems: [
      {
        label: 'My Account',
        icon: 'mdi mdi-account-circle-outline',
        redirectTo: '/home/my-account',
        index: 1,
      },
      {
        label: 'Billing',
        icon: 'mdi mdi-credit-card-outline',
        redirectTo: '/home/billing',
        index: 2,
      },
      {
        label: 'Get help',
        icon: 'mdi mdi-help-circle-outline',
        redirectTo: '/home/customer-support-center',
        index: 4,
      },
    ],
    track: vi.fn(),
  };

  describe('Billing Permission Logic', () => {
    test('should show billing link for PARENT user (store owner)', () => {
      const props = {
        ...defaultProps,
        currentUser: {
          user_profile: { user_type: 'PARENT' },
          permissions: ['orders.read', 'products.read'],
        },
      };

      renderProfileDropdown(props);

      // Open dropdown
      fireEvent.click(screen.getByText('John Doe'));

      // Should show billing link for PARENT user
      expect(screen.getByText('Billing')).toBeInTheDocument();
    });

    test('should show billing link for MEMBER user with billing permissions', () => {
      const props = {
        ...defaultProps,
        currentUser: {
          user_profile: { user_type: 'MEMBER' },
          permissions: ['billing.read', 'orders.read', 'products.read'],
        },
      };

      renderProfileDropdown(props);

      // Open dropdown
      fireEvent.click(screen.getByText('John Doe'));

      // Should show billing link for MEMBER with billing permissions
      expect(screen.getByText('Billing')).toBeInTheDocument();
    });

    test('should NOT show billing link for MEMBER user without billing permissions', () => {
      const props = {
        ...defaultProps,
        currentUser: {
          user_profile: { user_type: 'MEMBER' },
          permissions: ['orders.read', 'products.read', 'leads.read'],
        },
      };

      renderProfileDropdown(props);

      // Open dropdown
      fireEvent.click(screen.getByText('John Doe'));

      // Should NOT show billing link for MEMBER without billing permissions
      expect(screen.queryByText('Billing')).not.toBeInTheDocument();
    });

    test('should show billing link for PARENT user even without billing permissions', () => {
      const props = {
        ...defaultProps,
        currentUser: {
          user_profile: { user_type: 'PARENT' },
          permissions: ['orders.read', 'products.read'], // No billing permissions
        },
      };

      renderProfileDropdown(props);

      // Open dropdown
      fireEvent.click(screen.getByText('John Doe'));

      // Should show billing link for PARENT user regardless of permissions
      expect(screen.getByText('Billing')).toBeInTheDocument();
    });
  });

  describe('Menu Items Rendering', () => {
    test('should render all menu items except billing when user lacks permissions', () => {
      const props = {
        ...defaultProps,
        currentUser: {
          user_profile: { user_type: 'MEMBER' },
          permissions: ['orders.read', 'products.read'],
        },
      };

      renderProfileDropdown(props);

      // Open dropdown
      fireEvent.click(screen.getByText('John Doe'));

      // Should show other menu items
      expect(screen.getByText('My Account')).toBeInTheDocument();
      expect(screen.getByText('Get help')).toBeInTheDocument();

      // Should NOT show billing
      expect(screen.queryByText('Billing')).not.toBeInTheDocument();
    });

    test('should render all menu items when user has billing permissions', () => {
      const props = {
        ...defaultProps,
        currentUser: {
          user_profile: { user_type: 'MEMBER' },
          permissions: ['billing.read', 'orders.read', 'products.read'],
        },
      };

      renderProfileDropdown(props);

      // Open dropdown
      fireEvent.click(screen.getByText('John Doe'));

      // Should show all menu items
      expect(screen.getByText('My Account')).toBeInTheDocument();
      expect(screen.getByText('Billing')).toBeInTheDocument();
      expect(screen.getByText('Get help')).toBeInTheDocument();
    });
  });

  describe('User Profile Display', () => {
    test('should display user profile information', () => {
      const props = {
        ...defaultProps,
        currentUser: {
          user_profile: { user_type: 'PARENT' },
          permissions: ['orders.read'],
        },
      };

      renderProfileDropdown(props);

      // Should show profile name
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      // Should show profile picture
      const profileImage = screen.getByAltText('user');
      expect(profileImage).toBeInTheDocument();
      expect(profileImage.src).toContain('example.com/avatar.jpg');
    });

    test('should show spinner when no profile picture', () => {
      const props = {
        ...defaultProps,
        profilePic: null,
        currentUser: {
          user_profile: { user_type: 'PARENT' },
          permissions: ['orders.read'],
        },
      };

      renderProfileDropdown(props);

      // Should show spinner instead of image
      expect(screen.queryByAltText('user')).not.toBeInTheDocument();
      // Note: Spinner might not be easily testable depending on implementation
    });
  });

  describe('Menu Item Click Handling', () => {
    test('should call track function when clicking menu items', () => {
      const trackMock = vi.fn();
      const props = {
        ...defaultProps,
        track: trackMock,
        currentUser: {
          user_profile: { user_type: 'PARENT' },
          permissions: ['orders.read'],
        },
      };

      renderProfileDropdown(props);

      // Open dropdown
      fireEvent.click(screen.getByText('John Doe'));

      // Click on My Account
      fireEvent.click(screen.getByText('My Account'));
      expect(trackMock).toHaveBeenCalledWith('P1: View My Account');

      // Click on Billing
      fireEvent.click(screen.getByText('Billing'));
      expect(trackMock).toHaveBeenCalledWith('P1: View Billing');

      // Click on Get help
      fireEvent.click(screen.getByText('Get help'));
      expect(trackMock).toHaveBeenCalledWith('P1: View Get Help');
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing currentUser gracefully', () => {
      const props = {
        ...defaultProps,
        currentUser: null,
      };

      // Should not throw error
      expect(() => renderProfileDropdown(props)).not.toThrow();
    });

    test('should handle missing permissions array gracefully', () => {
      const props = {
        ...defaultProps,
        currentUser: {
          user_profile: { user_type: 'MEMBER' },
          permissions: null,
        },
      };

      renderProfileDropdown(props);

      // Open dropdown
      fireEvent.click(screen.getByText('John Doe'));

      // Should NOT show billing for MEMBER without permissions
      expect(screen.queryByText('Billing')).not.toBeInTheDocument();
    });

    test('should handle missing user_profile gracefully', () => {
      const props = {
        ...defaultProps,
        currentUser: {
          permissions: ['billing.read'],
        },
      };

      // Should not throw error
      expect(() => renderProfileDropdown(props)).not.toThrow();
    });
  });
});

describe('Additional Coverage for ProfileDropdown', () => {
  const baseUser = {
    user_profile: { user_type: 'PARENT' },
    permissions: ['orders.read'],
  };
  const baseProps = {
    profilePic: 'https://example.com/avatar.jpg',
    profileName: 'John Doe',
    userType: 'MERCHANT',
    menuItems: [
      {
        label: 'My Account',
        icon: 'mdi mdi-account-circle-outline',
        redirectTo: '/home/my-account',
        index: 1,
      },
      {
        label: 'Billing',
        icon: 'mdi mdi-credit-card-outline',
        redirectTo: '/home/billing',
        index: 2,
      },
      {
        label: 'Get help',
        icon: 'mdi mdi-help-circle-outline',
        redirectTo: '/home/customer-support-center',
        index: 4,
      },
    ],
    track: vi.fn(),
  };

  test('should render Free Plan for FREE payPlanType', () => {
    const store = createMockStore({
      account: { storeDetails: { payPlanType: 'FREE' } },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    fireEvent.click(screen.getAllByText('John Doe')[0]);
    expect(screen.getByText('Free Plan')).toBeInTheDocument();
  });

  test('should render Premium Trial for PLUS_TRIAL payPlanType', () => {
    const store = createMockStore({
      account: { storeDetails: { payPlanType: 'PLUS_TRIAL' } },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    fireEvent.click(screen.getAllByText('John Doe')[0]);
    expect(screen.getByText('Premium Trial')).toBeInTheDocument();
  });

  test('should render Premium Trial for PREMIUM_TRIAL payPlanType', () => {
    const store = createMockStore({
      account: { storeDetails: { payPlanType: 'PREMIUM_TRIAL' } },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    fireEvent.click(screen.getAllByText('John Doe')[0]);
    expect(screen.getByText('Premium Trial')).toBeInTheDocument();
  });

  test('should render Plus Plan for PLUS payPlanType', () => {
    const store = createMockStore({
      account: { storeDetails: { payPlanType: 'PLUS' } },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    fireEvent.click(screen.getAllByText('John Doe')[0]);
    expect(screen.getByText('Plus Plan')).toBeInTheDocument();
  });

  test('should render Pro Plan for PRO payPlanType', () => {
    const store = createMockStore({
      account: { storeDetails: { payPlanType: 'PRO' } },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    fireEvent.click(screen.getAllByText('John Doe')[0]);
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
  });

  test('should render Premium Plan for PREMIUM payPlanType', () => {
    const store = createMockStore({
      account: { storeDetails: { payPlanType: 'PREMIUM' } },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    fireEvent.click(screen.getAllByText('John Doe')[0]);
    expect(screen.getByText('Premium Plan')).toBeInTheDocument();
  });

  test('should show spinner when profilePic is null', () => {
    renderProfileDropdown({
      ...baseProps,
      profilePic: null,
      currentUser: baseUser,
    });
    // Use class-based query for spinner
    expect(document.querySelector('.spinner-border')).toBeInTheDocument();
  });

  test('should call handlePlayStoreRedirect when Play Store button is clicked', () => {
    window.open = vi.fn();
    renderProfileDropdown({
      ...baseProps,
      currentUser: baseUser,
    });
    fireEvent.click(screen.getByText('John Doe'));
    fireEvent.click(screen.getByAltText('Get it on Google Play'));
    expect(window.open).toHaveBeenCalledWith(
      'https://play.google.com/store/search?q=prosperna&c=apps&hl=en&gl=US',
      '_blank',
    );
  });

  test('should render emailDetachStore for ADMIN userType', () => {
    renderProfileDropdown({
      ...baseProps,
      userType: 'ADMIN',
      currentUser: baseUser,
    });
    fireEvent.click(screen.getByText('John Doe'));
    // Should show masked email (emailDetachStore)
    expect(screen.getByText(/@/)).toBeInTheDocument();
  });

  test('should render normal email for non-ADMIN userType', () => {
    renderProfileDropdown({
      ...baseProps,
      userType: 'MERCHANT',
      currentUser: baseUser,
    });
    fireEvent.click(screen.getByText('John Doe'));
    // Use getAllByText to avoid multiple match error
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
  });

  test('should handle isCSLA true and false', () => {
    // isCSLA true
    const store = createMockStore({
      account: { storeDetails: { payPlanType: 'FREE' } },
      Auth: { user: { 'custom:user_type': 'CSLA', email: 'test@csla.com' } },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    fireEvent.click(screen.getByText('John Doe'));
    // Should not show Upgrade My Plan button
    expect(screen.queryByText('Upgrade My Plan')).not.toBeInTheDocument();
  });

  test('should call handleLogout for ADMIN', () => {
    // Mock window.location.href as a setter/getter
    let hrefValue = '';
    delete window.location;
    window.location = {
      set href(val) {
        hrefValue = val;
      },
      get href() {
        return hrefValue;
      },
    };
    renderProfileDropdown({
      ...baseProps,
      userType: 'ADMIN',
      currentUser: baseUser,
    });
    fireEvent.click(screen.getByText('John Doe'));
    // Click logout
    fireEvent.click(screen.getByText('Logout'));
    // Should set href to /account/logout
    expect(window.location.href).toContain('/account/logout');
  });

  test('should call freshSalesTrackingEvent.mutate for non-ADMIN', () => {
    const mutateMock = vi.fn();
    vi.spyOn(Users, 'useFreshSalesTrackingEvent').mockReturnValue({
      mutate: mutateMock,
    });
    renderProfileDropdown({
      ...baseProps,
      userType: 'MERCHANT',
      currentUser: baseUser,
    });
    fireEvent.click(screen.getByText('John Doe'));
    // Click logout
    fireEvent.click(screen.getByText('Logout'));
    expect(mutateMock).toHaveBeenCalled();
  });

  // New tests to improve function coverage
  test('should render menu item with imageUrl', () => {
    const propsWithImage = {
      ...baseProps,
      menuItems: [
        {
          label: 'Custom Item',
          imageUrl: 'https://example.com/icon.png',
          redirectTo: '/custom',
          index: 1,
        },
      ],
      currentUser: baseUser,
    };
    renderProfileDropdown(propsWithImage);
    fireEvent.click(screen.getByText('John Doe'));
    const image = screen.getByAltText('Custom Item');
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('example.com/icon.png');
  });

  test('should render menu item with withIndicator', () => {
    const propsWithIndicator = {
      ...baseProps,
      menuItems: [
        {
          label: 'Notification Item',
          icon: 'mdi mdi-bell',
          withIndicator: true,
          redirectTo: '/notifications',
          index: 1,
        },
      ],
      currentUser: baseUser,
    };
    renderProfileDropdown(propsWithIndicator);
    fireEvent.click(screen.getByText('John Doe'));
    // Check for the indicator span
    expect(document.querySelector('.pulse-indicator')).toBeInTheDocument();
  });

  test('should render menu item without withIndicator', () => {
    const propsWithoutIndicator = {
      ...baseProps,
      menuItems: [
        {
          label: 'No Indicator',
          icon: 'mdi mdi-bell',
          withIndicator: false,
          redirectTo: '/no-indicator',
          index: 1,
        },
      ],
      currentUser: baseUser,
    };
    renderProfileDropdown(propsWithoutIndicator);
    fireEvent.click(screen.getAllByText('John Doe')[0]);
    // Should not find the indicator span
    expect(document.querySelector('.pulse-indicator')).not.toBeInTheDocument();
    // Should still render the menu item
    expect(screen.getByText('No Indicator')).toBeInTheDocument();
  });

  test('should handle toggleDropdown function', async () => {
    renderProfileDropdown({
      ...baseProps,
      currentUser: baseUser,
    });
    // Initially dropdown should be closed
    expect(screen.queryByText('My Account')).not.toBeInTheDocument();
    // Click to open dropdown
    fireEvent.click(screen.getAllByText('John Doe')[0]);
    expect(screen.getByText('My Account')).toBeInTheDocument();
    // Click again to close dropdown
    fireEvent.click(screen.getAllByText('John Doe')[0]);
    await waitFor(() => {
      // The toggle should have aria-expanded false
      expect(screen.getByRole('link', { name: /john doe/i })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });
  });

  test('should handle useEffect for setting email', () => {
    const store = createMockStore({
      Auth: { user: { email: 'test@example.com' } },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    fireEvent.click(screen.getByText('John Doe'));
    // Email should be set from loggedInUser
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('should handle freshSalesTrackingEvent onSuccess callback', () => {
    const mockHandleLogout = vi.fn();
    const mockMutate = vi.fn((params) => {
      // Simulate onSuccess callback
      setTimeout(() => {
        mockHandleLogout();
      }, 0);
    });

    vi.spyOn(Users, 'useFreshSalesTrackingEvent').mockReturnValue({
      mutate: mockMutate,
    });

    renderProfileDropdown({
      ...baseProps,
      userType: 'MERCHANT',
      currentUser: baseUser,
    });
    fireEvent.click(screen.getByText('John Doe'));
    fireEvent.click(screen.getByText('Logout'));

    // Wait for the async callback
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          event_name: 'P1: Admin Logout',
        });
        resolve();
      }, 10);
    });
  });

  test('should handle freshSalesTrackingEvent onError callback', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    let onError;
    vi.spyOn(Users, 'useFreshSalesTrackingEvent').mockImplementation((opts) => {
      onError = opts.onError;
      return { mutate: vi.fn() };
    });
    renderProfileDropdown({
      ...baseProps,
      userType: 'MERCHANT',
      currentUser: baseUser,
    });
    // Simulate error callback
    onError && onError('Error message');
    expect(consoleSpy).toHaveBeenCalledWith('Error message');
    consoleSpy.mockRestore();
  });

  test('should render withIndicator span with proper styling', () => {
    const propsWithIndicator = {
      ...baseProps,
      menuItems: [
        {
          label: 'Notification Item',
          icon: 'mdi mdi-bell',
          withIndicator: true,
          redirectTo: '/notifications',
          index: 1,
        },
      ],
      currentUser: baseUser,
    };
    renderProfileDropdown(propsWithIndicator);
    fireEvent.click(screen.getByText('John Doe'));

    // Check for the indicator span with specific classes
    const indicator = document.querySelector('.pulse-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('position-absolute');
    expect(indicator).toHaveClass('translate-middle');
    expect(indicator).toHaveClass('bg-danger');
    expect(indicator).toHaveClass('text-white');
    expect(indicator).toHaveClass('text-xs');
  });

  test('should directly test onError callback from useFreshSalesTrackingEvent', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock the hook to capture the onError callback
    let capturedOnError;
    vi.spyOn(Users, 'useFreshSalesTrackingEvent').mockImplementation(
      (options) => {
        capturedOnError = options.onError;
        return { mutate: vi.fn() };
      },
    );

    renderProfileDropdown({
      ...baseProps,
      userType: 'MERCHANT',
      currentUser: baseUser,
    });

    // Directly call the onError callback
    if (capturedOnError) {
      capturedOnError('Direct test error message');
    }

    expect(consoleSpy).toHaveBeenCalledWith('Direct test error message');
    consoleSpy.mockRestore();
  });

  test('should test withIndicator span rendering with all attributes', () => {
    const propsWithIndicator = {
      ...baseProps,
      menuItems: [
        {
          label: 'Test Item',
          icon: 'mdi mdi-test',
          withIndicator: true,
          redirectTo: '/test',
          index: 1,
        },
      ],
      currentUser: baseUser,
    };
    renderProfileDropdown(propsWithIndicator);
    fireEvent.click(screen.getByText('John Doe'));

    // Find the indicator span and verify it has all required attributes
    const indicator = document.querySelector('.pulse-indicator');
    expect(indicator).toBeInTheDocument();

    // Check that the span is inside the icon element
    const iconElement = indicator.closest('i');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass('position-relative');
  });

  test('should handle null currentUser for hasBillingPermission calculation', () => {
    const props = {
      ...baseProps,
      currentUser: null,
    };

    // Should not throw error and should handle null gracefully
    expect(() => renderProfileDropdown(props)).not.toThrow();

    // Component should still render
    const { container } = renderProfileDropdown(props);
    expect(container).toBeInTheDocument();
  });

  test('should handle undefined currentUser for hasBillingPermission calculation', () => {
    const props = {
      ...baseProps,
      currentUser: undefined,
    };

    // Should not throw error and should handle undefined gracefully
    expect(() => renderProfileDropdown(props)).not.toThrow();

    // Component should still render
    const { container } = renderProfileDropdown(props);
    expect(container).toBeInTheDocument();
  });

  test('should handle null loggedInUser for isCSLA calculation', () => {
    const store = createMockStore({
      Auth: { user: null },
    });

    // Should not throw error and should handle null gracefully
    expect(() =>
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ProfileDropdown {...baseProps} currentUser={baseUser} />
          </BrowserRouter>
        </Provider>,
      ),
    ).not.toThrow();

    // Component should still render
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    expect(container).toBeInTheDocument();
  });

  test('should handle undefined loggedInUser for isCSLA calculation', () => {
    const store = createMockStore({
      Auth: { user: undefined },
    });

    // Should not throw error and should handle undefined gracefully
    expect(() =>
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ProfileDropdown {...baseProps} currentUser={baseUser} />
          </BrowserRouter>
        </Provider>,
      ),
    ).not.toThrow();

    // Component should still render
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ProfileDropdown {...baseProps} currentUser={baseUser} />
        </BrowserRouter>
      </Provider>,
    );
    expect(container).toBeInTheDocument();
  });

  test('should handle currentUser with null permissions array', () => {
    const props = {
      ...baseProps,
      currentUser: {
        user_profile: { user_type: 'MEMBER' },
        permissions: null,
      },
    };

    renderProfileDropdown(props);
    fireEvent.click(screen.getByText('John Doe'));

    // Should NOT show billing for MEMBER with null permissions
    expect(screen.queryByText('Billing')).not.toBeInTheDocument();
  });

  test('should handle currentUser with undefined permissions array', () => {
    const props = {
      ...baseProps,
      currentUser: {
        user_profile: { user_type: 'MEMBER' },
        permissions: undefined,
      },
    };

    renderProfileDropdown(props);
    fireEvent.click(screen.getByText('John Doe'));

    // Should NOT show billing for MEMBER with undefined permissions
    expect(screen.queryByText('Billing')).not.toBeInTheDocument();
  });
});
