import React from 'react';
import { render, screen } from '@testing-library/react';
import BillingInfo from '../index';

// Mock the BillingInfo component
jest.mock('../BillingInfo', () => ({
  __esModule: true,
  default: ({
    setTabCallback,
    cartHasDigitalProduct,
    cartHasOnlyDigitalProduct,
    isActive,
  }: any) => (
    <div data-testid="billing-info-component">
      <div data-testid="set-tab-callback">
        {setTabCallback ? 'has-callback' : 'no-callback'}
      </div>
      <div data-testid="cart-has-digital">
        {cartHasDigitalProduct ? 'has-digital' : 'no-digital'}
      </div>
      <div data-testid="cart-only-digital">
        {cartHasOnlyDigitalProduct ? 'only-digital' : 'mixed'}
      </div>
      <div data-testid="is-active">{isActive ? 'active' : 'inactive'}</div>
    </div>
  ),
}));

describe('BillingInfo Index', () => {
  const mockProps = {
    setTabCallback: jest.fn(),
    cartHasDigitalProduct: false,
    cartHasOnlyDigitalProduct: false,
    setDataFromBillingInfo: jest.fn(),
    location: { name: 'test', value: 'test-value' },
    StoreLocations: [],
    isQRCodeActive: false,
    referenceQRNumber: undefined,
    tableNumber: undefined,
    isActive: true,
  };

  it('exports BillingInfo component correctly', () => {
    expect(BillingInfo).toBeDefined();
    expect(typeof BillingInfo).toBe('function');
  });

  it('renders BillingInfo component with props', () => {
    render(<BillingInfo {...mockProps} />);

    expect(screen.getByTestId('billing-info-component')).toBeInTheDocument();
    expect(screen.getByTestId('set-tab-callback')).toHaveTextContent(
      'has-callback',
    );
    expect(screen.getByTestId('cart-has-digital')).toHaveTextContent(
      'no-digital',
    );
    expect(screen.getByTestId('cart-only-digital')).toHaveTextContent('mixed');
    expect(screen.getByTestId('is-active')).toHaveTextContent('active');
  });

  it('handles different prop combinations', () => {
    const { rerender } = render(
      <BillingInfo {...mockProps} cartHasDigitalProduct={true} />,
    );
    expect(screen.getByTestId('cart-has-digital')).toHaveTextContent(
      'has-digital',
    );

    rerender(<BillingInfo {...mockProps} cartHasOnlyDigitalProduct={true} />);
    expect(screen.getByTestId('cart-only-digital')).toHaveTextContent(
      'only-digital',
    );

    rerender(<BillingInfo {...mockProps} isActive={false} />);
    expect(screen.getByTestId('is-active')).toHaveTextContent('inactive');
  });

  it('handles undefined props gracefully', () => {
    const propsWithUndefined = {
      ...mockProps,
      setTabCallback: jest.fn() as any,
      location: undefined as any,
      StoreLocations: undefined as any,
    };

    render(<BillingInfo {...propsWithUndefined} />);

    expect(screen.getByTestId('billing-info-component')).toBeInTheDocument();
    expect(screen.getByTestId('set-tab-callback')).toHaveTextContent(
      'has-callback',
    );
  });
});
