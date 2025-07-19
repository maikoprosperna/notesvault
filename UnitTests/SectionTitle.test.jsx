/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SectionTitle from '../SectionTitle';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SectionTitle', () => {
  it('renders without crashing', () => {
    renderWithRouter(<SectionTitle title="Test Section" />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    renderWithRouter(<SectionTitle title="Test Section" classAttr="custom-section" />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(document.querySelector('.custom-section')).toBeInTheDocument();
  });

  it('renders with long title', () => {
    const longTitle = 'This is a very long section title that might cause layout issues and should be handled properly';
    renderWithRouter(<SectionTitle title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('renders with special characters in title', () => {
    const specialTitle = 'Section Title with Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?';
    renderWithRouter(<SectionTitle title={specialTitle} />);
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  it('renders with empty title', () => {
    renderWithRouter(<SectionTitle title="" />);
    // Use a more specific selector to avoid multiple matches
    expect(document.querySelector('h4.mb-0')).toBeInTheDocument();
  });

  it('renders with null title', () => {
    renderWithRouter(<SectionTitle title={null} />);
    // Use a more specific selector to avoid multiple matches
    expect(document.querySelector('h4.mb-0')).toBeInTheDocument();
  });

  it('renders with undefined title', () => {
    renderWithRouter(<SectionTitle title={undefined} />);
    // Use a more specific selector to avoid multiple matches
    expect(document.querySelector('h4.mb-0')).toBeInTheDocument();
  });

  it('renders with HTML entities in title', () => {
    const titleWithEntities = 'Section & Title with <strong>HTML</strong> entities';
    renderWithRouter(<SectionTitle title={titleWithEntities} />);
    expect(screen.getByText(titleWithEntities)).toBeInTheDocument();
  });

  it('renders with numbers in title', () => {
    renderWithRouter(<SectionTitle title="Section 123" />);
    expect(screen.getByText('Section 123')).toBeInTheDocument();
  });

  it('renders with emoji in title', () => {
    renderWithRouter(<SectionTitle title="Section 🎉" />);
    expect(screen.getByText('Section 🎉')).toBeInTheDocument();
  });

  it('renders with multiple custom classes', () => {
    renderWithRouter(<SectionTitle title="Test Section" classAttr="custom-section primary-section" />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(document.querySelector('.custom-section.primary-section')).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    renderWithRouter(
      <SectionTitle 
        title="Test Section" 
        classAttr="custom-section" 
      />
    );
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(document.querySelector('.custom-section')).toBeInTheDocument();
  });

  it('renders with link prop', () => {
    renderWithRouter(<SectionTitle title="Test Section" link="/test" />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('renders with goBack function', () => {
    const goBack = vi.fn();
    renderWithRouter(<SectionTitle title="Test Section" goBack={goBack} />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders with popContent', () => {
    renderWithRouter(<SectionTitle title="Test Section" popContent="Help content" />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(document.querySelector('.text-black.ms-2')).toBeInTheDocument();
  });

  it('renders with badge', () => {
    renderWithRouter(<SectionTitle title="Test Section" badge={<span>Badge</span>} />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Badge')).toBeInTheDocument();
  });

  it('renders with additionalContent', () => {
    renderWithRouter(<SectionTitle title="Test Section" additionaContent={<span>Additional</span>} />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Additional')).toBeInTheDocument();
  });
}); 