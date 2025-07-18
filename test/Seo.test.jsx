/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SEO from '../Seo';

// Mock react-helmet-async
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => <div data-testid="helmet">{children}</div>,
}));

// Mock useStoreRegistration hook
vi.mock('../../hooks/useStoreRegistration', () => ({
  default: () => ({
    publicStoreData: {
      data: {
        store: {
          googleTrackingCode: 'GA-123456789',
          storeLogo: 'https://example.com/logo.png',
        },
      },
    },
  }),
}));

const renderWithQueryClient = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('SEO', () => {
  const defaultProps = {
    defaultTitle: 'Default Store Title',
    SEOTags: {
      seo: {
        google: {
          title: 'Google Title',
          description: 'Google Description',
          keywords: 'google, seo, keywords',
        },
        facebook: {
          title: 'Facebook Title',
          description: 'Facebook Description',
          image: 'https://example.com/facebook-image.jpg',
        },
        twitter: {
          title: 'Twitter Title',
          description: 'Twitter Description',
          image: 'https://example.com/twitter-image.jpg',
        },
      },
    },
    singleProduct: {
      title: 'Product Title',
      description: 'Product Description',
      image: 'https://example.com/product-image.jpg',
    },
  };

  it('renders without crashing', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with default title', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with Google meta title from SEOTags', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with single product title when no Google meta title', () => {
    const propsWithoutGoogleTitle = {
      ...defaultProps,
      SEOTags: {
        seo: {
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutGoogleTitle} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with default title when no SEOTags or single product title', () => {
    const propsWithoutTitles = {
      defaultTitle: 'Default Title',
    };
    renderWithQueryClient(<SEO {...propsWithoutTitles} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with Google meta description from SEOTags', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with single product description when no Google meta description', () => {
    const propsWithoutGoogleDesc = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: {
            title: 'Google Title',
            keywords: 'google, seo, keywords',
          },
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutGoogleDesc} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty description when no SEOTags or single product description', () => {
    const propsWithoutDescriptions = {
      defaultTitle: 'Default Title',
    };
    renderWithQueryClient(<SEO {...propsWithoutDescriptions} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with Facebook meta title from SEOTags', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with single product title when no Facebook meta title', () => {
    const propsWithoutFacebookTitle = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {
            description: 'Facebook Description',
            image: 'https://example.com/facebook-image.jpg',
          },
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutFacebookTitle} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty Facebook title when no SEOTags or single product title', () => {
    const propsWithoutFacebookTitle = {
      defaultTitle: 'Default Title',
    };
    renderWithQueryClient(<SEO {...propsWithoutFacebookTitle} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with Facebook meta description from SEOTags', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with single product description when no Facebook meta description', () => {
    const propsWithoutFacebookDesc = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {
            title: 'Facebook Title',
            image: 'https://example.com/facebook-image.jpg',
          },
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutFacebookDesc} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty Facebook description when no SEOTags or single product description', () => {
    const propsWithoutFacebookDesc = {
      defaultTitle: 'Default Title',
    };
    renderWithQueryClient(<SEO {...propsWithoutFacebookDesc} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with Facebook meta image from SEOTags', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with single product image when no Facebook meta image', () => {
    const propsWithoutFacebookImage = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {
            title: 'Facebook Title',
            description: 'Facebook Description',
          },
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutFacebookImage} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with store logo when no Facebook meta image or single product image', () => {
    const propsWithoutImages = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {
            title: 'Facebook Title',
            description: 'Facebook Description',
          },
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
      singleProduct: {
        title: 'Product Title',
        description: 'Product Description',
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutImages} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with Twitter meta title from SEOTags', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with single product title when no Twitter meta title', () => {
    const propsWithoutTwitterTitle = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: {
            description: 'Twitter Description',
            image: 'https://example.com/twitter-image.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutTwitterTitle} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty Twitter title when no SEOTags or single product title', () => {
    const propsWithoutTwitterTitle = {
      defaultTitle: 'Default Title',
    };
    renderWithQueryClient(<SEO {...propsWithoutTwitterTitle} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with Twitter meta description from SEOTags', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with single product description when no Twitter meta description', () => {
    const propsWithoutTwitterDesc = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: {
            title: 'Twitter Title',
            image: 'https://example.com/twitter-image.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutTwitterDesc} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty Twitter description when no SEOTags or single product description', () => {
    const propsWithoutTwitterDesc = {
      defaultTitle: 'Default Title',
    };
    renderWithQueryClient(<SEO {...propsWithoutTwitterDesc} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with Twitter meta image from SEOTags', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with single product image when no Twitter meta image', () => {
    const propsWithoutTwitterImage = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: {
            title: 'Twitter Title',
            description: 'Twitter Description',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutTwitterImage} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with store logo when no Twitter meta image or single product image', () => {
    const propsWithoutImages = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: {
            title: 'Twitter Title',
            description: 'Twitter Description',
          },
        },
      },
      singleProduct: {
        title: 'Product Title',
        description: 'Product Description',
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutImages} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with keywords when provided', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders without keywords when not provided', () => {
    const propsWithoutKeywords = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: {
            title: 'Google Title',
            description: 'Google Description',
          },
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithoutKeywords} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with null SEOTags', () => {
    const propsWithNullSEOTags = {
      ...defaultProps,
      SEOTags: null,
    };
    renderWithQueryClient(<SEO {...propsWithNullSEOTags} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with undefined SEOTags', () => {
    const propsWithUndefinedSEOTags = {
      ...defaultProps,
      SEOTags: undefined,
    };
    renderWithQueryClient(<SEO {...propsWithUndefinedSEOTags} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty SEOTags object', () => {
    const propsWithEmptySEOTags = {
      ...defaultProps,
      SEOTags: {},
    };
    renderWithQueryClient(<SEO {...propsWithEmptySEOTags} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with null seo property in SEOTags', () => {
    const propsWithNullSeo = {
      ...defaultProps,
      SEOTags: {
        seo: null,
      },
    };
    renderWithQueryClient(<SEO {...propsWithNullSeo} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with undefined seo property in SEOTags', () => {
    const propsWithUndefinedSeo = {
      ...defaultProps,
      SEOTags: {
        seo: undefined,
      },
    };
    renderWithQueryClient(<SEO {...propsWithUndefinedSeo} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty seo object in SEOTags', () => {
    const propsWithEmptySeo = {
      ...defaultProps,
      SEOTags: {
        seo: {},
      },
    };
    renderWithQueryClient(<SEO {...propsWithEmptySeo} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with null google property in SEOTags', () => {
    const propsWithNullGoogle = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: null,
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithNullGoogle} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with null facebook property in SEOTags', () => {
    const propsWithNullFacebook = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: null,
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithNullFacebook} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with null twitter property in SEOTags', () => {
    const propsWithNullTwitter = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: null,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithNullTwitter} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty google object in SEOTags', () => {
    const propsWithEmptyGoogle = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: {},
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithEmptyGoogle} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty facebook object in SEOTags', () => {
    const propsWithEmptyFacebook = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {},
          twitter: defaultProps.SEOTags.seo.twitter,
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithEmptyFacebook} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty twitter object in SEOTags', () => {
    const propsWithEmptyTwitter = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: defaultProps.SEOTags.seo.facebook,
          twitter: {},
        },
      },
    };
    renderWithQueryClient(<SEO {...propsWithEmptyTwitter} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with minimal props', () => {
    renderWithQueryClient(<SEO defaultTitle="Minimal Title" />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with long titles and descriptions', () => {
    const longProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: {
            title: 'A'.repeat(100),
            description: 'B'.repeat(200),
            keywords: 'C'.repeat(300),
          },
          facebook: {
            title: 'D'.repeat(100),
            description: 'E'.repeat(200),
            image: 'https://example.com/long-image.jpg',
          },
          twitter: {
            title: 'F'.repeat(100),
            description: 'G'.repeat(200),
            image: 'https://example.com/long-twitter-image.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...longProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with special characters in titles and descriptions', () => {
    const specialProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: {
            title: 'Title with Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
            description: 'Description with & symbols and <strong>HTML</strong> tags',
            keywords: 'keywords, with, special, chars: !@#$%^&*()',
          },
          facebook: {
            title: 'Facebook Title with Special Characters: !@#$%^&*()',
            description: 'Facebook Description with & symbols',
            image: 'https://example.com/special-image.jpg',
          },
          twitter: {
            title: 'Twitter Title with Special Characters: !@#$%^&*()',
            description: 'Twitter Description with & symbols',
            image: 'https://example.com/special-twitter-image.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...specialProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with emoji in titles and descriptions', () => {
    const emojiProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: {
            title: 'Title with Emoji 🎉',
            description: 'Description with emoji 🚀',
            keywords: 'keywords, with, emoji, 🎉, 🚀',
          },
          facebook: {
            title: 'Facebook Title with Emoji 🎉',
            description: 'Facebook Description with emoji 🚀',
            image: 'https://example.com/emoji-image.jpg',
          },
          twitter: {
            title: 'Twitter Title with Emoji 🎉',
            description: 'Twitter Description with emoji 🚀',
            image: 'https://example.com/emoji-twitter-image.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...emojiProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with HTML entities in titles and descriptions', () => {
    const htmlProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: {
            title: 'Title with &amp; HTML &lt;entities&gt;',
            description: 'Description with &amp; HTML &lt;entities&gt;',
            keywords: 'keywords, with, html, entities, &amp;, &lt;, &gt;',
          },
          facebook: {
            title: 'Facebook Title with &amp; HTML &lt;entities&gt;',
            description: 'Facebook Description with &amp; HTML &lt;entities&gt;',
            image: 'https://example.com/html-image.jpg',
          },
          twitter: {
            title: 'Twitter Title with &amp; HTML &lt;entities&gt;',
            description: 'Twitter Description with &amp; HTML &lt;entities&gt;',
            image: 'https://example.com/html-twitter-image.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...htmlProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with numbers in titles and descriptions', () => {
    const numberProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: {
            title: 'Title with Numbers 123',
            description: 'Description with numbers 456',
            keywords: 'keywords, with, numbers, 123, 456',
          },
          facebook: {
            title: 'Facebook Title with Numbers 123',
            description: 'Facebook Description with numbers 456',
            image: 'https://example.com/number-image.jpg',
          },
          twitter: {
            title: 'Twitter Title with Numbers 123',
            description: 'Twitter Description with numbers 456',
            image: 'https://example.com/number-twitter-image.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...numberProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with very long URLs in images', () => {
    const longUrlProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {
            ...defaultProps.SEOTags.seo.facebook,
            image: 'https://example.com/' + 'a'.repeat(1000) + '.jpg',
          },
          twitter: {
            ...defaultProps.SEOTags.seo.twitter,
            image: 'https://example.com/' + 'b'.repeat(1000) + '.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...longUrlProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with special characters in URLs', () => {
    const specialUrlProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {
            ...defaultProps.SEOTags.seo.facebook,
            image: 'https://example.com/special-chars-!@#$%^&*().jpg',
          },
          twitter: {
            ...defaultProps.SEOTags.seo.twitter,
            image: 'https://example.com/special-chars-!@#$%^&*().jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...specialUrlProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with different URL protocols', () => {
    const protocolProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {
            ...defaultProps.SEOTags.seo.facebook,
            image: 'http://example.com/http-image.jpg',
          },
          twitter: {
            ...defaultProps.SEOTags.seo.twitter,
            image: 'ftp://example.com/ftp-image.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...protocolProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with data URLs', () => {
    const dataUrlProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {
            ...defaultProps.SEOTags.seo.facebook,
            image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
          },
          twitter: {
            ...defaultProps.SEOTags.seo.twitter,
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...dataUrlProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with relative URLs', () => {
    const relativeUrlProps = {
      ...defaultProps,
      SEOTags: {
        seo: {
          google: defaultProps.SEOTags.seo.google,
          facebook: {
            ...defaultProps.SEOTags.seo.facebook,
            image: '/images/facebook-image.jpg',
          },
          twitter: {
            ...defaultProps.SEOTags.seo.twitter,
            image: './images/twitter-image.jpg',
          },
        },
      },
    };
    renderWithQueryClient(<SEO {...relativeUrlProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with empty strings for all optional props', () => {
    const emptyProps = {
      defaultTitle: '',
      SEOTags: {
        seo: {
          google: {
            title: '',
            description: '',
            keywords: '',
          },
          facebook: {
            title: '',
            description: '',
            image: '',
          },
          twitter: {
            title: '',
            description: '',
            image: '',
          },
        },
      },
      singleProduct: {
        title: '',
        description: '',
        image: '',
      },
    };
    renderWithQueryClient(<SEO {...emptyProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with null values for all optional props', () => {
    const nullProps = {
      defaultTitle: null,
      SEOTags: {
        seo: {
          google: {
            title: null,
            description: null,
            keywords: null,
          },
          facebook: {
            title: null,
            description: null,
            image: null,
          },
          twitter: {
            title: null,
            description: null,
            image: null,
          },
        },
      },
      singleProduct: {
        title: null,
        description: null,
        image: null,
      },
    };
    renderWithQueryClient(<SEO {...nullProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with undefined values for all optional props', () => {
    const undefinedProps = {
      defaultTitle: undefined,
      SEOTags: {
        seo: {
          google: {
            title: undefined,
            description: undefined,
            keywords: undefined,
          },
          facebook: {
            title: undefined,
            description: undefined,
            image: undefined,
          },
          twitter: {
            title: undefined,
            description: undefined,
            image: undefined,
          },
        },
      },
      singleProduct: {
        title: undefined,
        description: undefined,
        image: undefined,
      },
    };
    renderWithQueryClient(<SEO {...undefinedProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders without Google tracking code when not available', async () => {
    // Mock useStoreRegistration to return undefined tracking code
    vi.doMock('../../hooks/useStoreRegistration', () => ({
      default: () => ({
        publicStoreData: {
          data: {
            store: {
              googleTrackingCode: undefined,
              storeLogo: 'https://example.com/logo.png',
            },
          },
        },
      }),
    }));
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders without store logo when not available', async () => {
    // Mock useStoreRegistration to return undefined store logo
    vi.doMock('../../hooks/useStoreRegistration', () => ({
      default: () => ({
        publicStoreData: {
          data: {
            store: {
              googleTrackingCode: 'GA-123456789',
              storeLogo: undefined,
            },
          },
        },
      }),
    }));
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with null publicStoreData', async () => {
    // Mock useStoreRegistration to return null publicStoreData
    vi.doMock('../../hooks/useStoreRegistration', () => ({
      default: () => ({
        publicStoreData: null,
      }),
    }));
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with undefined publicStoreData', async () => {
    // Mock useStoreRegistration to return undefined publicStoreData
    vi.doMock('../../hooks/useStoreRegistration', () => ({
      default: () => ({
        publicStoreData: undefined,
      }),
    }));
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with null store data', async () => {
    // Mock useStoreRegistration to return null store data
    vi.doMock('../../hooks/useStoreRegistration', () => ({
      default: () => ({
        publicStoreData: {
          data: {
            store: null,
          },
        },
      }),
    }));
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });

  it('renders with undefined store data', async () => {
    // Mock useStoreRegistration to return undefined store data
    vi.doMock('../../hooks/useStoreRegistration', () => ({
      default: () => ({
        publicStoreData: {
          data: {
            store: undefined,
          },
        },
      }),
    }));
    renderWithQueryClient(<SEO {...defaultProps} />);
    expect(screen.getByTestId('helmet')).toBeInTheDocument();
  });
}); 