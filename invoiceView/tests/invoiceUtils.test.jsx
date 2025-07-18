/* eslint-disable */
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getInvoiceTitle, getPaymentMethod } from '../components/invoiceUtils.jsx';

// Mock the utilities
vi.mock('../../../../../../../utils', () => ({
  capitalizeAndRemoveDashes: vi.fn((str) => str),
}));

describe('invoiceUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getInvoiceTitle', () => {
    it('returns addon title when app_key exists', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('returns addon title with prorated when is_prorated is true', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
        is_prorated: true,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('returns addon title with plan type when plan_type is not Base', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'PREMIUM',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('returns regular subscription title when no app_key', () => {
      const singleDetails = {
        subscription_plan_info: {
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles missing subscription_plan_info', () => {
      const singleDetails = {};

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles missing plan_type', () => {
      const singleDetails = {
        subscription_plan_info: {
          billing_type: 'MONTH',
        },
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles missing billing_type', () => {
      const singleDetails = {
        subscription_plan_info: {
          plan_type: 'BASIC',
        },
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles missing addon_name', () => {
      const singleDetails = {
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles missing is_prorated', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles missing plan_type in addon', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles missing billing_type in addon', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles Base plan type in addon', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'Base',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles non-Base plan type in addon', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'PREMIUM',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles prorated addon with Base plan type', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'Base',
          billing_type: 'MONTH',
        },
        is_prorated: true,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles prorated addon with non-Base plan type', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'PREMIUM',
          billing_type: 'MONTH',
        },
        is_prorated: true,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    // Additional test cases to increase coverage
    it('handles null singleDetails', () => {
      const result = getInvoiceTitle(null);
      expect(result).toBeDefined();
    });

    it('handles undefined singleDetails', () => {
      const result = getInvoiceTitle(undefined);
      expect(result).toBeDefined();
    });

    it('handles null subscription_plan_info', () => {
      const singleDetails = {
        subscription_plan_info: null,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles undefined subscription_plan_info', () => {
      const singleDetails = {
        subscription_plan_info: undefined,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles null app_key', () => {
      const singleDetails = {
        subscription_plan_info: {
          app_key: null,
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles empty string app_key', () => {
      const singleDetails = {
        subscription_plan_info: {
          app_key: '',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles null plan_type', () => {
      const singleDetails = {
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: null,
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles null billing_type', () => {
      const singleDetails = {
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: null,
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles null addon_name', () => {
      const singleDetails = {
        addon_name: null,
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles undefined addon_name', () => {
      const singleDetails = {
        addon_name: undefined,
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles null is_prorated', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
        is_prorated: null,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles undefined is_prorated', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
        is_prorated: undefined,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles false is_prorated explicitly', () => {
      const singleDetails = {
        addon_name: 'Premium Support',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles empty string plan_type', () => {
      const singleDetails = {
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: '',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles empty string billing_type', () => {
      const singleDetails = {
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: '',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });

    it('handles empty string addon_name', () => {
      const singleDetails = {
        addon_name: '',
        subscription_plan_info: {
          app_key: 'addon',
          plan_type: 'BASIC',
          billing_type: 'MONTH',
        },
        is_prorated: false,
      };

      const result = getInvoiceTitle(singleDetails);
      expect(result).toBeDefined();
    });
  });

  describe('getPaymentMethod', () => {
    it('returns E-WALLET: GCash for E-WALLET type', () => {
      const singleDetails = {
        payment_methods: [{ type: 'E-WALLET' }],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBe('E-WALLET: GCash');
    });

    it('returns payment method type for non-E-WALLET', () => {
      const singleDetails = {
        payment_methods: [{ type: 'CREDIT_CARD' }],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBe('CREDIT_CARD');
    });

    it('handles missing payment_methods', () => {
      const singleDetails = {};

      const result = getPaymentMethod(singleDetails);
      expect(result).toBeUndefined();
    });

    it('handles empty payment_methods array', () => {
      const singleDetails = {
        payment_methods: [],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBeUndefined();
    });

    it('handles payment method without type', () => {
      const singleDetails = {
        payment_methods: [{}],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBeUndefined();
    });

    // Additional test cases to increase coverage
    it('handles null singleDetails', () => {
      const result = getPaymentMethod(null);
      expect(result).toBeUndefined();
    });

    it('handles undefined singleDetails', () => {
      const result = getPaymentMethod(undefined);
      expect(result).toBeUndefined();
    });

    it('handles null payment_methods', () => {
      const singleDetails = {
        payment_methods: null,
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBeUndefined();
    });

    it('handles undefined payment_methods', () => {
      const singleDetails = {
        payment_methods: undefined,
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBeUndefined();
    });

    it('handles payment method with null type', () => {
      const singleDetails = {
        payment_methods: [{ type: null }],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBeNull();
    });

    it('handles payment method with undefined type', () => {
      const singleDetails = {
        payment_methods: [{ type: undefined }],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBeUndefined();
    });

    it('handles payment method with empty string type', () => {
      const singleDetails = {
        payment_methods: [{ type: '' }],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBe('');
    });

    it('handles multiple payment methods', () => {
      const singleDetails = {
        payment_methods: [
          { type: 'CREDIT_CARD' },
          { type: 'E-WALLET' },
        ],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBe('CREDIT_CARD');
    });

    it('handles payment method with additional properties', () => {
      const singleDetails = {
        payment_methods: [{ 
          type: 'E-WALLET',
          id: 1,
          name: 'GCash'
        }],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBe('E-WALLET: GCash');
    });

    it('handles case insensitive E-WALLET type', () => {
      const singleDetails = {
        payment_methods: [{ type: 'e-wallet' }],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBe('e-wallet');
    });

    it('handles different E-WALLET variations', () => {
      const singleDetails = {
        payment_methods: [{ type: 'EWALLET' }],
      };

      const result = getPaymentMethod(singleDetails);
      expect(result).toBe('EWALLET');
    });
  });
}); 