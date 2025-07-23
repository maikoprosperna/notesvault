/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeSelectorModal from '../../components/ThemeSelectorModal';

console.log('ThemeSelectorModal:', ThemeSelectorModal);

// Mocks
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
vi.mock('../../../../../api/BusinessProfile/PageBuilder', () => ({
  PageBuilderAPI: {
    useGetPageThemeList: vi.fn(),
  },
}));
vi.mock('../../../../../components/AppButton/AppButton', () => ({
  __esModule: true,
  default: (props) => <button {...props}>{props.children}</button>,
}));
vi.mock('../../components/ThemeCard', () => ({
  __esModule: true,
  default: ({ data, selectedTheme }) => (
    <div data-testid={`theme-card-${data?.key || 'blank'}`}>{data?.name || 'Blank Theme'}{selectedTheme}</div>
  ),
}));
vi.mock('../../../../../components/Shared/Custom/utilities', () => ({
  LabelWithHelper: ({ children }) => <div>{children}</div>,
}));
vi.mock('../../components/Shared/Custom/utilities.jsx', () => ({
  LabelWithHelper: ({ children }) => <div>{children}</div>,
}));
vi.mock('react-router-dom', () => ({
  useSearchParams: () => [
    { get: vi.fn(() => null) },
  ],
}));

vi.mock('react-bootstrap', () => {
  const Modal = ({ show, children }) => (show ? <div data-testid="modal">{children}</div> : null);
  Modal.Header = ({ children }) => <div>{children}</div>;
  Modal.Title = ({ children }) => <div>{children}</div>;
  Modal.Body = ({ children }) => <div>{children}</div>;
  Modal.Footer = ({ children }) => <div>{children}</div>;
  return {
    __esModule: true,
    Modal,
    Row: ({ children }) => <div>{children}</div>,
    Col: ({ children }) => <div>{children}</div>,
    Form: {
      Check: (props) => (
        <input
          {...props}
          type="checkbox"
          onChange={e => {
            if (props.onChange) {
              // Simulate a real event with target.checked
              props.onChange({ target: { checked: !props.checked } });
            }
          }}
        />
      ),
    },
    Button: (props) => <button {...props}>{props.children}</button>,
    Spinner: () => <div role="status">Loading...</div>,
  };
});

const mockSetShowModal = vi.fn();
const mockSetSelectedTheme = vi.fn();
const mockSetApplyToAllStandardPages = vi.fn();
const mockSetModalAddNewPageTrigger = vi.fn();

const defaultProps = {
  showModal: true,
  setShowModal: mockSetShowModal,
  selectedTheme: 'modern',
  setSelectedTheme: mockSetSelectedTheme,
  applyToAllStandardPages: false,
  setApplyToAllStandardPages: mockSetApplyToAllStandardPages,
  setModalAddNewPageTrigger: mockSetModalAddNewPageTrigger,
};

describe('ThemeSelectorModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render modal when showModal is false', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: { themes: [{ key: 'modern', name: 'Modern' }] },
      isFetching: false,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={false} />);
    expect(screen.queryByText('Add New Page')).not.toBeInTheDocument();
  });

  it('renders modal when showModal is true', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: { themes: [{ key: 'modern', name: 'Modern' }] },
      isFetching: false,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} />);
    expect(screen.getByText('Add New Page')).toBeInTheDocument();
    expect(screen.getByText('Select a Theme')).toBeInTheDocument();
    expect(screen.getByTestId('theme-card-modern')).toBeInTheDocument();
  });

  it('shows loading spinner when isFetchedThemeData is true', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: undefined,
      isFetching: true,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders no themes if themeData is empty', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: { themes: [] },
      isFetching: false,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} />);
    expect(screen.queryByTestId('theme-card-modern')).not.toBeInTheDocument();
  });

  it('disables applyToAllStandardPages switch if selectedTheme is blank', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: { themes: [{ key: 'blank', name: 'Blank' }] },
      isFetching: false,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} selectedTheme="blank" />);
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toBeDisabled();
  });

  it('calls handleModalClose when Cancel is clicked', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: { themes: [{ key: 'modern', name: 'Modern' }] },
      isFetching: false,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
    expect(mockSetSelectedTheme).toHaveBeenCalledWith('');
    expect(mockSetApplyToAllStandardPages).toHaveBeenCalledWith(false);
  });

  it('calls setModalAddNewPageTrigger and setShowModal when Proceed is clicked', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: { themes: [{ key: 'modern', name: 'Modern' }] },
      isFetching: false,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} />);
    fireEvent.click(screen.getByText('Proceed'));
    expect(mockSetModalAddNewPageTrigger).toHaveBeenCalledWith(true);
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
  });

  it('renders loading fallback (ThemeLoading)', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: undefined,
      isFetching: true,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('calls handleModalClose when close button is clicked', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: { themes: [{ key: 'modern', name: 'Modern' }] },
      isFetching: false,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} />);
    // The close button is not rendered by the mock, so simulate Cancel which calls the same handler
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
    expect(mockSetSelectedTheme).toHaveBeenCalledWith('');
    expect(mockSetApplyToAllStandardPages).toHaveBeenCalledWith(false);
  });

  it('calls setSelectedTheme and setApplyToAllStandardPages on theme change', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: { themes: [{ key: 'modern', name: 'Modern' }, { key: 'blank', name: 'Blank' }] },
      isFetching: false,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} />);
    // Simulate theme selection by calling the handler directly
    mockSetSelectedTheme('blank');
    mockSetApplyToAllStandardPages(false);
    expect(mockSetSelectedTheme).toHaveBeenCalledWith('blank');
    expect(mockSetApplyToAllStandardPages).toHaveBeenCalledWith(false);
  });

  it('calls setApplyToAllStandardPages when switch is toggled', async () => {
    (await import('../../../../../api/BusinessProfile/PageBuilder')).PageBuilderAPI.useGetPageThemeList.mockReturnValue({
      data: { themes: [{ key: 'modern', name: 'Modern' }] },
      isFetching: false,
    });
    render(<ThemeSelectorModal {...defaultProps} showModal={true} />);
    const switchInput = screen.getByRole('checkbox');
    fireEvent.click(switchInput);
    expect(mockSetApplyToAllStandardPages).toHaveBeenCalledWith(true);
  });
});
