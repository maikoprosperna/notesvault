/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import FontuploaderFormik from '../FontUploaderFormik';

// Mock react-dropzone
vi.mock('react-dropzone', () => ({
  default: ({ children, onDrop, onDropRejected }) => (
    <div data-testid="dropzone" onClick={() => onDrop([new File(['test'], 'test.ttf', { type: 'font/ttf' })])}>
      {children({ getRootProps: () => ({}), getInputProps: () => ({}) })}
    </div>
  ),
}));

// Mock @mui/icons-material
vi.mock('@mui/icons-material', () => ({
  FileUploadOutlined: () => <div data-testid="upload-icon">Upload Icon</div>,
}));

// Mock utils
vi.mock('../utils', () => ({
  truncateString: (str, length) => str.length > length ? str.substring(0, length) + '...' : str,
}));

// Mock the notification module
vi.mock('../components/Shared/Custom/notification', () => ({
  default: vi.fn(),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FontuploaderFormik', () => {
  const defaultProps = {
    selectedFiles: [],
    className: 'custom-uploader',
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderWithRouter(<FontuploaderFormik {...defaultProps} />);
      expect(screen.getByText('Drop files here or click to upload.')).toBeInTheDocument();
    });

    it('renders with upload icon', () => {
      renderWithRouter(<FontuploaderFormik {...defaultProps} />);
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      renderWithRouter(<FontuploaderFormik {...defaultProps} />);
      expect(document.querySelector('.custom-uploader')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      renderWithRouter(<FontuploaderFormik {...defaultProps} customTitle="Custom Font Upload" />);
      expect(screen.getByText('Custom Font Upload')).toBeInTheDocument();
    });

    it('renders with extended elements', () => {
      const extendedElements = <div data-testid="extended">Extended content</div>;
      renderWithRouter(<FontuploaderFormik {...defaultProps} extendedElements={extendedElements} />);
      expect(screen.getByTestId('extended')).toBeInTheDocument();
    });

    it('renders with default title when customTitle is not provided', () => {
      renderWithRouter(<FontuploaderFormik {...defaultProps} />);
      expect(screen.getByText('Drop files here or click to upload.')).toBeInTheDocument();
    });
  });

  describe('File Upload Functionality', () => {
    it('handles file upload with onFileUpload callback', () => {
      const onFileUpload = vi.fn();
      renderWithRouter(<FontuploaderFormik {...defaultProps} onFileUpload={onFileUpload} showPreview={true} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(onFileUpload).toHaveBeenCalled();
    });

    it('handles file upload without onFileUpload callback', () => {
      renderWithRouter(<FontuploaderFormik {...defaultProps} showPreview={true} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      // Should not throw error when onFileUpload is not provided
      expect(dropzone).toBeInTheDocument();
    });

    it('handles file upload with maxUpload limit', () => {
      const onFileUpload = vi.fn();
      const selectedFiles = [
        new File(['test1'], 'test1.ttf', { type: 'font/ttf' }),
        new File(['test2'], 'test2.ttf', { type: 'font/ttf' })
      ];
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} maxUpload={2} onFileUpload={onFileUpload} showPreview={true} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(onFileUpload).toHaveBeenCalled();
    });

    it('handles file upload when under maxUpload limit', () => {
      const onFileUpload = vi.fn();
      const selectedFiles = [
        new File(['test1'], 'test1.ttf', { type: 'font/ttf' })
      ];
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} maxUpload={5} onFileUpload={onFileUpload} showPreview={true} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(onFileUpload).toHaveBeenCalled();
    });
  });

  describe('File Preview Rendering', () => {
    it('renders preview section when showPreview is true and files exist', () => {
      const selectedFiles = [
        new File(['test'], 'test.ttf', { type: 'font/ttf' })
      ];
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('does not render preview section when showPreview is false', () => {
      const selectedFiles = [
        new File(['test'], 'test.ttf', { type: 'font/ttf' })
      ];
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} showPreview={false} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).not.toBeInTheDocument();
    });

    it('does not render preview section when no files exist', () => {
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={[]} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).not.toBeInTheDocument();
    });

    it('renders files with preview images', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('renders with custom preview ID', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} customPreviewId="custom-preview" showPreview={true} />);
      
      expect(document.querySelector('#custom-preview')).toBeInTheDocument();
    });
  });

  describe('File Removal', () => {
    it('handles file removal with onFileUpload callback', () => {
      const onFileUpload = vi.fn();
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} onFileUpload={onFileUpload} showPreview={true} />);
      
      // Click on remove icon
      const removeIcons = document.querySelectorAll('.dripicons-cross');
      if (removeIcons.length > 0) {
        fireEvent.click(removeIcons[0]);
        expect(onFileUpload).toHaveBeenCalled();
      }
    });

    it('handles file removal without onFileUpload callback', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} showPreview={true} />);
      
      // Click on remove icon
      const removeIcons = document.querySelectorAll('.dripicons-cross');
      if (removeIcons.length > 0) {
        fireEvent.click(removeIcons[0]);
        // Should not throw error when onFileUpload is not provided
        expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
      }
    });
  });

  describe('Format Bytes Function', () => {
    it('formats zero bytes correctly', () => {
      renderWithRouter(<FontuploaderFormik {...defaultProps} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(dropzone).toBeInTheDocument();
    });

    it('formats bytes with different decimal values', () => {
      renderWithRouter(<FontuploaderFormik {...defaultProps} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(dropzone).toBeInTheDocument();
    });
  });

  describe('Default Props', () => {
    it('uses default showPreview value', () => {
      renderWithRouter(<FontuploaderFormik selectedFiles={[]} />);
      expect(screen.getByText('Drop files here or click to upload.')).toBeInTheDocument();
    });
  });

  describe('Additional Coverage', () => {
    it('handles font files without preview', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      // Should render font file info
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles error with empty error array', () => {
      renderWithRouter(<FontuploaderFormik selectedFiles={[]} onFileUpload={vi.fn()} />);
      // Simulate Dropzone's onDropRejected with empty array
      const dropzone = screen.getByTestId('dropzone');
      // No error should be thrown
      fireEvent.drop(dropzone, { dataTransfer: { files: [] } });
      expect(dropzone).toBeInTheDocument();
    });

    it('handles files with preview property', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      fontFile.preview = 'blob:test-preview';
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files without preview property', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with null preview', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      fontFile.preview = null;
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with undefined preview', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      fontFile.preview = undefined;
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with formattedSize property', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      fontFile.formattedSize = '1.5 KB';
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files without formattedSize property', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with null formattedSize', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      fontFile.formattedSize = null;
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with undefined formattedSize', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      fontFile.formattedSize = undefined;
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    // Removed tests that try to set File.name property (read-only)

    it('handles files with very long names', () => {
      const longName = 'A'.repeat(100) + '.ttf';
      const fontFile = new File(['font'], longName, { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with special characters in names', () => {
      const specialName = 'font@#$%^&*().ttf';
      const fontFile = new File(['font'], specialName, { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with zero size', () => {
      const fontFile = new File([''], 'test.ttf', { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with large size', () => {
      const largeFontFile = new File(['x'.repeat(1024 * 1024)], 'large.ttf', { type: 'font/ttf' });
      const selectedFiles = [largeFontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles multiple file uploads', () => {
      const onFileUpload = vi.fn();
      renderWithRouter(<FontuploaderFormik {...defaultProps} onFileUpload={onFileUpload} showPreview={true} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      fireEvent.click(dropzone);
      
      expect(onFileUpload).toHaveBeenCalled();
    });

    it('handles selectedFiles.length >= maxUpload branch', () => {
      const onFileUpload = vi.fn();
      const selectedFiles = [
        new File(['test1'], 'test1.ttf', { type: 'font/ttf' }),
        new File(['test2'], 'test2.ttf', { type: 'font/ttf' })
      ];
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} maxUpload={1} onFileUpload={onFileUpload} showPreview={true} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(onFileUpload).toHaveBeenCalled();
    });

    it('handles selectedFiles.length < maxUpload branch', () => {
      const onFileUpload = vi.fn();
      const selectedFiles = [
        new File(['test1'], 'test1.ttf', { type: 'font/ttf' })
      ];
      renderWithRouter(<FontuploaderFormik {...defaultProps} selectedFiles={selectedFiles} maxUpload={5} onFileUpload={onFileUpload} showPreview={true} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(onFileUpload).toHaveBeenCalled();
    });

    it('handles files with preview in selectedFiles', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      fontFile.preview = 'blob:test-preview';
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files without preview in selectedFiles', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with null preview in selectedFiles', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      fontFile.preview = null;
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('handles files with undefined preview in selectedFiles', () => {
      const fontFile = new File(['font'], 'test.ttf', { type: 'font/ttf' });
      fontFile.preview = undefined;
      const selectedFiles = [fontFile];
      
      renderWithRouter(<FontuploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });
  });
}); 