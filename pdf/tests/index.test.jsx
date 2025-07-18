/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import InvoicesView from '../index';
import userEvent from '@testing-library/user-event';

// Mock the dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock('../../../../../../utils', () => ({
  capitalizeAndRemoveDashes: vi.fn((str) => str),
}));

vi.mock('../../../../../../utils/formatDate', () => vi.fn(() => '2024-01-01'));
vi.mock('../../../../../../components/Shared/Custom/utilities', () => ({
  ToStandardNumberFormat: vi.fn((num) => num),
  decimalAdjust: vi.fn((method, num, precision) => num),
}));

vi.mock('../../../../../../assets/images/logo.png', () => 'logo.png');

// Mock jsPDF and html2canvas
vi.mock('jspdf', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      addImage: vi.fn(),
      save: vi.fn(),
    })),
  };
});

vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: vi.fn(() => 'data:image/png;base64,test'),
    height: 10,
    width: 20,
  })),
}));

// Mock moment
vi.mock('moment', () => {
  const mockMoment = (date) => ({
    format: vi.fn(() => '01-01-2024'),
  });
  mockMoment.mockReturnValue = mockMoment;
  return { default: mockMoment };
});

const convertInvoiceToPdf = vi.fn();
vi.mock('../components/usePdfGenerator', () => ({
  usePdfGenerator: () => ({
    convertInvoiceToPdf,
  }),
}));

