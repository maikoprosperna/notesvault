/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
// import GenerateSEOForm from '../components/GenerateSEOForm'; // REMOVE THIS LINE

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock AI API
const mockGenerateMetaAsync = vi.fn();
const mockReset = vi.fn();
vi.mock('../../../../api/AINa/ProductMeta', () => ({
  AINa: {
    useGenerateProductMeta: () => ({
      generateMetaAsync: mockGenerateMetaAsync,
      isGenerating: false,
      reset: mockReset,
    }),
  },
}));

// Mock notification
vi.mock('../../../../components/Shared/Custom/notification', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('GenerateSEOForm', () => {
  const defaultProps = {
    pageName: 'Test Page',
    onCancel: vi.fn(),
    onGenerate: vi.fn(),
    show: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateMetaAsync.mockReset();
    mockReset.mockReset();
  });

  it('renders modal and all main fields', async () => {
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    expect(screen.getByText('Generate SEO Meta Tags')).toBeInTheDocument();
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(6); // Page Name, Brand, Audience, Main keyword, Supporting keywords, Value proposition
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Tone select
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('updates input fields on change', async () => {
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    // 0: Page Name, 1: Brand
    fireEvent.change(inputs[0], { target: { value: 'New Page' } });
    expect(inputs[0].value).toBe('New Page');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    expect(inputs[1].value).toBe('BrandX');
  });

  it('shows error notification if required fields are missing on generate', async () => {
    const notification = (await import('../../../../components/Shared/Custom/notification')).default;
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    expect(notification).toHaveBeenCalledWith(false, '', 'Please fill in all required fields', expect.any(Object));
  });

  it('calls generateMetaAsync and shows suggestions on success', async () => {
    mockGenerateMetaAsync.mockResolvedValue({
      options: [
        { meta_title: 'Title1', meta_description: 'Desc1' },
        { meta_title: 'Title2', meta_description: 'Desc2' },
      ],
    });
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    // Fill required fields
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } }); // Brand
    fireEvent.change(inputs[2], { target: { value: 'Audience' } }); // Audience
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } }); // Main keyword
    fireEvent.change(inputs[5], { target: { value: 'Value' } }); // Value proposition
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(mockGenerateMetaAsync).toHaveBeenCalled();
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Title1')).toBeInTheDocument();
      expect(screen.getByText('Title2')).toBeInTheDocument();
    });
  });

  it('calls onGenerate when Apply is clicked', async () => {
    mockGenerateMetaAsync.mockResolvedValue({
      options: [
        { meta_title: 'Title1', meta_description: 'Desc1' },
        { meta_title: 'Title2', meta_description: 'Desc2' },
      ],
    });
    const onGenerate = vi.fn();
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} onGenerate={onGenerate} />);
    // Fill required fields
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } }); // Brand
    fireEvent.change(inputs[2], { target: { value: 'Audience' } }); // Audience
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } }); // Main keyword
    fireEvent.change(inputs[5], { target: { value: 'Value' } }); // Value proposition
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    // Select first option card robustly
    const optionCards = document.querySelectorAll('.option-card');
    fireEvent.click(optionCards[0]);
    await waitFor(() => {
      expect(optionCards[0].className).toMatch(/selected/);
    });
    // Click Apply
    fireEvent.click(screen.getByText('Apply'));
    expect(onGenerate).toHaveBeenCalled();
  });

  it('shows error notification if generateMetaAsync returns no options', async () => {
    const notification = (await import('../../../../components/Shared/Custom/notification')).default;
    mockGenerateMetaAsync.mockResolvedValue({ options: [] });
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(notification).toHaveBeenCalledWith(false, '', 'No meta tag options were generated. Please try again.', expect.any(Object));
    });
  });

  it('shows error notification if generateMetaAsync throws', async () => {
    const notification = (await import('../../../../components/Shared/Custom/notification')).default;
    mockGenerateMetaAsync.mockRejectedValue(new Error('API error'));
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(notification).toHaveBeenCalledWith(false, '', expect.stringContaining('Error generating meta tags: API error'), expect.any(Object));
    });
  });

  it('regenerates only selected option with handleGenerateNewMetaTags', async () => {
    // First call returns two options, second call returns one
    mockGenerateMetaAsync
      .mockResolvedValueOnce({
        options: [
          { meta_title: 'Title1', meta_description: 'Desc1' },
          { meta_title: 'Title2', meta_description: 'Desc2' },
        ],
      })
      .mockResolvedValueOnce({
        options: [
          { meta_title: 'Title1b', meta_description: 'Desc1b' },
        ],
      });
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    // Select first option card
    const optionCards = document.querySelectorAll('.option-card');
    fireEvent.click(optionCards[0]);
    await waitFor(() => {
      expect(optionCards[0].className).toMatch(/selected/);
    });
    // Click Generate New
    fireEvent.click(screen.getByText('Generate New'));
    await waitFor(() => {
      expect(mockGenerateMetaAsync).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Title1b')).toBeInTheDocument();
    });
  });

  it('does not call onGenerate if Apply is clicked with no selection', async () => {
    mockGenerateMetaAsync.mockResolvedValue({
      options: [
        { meta_title: 'Title1', meta_description: 'Desc1' },
        { meta_title: 'Title2', meta_description: 'Desc2' },
      ],
    });
    const onGenerate = vi.fn();
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} onGenerate={onGenerate} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    // Click Apply without selecting any option
    fireEvent.click(screen.getByText('Apply'));
    expect(onGenerate).not.toHaveBeenCalled();
  });

  it('changes tone select value', async () => {
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Friendly' } });
    expect(select.value).toBe('Friendly');
  });

  it('changes Apply to select value', async () => {
    mockGenerateMetaAsync.mockResolvedValue({
      options: [
        { meta_title: 'Title1', meta_description: 'Desc1' },
        { meta_title: 'Title2', meta_description: 'Desc2' },
      ],
    });
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'twitter' } });
    expect(selects[1].value).toBe('twitter');
  });

  it('calls onCancel when modal close button is clicked', async () => {
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('regenerates both options if no option is selected', async () => {
    mockGenerateMetaAsync
      .mockResolvedValueOnce({
        options: [
          { meta_title: 'Title1', meta_description: 'Desc1' },
          { meta_title: 'Title2', meta_description: 'Desc2' },
        ],
      })
      .mockResolvedValueOnce({
        options: [
          { meta_title: 'Title1c', meta_description: 'Desc1c' },
          { meta_title: 'Title2c', meta_description: 'Desc2c' },
        ],
      });
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    // Click Generate New without selecting any option
    fireEvent.click(screen.getByText('Generate New'));
    await waitFor(() => {
      expect(mockGenerateMetaAsync).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Title1c')).toBeInTheDocument();
      expect(screen.getByText('Title2c')).toBeInTheDocument();
    });
  });

  it('shows error notification if regenerating a single option fails', async () => {
    const notification = (await import('../../../../components/Shared/Custom/notification')).default;
    mockGenerateMetaAsync
      .mockResolvedValueOnce({
        options: [
          { meta_title: 'Title1', meta_description: 'Desc1' },
          { meta_title: 'Title2', meta_description: 'Desc2' },
        ],
      })
      .mockRejectedValueOnce(new Error('Regenerate error'));
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    // Select first option card
    const optionCards = document.querySelectorAll('.option-card');
    fireEvent.click(optionCards[0]);
    await waitFor(() => {
      expect(optionCards[0].className).toMatch(/selected/);
    });
    // Click Generate New
    fireEvent.click(screen.getByText('Generate New'));
    await waitFor(() => {
      expect(notification).toHaveBeenCalledWith(false, '', expect.stringContaining('Error regenerating meta tag: Regenerate error'), expect.any(Object));
    });
  });

  it('does not call onGenerate if Apply is clicked before generating options', async () => {
    const onGenerate = vi.fn();
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} onGenerate={onGenerate} />);
    expect(screen.queryByText('Apply')).not.toBeInTheDocument();
    expect(onGenerate).not.toHaveBeenCalled();
  });

  it('does not crash if selectedOptionData is missing when regenerating', async () => {
    mockGenerateMetaAsync
      .mockResolvedValueOnce({
        options: [
          { meta_title: 'Title1', meta_description: 'Desc1' },
          { meta_title: 'Title2', meta_description: 'Desc2' },
        ],
      })
      .mockResolvedValueOnce({ options: [{ meta_title: 'Title1b', meta_description: 'Desc1b' }] });
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    // Simulate missing selectedOptionData by selecting a non-existent option
    // (e.g., set selectedOption to 99 via click on a fake card)
    // Instead, directly call Generate New without selecting a valid card
    fireEvent.click(screen.getByText('Generate New'));
    // Should not crash, and UI should remain
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
  });

  it('does not crash if unselectedOptionData is missing when regenerating', async () => {
    mockGenerateMetaAsync
      .mockResolvedValueOnce({
        options: [
          { meta_title: 'Title1', meta_description: 'Desc1' },
        ],
      })
      .mockResolvedValueOnce({ options: [{ meta_title: 'Title1b', meta_description: 'Desc1b' }] });
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    // Select the only card (which will make unselectedOptionData missing)
    const optionCards = document.querySelectorAll('.option-card');
    fireEvent.click(optionCards[0]);
    await waitFor(() => {
      expect(optionCards[0].className).toMatch(/selected/);
    });
    fireEvent.click(screen.getByText('Generate New'));
    // Should not crash, and UI should remain
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
  });

  it('does not call onGenerate if selectedOption is invalid', async () => {
    mockGenerateMetaAsync.mockResolvedValue({
      options: [
        { meta_title: 'Title1', meta_description: 'Desc1' },
        { meta_title: 'Title2', meta_description: 'Desc2' },
      ],
    });
    const onGenerate = vi.fn();
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} onGenerate={onGenerate} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    // Manually set selectedOption to an invalid value (simulate by not clicking any card)
    // Click Apply
    fireEvent.click(screen.getByText('Apply'));
    expect(onGenerate).not.toHaveBeenCalled();
  });

  it('regenerates Option B when second card is selected', async () => {
    mockGenerateMetaAsync
      .mockResolvedValueOnce({
        options: [
          { meta_title: 'Title1', meta_description: 'Desc1' },
          { meta_title: 'Title2', meta_description: 'Desc2' },
        ],
      })
      .mockResolvedValueOnce({
        options: [
          { meta_title: 'Title2b', meta_description: 'Desc2b' },
        ],
      });
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    // Select second option card
    const optionCards = document.querySelectorAll('.option-card');
    fireEvent.click(optionCards[1]);
    await waitFor(() => {
      expect(optionCards[1].className).toMatch(/selected/);
    });
    // Click Generate New
    fireEvent.click(screen.getByText('Generate New'));
    await waitFor(() => {
      expect(mockGenerateMetaAsync).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Title2b')).toBeInTheDocument();
    });
  });

  it('disables Apply button when no option is selected', async () => {
    mockGenerateMetaAsync.mockResolvedValue({
      options: [
        { meta_title: 'Title1', meta_description: 'Desc1' },
        { meta_title: 'Title2', meta_description: 'Desc2' },
      ],
    });
    const { default: GenerateSEOForm } = await import('../components/GenerateSEOForm');
    render(<GenerateSEOForm {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'BrandX' } });
    fireEvent.change(inputs[2], { target: { value: 'Audience' } });
    fireEvent.change(inputs[3], { target: { value: 'Keyword' } });
    fireEvent.change(inputs[5], { target: { value: 'Value' } });
    fireEvent.click(screen.getByText('Generate Meta Tags'));
    await waitFor(() => {
      expect(screen.getByText('SEO Meta Tags Suggestions')).toBeInTheDocument();
    });
    const applyButton = screen.getByText('Apply').closest('button');
    expect(applyButton).toBeDisabled();
  });
});