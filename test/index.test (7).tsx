import React from 'react';
import { render } from '@testing-library/react';
import ProductListing from '../index';

// Mock the ProductListing component
jest.mock('../ProductListing', () => {
  return function MockProductListing() {
    return <div data-testid="product-listing">ProductListing</div>;
  };
});

describe('ProductListing Index', () => {
  it('exports ProductListing component correctly', () => {
    expect(ProductListing).toBeDefined();
    expect(typeof ProductListing).toBe('function');
  });

  it('renders ProductListing component', () => {
    const mockProps = {
      storeID: 'test-store',
      storeCategoryList: [],
      selectedCategories: [],
      setSelectedCategories: jest.fn(),
      selectedSubCategories: [],
      setSelectedSubCategories: jest.fn(),
      isGuestCheckoutVerification: false,
      businessOperations: {
        type: 'enabled',
        type_props: {
          show_buy_now_btn_product_listing: true,
          show_buy_now_btn_product_single: true,
        },
        btn_name: '',
        contact_form: '',
      },
      location: undefined,
      store_location_id: 'loc1',
      StoreLocations: [],
      category: undefined,
      storeDetails: {
        data: {
          store: {
            productListing: {
              allow_list_view: true,
              allow_grid_view: true,
              allow_menu_view: true,
            },
          },
        },
      },
      activePage: 1,
      setActivePage: jest.fn(),
      viewType: 'grid',
      setViewType: jest.fn(),
      productListingByCategory: [],
      productListingByCategoryIsFetching: false,
    };

    const { getByTestId } = render(<ProductListing {...mockProps} />);
    expect(getByTestId('product-listing')).toBeInTheDocument();
  });
});
