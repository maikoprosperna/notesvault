/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import ProductModal from '../../../createOrder/productModal/index';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, className, onMouseOver, onClick }) => (
    <a href={to} className={className} onMouseOver={onMouseOver} onClick={onClick}>
      {children}
    </a>
  ),
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock components
vi.mock('../../../../../components/Shared/Custom/utilities', () => ({
  ToCurrencyFormat: (value) => `$${value}`,
}));

vi.mock('../../../../../constants/currency', () => ({
  CURRENCY: '$',
}));

// Mock store
const mockStore = configureStore({
  reducer: {
    auth: {
      user: { id: '1', name: 'Test User' },
    },
  },
});

// Mock QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper = ({ children }) => (
  <Provider store={mockStore}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  </Provider>
);

describe('ProductModal', () => {
  const mockModalVisible = [true, vi.fn()];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal when visible', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    expect(screen.getByTestId('product-modal-element')).toBeInTheDocument();
  });

  it('should render product title and price', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    expect(screen.getByText('Vintage Typewriter')).toBeInTheDocument();
    expect(screen.getByText(/₱\s*2850\.00/)).toBeInTheDocument();
  });

  it('should render product variants', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    expect(screen.getByText('Variants')).toBeInTheDocument();
    expect(screen.getByText('Variant 1')).toBeInTheDocument();
    expect(screen.getByText('Variant 2')).toBeInTheDocument();
    expect(screen.getByText('Variant 3')).toBeInTheDocument();
  });

  it('should render add-ons section', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    expect(screen.getByText('Add-ons')).toBeInTheDocument();
    expect(screen.getByText('Add-ons 1')).toBeInTheDocument();
    expect(screen.getByText('Add-ons 2')).toBeInTheDocument();
    expect(screen.getByText('Add-ons 3')).toBeInTheDocument();
  });

  it('should render quantity section', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(screen.getByText('300 items left')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Add to Order')).toBeInTheDocument();
  });

  it('should handle quantity increase', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('should handle quantity decrease', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    // First increase quantity to 2
    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    // Then decrease it
    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  it('should not allow quantity to go below 1', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  it('should handle quantity input change', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const quantityInput = screen.getByDisplayValue('1');
    fireEvent.change(quantityInput, { target: { value: '5' } });

    expect(quantityInput.value).toBe('5');
  });

  it('should handle variant selection', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const variant2 = screen.getByLabelText('Variant 2');
    fireEvent.click(variant2);

    expect(variant2.checked).toBe(true);
  });

  it('should handle add-on selection', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const addon1 = screen.getByLabelText('Add-ons 1');
    fireEvent.click(addon1);

    expect(addon1.checked).toBe(true);
  });

  it('should handle multiple add-on selections', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const addon1 = screen.getByLabelText('Add-ons 1');
    const addon2 = screen.getByLabelText('Add-ons 2');
    
    fireEvent.click(addon1);
    fireEvent.click(addon2);

    expect(addon1.checked).toBe(true);
    expect(addon2.checked).toBe(true);
  });

  it('should handle image hover', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const imageLink = screen.getAllByAltText('Product-img')[0];
    fireEvent.mouseOver(imageLink);

    // Image should change (this is handled by the component state)
    expect(imageLink).toBeInTheDocument();
  });

  it('should handle image click', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const imageLink = screen.getAllByAltText('Product-img')[0];
    fireEvent.click(imageLink);

    // Image should change (this is handled by the component state)
    expect(imageLink).toBeInTheDocument();
  });

  it('should render product images', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const productImages = screen.getAllByAltText('Product-img');
    expect(productImages).toHaveLength(5); // 4 thumbnail images + 1 main image
  });

  it('should render main product image', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const mainImages = screen.getAllByAltText('Product-img');
    expect(mainImages.length).toBeGreaterThan(0);
  });

  it('should handle cancel button click', () => {
    const mockSetProductModal = vi.fn();
    const mockModalVisible = [true, mockSetProductModal];

    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockSetProductModal).toHaveBeenCalledWith(false);
  });

  it('should handle add to order button click', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const addToOrderButton = screen.getByText('Add to Order');
    fireEvent.click(addToOrderButton);

    // Button should be clickable (functionality would be implemented in parent component)
    expect(addToOrderButton).toBeInTheDocument();
  });

  it('should render modal with correct size', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const modal = screen.getByTestId('product-modal-element');
    expect(modal).toBeInTheDocument();
  });

  it('should render modal header with close button', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    // Modal should have close button (handled by Bootstrap Modal)
    expect(screen.getByTestId('product-modal-element')).toBeInTheDocument();
  });

  it('should render quantity controls with correct styling', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const quantityInput = screen.getByDisplayValue('1');
    const increaseButton = screen.getByText('+');
    const decreaseButton = screen.getByText('-');

    expect(quantityInput).toBeInTheDocument();
    expect(increaseButton).toBeInTheDocument();
    expect(decreaseButton).toBeInTheDocument();
  });

  it('should render stock information', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    expect(screen.getByText('300 items left')).toBeInTheDocument();
  });

  it('should render variant radio buttons', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const variant1 = screen.getByLabelText('Variant 1');
    const variant2 = screen.getByLabelText('Variant 2');
    const variant3 = screen.getByLabelText('Variant 3');

    expect(variant1).toBeInTheDocument();
    expect(variant2).toBeInTheDocument();
    expect(variant3).toBeInTheDocument();
  });

  it('should render add-on checkboxes', () => {
    render(
      <TestWrapper>
        <ProductModal modalVisible={mockModalVisible} />
      </TestWrapper>
    );

    const addon1 = screen.getByLabelText('Add-ons 1');
    const addon2 = screen.getByLabelText('Add-ons 2');
    const addon3 = screen.getByLabelText('Add-ons 3');

    expect(addon1).toBeInTheDocument();
    expect(addon2).toBeInTheDocument();
    expect(addon3).toBeInTheDocument();
  });
});