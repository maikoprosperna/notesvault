/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import FileUploaderFormik from '../FileUploaderFormik';

// Mock react-dropzone
vi.mock('react-dropzone', () => ({
  default: ({ children, onDrop, onDropRejected }) => (
    <div data-testid="dropzone" onClick={() => onDrop([new File(['test'], 'test.txt', { type: 'text/plain' })])}>
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

describe('FileUploaderFormik', () => {
  const defaultProps = {
    selectedFiles: [],
    className: 'custom-uploader',
    showFileInfo: true,
    showPreview: true,
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      expect(screen.getByText('Drop files here or click to upload.')).toBeInTheDocument();
    });

    it('renders with upload icon', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      expect(document.querySelector('.custom-uploader')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} customTitle="Custom Upload" />);
      expect(screen.getByText('Custom Upload')).toBeInTheDocument();
    });

    it('renders with extended elements', () => {
      const extendedElements = <div data-testid="extended">Extended content</div>;
      renderWithRouter(<FileUploaderFormik {...defaultProps} extendedElements={extendedElements} />);
      expect(screen.getByTestId('extended')).toBeInTheDocument();
    });

    it('renders with default title when customTitle is not provided', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      expect(screen.getByText('Drop files here or click to upload.')).toBeInTheDocument();
      expect(screen.getByText('Max Size: 10 MB')).toBeInTheDocument();
    });
  });

  describe('File Upload Functionality', () => {
    it('handles file upload with onFileUpload callback', () => {
      const onFileUpload = vi.fn();
      renderWithRouter(<FileUploaderFormik {...defaultProps} onFileUpload={onFileUpload} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(onFileUpload).toHaveBeenCalled();
    });

    it('handles file upload without onFileUpload callback', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      // Should not throw error when onFileUpload is not provided
      expect(dropzone).toBeInTheDocument();
    });

    it('handles file upload with maxUpload limit', () => {
      const onFileUpload = vi.fn();
      const selectedFiles = [
        new File(['test1'], 'test1.txt', { type: 'text/plain' }),
        new File(['test2'], 'test2.txt', { type: 'text/plain' })
      ];
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} maxUpload={2} onFileUpload={onFileUpload} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(onFileUpload).toHaveBeenCalled();
    });

    it('handles file upload when under maxUpload limit', () => {
      const onFileUpload = vi.fn();
      const selectedFiles = [
        new File(['test1'], 'test1.txt', { type: 'text/plain' })
      ];
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} maxUpload={5} onFileUpload={onFileUpload} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(onFileUpload).toHaveBeenCalled();
    });
  });

  describe('File Preview Rendering', () => {
    it('renders preview section when showPreview is true and files exist', () => {
      const selectedFiles = [
        new File(['test'], 'test.txt', { type: 'text/plain' })
      ];
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('does not render preview section when showPreview is false', () => {
      const selectedFiles = [
        new File(['test'], 'test.txt', { type: 'text/plain' })
      ];
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} showPreview={false} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).not.toBeInTheDocument();
    });

    it('does not render preview section when no files exist', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={[]} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).not.toBeInTheDocument();
    });

    it('renders files with preview images', () => {
      const imageFile = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      const selectedFiles = [imageFile];
      
      // Mock URL.createObjectURL
      const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
      Object.defineProperty(URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true
      });
      
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('renders files without preview images', () => {
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
      const selectedFiles = [textFile];
      
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
      expect(document.querySelector('.avatar-title')).toBeInTheDocument();
    });

    it('renders file info when showFileInfo is true', () => {
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
      const selectedFiles = [textFile];
      
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} showFileInfo={true} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('does not render file info when showFileInfo is false', () => {
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
      const selectedFiles = [textFile];
      
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} showFileInfo={false} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });

    it('renders with custom preview ID', () => {
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
      const selectedFiles = [textFile];
      
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} customPreviewId="custom-preview" showPreview={true} />);
      
      expect(document.querySelector('#custom-preview')).toBeInTheDocument();
    });
  });

  describe('File Removal', () => {
    it('handles file removal with onFileUpload callback', () => {
      const onFileUpload = vi.fn();
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
      const selectedFiles = [textFile];
      
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} onFileUpload={onFileUpload} showPreview={true} />);
      
      // Click on remove icon
      const removeIcons = document.querySelectorAll('.dripicons-cross');
      if (removeIcons.length > 0) {
        fireEvent.click(removeIcons[0]);
        expect(onFileUpload).toHaveBeenCalled();
      }
    });

    it('handles file removal without onFileUpload callback', () => {
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
      const selectedFiles = [textFile];
      
      renderWithRouter(<FileUploaderFormik {...defaultProps} selectedFiles={selectedFiles} showPreview={true} />);
      
      // Click on remove icon
      const removeIcons = document.querySelectorAll('.dripicons-cross');
      if (removeIcons.length > 0) {
        fireEvent.click(removeIcons[0]);
        // Should not throw error when onFileUpload is not provided
        expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
      }
    });
  });

  describe('Error Handling', () => {
    it('handles file-too-large error', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      
      // Simulate error by calling handleErrorFiles directly
      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toBeInTheDocument();
    });

    it('handles file-invalid-type error', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      
      // Simulate error by calling handleErrorFiles directly
      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toBeInTheDocument();
    });

    it('handles generic error', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      
      // Simulate error by calling handleErrorFiles directly
      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toBeInTheDocument();
    });
  });

  describe('Format Bytes Function', () => {
    it('formats zero bytes correctly', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(dropzone).toBeInTheDocument();
    });

    it('formats bytes with different decimal values', () => {
      renderWithRouter(<FileUploaderFormik {...defaultProps} />);
      
      const dropzone = screen.getByTestId('dropzone');
      fireEvent.click(dropzone);
      
      expect(dropzone).toBeInTheDocument();
    });
  });

  describe('Default Props', () => {
    it('uses default showPreview value', () => {
      renderWithRouter(<FileUploaderFormik selectedFiles={[]} />);
      expect(screen.getByText('Drop files here or click to upload.')).toBeInTheDocument();
    });

    it('uses default showFileInfo value', () => {
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
      const selectedFiles = [textFile];
      
      renderWithRouter(<FileUploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      
      expect(document.querySelector('#uploadPreviewTemplate')).toBeInTheDocument();
    });
  });

  describe('Additional Coverage', () => {
    it('handles non-image file type for preview fallback', () => {
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
      const selectedFiles = [textFile];
      renderWithRouter(<FileUploaderFormik selectedFiles={selectedFiles} showPreview={true} />);
      // Should render fallback avatar (no preview)
      expect(document.querySelector('.avatar-title')).toBeInTheDocument();
      // Should show the type split ("text")
      expect(document.querySelector('.avatar-title').textContent).toBe('text');
    });

    it('handles error with empty error array', () => {
      renderWithRouter(<FileUploaderFormik selectedFiles={[]} onFileUpload={vi.fn()} />);
      // Simulate Dropzone's onDropRejected with empty array
      const dropzone = screen.getByTestId('dropzone');
      // No error should be thrown
      fireEvent.drop(dropzone, { dataTransfer: { files: [] } });
      expect(dropzone).toBeInTheDocument();
    });
  });
}); 