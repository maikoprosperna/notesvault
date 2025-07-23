/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Formik } from 'formik';
import MetaTags from '../components/MetaTags';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock UploadImage
vi.mock('../../../../components/MediaLibraryModal/UploadImage', () => ({
  __esModule: true,
  default: ({ clickFunction, AdditionalInfo }) => (
    <div data-testid="upload-image" onClick={clickFunction}>
      UploadImage
      {AdditionalInfo}
    </div>
  ),
}));

// Mock MediaLibraryModal
vi.mock('../../../../components/MediaLibraryModal/MediaLibraryModal', () => ({
  MediaLibraryModal: ({ showMediaLibraryModal, setShowMediaLibraryModal, selectCallback }) => (
    showMediaLibraryModal ? (
      <div data-testid="media-library-modal">
        MediaLibraryModal
        <button onClick={() => {
          selectCallback([
            {
              id: 'img1',
              attributes: {
                source: {
                  file_location: 'http://test/image.jpg',
                  width: 600,
                  height: 315,
                  file_size: 1000,
                },
              },
            },
          ]);
        }}>Select Image</button>
        <button onClick={() => setShowMediaLibraryModal(false)}>Close</button>
    </div>
    ) : null
  ),
}));

// Mock validateImage
vi.mock('../../../../utils/images', () => ({
  validateImage: () => true,
}));

// Mock FormTextField
vi.mock('../../../../components/BootstrapFormik/FormTextField', () => ({
  __esModule: true,
  default: ({ label, value, onChange, underInputContent, ...props }) => (
    <div>
      <input data-testid={`form-text-field-${label}`} value={value} onChange={onChange} {...props} />
      {underInputContent && <span data-testid={`under-input-content-${label}`}>{underInputContent}</span>}
    </div>
  ),
}));

// Mock ErrorMessage
vi.mock('formik', async () => {
  const actual = await vi.importActual('formik');
  return {
    ...actual,
    ErrorMessage: ({ name }) => <div>Error: {name}</div>,
  };
});

const fields = {
  seo_meta_title: {
    type: 'text',
    id: 'seo_meta_title',
    label: 'Meta Title',
    required: true,
    placeholder: 'Enter meta title',
    value: '',
  },
  seo_meta_description: {
    type: 'text',
    id: 'seo_meta_description',
    label: 'Meta Description',
    required: true,
    placeholder: 'Enter meta description',
    value: '',
  },
  seo_meta_image: {
    type: 'image',
    id: 'seo_meta_image',
    label: 'Meta Image',
    required: false,
    value: '',
  },
};

const initialValues = {
  seo_meta_title: 'Test Title',
  seo_meta_description: 'Test Description',
  seo_meta_image: '',
};

