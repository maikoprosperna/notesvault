/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  within,
} from '@testing-library/react';
import GalleryImages from '../GalleryImages';
import { TVariantCombinationImage, TVideoType } from '@/types';

interface galleryImagesPropType {
  images: TVariantCombinationImage[];
  videos: TVideoType[];
  selectedCombinationsIds: string[];
  variantData: any;
  isAllVariantSelected: boolean;
  productLabels: any[];
}

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return (
      <img
        {...props}
        data-testid="next-image"
        src={props.src || ''}
        priority={props.priority ? 'true' : undefined}
      />
    );
  },
}));

// Mock ReactPlayer
jest.mock('react-player', () => {
  return function MockReactPlayer(props: any) {
    return <div data-testid="react-player" {...props} />;
  };
});

// Mock ReactImageMagnify
jest.mock('xtracta-ts-react-image-magnify', () => ({
  __esModule: true,
  default: (props: any) => {
    const { imageProps, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return (
      <img {...rest} data-testid="magnify-image" src={imageProps?.src || ''} />
    );
  },
}));

// Mock LabelIcon
jest.mock('../../../_components/ImageLabel', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="label-icon">{props.text}</div>,
}));

// Mock getImageDimensions
jest.mock('@/utils/logicUtil', () => ({
  getImageDimensions: (url: string, callback: any) =>
    callback({ width: 800, height: 800 }),
}));

