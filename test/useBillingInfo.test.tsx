import { renderHook } from '@testing-library/react';
import { useBillingInfo } from '../useBillingInfo';
import { TCustomer } from '@/types';

// Mock the formSetupGenerator utility
jest.mock('@/utils/forms/formSetupGenerator', () => ({
  formSetupGenerator: jest.fn((fields) => ({
    fields: fields.reduce((acc: any, field: any) => {
      acc[field.id] = field;
      return acc;
    }, {}),
    initialValues: fields.reduce((acc: any, field: any) => {
      acc[field.id] = field.value;
      return acc;
    }, {}),
    schema: {},
  })),
}));

// Mock the emailDetachStore utility
jest.mock('@/utils/emailDetachStore', () => ({
  emailDetachStore: jest.fn((email) => email?.replace('@store.com', '')),
}));

// Mock the validation constants
jest.mock('@/utils/yupCustomValidation', () => ({
  EMAIL_VALIDATOR: 'email-validator',
  NAME_VALIDATOR: 'name-validator',
  REQUIRED_INTERNATIONAL_MOBILE_NUMBER_VALIDATOR: 'phone-validator',
}));

// Import mocked modules
import { formSetupGenerator } from '@/utils/forms/formSetupGenerator';
import { emailDetachStore } from '@/utils/emailDetachStore';

