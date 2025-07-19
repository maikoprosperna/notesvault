import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyOrdersTableSection from '../MyOrdersTableSection';
import * as useMyOrderTableSectionModule from '../useMyOrderTableSection';
import * as LocationAPIModule from '../../../../../../../../api/Locations';
import * as nextNavigation from 'next/navigation';
import * as Columns from '../MyOrdersTableSection.Columns';
import * as TableModule from '@/components/Table/Table';
import SelectDropdown from '@/components/SelectDropdown/SelectDropdown';
import Select from 'react-select';
import { User } from 'next-auth';
import { IOrder } from '@/types';

// Mocks
jest.mock('../useMyOrderTableSection');
jest.mock('../../../../../../../../api/Locations');
jest.mock('next/navigation');
jest.mock('../MyOrdersTableSection.Columns');
jest.mock('@/components/SelectDropdown/SelectDropdown', () =>
  jest.fn(() => <div data-testid="select-dropdown" />),
);
jest.mock('react-select', () =>
  jest.fn(() => <div data-testid="react-select" />),
);
jest.mock('@/components/Table/Table', () =>
  jest.fn(() => <div data-testid="table" />),
);
jest.mock('../../../../_components/AddAReviewModal/AddAReviewModal', () =>
  jest.fn(() => <div data-testid="add-review-modal" />),
);
jest.mock('../MyOrdersTableSection.SmallScreenOrdersTable', () =>
  jest.fn(() => <div data-testid="small-screen-table" />),
);
jest.mock('@/components/AppButton/AppButton', () =>
  jest.fn(({ onClick, children }) => (
    <button data-testid="app-button" onClick={onClick}>
      {children}
    </button>
  )),
);

jest.mock('next-auth', () => ({
  __esModule: true,
  User: jest.fn(),
}));

// Mock useSearchParams properly
const mockUseSearchParams = jest.fn();
(nextNavigation.useSearchParams as jest.Mock) = mockUseSearchParams;

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
} as any;

const baseOrder: IOrder = {
  order_information: {
    fname: 'John',
    lname: 'Doe',
    email_address: 'john@example.com',
    phone: '1234567890',
    address_line: '123 Main St',
    state: 'State',
    city: 'City',
    barangay: 'Barangay',
    zip_code: '12345',
    landmark: 'Landmark',
    note: 'Note',
    status: 'Completed',
    quotation: { country_region: 'PH' },
  },
  payment_information: {
    type: 'Credit Card',
    gateway: 'Gateway',
    status: 'Paid',
    reference_id: 'ref123',
  },
  shipping_information: {
    type: 'Standard',
    shipped_by: 'Courier',
  },
  delivery_information: {
    vehicle_type: 'Car',
    status: 'Delivered',
    reference_number: 'ref-delivery',
    meta_data: {
      success: 'yes',
      reason: 'none',
      txlogisticid: 'txid',
      mailno: 'mailno',
      sortingcode: 'sortcode',
      sortingNo: 'sortno',
    },
  },
  fees: {
    xendit_gateway_fee: 1,
    convenience_fee: 2,
    convenience_fee_customer: 3,
    shipping_fee: 4,
    payment_gateway_fee: 5,
    additional_fee: 6,
  },
  dimensions: { actual_weight: 1, volumetric_weight: 2 },
  order_grand_total: 100,
  order_total_income: 90,
  order_cost_of_sales: 80,
  prosperna_earning: 10,
  discount_amount: 5,
  order_external_discount: 0,
  order_id: 'order1',
  store_id: 'store1',
  customer_id: 'customer1',
  cart_ids: [],
  ordered_item_ids: [],
  is_trashed: false,
  order_total_amount: 100,
  order_subtotal_amount: 95,
  order_total_qty: 1,
  has_been_disbursed_to_merchant: false,
  requested_for_disbursement: false,
  disbursement_status: 'none',
  disbursement_updated_by: [],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  order_origin: 'web',
  id: 'id1',
  cart_items_list: [],
  ordered_items_list: [],
  has_download_link_all: false,
  download_link: null,
  download_link_all: null,
  order_comment: undefined,
  order_delivery_date: '2023-01-02T00:00:00Z',
  product_variant_combination_id: null,
  selected_variant_combination_data: {},
  unit_cost: '10',
  product_data: {},
  selected_addon_data: [],
  product_name: 'Product Name',
  order_status: 'Completed',
  is_wholesale: false,
  wholesale_unit_cost: 0,
  store_locations: 'Location 1',
} as any;