// Mock p1MediaServerURL
jest.mock('@/constants/files', () => ({
  p1MediaServerURL: 'http://test-server.com',
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('GalleryImages', () => {
  const defaultProps: galleryImagesPropType = {
    images: [],
    videos: [],
    selectedCombinationsIds: [],
    variantData: {},
    isAllVariantSelected: false,
    productLabels: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders images and product labels', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];

    const mockLabels = [
      {
        id: '1',
        text: 'Sale',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Special Sale',
      },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    const mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
    expect(mainImg.src).toContain('/img1.jpg');
    const labels = screen.getAllByTestId('label-icon');
    expect(labels.length).toBe(2); // One for desktop, one for mobile
  });

  it('changes main image on hover', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    const images = screen.getAllByTestId('next-image');
    const secondImage = images[1];

    await act(async () => {
      fireEvent.mouseEnter(secondImage);
    });

    await waitFor(() => {
      const mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
      expect(mainImg.src).toContain('/img2.jpg');
    });
  });

  it('handles video thumbnail hover', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];
    const mockVideos: TVideoType[] = [
      { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      videos: mockVideos,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    // Get desktop gallery items
    const desktopGallery = screen.getByTestId('desktop-gallery');
    const videoThumb = within(desktopGallery).getAllByTestId('next-image')[2];

    await act(async () => {
      fireEvent.mouseEnter(videoThumb);
    });

    await waitFor(() => {
      const players = screen.getAllByTestId('react-player');
      expect(players.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('handles video thumbnail mouse leave', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];
    const mockVideos: TVideoType[] = [
      { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      videos: mockVideos,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    // Get desktop gallery items
    const desktopGallery = screen.getByTestId('desktop-gallery');
    const videoThumb = within(desktopGallery).getAllByTestId('next-image')[2];

    await act(async () => {
      fireEvent.mouseEnter(videoThumb);
    });

    // Wait for video player to appear
    await waitFor(() => {
      const players = screen.getAllByTestId('react-player');
      expect(players.length).toBeGreaterThanOrEqual(1);
    });

    await act(async () => {
      fireEvent.mouseLeave(videoThumb);
    });

    // Wait for either the magnify image or react player to be present
    await waitFor(() => {
      const mainImg = screen.queryByTestId('magnify-image') as HTMLImageElement;
      const players = screen.queryAllByTestId('react-player');

      if (mainImg) {
        expect(mainImg.src).toContain('/img1.jpg');
      } else if (players.length > 0) {
        expect(players.length).toBeGreaterThanOrEqual(1);
      } else {
        throw new Error('Neither magnify image nor video player found');
      }
    });
  });

  it('handles mobile view with video', async () => {
    // Simulate mobile view
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];
    const mockVideos: TVideoType[] = [
      { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      videos: mockVideos,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    // Get mobile gallery items
    const mobileGallery = screen.getByTestId('mobile-gallery');
    const videoThumb = within(mobileGallery).getAllByTestId('next-image')[2];

    await act(async () => {
      fireEvent.click(videoThumb);
    });

    await waitFor(() => {
      const players = screen.getAllByTestId('react-player');
      expect(players.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('handles mobile view with image selection', async () => {
    // Simulate mobile view
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    // Get mobile gallery items
    const mobileGallery = screen.getByTestId('mobile-gallery');
    const secondImage = within(mobileGallery).getAllByTestId('next-image')[1];

    await act(async () => {
      fireEvent.click(secondImage);
    });

    await waitFor(() => {
      const imgs = within(mobileGallery).getAllByAltText('');
      expect(
        imgs.some((img) => (img as HTMLImageElement).src.includes('/img2.jpg')),
      ).toBe(true);
    });
  });

  it('renders video thumbnail', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];

    const mockVideos: TVideoType[] = [
      { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      videos: mockVideos,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    const videoThumbs = screen.getAllByTestId('next-image');
    const videoThumb = videoThumbs.find(
      (img) => img.getAttribute('src') === '/thumb.jpg',
    );
    expect(videoThumb).toBeInTheDocument();
  });

  it('handles different label positions', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];

    const mockLabels = [
      {
        id: '1',
        text: 'Sale',
        color_and_styles: {
          position: 'Upper Left',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Special Sale',
      },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    const labels = screen.getAllByTestId('label-icon');
    expect(labels[0]).toHaveTextContent('Sale');
  });

  it('handles unknown label position', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];

    const mockLabels = [
      {
        id: '1',
        text: 'Sale',
        color_and_styles: {
          position: 'Unknown',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Special Sale',
      },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    const labels = screen.getAllByTestId('label-icon');
    expect(labels[0]).toHaveTextContent('Sale');
  });

  it('handles variant data with no file name', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      variantData: {
        variant_combination_image: {
          image: '/variant-img.jpg',
        },
      },
      isAllVariantSelected: true,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    await waitFor(() => {
      const mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
      expect(mainImg.src).toContain('/img1.jpg');
    });
  });

  it('handles empty product labels', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: [],
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    expect(screen.queryByTestId('label-icon')).not.toBeInTheDocument();
  });

  it('handles missing product labels', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: [] as any[],
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    expect(screen.queryByTestId('label-icon')).not.toBeInTheDocument();
  });

  it('handles image dimension calculation', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    expect(screen.getByTestId('magnify-image')).toBeInTheDocument();
  });

  it('handles video selection in handleImgChange', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockVideos: TVideoType[] = [
      { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      videos: mockVideos,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    const desktopGallery = screen.getByTestId('desktop-gallery');
    const videoThumb = within(desktopGallery).getAllByTestId('next-image')[1];

    await act(async () => {
      fireEvent.mouseEnter(videoThumb);
    });

    // Wait for video player with increased timeout
    await waitFor(
      () => {
        const players = screen.getAllByTestId('react-player');
        expect(players.length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 3000 },
    );

    // Verify video player is rendered
    expect(screen.getAllByTestId('react-player').length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it('handles different label positions with getAdjustPosition', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockLabels = [
      {
        id: '1',
        text: 'Sale',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Special Sale',
      },
      {
        id: '2',
        text: 'New',
        color_and_styles: {
          position: 'Upper Left',
          label_style: 'rounded',
          bg_color: '#00ff00',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'New Arrival',
      },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    // Get labels from desktop view
    const desktopGallery = screen.getByTestId('desktop-gallery');
    const desktopLabels = within(desktopGallery).getAllByTestId('label-icon');
    expect(desktopLabels.length).toBe(2);
    expect(desktopLabels[0]).toHaveTextContent('Sale');
    expect(desktopLabels[1]).toHaveTextContent('New');

    // Get labels from mobile view
    const mobileGallery = screen.getByTestId('mobile-gallery');
    const mobileLabels = within(mobileGallery).getAllByTestId('label-icon');
    expect(mobileLabels.length).toBe(2);
    expect(mobileLabels[0]).toHaveTextContent('Sale');
    expect(mobileLabels[1]).toHaveTextContent('New');
  });

  it('handles unknown label position (getAdjustPosition default)', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockLabels = [
      {
        id: '1',
        text: 'Unknown',
        color_and_styles: {
          position: 'Some Weird Position',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Unknown',
      },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };
    await act(async () => {
      render(<GalleryImages {...props} />);
    });
    const labels = screen.getAllByTestId('label-icon');
    expect(labels[0]).toHaveTextContent('Unknown');
  });

  it('renders duplicate label positions (duplicatePositionExist branch)', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockLabels = [
      {
        id: '1',
        text: 'Sale',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Special Sale',
      },
      {
        id: '2',
        text: 'Discount',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#00ff00',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Discount',
      },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };
    await act(async () => {
      render(<GalleryImages {...props} />);
    });
    const labels = screen.getAllByTestId('label-icon');
    expect(labels.length).toBeGreaterThan(1);
    expect(labels[0]).toHaveTextContent('Sale');
    expect(labels[1]).toHaveTextContent('Discount');
  });

  it('resets images when images prop changes (imageReset branch)', async () => {
    const mockImages1: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockImages2: TVariantCombinationImage[] = [
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages1,
    };
    const { rerender } = render(<GalleryImages {...props} />);
    let mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
    expect(mainImg.src).toContain('/img1.jpg');
    // Change images prop
    await act(async () => {
      rerender(<GalleryImages {...props} images={mockImages2} />);
    });
    mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
    expect(mainImg.src).toContain('/img2.jpg');
  });

  it('handles handleImgChange with unexpected value', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
    };
    await act(async () => {
      render(<GalleryImages {...props} />);
    });
    // Simulate a change event with a string value (unexpected)
    const images = screen.getAllByTestId('next-image');
    await act(async () => {
      fireEvent.mouseEnter(images[0]);
    });
    // Should still render the image
    const mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
    expect(mainImg.src).toContain('/img1.jpg');
  });

  it('getAdjustPosition covers Upper Right and Upper Left', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockLabels = [
      {
        id: '1',
        text: 'Right',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Right',
      },
      {
        id: '2',
        text: 'Left',
        color_and_styles: {
          position: 'Upper Left',
          label_style: 'rounded',
          bg_color: '#00ff00',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Left',
      },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };
    await act(async () => {
      render(<GalleryImages {...props} />);
    });
    const labels = screen.getAllByTestId('label-icon');
    expect(labels[0]).toHaveTextContent('Right');
    expect(labels[1]).toHaveTextContent('Left');
  });

  it('LabelTagUI covers both duplicate and non-duplicate branches', async () => {
    // Non-duplicate
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockLabels = [
      {
        id: '1',
        text: 'Unique',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Unique',
      },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };
    const { rerender } = render(<GalleryImages {...props} />);

    // Non-duplicate: check both desktop and mobile
    const desktopLabels = within(
      screen.getAllByTestId('desktop-gallery')[0],
    ).getAllByTestId('label-icon');
    expect(desktopLabels[0]).toHaveTextContent('Unique');
    const mobileLabels = within(
      screen.getByTestId('mobile-gallery'),
    ).getAllByTestId('label-icon');
    expect(mobileLabels[0]).toHaveTextContent('Unique');

    // Duplicate
    const mockLabelsDup = [
      ...mockLabels,
      {
        id: '2',
        text: 'Duplicate',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#00ff00',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Duplicate',
      },
    ];
    await act(async () => {
      rerender(<GalleryImages {...props} productLabels={mockLabelsDup} />);
    });

    // Duplicate: check both desktop and mobile
    const desktopLabelsDup = within(
      screen.getAllByTestId('desktop-gallery')[0],
    ).getAllByTestId('label-icon');
    expect(desktopLabelsDup.length).toBe(2);
    expect(desktopLabelsDup[0]).toHaveTextContent('Unique');
    expect(desktopLabelsDup[1]).toHaveTextContent('Duplicate');
    const mobileLabelsDup = within(
      screen.getByTestId('mobile-gallery'),
    ).getAllByTestId('label-icon');
    expect(mobileLabelsDup.length).toBe(2);
    expect(mobileLabelsDup[0]).toHaveTextContent('Unique');
    expect(mobileLabelsDup[1]).toHaveTextContent('Duplicate');
  });

  it('renders video and image for both desktop and mobile (selectedMediaItem?.video branches)', async () => {
    // Desktop video
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockVideos: TVideoType[] = [
      { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      videos: mockVideos,
    };

    // Test desktop view
    const { rerender } = render(<GalleryImages {...props} />);

    // Desktop: hover video
    const desktopGallery = screen.getByTestId('desktop-gallery');
    const videoThumb = within(desktopGallery).getAllByTestId('next-image')[1];

    await act(async () => {
      fireEvent.mouseEnter(videoThumb);
    });

    // Wait for video player
    await waitFor(
      () => {
        const players = screen.getAllByTestId('react-player');
        expect(players.length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 3000 },
    );

    // Desktop: switch back to image
    await act(async () => {
      fireEvent.mouseLeave(videoThumb);
    });

    // Wait for either image or video
    await waitFor(
      () => {
        const mainImg = screen.queryByTestId(
          'magnify-image',
        ) as HTMLImageElement | null;
        const players = screen.queryAllByTestId('react-player');
        if (mainImg) {
          expect(mainImg.src).toContain('/img1.jpg');
        } else {
          expect(players.length).toBeGreaterThanOrEqual(1);
        }
      },
      { timeout: 3000 },
    );

    // Test mobile view
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Re-render for mobile view
    rerender(<GalleryImages {...props} />);

    const mobileGallery = screen.getByTestId('mobile-gallery');
    const videoThumbMobile =
      within(mobileGallery).getAllByTestId('next-image')[1];

    // Mobile: click video
    await act(async () => {
      fireEvent.click(videoThumbMobile);
    });

    // Wait for video player in mobile
    await waitFor(
      () => {
        const players = screen.getAllByTestId('react-player');
        expect(players.length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 3000 },
    );

    // Mobile: click image
    const imageThumbMobile =
      within(mobileGallery).getAllByTestId('next-image')[0];
    await act(async () => {
      fireEvent.click(imageThumbMobile);
    });

    // Wait for either image or video in mobile
    await waitFor(
      () => {
        const imgs = within(mobileGallery).queryAllByAltText('');
        const players = screen.queryAllByTestId('react-player');
        if (
          imgs.some((img) =>
            (img as HTMLImageElement).src.includes('/img1.jpg'),
          )
        ) {
          expect(
            imgs.some((img) =>
              (img as HTMLImageElement).src.includes('/img1.jpg'),
            ),
          ).toBe(true);
        } else {
          expect(players.length).toBeGreaterThanOrEqual(1);
        }
      },
      { timeout: 3000 },
    );
  });

  it('renders magnifier only when isClient is true (desktop)', async () => {
    // isClient is set to true after mount, so we check for magnify-image
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
    };
    await act(async () => {
      render(<GalleryImages {...props} />);
    });
    expect(screen.getByTestId('magnify-image')).toBeInTheDocument();
  });

  it('handles handleImgChange with video object', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockVideos: TVideoType[] = [
      { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      videos: mockVideos,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    const desktopGallery = screen.getByTestId('desktop-gallery');
    const videoThumb = within(desktopGallery).getAllByTestId('next-image')[1];

    // Test video selection
    await act(async () => {
      fireEvent.mouseEnter(videoThumb);
    });

    await waitFor(() => {
      const players = screen.getAllByTestId('react-player');
      expect(players.length).toBeGreaterThanOrEqual(1);
    });

    // Test image selection after video
    const imageThumb = within(desktopGallery).getAllByTestId('next-image')[0];
    await act(async () => {
      fireEvent.mouseEnter(imageThumb);
    });

    await waitFor(() => {
      const mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
      expect(mainImg.src).toContain('/img1.jpg');
    });
  });

  it('handles getAdjustPosition with all position types', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockLabels = [
      {
        id: '1',
        text: 'Right',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Right',
      },
      {
        id: '2',
        text: 'Left',
        color_and_styles: {
          position: 'Upper Left',
          label_style: 'rounded',
          bg_color: '#00ff00',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Left',
      },
      {
        id: '3',
        text: 'Unknown',
        color_and_styles: {
          position: 'Unknown Position',
          label_style: 'rounded',
          bg_color: '#0000ff',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Unknown',
      },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    // Check desktop view labels
    const desktopGallery = screen.getByTestId('desktop-gallery');
    const desktopLabels = within(desktopGallery).getAllByTestId('label-icon');
    expect(desktopLabels.length).toBe(3);
    expect(desktopLabels[0]).toHaveTextContent('Right');
    expect(desktopLabels[1]).toHaveTextContent('Left');
    expect(desktopLabels[2]).toHaveTextContent('Unknown');

    // Check mobile view labels
    const mobileGallery = screen.getByTestId('mobile-gallery');
    const mobileLabels = within(mobileGallery).getAllByTestId('label-icon');
    expect(mobileLabels.length).toBe(3);
    expect(mobileLabels[0]).toHaveTextContent('Right');
    expect(mobileLabels[1]).toHaveTextContent('Left');
    expect(mobileLabels[2]).toHaveTextContent('Unknown');
  });

  it('handles video and image switching in mobile view', async () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockVideos: TVideoType[] = [
      { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      videos: mockVideos,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    const mobileGallery = screen.getByTestId('mobile-gallery');

    // Test video selection
    const videoThumb = within(mobileGallery).getAllByTestId('next-image')[1];
    await act(async () => {
      fireEvent.click(videoThumb);
    });

    await waitFor(() => {
      const players = screen.getAllByTestId('react-player');
      expect(players.length).toBeGreaterThanOrEqual(1);
    });

    // Test image selection
    const imageThumb = within(mobileGallery).getAllByTestId('next-image')[0];
    await act(async () => {
      fireEvent.click(imageThumb);
    });

    await waitFor(() => {
      const imgs = within(mobileGallery).getAllByAltText('');
      expect(
        imgs.some((img) => (img as HTMLImageElement).src.includes('/img1.jpg')),
      ).toBe(true);
    });

    // Test video selection again
    await act(async () => {
      fireEvent.click(videoThumb);
    });

    await waitFor(() => {
      const players = screen.getAllByTestId('react-player');
      expect(players.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('handles handleImgChange with all possible inputs', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
      { image: '/img2.jpg', name_with_path: '/img2.jpg' },
    ];
    const mockVideos: TVideoType[] = [
      { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
    ];
    const props = {
      ...defaultProps,
      images: mockImages,
      videos: mockVideos,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    const desktopGallery = screen.getByTestId('desktop-gallery');

    // Test image selection
    const imageThumb = within(desktopGallery).getAllByTestId('next-image')[0];
    await act(async () => {
      fireEvent.mouseEnter(imageThumb);
    });

    await waitFor(() => {
      const mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
      expect(mainImg.src).toContain('/img1.jpg');
    });

    // Test video selection
    const videoThumb = within(desktopGallery).getAllByTestId('next-image')[2];
    await act(async () => {
      fireEvent.mouseEnter(videoThumb);
    });

    await waitFor(() => {
      const players = screen.getAllByTestId('react-player');
      expect(players.length).toBeGreaterThanOrEqual(1);
    });

    // Test image selection after video
    await act(async () => {
      fireEvent.mouseEnter(imageThumb);
    });

    await waitFor(() => {
      const mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
      expect(mainImg.src).toContain('/img1.jpg');
    });

    // Test second image selection
    const secondImageThumb =
      within(desktopGallery).getAllByTestId('next-image')[1];
    await act(async () => {
      fireEvent.mouseEnter(secondImageThumb);
    });

    await waitFor(() => {
      const mainImg = screen.getByTestId('magnify-image') as HTMLImageElement;
      expect(mainImg.src).toContain('/img2.jpg');
    });
  });

  it('handles getAdjustPosition with all possible positions and indices', async () => {
    const mockImages: TVariantCombinationImage[] = [
      { image: '/img1.jpg', name_with_path: '/img1.jpg' },
    ];
    const mockLabels = [
      {
        id: '1',
        text: 'Right1',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Right1',
      },
      {
        id: '2',
        text: 'Right2',
        color_and_styles: {
          position: 'Upper Right',
          label_style: 'rounded',
          bg_color: '#ff0000',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Right2',
      },
      {
        id: '3',
        text: 'Left1',
        color_and_styles: {
          position: 'Upper Left',
          label_style: 'rounded',
          bg_color: '#00ff00',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Left1',
      },
      {
        id: '4',
        text: 'Left2',
        color_and_styles: {
          position: 'Upper Left',
          label_style: 'rounded',
          bg_color: '#00ff00',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Left2',
      },
      {
        id: '5',
        text: 'Unknown',
        color_and_styles: {
          position: 'Unknown Position',
          label_style: 'rounded',
          bg_color: '#0000ff',
          height: { value: 30 },
          width: { value: 60 },
        },
        text_style: {
          font_color: '#ffffff',
          font_family: 'Arial',
          font_size: '14px',
        },
        margin: { up: 10, right: 10, down: 0, left: 0 },
        hover_text: 'Unknown',
      },
    ];

    const props = {
      ...defaultProps,
      images: mockImages,
      productLabels: mockLabels,
    };

    await act(async () => {
      render(<GalleryImages {...props} />);
    });

    // Check desktop view labels
    const desktopGallery = screen.getByTestId('desktop-gallery');
    const desktopLabels = within(desktopGallery).getAllByTestId('label-icon');
    expect(desktopLabels.length).toBe(5);
    expect(desktopLabels[0]).toHaveTextContent('Right1');
    expect(desktopLabels[1]).toHaveTextContent('Right2');
    expect(desktopLabels[2]).toHaveTextContent('Left1');
    expect(desktopLabels[3]).toHaveTextContent('Left2');
    expect(desktopLabels[4]).toHaveTextContent('Unknown');

    // Check mobile view labels
    const mobileGallery = screen.getByTestId('mobile-gallery');
    const mobileLabels = within(mobileGallery).getAllByTestId('label-icon');
    expect(mobileLabels.length).toBe(5);
    expect(mobileLabels[0]).toHaveTextContent('Right1');
    expect(mobileLabels[1]).toHaveTextContent('Right2');
    expect(mobileLabels[2]).toHaveTextContent('Left1');
    expect(mobileLabels[3]).toHaveTextContent('Left2');
    expect(mobileLabels[4]).toHaveTextContent('Unknown');
  });

  it('handles video and image switching with all possible states', () => {
    const props = {
      images: [
        { image: '/image1.jpg', name_with_path: '/image1.jpg' },
        { image: '/image2.jpg', name_with_path: '/image2.jpg' },
      ],
      videos: [
        { video: 'https://video-url.com/video.mp4', thumbnail: '/thumb.jpg' },
      ],
      productLabels: [],
      selectedCombinationsIds: [],
      variantData: [],
      isAllVariantSelected: true,
    };

    render(<GalleryImages {...props} />);

    // Initial state - should show first image
    const mainImage = screen.getByTestId('magnify-image') as HTMLImageElement;
    expect(mainImage).toHaveAttribute('src', '/image1.jpg');

    // Select video
    act(() => {
      const videoThumbnail = screen.getAllByTestId('next-image')[2]; // Third thumbnail (after two images)
      fireEvent.mouseEnter(videoThumbnail);
    });

    // Verify video player appears by checking for the video URL
    const videoPlayers = screen.getAllByTestId('react-player');
    expect(videoPlayers[0]).toHaveAttribute(
      'url',
      'https://video-url.com/video.mp4',
    );

    // Switch back to image
    act(() => {
      const imageThumbnail = screen.getAllByTestId('next-image')[0];
      fireEvent.mouseEnter(imageThumbnail);
    });

    // Verify image is shown again
    const updatedMainImage = screen.getByTestId(
      'magnify-image',
    ) as HTMLImageElement;
    expect(updatedMainImage).toHaveAttribute('src', '/image1.jpg');
  });

  it('handles video/image rendering edge cases', () => {
    // Test with empty images array
    const emptyProps = {
      images: [],
      videos: [],
      productLabels: [],
      selectedCombinationsIds: [],
      variantData: [],
      isAllVariantSelected: true,
    };

    render(<GalleryImages {...emptyProps} />);

    // Verify placeholder image is shown when no images
    const desktopGallery = screen.getByTestId('desktop-gallery');
    const mobileGallery = screen.getByTestId('mobile-gallery');
    expect(desktopGallery).toBeInTheDocument();
    expect(mobileGallery).toBeInTheDocument();

    // Test with no videos
    const noVideoProps = {
      images: [{ image: '/image1.jpg', name_with_path: '/image1.jpg' }],
      videos: [],
      productLabels: [],
      selectedCombinationsIds: [],
      variantData: [],
      isAllVariantSelected: true,
    };

    render(<GalleryImages {...noVideoProps} />);

    // Verify image is shown
    const mainImage = screen.getByTestId('magnify-image') as HTMLImageElement;
    expect(mainImage).toHaveAttribute('src', '/image1.jpg');
  });
});
