import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductListItem from '../ProductListItem';
import { IBusinessOperations, IStoreLocationDetails } from '@/types';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} data-testid="next-image" />;
  },
}));

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock the useProduct hook
jest.mock('@/hooks/useProduct', () => ({
  useProduct: () => ({
    getPrice: (price: any) => `₱ ${price.sale_price}.00`,
    getRange: (range: any) => {
      if (Array.isArray(range)) {
        return `₱ ${range[0]} - ₱ ${range[range.length - 1]}`;
      }
      return `₱ ${range.min} - ₱ ${range.max}`;
    },
    createPriceRangeFormat: (prices: any[]) =>
      `₱ ${prices[0]} - ₱ ${prices[prices.length - 1]}`,
  }),
}));

// Mock the ShareIcons component
jest.mock('@/components/ShareIcons', () => ({
  __esModule: true,
  default: () => <div data-testid="share-icons">Share Icons</div>,
}));

// Mock the SocialShareModal component
jest.mock('../SocialShareModal', () => ({
  __esModule: true,
  default: () => <div data-testid="social-share-modal">Social Share Modal</div>,
}));

// Mock the AppButton component
jest.mock('@/components/AppButton/AppButton', () => ({
  __esModule: true,
  default: ({ children, onClick, disabled, loading }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="app-button">
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

// Mock the ReviewStar component
jest.mock('@/components/ReviewStar', () => ({
  __esModule: true,
  default: ({ rating }: { rating: number }) => (
    <div data-testid="review-star">{rating} stars</div>
  ),
}));

describe('ProductListItem', () => {
  const mockProduct = {
    id: '123',
    product_image_labels: [],
    product_specification: {
      name: 'Test Product',
      slug: 'test-product',
      short_description: 'Test description',
      images: [{ image: '/test-image.jpg' }],
    },
    product_price: {
      regular_price: 100,
      sale_price: 80,
      stock_quantity: 10,
    },
    product_state: {
      is_product_has_variants: false,
    },
    rating: 4.5,
    reviewCount: 10,
    product_seo: {},
  };

  const mockBusinessOperations: IBusinessOperations = {
    type: 'enabled',
    type_props: {
      show_buy_now_btn_product_listing: true,
      show_buy_now_btn_product_single: true,
    },
    btn_name: 'Add to Cart',
    contact_form: 'default',
  };

  const mockLocation = {
    name: 'location',
    value: 'US-CA-San Francisco',
    country: 'US',
    state: 'CA',
    city: 'San Francisco',
  };

  const mockStoreLocations: IStoreLocationDetails[] = [];

  const mockStoreDetails = {
    data: {
      store: {
        redirectToCustomDomain: false,
        customSubDomain: 'test-store',
      },
    },
  };

  const defaultProps = {
    product: mockProduct,
    handleAddToCart: jest.fn(),
    isLoading: false,
    buttonToLoad: '',
    businessOperations: mockBusinessOperations,
    location: mockLocation,
    StoreLocations: mockStoreLocations,
    storeDetails: mockStoreDetails,
    viewType: 'grid',
    setShowRatingSummary: jest.fn(),
    setProductIDToShowRatingSummary: jest.fn(),
    isRatingEnabled: true,
    isCustomerOnQRCode: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product name correctly', () => {
    render(<ProductListItem {...defaultProps} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price correctly', () => {
    render(<ProductListItem {...defaultProps} />);
    expect(screen.getByText('₱ 80.00')).toBeInTheDocument();
  });

  it('renders product description correctly', () => {
    render(<ProductListItem {...defaultProps} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders rating and review count correctly', () => {
    render(<ProductListItem {...defaultProps} />);
    expect(screen.getByText('(10 Reviews)')).toBeInTheDocument();
  });

  it('calls handleAddToCart when Add to Cart button is clicked', () => {
    render(<ProductListItem {...defaultProps} />);
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);
    expect(defaultProps.handleAddToCart).toHaveBeenCalledWith('123');
  });

  it('renders Buy Now button when show_buy_now_btn_product_listing is true', () => {
    render(<ProductListItem {...defaultProps} />);
    expect(screen.getByText('Buy Now')).toBeInTheDocument();
  });

  it('does not render Buy Now button when show_buy_now_btn_product_listing is false', () => {
    const propsWithoutBuyNow = {
      ...defaultProps,
      businessOperations: {
        ...mockBusinessOperations,
        type_props: {
          show_buy_now_btn_product_listing: false,
          show_buy_now_btn_product_single: true,
        },
      },
    };
    render(<ProductListItem {...propsWithoutBuyNow} />);
    expect(screen.queryByText('Buy Now')).not.toBeInTheDocument();
  });

  it('renders Out of Stock button when stock quantity is 0', () => {
    const propsWithNoStock = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_price: {
          ...mockProduct.product_price,
          stock_quantity: 0,
        },
      },
    };
    render(<ProductListItem {...propsWithNoStock} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('renders RFQ button when business type is rfq', () => {
    const propsWithRFQ = {
      ...defaultProps,
      businessOperations: {
        ...mockBusinessOperations,
        type: 'rfq',
        btn_name: 'Request Quote',
        contact_form: 'test-form',
        type_props: {
          show_buy_now_btn_product_listing: true,
          show_buy_now_btn_product_single: true,
        },
      },
    };
    render(<ProductListItem {...propsWithRFQ} />);
    expect(screen.getByText('Request Quote')).toBeInTheDocument();
  });

  // New test cases for increased coverage
  it('renders product with variants correctly', () => {
    const propsWithVariants = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_state: {
          is_product_has_variants: true,
        },
        variant_combinations_price_range: {
          min: 50,
          max: 100,
        },
      },
    };
    render(<ProductListItem {...propsWithVariants} />);
    expect(screen.getByText('₱ 50 - ₱ 100')).toBeInTheDocument();
  });

  it('renders product with wholesale prices', () => {
    const propsWithWholesale = {
      ...defaultProps,
      product: {
        ...mockProduct,
        wholesale_prices: [60, 70, 80],
      },
      isWholesaleEnabled: true,
    };
    render(<ProductListItem {...propsWithWholesale} />);
    expect(screen.getByText('₱ 60 - ₱ 80')).toBeInTheDocument();
  });

  it('renders product in list view', () => {
    const propsWithListView = {
      ...defaultProps,
      viewType: 'list',
    };
    render(<ProductListItem {...propsWithListView} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product in menu view', () => {
    const propsWithMenuView = {
      ...defaultProps,
      viewType: 'menu',
    };
    render(<ProductListItem {...propsWithMenuView} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('handles product with no images', () => {
    const propsWithNoImages = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_specification: {
          ...mockProduct.product_specification,
          images: [],
        },
      },
    };
    render(<ProductListItem {...propsWithNoImages} />);
    expect(screen.getByAltText('Test Product')).toHaveAttribute(
      'src',
      '/Images/no-image.png',
    );
  });

  it('handles product with sale price and price display', () => {
    const propsWithPriceDisplay = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_price: {
          ...mockProduct.product_price,
          price_display: true,
        },
      },
    };
    render(<ProductListItem {...propsWithPriceDisplay} />);
    expect(screen.getByText('₱ 80.00')).toBeInTheDocument();
  });

  it('handles product with custom domain', () => {
    const propsWithCustomDomain = {
      ...defaultProps,
      storeDetails: {
        data: {
          store: {
            redirectToCustomDomain: true,
            customDomain: 'custom-store.com',
          },
        },
      },
    };
    render(<ProductListItem {...propsWithCustomDomain} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('handles product with product tags', () => {
    const propsWithProductTags = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_tags: ['tag1', 'tag2'],
      },
    };
    render(<ProductListItem {...propsWithProductTags} />);
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('handles customer on QR code', () => {
    const propsWithQRCode = {
      ...defaultProps,
      isCustomerOnQRCode: true,
    };
    render(<ProductListItem {...propsWithQRCode} />);
    expect(screen.queryByText('Buy Now')).not.toBeInTheDocument();
  });

  it('handles disabled business operations', () => {
    const propsWithDisabledBusiness = {
      ...defaultProps,
      businessOperations: {
        ...mockBusinessOperations,
        type: 'disabled',
      },
    };
    render(<ProductListItem {...propsWithDisabledBusiness} />);
    expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
  });

  it('handles rating summary click', () => {
    render(<ProductListItem {...defaultProps} />);
    const ratingElement = screen.getByText('(10 Reviews)');
    fireEvent.click(ratingElement);
    expect(defaultProps.setShowRatingSummary).toHaveBeenCalledWith(true);
    expect(defaultProps.setProductIDToShowRatingSummary).toHaveBeenCalledWith(
      '123',
    );
  });

  it('handles buy now click', () => {
    render(<ProductListItem {...defaultProps} />);
    const buyNowButton = screen.getByText('Buy Now');
    fireEvent.click(buyNowButton);
    expect(defaultProps.handleAddToCart).toHaveBeenCalledWith(
      '123',
      true,
      true,
    );
  });

  // Additional test cases for 90% coverage
  it('handles product with display price', () => {
    const propsWithDisplayPrice = {
      ...defaultProps,
      product: {
        ...mockProduct,
        display_price: {
          strikethrough: '₱ 100.00',
          sale_price: '₱ 80.00',
          regular_price: '₱ 90.00',
          regular_price_range: '₱ 50.00 - ₱ 100.00',
        },
        product_state: {
          is_product_has_variants: true,
        },
      },
    };
    render(<ProductListItem {...propsWithDisplayPrice} />);
    expect(screen.getByText('₱ 100.00')).toBeInTheDocument();
    expect(screen.getByText('₱ 80.00')).toBeInTheDocument();
    expect(screen.getByText('₱ 90.00')).toBeInTheDocument();
    expect(screen.getByText('₱ 50.00 - ₱ 100.00')).toBeInTheDocument();
  });

  it('handles product with image labels', () => {
    const propsWithImageLabels = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_image_labels: [
          {
            id: '1',
            text: 'Sale',
            color_and_styles: {
              position: 'Upper Right',
              label_style: 'rounded',
              bg_color: '#ff0000',
              height: { value: 30 },
              width: { value: 60 },
            },
            text_style: {
              font_color: '#ffffff',
              font_family: 'Arial',
              font_size: '14px',
            },
            margin: {
              up: 10,
              right: 10,
              down: 0,
              left: 0,
            },
            hover_text: 'Special Sale',
          },
        ],
      },
    };
    render(<ProductListItem {...propsWithImageLabels} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('handles product with store locations', () => {
    const propsWithStoreLocations = {
      ...defaultProps,
      StoreLocations: [
        {
          id: '1',
          storeId: 'store1',
          storeName: 'Store 1',
          storeSlug: 'store-1',
          storeAddress: {
            address: '123 Main St',
            barangay: {
              _id: '1',
              barangayName: 'Barangay 1',
              barangayNameUppercased: 'BARANGAY 1',
            },
            city: {
              _id: '1',
              municipalityName: 'City 1',
              municipalityNameUppercased: 'CITY 1',
            },
            province: {
              _id: '1',
              provinceName: 'Province 1',
              provinceNameUppercased: 'PROVINCE 1',
            },
            country: {
              _id: '1',
              name: 'Country 1',
            },
            postal_code: '1234',
          },
          storePhoneNumber: '123-456-7890',
          storeSecondaryPhoneNumber: '098-765-4321',
          storeHours: {
            open: '09:00',
            close: '18:00',
          },
          storeEmail: 'store1@example.com',
          dateCreated: '2024-01-01',
          lastUpdated: '2024-01-01',
          status: 'active',
          is_default: true,
        },
      ],
    };
    render(<ProductListItem {...propsWithStoreLocations} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('handles product with duplicate image label positions', () => {
    const propsWithDuplicateLabels = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_image_labels: [
          {
            id: '1',
            text: 'Sale',
            color_and_styles: {
              position: 'Upper Right',
              label_style: 'rounded',
              bg_color: '#ff0000',
              height: { value: 30 },
              width: { value: 60 },
            },
            text_style: {
              font_color: '#ffffff',
              font_family: 'Arial',
              font_size: '14px',
            },
            margin: {
              up: 10,
              right: 10,
              down: 0,
              left: 0,
            },
            hover_text: 'Special Sale',
          },
          {
            id: '2',
            text: 'New',
            color_and_styles: {
              position: 'Upper Right',
              label_style: 'rounded',
              bg_color: '#00ff00',
              height: { value: 30 },
              width: { value: 60 },
            },
            text_style: {
              font_color: '#ffffff',
              font_family: 'Arial',
              font_size: '14px',
            },
            margin: {
              up: 10,
              right: 10,
              down: 0,
              left: 0,
            },
            hover_text: 'New Arrival',
          },
        ],
      },
    };
    render(<ProductListItem {...propsWithDuplicateLabels} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('handles product with different label positions', () => {
    const propsWithDifferentPositions = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_image_labels: [
          {
            id: '1',
            text: 'Sale',
            color_and_styles: {
              position: 'Upper Left',
              label_style: 'rounded',
              bg_color: '#ff0000',
              height: { value: 30 },
              width: { value: 60 },
            },
            text_style: {
              font_color: '#ffffff',
              font_family: 'Arial',
              font_size: '14px',
            },
            margin: {
              up: 10,
              right: 10,
              down: 0,
              left: 0,
            },
            hover_text: 'Special Sale',
          },
        ],
      },
    };
    render(<ProductListItem {...propsWithDifferentPositions} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('handles rating summary with review link', () => {
    const setReviewLink = jest.fn();
    const propsWithReviewLink = {
      ...defaultProps,
      setReviewLink,
      isRatingEnabled: true,
    };
    render(<ProductListItem {...propsWithReviewLink} />);
    const ratingElement = screen.getByText('(10 Reviews)');
    fireEvent.click(ratingElement);
    expect(setReviewLink).toHaveBeenCalled();
  });

  it('handles rating summary without review link', () => {
    const propsWithoutReviewLink = {
      ...defaultProps,
      isRatingEnabled: true,
    };
    render(<ProductListItem {...propsWithoutReviewLink} />);
    const ratingElement = screen.getByText('(10 Reviews)');
    fireEvent.click(ratingElement);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('handles disabled rating summary', () => {
    const propsWithDisabledRating = {
      ...defaultProps,
      isRatingEnabled: false,
    };
    render(<ProductListItem {...propsWithDisabledRating} />);
    expect(screen.queryByText('(10 Reviews)')).not.toBeInTheDocument();
  });

  it('handles product with unknown label position', () => {
    const propsWithUnknownPosition = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_image_labels: [
          {
            id: '1',
            text: 'Sale',
            color_and_styles: {
              position: 'Unknown',
              label_style: 'rounded',
              bg_color: '#ff0000',
              height: { value: 30 },
              width: { value: 60 },
            },
            text_style: {
              font_color: '#ffffff',
              font_family: 'Arial',
              font_size: '14px',
            },
            margin: {
              up: 10,
              right: 10,
              down: 0,
              left: 0,
            },
            hover_text: 'Special Sale',
          },
        ],
      },
    };
    render(<ProductListItem {...propsWithUnknownPosition} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('handles product with multiple label positions and styles', () => {
    const propsWithMultipleLabels = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_image_labels: [
          {
            id: '1',
            text: 'Sale',
            color_and_styles: {
              position: 'Upper Right',
              label_style: 'rounded',
              bg_color: '#ff0000',
              height: { value: 30 },
              width: { value: 60 },
            },
            text_style: {
              font_color: '#ffffff',
              font_family: 'Arial',
              font_size: '14px',
            },
            margin: {
              up: 10,
              right: 10,
              down: 0,
              left: 0,
            },
            hover_text: 'Special Sale',
          },
          {
            id: '2',
            text: 'New',
            color_and_styles: {
              position: 'Upper Left',
              label_style: 'square',
              bg_color: '#00ff00',
              height: { value: 30 },
              width: { value: 60 },
            },
            text_style: {
              font_color: '#000000',
              font_family: 'Arial',
              font_size: '14px',
            },
            margin: {
              up: 10,
              right: 10,
              down: 0,
              left: 0,
            },
            hover_text: 'New Arrival',
          },
        ],
      },
    };
    render(<ProductListItem {...propsWithMultipleLabels} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('handles rating summary with review link and custom pathname', () => {
    const setReviewLink = jest.fn();
    const propsWithCustomPathname = {
      ...defaultProps,
      setReviewLink,
      isRatingEnabled: true,
      location: {
        ...mockLocation,
        value: 'US-CA-Los Angeles',
      },
    };
    render(<ProductListItem {...propsWithCustomPathname} />);
    const ratingElement = screen.getByText('(10 Reviews)');
    fireEvent.click(ratingElement);
    expect(setReviewLink).toHaveBeenCalled();
  });

  it('handles rating summary with review link and store locations', () => {
    const setReviewLink = jest.fn();
    const propsWithStoreLocations = {
      ...defaultProps,
      setReviewLink,
      isRatingEnabled: true,
      StoreLocations: [
        {
          id: '1',
          storeId: 'store1',
          storeName: 'Store 1',
          storeSlug: 'store-1',
          storeAddress: {
            address: '123 Main St',
            barangay: {
              _id: '1',
              barangayName: 'Barangay 1',
              barangayNameUppercased: 'BARANGAY 1',
            },
            city: {
              _id: '1',
              municipalityName: 'City 1',
              municipalityNameUppercased: 'CITY 1',
            },
            province: {
              _id: '1',
              provinceName: 'Province 1',
              provinceNameUppercased: 'PROVINCE 1',
            },
            country: {
              _id: '1',
              name: 'Country 1',
            },
            postal_code: '1234',
          },
          storePhoneNumber: '123-456-7890',
          storeSecondaryPhoneNumber: '098-765-4321',
          storeHours: {
            open: '09:00',
            close: '18:00',
          },
          storeEmail: 'store1@example.com',
          dateCreated: '2024-01-01',
          lastUpdated: '2024-01-01',
          status: 'active',
          is_default: true,
        },
      ],
    };
    render(<ProductListItem {...propsWithStoreLocations} />);
    const ratingElement = screen.getByText('(10 Reviews)');
    fireEvent.click(ratingElement);
    expect(setReviewLink).toHaveBeenCalled();
  });

  it('handles rating summary with review link and custom domain', () => {
    const setReviewLink = jest.fn();
    const propsWithCustomDomain = {
      ...defaultProps,
      setReviewLink,
      isRatingEnabled: true,
      storeDetails: {
        data: {
          store: {
            redirectToCustomDomain: true,
            customDomain: 'custom-store.com',
          },
        },
      },
    };
    render(<ProductListItem {...propsWithCustomDomain} />);
    const ratingElement = screen.getByText('(10 Reviews)');
    fireEvent.click(ratingElement);
    expect(setReviewLink).toHaveBeenCalled();
  });

  it('handles rating summary with review link and custom subdomain', () => {
    const setReviewLink = jest.fn();
    const propsWithCustomSubdomain = {
      ...defaultProps,
      setReviewLink,
      isRatingEnabled: true,
      storeDetails: {
        data: {
          store: {
            redirectToCustomDomain: false,
            customSubDomain: 'custom-store',
          },
        },
      },
    };
    render(<ProductListItem {...propsWithCustomSubdomain} />);
    const ratingElement = screen.getByText('(10 Reviews)');
    fireEvent.click(ratingElement);
    expect(setReviewLink).toHaveBeenCalled();
  });

  it('handles product with empty image labels', () => {
    const propsWithEmptyLabels = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_image_labels: [],
      },
    };
    render(<ProductListItem {...propsWithEmptyLabels} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('handles product with null image labels', () => {
    const propsWithNullLabels = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_image_labels: null,
      },
    };
    render(<ProductListItem {...propsWithNullLabels} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('handles product with undefined image labels', () => {
    const propsWithUndefinedLabels = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_image_labels: undefined,
      },
    };
    render(<ProductListItem {...propsWithUndefinedLabels} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('handles product with invalid label position', () => {
    const propsWithInvalidPosition = {
      ...defaultProps,
      product: {
        ...mockProduct,
        product_image_labels: [
          {
            id: '1',
            text: 'Sale',
            color_and_styles: {
              position: 'Invalid Position',
              label_style: 'rounded',
              bg_color: '#ff0000',
              height: { value: 30 },
              width: { value: 60 },
            },
            text_style: {
              font_color: '#ffffff',
              font_family: 'Arial',
              font_size: '14px',
            },
            margin: {
              up: 10,
              right: 10,
              down: 0,
              left: 0,
            },
            hover_text: 'Special Sale',
          },
        ],
      },
    };
    render(<ProductListItem {...propsWithInvalidPosition} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('handles rating summary with single review', () => {
    const propsWithSingleReview = {
      ...defaultProps,
      product: {
        ...mockProduct,
        reviewCount: 1,
      },
    };
    render(<ProductListItem {...propsWithSingleReview} />);
    expect(screen.getByText('(1 Review)')).toBeInTheDocument();
  });

  it('handles rating summary with zero reviews', () => {
    const propsWithZeroReviews = {
      ...defaultProps,
      product: {
        ...mockProduct,
        reviewCount: 0,
      },
    };
    render(<ProductListItem {...propsWithZeroReviews} />);
    expect(screen.getByText('(0 Reviews)')).toBeInTheDocument();
  });

  it('handles rating summary with undefined review count', () => {
    const propsWithUndefinedReviews = {
      ...defaultProps,
      product: {
        ...mockProduct,
        reviewCount: undefined,
      },
    };
    render(<ProductListItem {...propsWithUndefinedReviews} />);
    expect(screen.getByText('(0 Reviews)')).toBeInTheDocument();
  });

  it('handles rating summary with custom domain and review link', () => {
    const setReviewLink = jest.fn();
    const propsWithCustomDomain = {
      ...defaultProps,
      setReviewLink,
      isRatingEnabled: true,
      storeDetails: {
        data: {
          store: {
            redirectToCustomDomain: true,
            customDomain: 'custom-store.com',
          },
        },
      },
    };
    render(<ProductListItem {...propsWithCustomDomain} />);
    const ratingElement = screen.getByText('(10 Reviews)');
    fireEvent.click(ratingElement);
    expect(setReviewLink).toHaveBeenCalled();
  });

  it('handles rating summary with custom subdomain and review link', () => {
    const setReviewLink = jest.fn();
    const propsWithCustomSubdomain = {
      ...defaultProps,
      setReviewLink,
      isRatingEnabled: true,
      storeDetails: {
        data: {
          store: {
            redirectToCustomDomain: false,
            customSubDomain: 'custom-store',
          },
        },
      },
    };
    render(<ProductListItem {...propsWithCustomSubdomain} />);
    const ratingElement = screen.getByText('(10 Reviews)');
    fireEvent.click(ratingElement);
    expect(setReviewLink).toHaveBeenCalled();
  });

  it('handles product with all price display options', () => {
    const propsWithAllPriceDisplay = {
      ...defaultProps,
      product: {
        ...mockProduct,
        display_price: {
          strikethrough: '₱ 100.00',
          sale_price: '₱ 80.00',
          regular_price: '₱ 90.00',
          regular_price_range: '₱ 50.00 - ₱ 100.00',
        },
        product_state: {
          is_product_has_variants: true,
        },
        product_price: {
          ...mockProduct.product_price,
          price_display: true,
        },
      },
    };
    render(<ProductListItem {...propsWithAllPriceDisplay} />);
    expect(screen.getByText('₱ 100.00')).toBeInTheDocument();
    expect(screen.getByText('₱ 80.00')).toBeInTheDocument();
    expect(screen.getByText('₱ 90.00')).toBeInTheDocument();
    expect(screen.getByText('₱ 50.00 - ₱ 100.00')).toBeInTheDocument();
  });

  it('handles product with wholesale prices and variants', () => {
    const propsWithWholesaleAndVariants = {
      ...defaultProps,
      product: {
        ...mockProduct,
        wholesale_prices: [60, 70, 80],
        product_state: {
          is_product_has_variants: true,
        },
        variant_combinations_price_range: { min: 60, max: 80 },
      },
      isWholesaleEnabled: true,
    };
    render(<ProductListItem {...propsWithWholesaleAndVariants} />);
    expect(screen.getByText('₱ 60 - ₱ 80')).toBeInTheDocument();
  });

  it('handles product with all button states', () => {
    const propsWithAllButtonStates = {
      ...defaultProps,
      isLoading: true,
      buttonToLoad: '123',
      product: {
        ...mockProduct,
        product_price: {
          ...mockProduct.product_price,
          stock_quantity: 0,
        },
      },
    };
    render(<ProductListItem {...propsWithAllButtonStates} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('handles product with all view types and button combinations', () => {
    const propsWithAllViewTypes = {
      ...defaultProps,
      viewType: 'list',
      businessOperations: {
        ...mockBusinessOperations,
        type_props: {
          show_buy_now_btn_product_listing: true,
          show_buy_now_btn_product_single: true,
        },
      },
    };
    render(<ProductListItem {...propsWithAllViewTypes} />);
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    expect(screen.getByText('Buy Now')).toBeInTheDocument();
  });
});
