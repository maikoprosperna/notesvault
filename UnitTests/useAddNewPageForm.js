// import { useState } from 'react';
import { object as yupObject } from 'yup';
import {
  REQUIRED_VALIDATOR,
  // NUMBER_VALIDATOR,
  // FLOAT_VALIDATOR,
  // NULL_VALIDATOR,
} from '../../../components/BootstrapFormik/CustomFormsValidators/CustomValidators';

export const useAddNewPageForm = (data) => {
  // const [showCreatePromoCodeForm, setShowCreatePromoCodeForm] = useState(false);
  // const handleSetShowCreatePromoCodeForm = (isShown) => setShowCreatePromoCodeForm(isShown);

  const fields = {
    page_name: {
      type: 'text',
      id: 'page_name',
      label: 'Page Name',
      value: data?.page_name || '',
      validator: REQUIRED_VALIDATOR,
      required: true,
      placeholder: '',
    },
    page_slug: {
      type: 'text',
      id: 'page_slug',
      label: 'Slug',
      value: data?.slug || '',
      // validator: REQUIRED_VALIDATOR,
      required: false,
    },
    google_meta_image: {
      type: 'file',
      id: 'google_meta_image',
      label: 'Meta Image',
      required: false,
      placeholder: '',
      value: data?.page_seo?.google?.meta_image || '',
    },
    google_meta_title: {
      type: 'text',
      id: 'google_meta_title',
      label: 'Meta Title',
      required: false,
      placeholder: '',
      value: data?.page_seo?.google?.meta_title || '',
    },
    google_meta_description: {
      type: 'text',
      id: 'google_meta_description',
      label: 'Meta Description',
      required: false,
      placeholder: '',
      value: data?.page_seo?.google?.meta_description || '',
    },
    facebook_meta_image: {
      type: 'file',
      id: 'facebook_meta_image',
      label: 'Meta Image',
      required: false,
      placeholder: '',
      value: data?.page_seo?.facebook?.meta_image || '',
    },
    facebook_meta_title: {
      type: 'text',
      id: 'facebook_meta_title',
      label: 'Meta Title',
      required: false,
      placeholder: '',
      value: data?.page_seo?.facebook?.meta_title || '',
    },
    facebook_meta_description: {
      type: 'text',
      id: 'facebook_meta_description',
      label: 'Meta Description',
      required: false,
      placeholder: '',
      value: data?.page_seo?.facebook?.meta_description || '',
    },
    twitter_meta_image: {
      type: 'file',
      id: 'twitter_meta_image',
      label: 'Meta Image',
      required: false,
      placeholder: '',
      value: data?.page_seo?.twitter?.meta_image || '',
    },
    twitter_meta_title: {
      type: 'text',
      id: 'twitter_meta_title',
      label: 'Meta Title',
      required: false,
      placeholder: '',
      value: data?.page_seo?.twitter?.meta_title || '',
    },
    twitter_meta_description: {
      type: 'text',
      id: 'twitter_meta_description',
      label: 'Meta Description',
      required: false,
      placeholder: '',
      value: data?.page_seo?.twitter?.meta_description || '',
    },
    theme_selection: {
      type: 'radio',
      id: 'theme_selection',
      label: 'Theme Selection',
      value: data?.theme || 'blank',
      validator: REQUIRED_VALIDATOR,
      required: true,
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