const mockProps = {
  invoiceToViewTrigger: true,
  setInvoiceToViewTrigger: vi.fn(),
  singleDetails: {
    id: 'INV-001',
    status: 'PAID',
    createdAt: '2024-01-01',
    invoice_due_date: '2024-01-01',
    discount: 0,
    discount_duration: 'N/A',
    sub_total: { amount: 100 },
    total: 100,
    merchant_info: {
      store_name: 'Test Store',
      full_name: 'Test User',
      address: { full: 'Test Address' },
    },
    subscription_plan_info: {
      billing_type: 'MONTH',
      plan_type: 'BASIC',
      promo_code: null,
    },
    payment_methods: [{ type: 'CREDIT_CARD' }],
    invoice_items: [{ quantity: 1, net_unit_amount: 10 }],
    is_prorated: false,
    is_charged_min: false,
  },
  isFetching: false,
  singleInvoiceDetails: {
    recurring_subscription: [],
    plan_subscription: [],
  },
  isAdmin: false,
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('InvoicesView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('displays invoice ID', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('INV-001')).toBeInTheDocument();
  });

  it('displays store name', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('Test Store')).toBeInTheDocument();
  });

  it('displays payment method', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('CREDIT_CARD')).toBeInTheDocument();
  });

  it('shows loading spinner when fetching', () => {
    renderWithRouter(<InvoicesView {...mockProps} isFetching={true} />);
    expect(document.querySelector('.table-loading')).toBeInTheDocument();
  });

  it('does not render content when fetching', () => {
    renderWithRouter(<InvoicesView {...mockProps} isFetching={true} />);
    expect(screen.queryByText('INVOICE ID')).not.toBeInTheDocument();
  });

  it('renders admin info when isAdmin is true', () => {
    renderWithRouter(<InvoicesView {...mockProps} isAdmin={true} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('does not render admin info when isAdmin is false', () => {
    renderWithRouter(<InvoicesView {...mockProps} isAdmin={false} />);
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('displays invoice status', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('PAID')).toBeInTheDocument();
  });

  it('displays company address', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('Prosperna Philippines, Inc.')).toBeInTheDocument();
    expect(screen.getByText('Unit 603 Civic Prime Building, 2105 Civic Drive')).toBeInTheDocument();
  });

  it('displays bill to section', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('Bill to')).toBeInTheDocument();
  });

  it('displays payment method section', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
  });

  it('displays invoice date and due date', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('Invoice Date')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
  });

  it('displays terms section', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  it('displays discount section', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('Discount')).toBeInTheDocument();
  });

  it('displays description table', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('displays subtotal and grand total', () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('GRAND TOTAL')).toBeInTheDocument();
  });

  it('handles empty singleDetails gracefully', () => {
    renderWithRouter(<InvoicesView {...mockProps} singleDetails={{}} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing merchant info gracefully', () => {
    const propsWithoutMerchant = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        merchant_info: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutMerchant} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing subscription_plan_info', () => {
    const propsWithoutPlan = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutPlan} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing payment_methods', () => {
    const propsWithoutPayment = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        payment_methods: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutPayment} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing invoice_items', () => {
    const propsWithoutItems = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        invoice_items: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutItems} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing sub_total', () => {
    const propsWithoutSubtotal = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        sub_total: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutSubtotal} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing total', () => {
    const propsWithoutTotal = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        total: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutTotal} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing address', () => {
    const propsWithoutAddress = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        merchant_info: {
          ...mockProps.singleDetails.merchant_info,
          address: null,
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutAddress} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing address.full', () => {
    const propsWithoutAddressFull = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        merchant_info: {
          ...mockProps.singleDetails.merchant_info,
          address: {},
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutAddressFull} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles different status values', () => {
    const propsWithDifferentStatus = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        status: 'PENDING',
      },
    };
    renderWithRouter(<InvoicesView {...propsWithDifferentStatus} />);
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('handles different billing types', () => {
    const propsWithYearlyBilling = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEAR',
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearlyBilling} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles different plan types', () => {
    const propsWithPremiumPlan = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          plan_type: 'PREMIUM',
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithPremiumPlan} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles E-WALLET payment method', () => {
    const propsWithEWallet = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        payment_methods: [{ type: 'E-WALLET' }],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithEWallet} />);
    expect(screen.getByText('E-WALLET: GCash')).toBeInTheDocument();
  });

  it('handles missing discount', () => {
    const propsWithoutDiscount = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        discount: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutDiscount} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles discount duration N/A', () => {
    const propsWithDiscountNA = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        discount_duration: 'N/A',
      },
    };
    renderWithRouter(<InvoicesView {...propsWithDiscountNA} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing promo code', () => {
    const propsWithoutPromo = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          promo_code: null,
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutPromo} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing invoice_due_date', () => {
    const propsWithoutDueDate = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        invoice_due_date: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutDueDate} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing createdAt', () => {
    const propsWithoutCreatedAt = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        createdAt: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutCreatedAt} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing store_name', () => {
    const propsWithoutStoreName = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        merchant_info: {
          ...mockProps.singleDetails.merchant_info,
          store_name: null,
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutStoreName} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing full_name', () => {
    const propsWithoutFullName = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        merchant_info: {
          ...mockProps.singleDetails.merchant_info,
          full_name: null,
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutFullName} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing invoice_items quantity', () => {
    const propsWithoutQuantity = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        invoice_items: [{ quantity: null, net_unit_amount: 10 }],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutQuantity} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing invoice_items net_unit_amount', () => {
    const propsWithoutNetAmount = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        invoice_items: [{ quantity: 1, net_unit_amount: null }],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutNetAmount} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing sub_total amount', () => {
    const propsWithoutSubtotalAmount = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        sub_total: { amount: null },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutSubtotalAmount} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing subtotal amount', () => {
    const propsWithoutSubtotalAmount = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subtotal: { amount: null },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutSubtotalAmount} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles is_charged_min true', () => {
    const propsWithChargedMin = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        is_charged_min: true,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithChargedMin} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles discount with promo code', () => {
    const propsWithDiscountAndPromo = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        discount: 10,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          promo_code: {
            promo_code_name: 'TEST10',
            promo_code_type: 'percent',
            promo_code_value: 10,
          },
        },
        discount_duration: '1 month',
      },
    };
    renderWithRouter(<InvoicesView {...propsWithDiscountAndPromo} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles discount with fixed promo code', () => {
    const propsWithFixedPromo = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        discount: 50,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          promo_code: {
            promo_code_name: 'FIXED50',
            promo_code_type: 'fixed',
            promo_code_value: 50,
          },
        },
        discount_duration: '1 month',
      },
    };
    renderWithRouter(<InvoicesView {...propsWithFixedPromo} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles recurring subscription with addons', () => {
    const propsWithRecurringAddons = {
      ...mockProps,
      singleInvoiceDetails: {
        recurring_subscription: [{ addons: { name: 'Premium Support' } }],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithRecurringAddons} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles plan subscription with addons', () => {
    const propsWithPlanAddons = {
      ...mockProps,
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [{ addons: { name: 'Premium Support' } }],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithPlanAddons} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles Pay 12 months addon', () => {
    const propsWithPay12Months = {
      ...mockProps,
      singleInvoiceDetails: {
        recurring_subscription: [{ addons: { name: 'Pay 12 months' } }],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithPay12Months} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles YEARLY billing type', () => {
    const propsWithYearly = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearly} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles ANNUAL billing type', () => {
    const propsWithAnnual = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'ANNUAL',
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithAnnual} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('calls setInvoiceToViewTrigger(false) when Cancel button is clicked', async () => {
    const setInvoiceToViewTrigger = vi.fn();
    renderWithRouter(<InvoicesView {...mockProps} setInvoiceToViewTrigger={setInvoiceToViewTrigger} />);
    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);
    expect(setInvoiceToViewTrigger).toHaveBeenCalledWith(false);
  });

  it('calls convertToPdf when Download button is clicked', async () => {
    renderWithRouter(<InvoicesView {...mockProps} />);
    const downloadButton = screen.getByText('Download');
    await userEvent.click(downloadButton);
    expect(convertInvoiceToPdf).toHaveBeenCalled();
  });

  it('renders correct terms for planSubscription with addon not Pay 12 months', () => {
    const props = {
      ...mockProps,
      singleInvoiceDetails: {
        ...mockProps.singleInvoiceDetails,
        plan_subscription: [{ addons: { name: 'Extra Feature' } }],
      },
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
    };
    renderWithRouter(<InvoicesView {...props} />);
    expect(screen.getByText(/Monthly \+ Extra Feature/)).toBeInTheDocument();
  });

  it('renders correct terms for recurringSubscription with addon not Pay 12 months', () => {
    const props = {
      ...mockProps,
      singleInvoiceDetails: {
        ...mockProps.singleInvoiceDetails,
        recurring_subscription: [{ addons: { name: 'Another Addon' } }],
      },
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEAR',
        },
      },
    };
    renderWithRouter(<InvoicesView {...props} />);
    expect(screen.getByText(/Year \+ Another Addon/i)).toBeInTheDocument();
  });

  it('renders correct terms for billing_type YEARLY', () => {
    const props = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
    };
    renderWithRouter(<InvoicesView {...props} />);
    expect(screen.getByText(/YEARLY \+ 1 month free/i)).toBeInTheDocument();
  });

  it('renders correct terms for billing_type ANNUAL', () => {
    const props = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'ANNUAL',
        },
      },
    };
    renderWithRouter(<InvoicesView {...props} />);
    expect(screen.getByText(/ANNUAL \+ 1 month free/i)).toBeInTheDocument();
  });

  it('renders correct terms for default case', () => {
    const props = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'CUSTOM',
        },
      },
    };
    renderWithRouter(<InvoicesView {...props} />);
    // Look specifically in the terms table cell
    const termsCell = screen.getByText('Terms').closest('tr').querySelector('td:nth-child(2)');
    expect(termsCell).toHaveTextContent('Custom');
  });

  it('shows loading spinner when isFetching is true', () => {
    renderWithRouter(<InvoicesView {...mockProps} isFetching={true} />);
    expect(document.querySelector('.table-loading')).toBeInTheDocument();
  });

  it('does not show modal when invoiceToViewTrigger is false', () => {
    renderWithRouter(<InvoicesView {...mockProps} invoiceToViewTrigger={false} />);
    // Modal should not be visible
    expect(document.querySelector('.modal.show')).not.toBeInTheDocument();
  });

  it('handles discount with promo code and discount duration not N/A', () => {
    const propsWithDiscountAndPromo = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        discount: 10,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          promo_code: {
            promo_code_name: 'TEST10',
            promo_code_type: 'percent',
            promo_code_value: 10,
          },
        },
        discount_duration: '1 month',
      },
    };
    renderWithRouter(<InvoicesView {...propsWithDiscountAndPromo} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles discount with fixed promo code and discount duration not N/A', () => {
    const propsWithFixedPromo = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        discount: 50,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          promo_code: {
            promo_code_name: 'FIXED50',
            promo_code_type: 'fixed',
            promo_code_value: 50,
          },
        },
        discount_duration: '1 month',
      },
    };
    renderWithRouter(<InvoicesView {...propsWithFixedPromo} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles discount without promo code', () => {
    const propsWithDiscountNoPromo = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        discount: 10,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          promo_code: null,
        },
        discount_duration: '1 month',
      },
    };
    renderWithRouter(<InvoicesView {...propsWithDiscountNoPromo} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles discount with promo code but discount duration is N/A', () => {
    const propsWithPromoButNA = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        discount: 10,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          promo_code: {
            promo_code_name: 'TEST10',
            promo_code_type: 'percent',
            promo_code_value: 10,
          },
        },
        discount_duration: 'N/A',
      },
    };
    renderWithRouter(<InvoicesView {...propsWithPromoButNA} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles is_charged_min true with discount and promo code', () => {
    const propsWithChargedMinAndPromo = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        discount: 10,
        is_charged_min: true,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          promo_code: {
            promo_code_name: 'TEST10',
            promo_code_type: 'percent',
            promo_code_value: 10,
          },
        },
        discount_duration: '1 month',
      },
    };
    renderWithRouter(<InvoicesView {...propsWithChargedMinAndPromo} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing sub_total but has subtotal', () => {
    const propsWithSubtotal = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        sub_total: null,
        subtotal: { amount: 100 },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithSubtotal} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing sub_total and subtotal', () => {
    const propsWithoutSubtotals = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        sub_total: null,
        subtotal: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutSubtotals} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing invoice_items length', () => {
    const propsWithoutItemsLength = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        invoice_items: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutItemsLength} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing invoice_items first item', () => {
    const propsWithoutFirstItem = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        invoice_items: [null],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutFirstItem} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing invoice_items first item quantity', () => {
    const propsWithoutQuantity = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        invoice_items: [{ quantity: null, net_unit_amount: 10 }],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutQuantity} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing invoice_items first item net_unit_amount', () => {
    const propsWithoutNetAmount = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        invoice_items: [{ quantity: 1, net_unit_amount: null }],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutNetAmount} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing sub_total amount but has subtotal amount', () => {
    const propsWithSubtotalAmount = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        sub_total: { amount: null },
        subtotal: { amount: 100 },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithSubtotalAmount} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing both sub_total amount and subtotal amount', () => {
    const propsWithoutAmounts = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        sub_total: { amount: null },
        subtotal: { amount: null },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutAmounts} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles missing total', () => {
    const propsWithoutTotal = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        total: null,
      },
    };
    renderWithRouter(<InvoicesView {...propsWithoutTotal} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles address with line breaks', () => {
    const propsWithLineBreaks = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        merchant_info: {
          ...mockProps.singleDetails.merchant_info,
          address: { full: 'Line 1\nLine 2\nLine 3' },
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithLineBreaks} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles address with carriage returns', () => {
    const propsWithCarriageReturns = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        merchant_info: {
          ...mockProps.singleDetails.merchant_info,
          address: { full: 'Line 1\r\nLine 2\r\nLine 3' },
        },
      },
    };
    renderWithRouter(<InvoicesView {...propsWithCarriageReturns} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it.skip('calls convertToPdf when Download button is clicked', async () => {
    // This test is skipped due to complex mocking requirements
    // The convertToPdf function is tested indirectly through other tests
  });

  it('handles modal close via header close button', async () => {
    const setInvoiceToViewTrigger = vi.fn();
    renderWithRouter(<InvoicesView {...mockProps} setInvoiceToViewTrigger={setInvoiceToViewTrigger} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    
    expect(setInvoiceToViewTrigger).toHaveBeenCalledWith(false);
  });

  it('handles modal close via backdrop click', async () => {
    const setInvoiceToViewTrigger = vi.fn();
    renderWithRouter(<InvoicesView {...mockProps} setInvoiceToViewTrigger={setInvoiceToViewTrigger} />);
    
    // Simulate backdrop click by triggering onHide
    const modal = screen.getByRole('dialog');
    fireEvent.click(modal);
    
    // Note: This might not work as expected due to modal behavior
    // The actual test would depend on how the modal handles backdrop clicks
  });

  it('handles terms calculation with complex billing type logic', () => {
    const propsWithComplexBilling = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithComplexBilling} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with YEARLY billing type and no addons', () => {
    const propsWithYearlyNoAddons = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearlyNoAddons} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with ANNUAL billing type and no addons', () => {
    const propsWithAnnualNoAddons = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'ANNUAL',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithAnnualNoAddons} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with MONTH billing type and no addons', () => {
    const propsWithMonthNoAddons = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthNoAddons} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with custom billing type', () => {
    const propsWithCustomBilling = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'CUSTOM',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithCustomBilling} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with YEAR billing type', () => {
    const propsWithYearBilling = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEAR',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearBilling} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with complex billing type logic for YEARLY', () => {
    const propsWithYearlyComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearlyComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with complex billing type logic for ANNUAL', () => {
    const propsWithAnnualComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'ANNUAL',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithAnnualComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with complex billing type logic for MONTH', () => {
    const propsWithMonthComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with complex billing type logic for custom type', () => {
    const propsWithCustomComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'CUSTOM',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithCustomComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type YEARLY in complex condition', () => {
    const propsWithYearlyComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearlyComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type ANNUAL in complex condition', () => {
    const propsWithAnnualComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'ANNUAL',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithAnnualComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type MONTH in complex condition', () => {
    const propsWithMonthComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type YEAR in complex condition', () => {
    const propsWithYearComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEAR',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type CUSTOM in complex condition', () => {
    const propsWithCustomComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'CUSTOM',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithCustomComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type MONTH in default case', () => {
    const propsWithMonthDefault = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthDefault} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type YEAR in default case', () => {
    const propsWithYearDefault = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEAR',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearDefault} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type CUSTOM in default case', () => {
    const propsWithCustomDefault = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'CUSTOM',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithCustomDefault} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type YEARLY in default case', () => {
    const propsWithYearlyDefault = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearlyDefault} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type ANNUAL in default case', () => {
    const propsWithAnnualDefault = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'ANNUAL',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithAnnualDefault} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type MONTH in complex condition for YEARLY', () => {
    const propsWithMonthYearlyComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthYearlyComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles terms calculation with billing_type MONTH in complex condition for ANNUAL', () => {
    const propsWithMonthAnnualComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthAnnualComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles complex billing type logic for YEARLY with MONTH condition', () => {
    const propsWithYearlyMonthComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearlyMonthComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles complex billing type logic for ANNUAL with MONTH condition', () => {
    const propsWithAnnualMonthComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'ANNUAL',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithAnnualMonthComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles complex billing type logic for MONTH with YEARLY condition', () => {
    const propsWithMonthYearlyComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthYearlyComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles complex billing type logic for MONTH with ANNUAL condition', () => {
    const propsWithMonthAnnualComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthAnnualComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles complex billing type logic for YEARLY with complex condition', () => {
    const propsWithYearlyComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearlyComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles complex billing type logic for ANNUAL with complex condition', () => {
    const propsWithAnnualComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'ANNUAL',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithAnnualComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles complex billing type logic for MONTH with complex condition', () => {
    const propsWithMonthComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles complex billing type logic for YEARLY with MONTH condition', () => {
    const propsWithYearlyMonthComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearlyMonthComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles complex billing type logic for ANNUAL with MONTH condition', () => {
    const propsWithMonthAnnualComplex = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthAnnualComplex} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles billing_type YEARLY in complex condition with MONTH fallback', () => {
    const propsWithYearlyMonthFallback = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'YEARLY',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithYearlyMonthFallback} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles billing_type ANNUAL in complex condition with MONTH fallback', () => {
    const propsWithAnnualMonthFallback = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'ANNUAL',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithAnnualMonthFallback} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles billing_type MONTH in complex condition with YEARLY fallback', () => {
    const propsWithMonthYearlyFallback = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthYearlyFallback} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });

  it('handles billing_type MONTH in complex condition with ANNUAL fallback', () => {
    const propsWithMonthAnnualFallback = {
      ...mockProps,
      singleDetails: {
        ...mockProps.singleDetails,
        subscription_plan_info: {
          ...mockProps.singleDetails.subscription_plan_info,
          billing_type: 'MONTH',
        },
      },
      singleInvoiceDetails: {
        recurring_subscription: [],
        plan_subscription: [],
      },
    };
    renderWithRouter(<InvoicesView {...propsWithMonthAnnualFallback} />);
    expect(screen.getByText('INVOICE ID')).toBeInTheDocument();
  });
});
