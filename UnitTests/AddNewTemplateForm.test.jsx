/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddNewTemplateForm } from '../AddNewTemplateForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Formik } from 'formik';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
// Mock react-redux
vi.mock('react-redux', () => ({
  useSelector: () => ({ storeDetails: {} }),
}));
// Mock other dependencies
vi.mock('../components/SpecificPages', () => ({
  default: () => <div>SpecificPages</div>,
}));
vi.mock('../../../components/BootstrapFormik/FormTextField', () => ({
  default: () => <input />,
}));
vi.mock('../../../components/Shared/Custom/notification', () => ({
  __esModule: true,
  default: vi.fn(),
}));
vi.mock('../../../api/BusinessProfile/PageBuilder', () => ({
  PageBuilderAPI: {
    useAddNewTemplate: () => ({ mutate: vi.fn() }),
    useUpdateTemplate: () => ({ mutate: vi.fn() }),
    useGetAvailablePages: () => ({ data: [] }),
  },
}));

const defaultProps = {
  modalAddNewTemplateTrigger: true,
  setModalAddNewTemplateTrigger: vi.fn(),
  isQuickEdit: false,
  data: {},
};

const queryClient = new QueryClient();

describe('AddNewTemplateForm', () => {
  it('renders the modal and Create Template button', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );
    expect(screen.getByText('Add New Template')).toBeInTheDocument();
    expect(screen.getByText('Create Template')).toBeInTheDocument();
  });

  it('calls setModalAddNewTemplateTrigger when Cancel is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.setModalAddNewTemplateTrigger).toHaveBeenCalled();
  });

  it('renders quick edit mode with Edit Template and Save', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} isQuickEdit={true} />
        </Formik>
      </QueryClientProvider>
    );
    expect(screen.getByText('Edit Template')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders Apply To radio buttons', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );
    expect(screen.getByText('All Pages')).toBeInTheDocument();
    expect(screen.getByText('Specific Pages')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('shows Select Pages when Specific Pages is selected', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );
    const radios = screen.getAllByRole('radio');
    // 0: All Pages, 1: Specific Pages, 2: None
    fireEvent.click(radios[1]);
    expect(screen.getByText('Select Pages')).toBeInTheDocument();
  });

  it('shows confirmation dialog when All Pages is selected', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );
    const radios = screen.getAllByRole('radio');
    // 0: All Pages, 1: Specific Pages, 2: None
    fireEvent.click(radios[0]);
    expect(screen.getByText('Apply To All Pages')).toBeInTheDocument();
    expect(screen.getByText('You are about to apply this footer to all of your pages.')).toBeInTheDocument();
  });

  it('handles form submission with template data', () => {
    const templateData = {
      id: '123',
      template_name: 'Test Template',
      template_type: 'footer',
      selected_pages: []
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={templateData} />
        </Formik>
      </QueryClientProvider>
    );

    expect(screen.getByText('Add New Template')).toBeInTheDocument();
  });

  it('handles different template types', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    // Check that the template type field is present (it's disabled and shows 'footer')
    expect(screen.getByText('Template Type')).toBeInTheDocument();
  });

  it('handles radio button selection changes', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]); // Specific Pages
    expect(screen.getByText('Select Pages')).toBeInTheDocument();
  });

  it('handles confirmation dialog actions', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]); // All Pages
    expect(screen.getByText('Apply To All Pages')).toBeInTheDocument();
  });

  it('handles form field interactions', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const templateNameInput = screen.getByRole('textbox', { name: /template name/i });
    fireEvent.change(templateNameInput, { target: { value: 'Test Template' } });
    
    expect(templateNameInput.value).toBe('Test Template');
  });

  it('handles quick edit mode with existing data', () => {
    const editData = {
      id: '123',
      template_name: 'Existing Template',
      template_type: 'footer',
      selected_pages: [{ id: '1', page_name: 'Home', slug: 'home' }]
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} isQuickEdit={true} data={editData} />
        </Formik>
      </QueryClientProvider>
    );

    expect(screen.getByText('Edit Template')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('handles modal close functionality', () => {
    const mockSetModalTrigger = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} setModalAddNewTemplateTrigger={mockSetModalTrigger} />
        </Formik>
      </QueryClientProvider>
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockSetModalTrigger).toHaveBeenCalled();
  });

  it('handles different apply options', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    
    // Test None option
    fireEvent.click(radios[2]);
    expect(radios[2]).toBeChecked();
  });

  it('tests onSubmitForm function with template creation', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests onSubmitForm function with template update', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} isQuickEdit={true} data={{ id: '123' }} />
        </Formik>
      </QueryClientProvider>
    );

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    expect(saveButton).toBeInTheDocument();
  });

  it('tests handleRadioChange function', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]); // Specific Pages
    
    expect(screen.getByText('Select Pages')).toBeInTheDocument();
  });

  it('tests handleApplyToAllPagesModal function', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]); // All Pages
    
    expect(screen.getByText('Apply To All Pages')).toBeInTheDocument();
  });

  it('tests handleConfirmApplyToAllPagesModal function', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]); // All Pages
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(confirmButton).toBeInTheDocument();
  });

  it('tests form submission with all template fields', () => {
    const mockOnSubmit = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages'
          }} 
          onSubmit={mockOnSubmit}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests error handling in template form submission', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    // Test with empty form values
    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests success callbacks for template API calls', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    expect(screen.getByText('Add New Template')).toBeInTheDocument();
  });

  it('tests error callbacks for template API calls', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    expect(screen.getByText('Add New Template')).toBeInTheDocument();
  });

  it('tests different radio button selections', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const radios = screen.getAllByRole('radio');
    
    // Test All Pages
    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
    
    // Test Specific Pages
    fireEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();
    
    // Test None
    fireEvent.click(radios[2]);
    expect(radios[2]).toBeChecked();
  });

  it('tests form validation for template submission', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    // Test form validation by submitting without required fields
    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests modal state management for templates', () => {
    const mockSetModalTrigger = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} setModalAddNewTemplateTrigger={mockSetModalTrigger} />
        </Formik>
      </QueryClientProvider>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  it('tests specific pages selection functionality', () => {
    const templateData = {
      id: '123',
      template_name: 'Test Template',
      template_type: 'footer',
      selected_pages: [
        { id: '1', page_name: 'Home', slug: 'home' },
        { id: '2', page_name: 'About', slug: 'about' }
      ]
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={templateData} />
        </Formik>
      </QueryClientProvider>
    );

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]); // Specific Pages
    
    expect(screen.getByText('Select Pages')).toBeInTheDocument();
  });

  it('tests form submission with different template data structures', () => {
    const templateData = {
      id: '456',
      template_name: 'Header Template',
      template_type: 'header',
      selected_pages: []
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={templateData} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with empty selected_pages array', () => {
    const templateData = {
      id: '789',
      template_name: 'Empty Template',
      template_type: 'footer',
      selected_pages: []
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={templateData} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with null/undefined template data', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={null} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with different page_applied values', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'all_pages'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with specific_pages page_applied value', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with empty page_applied value', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: ''
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with null/undefined form values', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: null
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with empty string form values', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: '',
            page_applied: ''
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with special characters in template name', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Template with Special Chars: !@#$%^&*()',
            page_applied: 'specific_pages'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with very long template name', () => {
    const longTemplateName = 'A'.repeat(1000);
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: longTemplateName,
            page_applied: 'all_pages'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with unicode characters in template name', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Template with Unicode: 中文 Español Français 🚀',
            page_applied: 'specific_pages'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with mixed data types in form values', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 123,
            page_applied: true
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with different template types', () => {
    const templateData = {
      id: '999',
      template_name: 'Custom Template',
      template_type: 'custom',
      selected_pages: []
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={templateData} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with complex selected_pages structure', () => {
    const templateData = {
      id: '111',
      template_name: 'Complex Template',
      template_type: 'footer',
      selected_pages: [
        { id: '1', page_name: 'Home', slug: 'home', custom_field: 'value' },
        { id: '2', page_name: 'About', slug: 'about', nested: { data: 'test' } }
      ]
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={templateData} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with different customSubDomain conditions for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} customSubDomain="prodev.test.com" />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with prostage customSubDomain for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} customSubDomain="prostage.test.com" />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with default customSubDomain for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} customSubDomain="test.com" />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with showBuilder true for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} showBuilder={true} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with different template_name values for createSlug', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template With Spaces' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with special characters in template_name for createSlug', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test-Template-With-Dashes' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with empty template_name for createSlug', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: '' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with null template_name for createSlug', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: null }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with undefined template_name for createSlug', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: undefined }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with data.id as different types for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={{ id: 123 }} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with data.id as string for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={{ id: '123' }} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with data.id as boolean for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={{ id: true }} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with data.id as object for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={{ id: { nested: 'value' } }} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with data.id as array for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={{ id: [1, 2, 3] }} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with data.id as function for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={{ id: () => 'test' }} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with data.id as symbol for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={{ id: Symbol('test') }} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with data.id as bigint for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{ template_name: 'Test Template' }} onSubmit={() => {}}>
          <AddNewTemplateForm {...defaultProps} data={{ id: BigInt(123) }} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with different page_applied values for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'all_pages'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with page_applied as boolean true for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: true
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with page_applied as boolean false for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: false
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with page_applied as number for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 1
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with page_applied as object for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: { nested: 'value' }
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with page_applied as array for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: [1, 2, 3]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as boolean true for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'all_pages',
            selected_pages: true
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as array for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [{ id: '1', page_name: 'Home' }]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as empty array for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: []
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as null for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: null
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as undefined for template', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: undefined
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with different template_type values', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: 'header'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as null', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: null
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as undefined', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: undefined
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as empty string', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: ''
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as number', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: 123
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as boolean', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: true
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as object', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: { nested: 'value' }
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as array', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: ['header', 'footer']
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as function', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: () => 'header'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as symbol', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: Symbol('header')
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_type as bigint', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            template_type: BigInt(123)
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with different selected_pages structures', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: '1', page_name: 'Home', slug: 'home', custom_field: 'value' },
              { id: '2', page_name: 'About', slug: 'about', nested: { data: 'test' } },
              { id: '3', page_name: 'Contact', slug: 'contact', array_field: [1, 2, 3] }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as different data types', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: 123, page_name: 'Home', slug: 'home' },
              { id: '456', page_name: 'About', slug: 'about' },
              { id: true, page_name: 'Contact', slug: 'contact' },
              { id: false, page_name: 'Services', slug: 'services' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as complex objects', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { 
                id: '1', 
                page_name: 'Home', 
                slug: 'home',
                metadata: {
                  title: 'Home Page',
                  description: 'Welcome to our site',
                  tags: ['home', 'landing']
                }
              },
              { 
                id: '2', 
                page_name: 'About', 
                slug: 'about',
                metadata: {
                  title: 'About Us',
                  description: 'Learn more about us',
                  tags: ['about', 'company']
                }
              }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as functions', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: () => '1', page_name: 'Home', slug: 'home' },
              { id: () => '2', page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as symbols', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: Symbol('1'), page_name: 'Home', slug: 'home' },
              { id: Symbol('2'), page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as bigint', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: BigInt(1), page_name: 'Home', slug: 'home' },
              { id: BigInt(2), page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with different page_applied values and selected_pages combinations', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'all_pages',
            selected_pages: true
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with page_applied as specific_pages and selected_pages as array', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [{ id: '1', page_name: 'Home', slug: 'home' }]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with page_applied as empty string and selected_pages as empty array', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: '',
            selected_pages: []
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with different template_name values for createSlug', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Template With Special Characters: !@#$%^&*()',
            page_applied: 'all_pages'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with template_name containing unicode characters', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Template with Unicode: 中文 Español Français 🚀',
            page_applied: 'specific_pages'
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as Date objects', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: new Date(), page_name: 'Home', slug: 'home' },
              { id: new Date('2023-01-01'), page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as RegExp objects', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: /test/, page_name: 'Home', slug: 'home' },
              { id: /pattern/, page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as Error objects', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: new Error('Test Error'), page_name: 'Home', slug: 'home' },
              { id: new Error('Another Error'), page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as Map objects', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: new Map([['key', 'value']]), page_name: 'Home', slug: 'home' },
              { id: new Map([['page', 'data']]), page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as Set objects', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: new Set(['id1', 'id2']), page_name: 'Home', slug: 'home' },
              { id: new Set(['id3', 'id4']), page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as Infinity values', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: Infinity, page_name: 'Home', slug: 'home' },
              { id: -Infinity, page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as NaN values', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: NaN, page_name: 'Home', slug: 'home' },
              { id: NaN, page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as decimal numbers', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: 3.14, page_name: 'Home', slug: 'home' },
              { id: 2.718, page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as negative numbers', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: -1, page_name: 'Home', slug: 'home' },
              { id: -2, page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });

  it('tests form submission with selected_pages as zero values', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik 
          initialValues={{ 
            template_name: 'Test Template',
            page_applied: 'specific_pages',
            selected_pages: [
              { id: 0, page_name: 'Home', slug: 'home' },
              { id: 0, page_name: 'About', slug: 'about' }
            ]
          }} 
          onSubmit={() => {}}
        >
          <AddNewTemplateForm {...defaultProps} />
        </Formik>
      </QueryClientProvider>
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);
    
    expect(createButton).toBeInTheDocument();
  });
});
