// import { useState } from 'react';
import { object as yupObject } from 'yup';
import {
  REQUIRED_VALIDATOR,
  // NUMBER_VALIDATOR,
  // FLOAT_VALIDATOR,
  // NULL_VALIDATOR,
} from '../../../components/BootstrapFormik/CustomFormsValidators/CustomValidators';

export const useAddNewTemplateForm = (data) => {
  const fields = {
    template_name: {
      type: 'text',
      id: 'template_name',
      label: 'Template Name',
      value: data?.template_name || '',
      validator: REQUIRED_VALIDATOR,
      required: true,
      placeholder: '',
    },
    template_type: {
      type: 'text',
      id: 'template_type',
      label: 'Template Type',
      value: data?.template_type || 'Footer',
      required: false,
      placeholder: '',
    },
    page_applied: {
      type: 'radio',
      id: 'page_applied',
      value: data?.page_applied || '',
      required: false,
      placeholder: '',
    },
    selected_pages: {
      type: 'checkbox',
      label: 'Select Pages',
      id: 'selected_pages',
      value: data?.selected_pages || [],
      validator: '',
      required: false,
    },
  };

  let schema = {};
  let initialValues = {};

  for (const [field, { validator, value }] of Object.entries(fields)) {
    schema[field] = validator;
    initialValues[field] = value;
  }

  schema = yupObject(schema);
  return {
    // showCreatePromoCodeForm,
    // handleSetShowCreatePromoCodeForm,
    fields,
    schema,
    initialValues,
  };
};