describe('useBillingInfo', () => {
  const mockCustomerDetails: TCustomer = {
    id: 'customer123',
    first_name: 'John',
    last_name: 'Doe',
    email_address: 'john.doe@store.com',
    phone_number: '+1234567890',
  };

  const mockCustomerDetailsWithEmail: TCustomer = {
    ...mockCustomerDetails,
    email_address: 'john.doe@store.com',
  };

  const mockCustomerDetailsWithoutEmail: TCustomer = {
    ...mockCustomerDetails,
    email_address: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns BillingInfoForm with correct structure', () => {
    const { result } = renderHook(() => useBillingInfo(mockCustomerDetails));

    expect(result.current.BillingInfoForm).toBeDefined();
    expect(result.current.BillingInfoForm.fields).toBeDefined();
    expect(result.current.BillingInfoForm.initialValues).toBeDefined();
    expect(result.current.BillingInfoForm.schema).toBeDefined();
  });

  it('generates form fields with customer details', () => {
    const { result } = renderHook(() => useBillingInfo(mockCustomerDetails));

    const { fields } = result.current.BillingInfoForm;

    expect(fields.fname).toBeDefined();
    expect(fields.fname.label).toBe('First Name');
    expect(fields.fname.type).toBe('text');
    expect(fields.fname.required).toBe(true);

    expect(fields.lname).toBeDefined();
    expect(fields.lname.label).toBe('Last Name');
    expect(fields.lname.type).toBe('text');
    expect(fields.lname.required).toBe(true);

    expect(fields.email).toBeDefined();
    expect(fields.email.label).toBe('Email Address');
    expect(fields.email.type).toBe('email');
    expect(fields.email.required).toBe(true);

    expect(fields.phone).toBeDefined();
    expect(fields.phone.label).toBe('Phone');
    expect(fields.phone.type).toBe('text');
    expect(fields.phone.required).toBe(true);

    expect(fields.accountRadio).toBeDefined();
    expect(fields.accountRadio.label).toBe('');
    expect(fields.accountRadio.type).toBe('text');
    expect(fields.accountRadio.required).toBe(false);
  });

  it('uses customer details for initial values', () => {
    const { result } = renderHook(() => useBillingInfo(mockCustomerDetails));

    const { initialValues } = result.current.BillingInfoForm;

    expect(initialValues.fname).toBe('John');
    expect(initialValues.lname).toBe('Doe');
    expect(initialValues.email).toBe('john.doe'); // After emailDetachStore processing
    expect(initialValues.phone).toBe('+1234567890');
    expect(initialValues.accountRadio).toBe('guest');
  });

  it('handles customer details with email', () => {
    const { result } = renderHook(() =>
      useBillingInfo(mockCustomerDetailsWithEmail),
    );

    const { initialValues } = result.current.BillingInfoForm;
    expect(initialValues.email).toBe('john.doe'); // After emailDetachStore processing
  });

  it('handles customer details without email', () => {
    const { result } = renderHook(() =>
      useBillingInfo(mockCustomerDetailsWithoutEmail),
    );

    const { initialValues } = result.current.BillingInfoForm;
    expect(initialValues.email).toBe('');
  });

  it('handles null customer details', () => {
    const { result } = renderHook(() => useBillingInfo(null as any));

    const { initialValues } = result.current.BillingInfoForm;
    expect(initialValues.fname).toBe('');
    expect(initialValues.lname).toBe('');
    expect(initialValues.email).toBe('');
    expect(initialValues.phone).toBe('');
    expect(initialValues.accountRadio).toBe('guest');
  });

  it('handles undefined customer details', () => {
    const { result } = renderHook(() => useBillingInfo(undefined as any));

    const { initialValues } = result.current.BillingInfoForm;
    expect(initialValues.fname).toBe('');
    expect(initialValues.lname).toBe('');
    expect(initialValues.email).toBe('');
    expect(initialValues.phone).toBe('');
    expect(initialValues.accountRadio).toBe('guest');
  });

  it('sets correct validators for each field', () => {
    const { result } = renderHook(() => useBillingInfo(mockCustomerDetails));

    const { fields } = result.current.BillingInfoForm;

    expect(fields.fname.validator).toBe('name-validator');
    expect(fields.lname.validator).toBe('name-validator');
    expect(fields.email.validator).toBe('email-validator');
    expect(fields.phone.validator).toBe('phone-validator');
    expect(fields.accountRadio.validator).toBe('');
  });

  it('sets correct placeholders for each field', () => {
    const { result } = renderHook(() => useBillingInfo(mockCustomerDetails));

    const { fields } = result.current.BillingInfoForm;

    expect(fields.fname.placeholder).toBe('Enter your first name');
    expect(fields.lname.placeholder).toBe('Enter your last name');
    expect(fields.email.placeholder).toBe('Enter your email');
    expect(fields.phone.placeholder).toBe('');
    expect(fields.accountRadio.placeholder).toBe('');
  });

  it('processes email with emailDetachStore', () => {
    const mockedEmailDetachStore = jest.mocked(emailDetachStore);
    mockedEmailDetachStore.mockReturnValue('john.doe');

    const { result } = renderHook(() =>
      useBillingInfo(mockCustomerDetailsWithEmail),
    );

    expect(emailDetachStore).toHaveBeenCalledWith('john.doe@store.com');

    const { initialValues } = result.current.BillingInfoForm;
    expect(initialValues.email).toBe('john.doe');
  });

  it('handles empty customer details gracefully', () => {
    const emptyCustomer: TCustomer = {
      id: 'empty',
      first_name: '',
      last_name: '',
      email_address: '',
      phone_number: '',
    };

    const { result } = renderHook(() => useBillingInfo(emptyCustomer));

    const { initialValues } = result.current.BillingInfoForm;
    expect(initialValues.fname).toBe('');
    expect(initialValues.lname).toBe('');
    expect(initialValues.email).toBe('');
    expect(initialValues.phone).toBe('');
    expect(initialValues.accountRadio).toBe('guest');
  });

  it('calls formSetupGenerator with correct parameters', () => {
    renderHook(() => useBillingInfo(mockCustomerDetails));

    expect(formSetupGenerator).toHaveBeenCalledWith([
      {
        type: 'text',
        id: 'fname',
        label: 'First Name',
        value: 'John',
        validator: 'name-validator',
        required: true,
        placeholder: 'Enter your first name',
      },
      {
        type: 'text',
        id: 'lname',
        label: 'Last Name',
        value: 'Doe',
        validator: 'name-validator',
        required: true,
        placeholder: 'Enter your last name',
      },
      {
        type: 'email',
        id: 'email',
        label: 'Email Address',
        value: 'john.doe',
        validator: 'email-validator',
        required: true,
        placeholder: 'Enter your email',
      },
      {
        type: 'text',
        id: 'phone',
        label: 'Phone',
        value: '+1234567890',
        validator: 'phone-validator',
        required: true,
        placeholder: '',
      },
      {
        type: 'text',
        id: 'accountRadio',
        label: '',
        value: 'guest',
        validator: '',
        required: false,
        placeholder: '',
      },
    ]);
  });
});