describe('MetaTags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithFormik(values = initialValues) {
    return render(
      <Formik initialValues={values} onSubmit={() => {}}>
        <MetaTags fields={fields} attr="seo" />
      </Formik>
    );
  }

  it('renders all main fields', () => {
    renderWithFormik();
    expect(screen.getByTestId('form-text-field-Meta Title')).toBeInTheDocument();
    expect(screen.getByTestId('form-text-field-Meta Description')).toBeInTheDocument();
    expect(screen.getByTestId('upload-image')).toBeInTheDocument();
    expect(screen.getByText('Meta Image')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('updates the title field value on change', () => {
    renderWithFormik();
    const titleInput = screen.getByTestId('form-text-field-Meta Title');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput.value).toBe('New Title');
  });

  it('updates the description field value on change', () => {
    renderWithFormik();
    const descInput = screen.getByTestId('form-text-field-Meta Description');
    fireEvent.change(descInput, { target: { value: 'New Desc' } });
    expect(descInput.value).toBe('New Desc');
  });

  it('opens media library modal on upload image click', () => {
    renderWithFormik();
    fireEvent.click(screen.getByTestId('upload-image'));
    expect(screen.queryByTestId('media-library-modal')).toBeInTheDocument();
  });

  it('selects image from media library and updates preview', () => {
    renderWithFormik();
    fireEvent.click(screen.getByTestId('upload-image'));
    const selectBtn = screen.getByText('Select Image');
    fireEvent.click(selectBtn);
    // After selecting, the preview should show the image
    expect(screen.getByAltText('Meta Image')).toBeInTheDocument();
  });

  it('closes media library modal', () => {
    renderWithFormik();
    fireEvent.click(screen.getByTestId('upload-image'));
    const closeBtn = screen.getByText('Close');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('media-library-modal')).not.toBeInTheDocument();
  });

  it('shows image preview if metaImage or field value is present', () => {
    const fieldsWithImage = {
      ...fields,
      seo_meta_image: { ...fields.seo_meta_image, value: 'http://test/image.jpg' },
    };
    const valuesWithImage = {
      ...initialValues,
      seo_meta_image: 'http://test/image.jpg',
    };
      render(
      <Formik initialValues={valuesWithImage} onSubmit={() => {}}>
        <MetaTags fields={fieldsWithImage} attr="seo" />
      </Formik>
    );
    expect(screen.getByAltText('Meta Image')).toBeInTheDocument();
  });

  it('shows default preview if no image is present', () => {
    renderWithFormik();
    expect(screen.getByText('Meta Image')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    // Should show SVG fallback
    expect(screen.getByText((content, element) => {
      return element.tagName === 'svg';
    })).toBeInTheDocument();
  });

  it('does not update preview or close modal if validateImage returns false', async () => {
    // Dynamically import the module and override validateImage to return false
    const imagesModule = await import('../../../../utils/images');
    const originalValidateImage = imagesModule.validateImage;
    imagesModule.validateImage = () => false;

    renderWithFormik();
    fireEvent.click(screen.getByTestId('upload-image'));
    const selectBtn = screen.getByText('Select Image');
    fireEvent.click(selectBtn);

    // Should still show the fallback SVG, not the image
    expect(screen.getByText((content, element) => element.tagName === 'svg')).toBeInTheDocument();
    // The modal should still be open
    expect(screen.getByTestId('media-library-modal')).toBeInTheDocument();

    // Restore the original mock
    imagesModule.validateImage = originalValidateImage;
  });

  it('shows error and sets isInvalid when title field has error and is touched', () => {
      render(
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
        initialErrors={{ seo_meta_title: 'Required' }}
        initialTouched={{ seo_meta_title: true }}
      >
        <MetaTags fields={fields} attr="seo" />
      </Formik>
    );
    // Error message should be rendered
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });

  it('shows underInputContent for description field', () => {
    renderWithFormik({
      ...initialValues,
      seo_meta_description: '12345',
    });
    // Should show the character count
    expect(screen.getByTestId('under-input-content-Meta Description')).toHaveTextContent('5/150');
  });

  it('shows underInputContent as 0/150 when description is empty', () => {
    renderWithFormik({
      ...initialValues,
      seo_meta_description: '',
    });
    expect(screen.getByTestId('under-input-content-Meta Description')).toHaveTextContent('0/150');
  });

  it('shows error message for image field', () => {
      render(
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
        initialErrors={{ seo_meta_image: 'Image required' }}
        initialTouched={{ seo_meta_image: true }}
      >
        <MetaTags fields={fields} attr="seo" />
      </Formik>
    );
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });

  it('shows underInputContent as 0/50 when attr is twitter and description is empty', () => {
    const twitterFields = {
      twitter_meta_title: {
        ...fields.seo_meta_title,
        id: 'twitter_meta_title',
        label: 'Meta Title',
      },
      twitter_meta_description: {
        ...fields.seo_meta_description,
        id: 'twitter_meta_description',
        label: 'Meta Description',
      },
      twitter_meta_image: {
        ...fields.seo_meta_image,
        id: 'twitter_meta_image',
        label: 'Meta Image',
        value: '',
      },
    };
      render(
      <Formik
        initialValues={{
          twitter_meta_title: '',
          twitter_meta_description: '',
          twitter_meta_image: '',
        }}
        onSubmit={() => {}}
      >
        <MetaTags fields={twitterFields} attr="twitter" />
      </Formik>
    );
    expect(screen.getByTestId('under-input-content-Meta Description')).toHaveTextContent('0/50');
  });
});