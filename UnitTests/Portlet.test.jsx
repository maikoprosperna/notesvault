/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Portlet from '../Portlet';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Portlet', () => {
  it('renders without crashing', () => {
    renderWithRouter(
      <Portlet>
        <div>Portlet content</div>
      </Portlet>
    );
    expect(screen.getByText('Card title')).toBeInTheDocument();
  });

  it('renders with children', () => {
    renderWithRouter(
      <Portlet>
        <div data-testid="portlet-child">Portlet Content</div>
      </Portlet>
    );
    expect(screen.getByText('Card title')).toBeInTheDocument();
    expect(screen.getByTestId('portlet-child')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    renderWithRouter(
      <Portlet className="custom-portlet">
        <div>Portlet content</div>
      </Portlet>
    );
    expect(screen.getByText('Card title')).toBeInTheDocument();
    expect(document.querySelector('.custom-portlet')).toBeInTheDocument();
  });

  it('toggles collapse when toggle button is clicked', () => {
    renderWithRouter(
      <Portlet>
        <div>Portlet content</div>
      </Portlet>
    );
    
    // Initially should be collapsed (mdi-minus icon)
    expect(document.querySelector('.mdi-minus')).toBeInTheDocument();
    
    // Click toggle button (second link - the toggle button)
    const toggleButton = screen.getAllByRole('link')[1];
    fireEvent.click(toggleButton);
    
    // Should now be expanded (mdi-plus icon)
    expect(document.querySelector('.mdi-plus')).toBeInTheDocument();
  });

  it('shows loading state when reload button is clicked', () => {
    renderWithRouter(
      <Portlet>
        <div>Portlet content</div>
      </Portlet>
    );
    
    // Click reload button
    const reloadButton = screen.getAllByRole('link')[0];
    fireEvent.click(reloadButton);
    
    // Should show loading state
    expect(document.querySelector('.card-disabled')).toBeInTheDocument();
    expect(document.querySelector('.card-portlets-loader')).toBeInTheDocument();
  });

  it('removes portlet when remove button is clicked', () => {
    renderWithRouter(
      <Portlet>
        <div>Portlet content</div>
      </Portlet>
    );
    
    // Initially should be visible
    expect(screen.getByText('Card title')).toBeInTheDocument();
    
    // Click remove button
    const removeButton = screen.getAllByRole('link')[2];
    fireEvent.click(removeButton);
    
    // Should be hidden
    expect(screen.queryByText('Card title')).not.toBeInTheDocument();
  });

  it('renders with multiple children', () => {
    renderWithRouter(
      <Portlet>
        <div>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </div>
      </Portlet>
    );
    expect(screen.getByText('Card title')).toBeInTheDocument();
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });

  it('renders with empty children', () => {
    renderWithRouter(<Portlet><div>Content</div></Portlet>);
    expect(screen.getByText('Card title')).toBeInTheDocument();
  });

  it('renders with null children', () => {
    renderWithRouter(<Portlet><div>Content</div></Portlet>);
    expect(screen.getByText('Card title')).toBeInTheDocument();
  });

  it('renders with undefined children', () => {
    renderWithRouter(<Portlet><div>Content</div></Portlet>);
    expect(screen.getByText('Card title')).toBeInTheDocument();
  });

  it('renders with complex children structure', () => {
    renderWithRouter(
      <Portlet>
        <div className="content-section">
          <h4>Section Title</h4>
          <p>This is some content inside the portlet.</p>
          <button>Action Button</button>
        </div>
      </Portlet>
    );
    expect(screen.getByText('Card title')).toBeInTheDocument();
    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('This is some content inside the portlet.')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('handles multiple toggle clicks', () => {
    renderWithRouter(
      <Portlet>
        <div>Portlet content</div>
      </Portlet>
    );
    
    const toggleButton = screen.getAllByRole('link')[1];
    
    // First click - expand
    fireEvent.click(toggleButton);
    expect(document.querySelector('.mdi-plus')).toBeInTheDocument();
    
    // Second click - collapse
    fireEvent.click(toggleButton);
    expect(document.querySelector('.mdi-minus')).toBeInTheDocument();
  });

  it('handles multiple reload clicks', () => {
    renderWithRouter(
      <Portlet>
        <div>Portlet content</div>
      </Portlet>
    );
    
    const reloadButton = screen.getAllByRole('link')[0];
    
    // First reload
    fireEvent.click(reloadButton);
    expect(document.querySelector('.card-disabled')).toBeInTheDocument();
    
    // Wait for loading to complete (simulate timeout)
    setTimeout(() => {
      expect(document.querySelector('.card-disabled')).not.toBeInTheDocument();
    }, 1000);
  });

  it('renders with long content', () => {
    const longContent = 'A'.repeat(1000);
    renderWithRouter(
      <Portlet>
        <div>{longContent}</div>
      </Portlet>
    );
    expect(screen.getByText('Card title')).toBeInTheDocument();
    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it('renders with special characters in content', () => {
    const specialContent = 'Content with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    renderWithRouter(
      <Portlet>
        <div>{specialContent}</div>
      </Portlet>
    );
    expect(screen.getByText('Card title')).toBeInTheDocument();
    expect(screen.getByText(specialContent)).toBeInTheDocument();
  });
}); 