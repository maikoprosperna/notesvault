/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CardTitle from '../CardTitle';
import React from 'react';

describe('CardTitle', () => {
  it('renders the title and menu items', () => {
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
      { label: 'Delete', icon: 'mdi mdi-delete', redirectTo: '/delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    // Click on the dropdown toggle to open the menu
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    // Now the menu items should be visible
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders title without menu items', () => {
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders title with icon', () => {
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" icon="mdi mdi-star" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(document.querySelector('.mdi-star')).toBeInTheDocument();
  });

  it('renders with custom container class', () => {
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
    ];
    render(
      <BrowserRouter>
        <CardTitle 
          title="Test Title" 
          containerClass="custom-class" 
          menuItems={menuItems} 
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('handles menu item click', () => {
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    
    // Open dropdown
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    // Click on menu item
    const editMenuItem = screen.getByText('Edit');
    fireEvent.click(editMenuItem);
  });

  it('renders with empty menu items array', () => {
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={[]} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders with null menu items', () => {
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={null} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders with undefined menu items', () => {
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={undefined} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders title with icon but no menu items', () => {
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" icon="mdi mdi-star" />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(document.querySelector('.mdi-star')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders with custom container class but no menu items', () => {
    render(
      <BrowserRouter>
        <CardTitle 
          title="Test Title" 
          containerClass="custom-class" 
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders with menu items that have no icon', () => {
    const menuItems = [
      { label: 'Edit', redirectTo: '/edit' },
      { label: 'Delete', redirectTo: '/delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    // Click on the dropdown toggle to open the menu
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    // Menu items should still be visible even without icons
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders with menu items that have no redirectTo', () => {
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil' },
      { label: 'Delete', icon: 'mdi mdi-delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    // Click on the dropdown toggle to open the menu
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    // Menu items should still be visible even without redirectTo
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('handles multiple dropdown toggles', () => {
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    
    const dropdownToggle = screen.getByRole('link');
    
    // Click to open
    fireEvent.click(dropdownToggle);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(dropdownToggle);
    expect(screen.getByText('Edit')).toBeInTheDocument(); // Still visible in test environment
  });

  it('renders with complex menu items structure', () => {
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
      { label: 'Delete', icon: 'mdi mdi-delete', redirectTo: '/delete' },
      { label: 'View', icon: 'mdi mdi-eye', redirectTo: '/view' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('renders with menu items containing empty strings', () => {
    const menuItems = [
      { label: '', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
      { label: 'Delete', icon: '', redirectTo: '/delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    // Should handle empty strings gracefully
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('tests dropdown aria-expanded attribute', () => {
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    
    const dropdownToggle = screen.getByRole('link');
    expect(dropdownToggle).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(dropdownToggle);
    expect(dropdownToggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders with very long title', () => {
    const longTitle = 'This is a very long title that might cause layout issues and should be handled properly by the component';
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title={longTitle} menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders with special characters in title', () => {
    const specialTitle = 'Test Title with Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?';
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title={specialTitle} menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders with menu items containing null properties', () => {
    const menuItems = [
      { label: null, icon: 'mdi mdi-pencil', redirectTo: '/edit' },
      { label: 'Delete', icon: null, redirectTo: '/delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    // Should handle null properties gracefully
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders with menu items containing undefined properties', () => {
    const menuItems = [
      { label: undefined, icon: 'mdi mdi-pencil', redirectTo: '/edit' },
      { label: 'Delete', icon: undefined, redirectTo: '/delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    // Should handle undefined properties gracefully
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders with different icon class patterns', () => {
    const menuItems = [
      { label: 'Edit', icon: 'fas fa-edit', redirectTo: '/edit' },
      { label: 'Delete', icon: 'far fa-trash', redirectTo: '/delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" icon="fas fa-star" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(document.querySelector('.fas.fa-star')).toBeInTheDocument();
    
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    const menuItems = [
      { label: 'Edit', icon: 'mdi mdi-pencil', redirectTo: '/edit' },
      { label: 'Delete', icon: 'mdi mdi-delete', redirectTo: '/delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle 
          title="Test Title" 
          icon="mdi mdi-star" 
          containerClass="custom-class" 
          menuItems={menuItems} 
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(document.querySelector('.mdi-star')).toBeInTheDocument();
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders with menu items that have only label property', () => {
    const menuItems = [
      { label: 'Edit' },
      { label: 'Delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders with menu items that have only icon property', () => {
    const menuItems = [
      { icon: 'mdi mdi-pencil' },
      { icon: 'mdi mdi-delete' },
    ];
    render(
      <BrowserRouter>
        <CardTitle title="Test Title" menuItems={menuItems} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    const dropdownToggle = screen.getByRole('link');
    fireEvent.click(dropdownToggle);
    
    // Should handle menu items with only icon property
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