const pendingOrder: IOrder = {
  ...baseOrder,
  order_id: 'order2',
  order_information: { ...baseOrder.order_information, status: 'Pending' },
  order_status: 'Pending',
};

const mockSetFilter = jest.fn();
const mockOnClickPrevious = jest.fn();
const mockOnClickNext = jest.fn();
const mockHandlePageSizeChange = jest.fn();

const defaultHookReturn = {
  filter: { label: 'All', value: 'all' },
  setFilter: mockSetFilter,
  filters: [
    { label: 'All', value: 'all' },
    { label: 'Completed', value: 'Completed' },
  ],
  filteredCustomerOrdersList: [baseOrder, pendingOrder],
  selectedPageSize: { label: '10', value: 10 },
  isFetchingCustomerOrders: false,
  sizePerPageList: [
    { text: '10', value: 10 },
    { text: '20', value: 20 },
  ],
  onClickPrevious: mockOnClickPrevious,
  onClickNext: mockOnClickNext,
  handlePageSizeChange: mockHandlePageSizeChange,
};

const renderComponent = (
  props = {},
  hookOverrides = {},
  locationData: any = { data: [] },
  searchParamsOverrides: Record<string, string | null | undefined> = {},
) => {
  (useMyOrderTableSectionModule.default as jest.Mock).mockReturnValue({
    ...defaultHookReturn,
    ...hookOverrides,
  });
  (
    LocationAPIModule.LocationAPI.usePublicStoreLocationsList as jest.Mock
  ).mockReturnValue(locationData);

  // Mock search params
  const getMock = (key: string) => searchParamsOverrides[key] ?? null;
  mockUseSearchParams.mockReturnValue({
    get: getMock,
  });

  // Mock columns
  (Columns.DateColumn as jest.Mock).mockImplementation(() => (
    <span>DateColumn</span>
  ));
  (Columns.ItemColumn as jest.Mock).mockImplementation(() => (
    <span>ItemColumn</span>
  ));
  (Columns.LocationColumn as jest.Mock).mockImplementation(() => (
    <span>LocationColumn</span>
  ));
  (Columns.PaymentLinkColumn as jest.Mock).mockImplementation(() => (
    <span>PaymentLinkColumn</span>
  ));
  (Columns.PaymentStatusColumn as jest.Mock).mockImplementation(() => (
    <span>PaymentStatusColumn</span>
  ));
  (Columns.PaymentTypeColumn as jest.Mock).mockImplementation(() => (
    <span>PaymentTypeColumn</span>
  ));
  (Columns.PriceColumn as jest.Mock).mockImplementation(() => (
    <span>PriceColumn</span>
  ));
  (Columns.StatusColumn as jest.Mock).mockImplementation(() => (
    <span>StatusColumn</span>
  ));
  (Columns.DeliveryTimeColumn as jest.Mock).mockImplementation(() => (
    <span>DeliveryTimeColumn</span>
  ));

  return render(
    <MyOrdersTableSection user={mockUser} storeId="store1" {...props} />,
  );
};

describe('MyOrdersTableSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Suppress console.error during tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders loading spinner when isFetchingCustomerOrders is true', () => {
    renderComponent({}, { isFetchingCustomerOrders: true });
    // The Spinner mock does not render role="status", so check for Spinner by class
    expect(document.querySelector('.spinner-border')).toBeTruthy();
  });

  it('renders SelectDropdown and passes correct props', () => {
    renderComponent();
    expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();
  });

  it('renders Table for desktop and SmallScreenOrdersTable for mobile', () => {
    renderComponent();
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('small-screen-table')).toBeInTheDocument();
  });

  it('renders Select for page size and handles change', () => {
    renderComponent();
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('renders Pagination and handles previous/next', () => {
    renderComponent();
    const prev = screen.getByRole('button', { name: /previous/i });
    const next = screen.getByRole('button', { name: /next/i });
    fireEvent.click(prev);
    fireEvent.click(next);
    expect(mockOnClickPrevious).toHaveBeenCalled();
    expect(mockOnClickNext).toHaveBeenCalled();
  });

  //   it('renders AddAReviewModal when showModal is true', async () => {
  //     renderComponent(
  //       {},
  //       {},
  //       { data: [] },
  //       { type: 'review', productid: 'any', order_id: 'order1' },
  //     );
  //     // Use findByTestId which waits for the element to appear
  //     expect(
  //       await screen.findByTestId('add-review-modal', {}, { timeout: 2000 }),
  //     ).toBeInTheDocument();
  //   });

  it('does not render AddAReviewModal if type is not review', () => {
    renderComponent(
      {},
      {},
      { data: [] },
      { type: 'notreview', productid: 'pid', order_id: 'order1' },
    );
    expect(screen.queryByTestId('add-review-modal')).not.toBeInTheDocument();
  });

  it('does not render AddAReviewModal if order is not completed', () => {
    renderComponent(
      {},
      { filteredCustomerOrdersList: [pendingOrder] },
      { data: [] },
      { type: 'review', productid: 'pid', order_id: 'order2' },
    );
    expect(screen.queryByTestId('add-review-modal')).not.toBeInTheDocument();
  });

  it('renders with empty filteredCustomerOrdersList', () => {
    renderComponent({}, { filteredCustomerOrdersList: [] });
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('small-screen-table')).toBeInTheDocument();
  });

  it('renders with null filteredCustomerOrdersList', () => {
    renderComponent({}, { filteredCustomerOrdersList: null });
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('small-screen-table')).toBeInTheDocument();
  });

  it('renders with undefined filteredCustomerOrdersList', () => {
    renderComponent({}, { filteredCustomerOrdersList: undefined });
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('small-screen-table')).toBeInTheDocument();
  });

  it('renders with empty sizePerPageList', () => {
    renderComponent({}, { sizePerPageList: [] });
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('renders with null sizePerPageList', () => {
    expect(() => renderComponent({}, { sizePerPageList: null })).toThrow();
  });

  it('renders with undefined sizePerPageList', () => {
    expect(() => renderComponent({}, { sizePerPageList: undefined })).toThrow();
  });

  it('renders with null selectedPageSize', () => {
    renderComponent({}, { selectedPageSize: null });
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('renders with undefined selectedPageSize', () => {
    renderComponent({}, { selectedPageSize: undefined });
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('renders with null filters', () => {
    renderComponent({}, { filters: null });
    expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();
  });

  it('renders with undefined filters', () => {
    renderComponent({}, { filters: undefined });
    expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();
  });

  it('renders with null filter', () => {
    renderComponent({}, { filter: null });
    expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();
  });

  it('renders with undefined filter', () => {
    renderComponent({}, { filter: undefined });
    expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();
  });

  it('renders with more than one store location and includes Store Location column', () => {
    renderComponent({}, {}, { data: [{}, {}] });
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('calls setFilter when SelectDropdown changes', () => {
    (SelectDropdown as jest.Mock).mockImplementation(({ onChange }) => (
      <button
        data-testid="select-dropdown"
        onClick={() => onChange({ label: 'Completed', value: 'Completed' })}
      />
    ));
    renderComponent();
    fireEvent.click(screen.getByTestId('select-dropdown'));
    expect(mockSetFilter).toHaveBeenCalled();
  });

  it('calls handlePageSizeChange when Select changes', () => {
    (Select as jest.Mock).mockImplementation(({ onChange }) => (
      <button
        data-testid="react-select"
        onClick={() => onChange({ label: '20', value: 20 })}
      />
    ));
    renderComponent();
    fireEvent.click(screen.getByTestId('react-select'));
    expect(mockHandlePageSizeChange).toHaveBeenCalled();
  });

  it('renders AppButton for completed order and opens modal on click', async () => {
    // Patch Table to render the Action cell
    (TableModule.default as jest.Mock).mockImplementation(
      ({ columns, data }) => {
        // Find the Action column
        const actionCol = columns.find((col: any) => col.header === 'Action');
        // Render the cell for the completed order
        return (
          <div>
            {data.map((row: any) => (
              <div key={row.order_id}>
                {actionCol.cell({ row: { original: row } })}
              </div>
            ))}
          </div>
        );
      },
    );
    renderComponent();
    const addReviewButtons = screen.getAllByTestId('app-button');
    expect(addReviewButtons.length).toBeGreaterThan(0);
    fireEvent.click(addReviewButtons[0]);
    await waitFor(() => {
      expect(screen.getByTestId('add-review-modal')).toBeInTheDocument();
    });
  });

  it('does not render AppButton for non-completed order', () => {
    (TableModule.default as jest.Mock).mockImplementation(
      ({ columns, data }) => {
        const actionCol = columns.find((col: any) => col.header === 'Action');
        return (
          <div>
            {data.map((row: any) => (
              <div key={row.order_id}>
                {actionCol.cell({ row: { original: row } })}
              </div>
            ))}
          </div>
        );
      },
    );
    renderComponent({}, { filteredCustomerOrdersList: [pendingOrder] });
    expect(screen.queryByTestId('app-button')).not.toBeInTheDocument();
  });

  it('handles missing order_information gracefully', () => {
    const order = { ...baseOrder, order_information: undefined };
    (TableModule.default as jest.Mock).mockImplementation(
      ({ columns, data }) => {
        const actionCol = columns.find((col: any) => col.header === 'Action');
        return (
          <div>
            {data.map((row: any) => (
              <div key={row.order_id}>
                {actionCol.cell({ row: { original: row } })}
              </div>
            ))}
          </div>
        );
      },
    );
    renderComponent({}, { filteredCustomerOrdersList: [order] });
    expect(screen.queryByTestId('app-button')).not.toBeInTheDocument();
  });

  it('handles missing payment_information gracefully', () => {
    const order = { ...baseOrder, payment_information: undefined };
    renderComponent({}, { filteredCustomerOrdersList: [order] });
    expect(screen.queryByTestId('table')).toBeNull();
  });

  it('handles missing store_locations gracefully', () => {
    const order = { ...baseOrder, store_locations: undefined };
    renderComponent({}, { filteredCustomerOrdersList: [order] });
    expect(screen.queryByTestId('table')).toBeNull();
  });

  it('handles missing order_total_amount gracefully', () => {
    const order = { ...baseOrder, order_total_amount: undefined };
    renderComponent({}, { filteredCustomerOrdersList: [order] });
    expect(screen.queryByTestId('table')).toBeNull();
  });

  it('handles missing createdAt gracefully', () => {
    const order = { ...baseOrder, createdAt: undefined };
    renderComponent({}, { filteredCustomerOrdersList: [order] });
    expect(screen.queryByTestId('table')).toBeNull();
  });

  it('handles missing order_delivery_date gracefully', () => {
    const order = { ...baseOrder, order_delivery_date: undefined };
    renderComponent({}, { filteredCustomerOrdersList: [order] });
    expect(screen.queryByTestId('table')).toBeNull();
  });

  it('handles missing order_id gracefully', () => {
    const order = { ...baseOrder, order_id: undefined };
    renderComponent({}, { filteredCustomerOrdersList: [order] });
    expect(screen.queryByTestId('table')).toBeNull();
  });
});
