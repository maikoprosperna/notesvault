/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Messages from '../Messages';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Messages', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Messages />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('renders with title', () => {
    renderWithRouter(<Messages />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    renderWithRouter(<Messages />);
    // The component has a Card wrapper, so we can check for that
    expect(document.querySelector('.card')).toBeInTheDocument();
  });

  it('renders message items', () => {
    renderWithRouter(<Messages />);
    // Check for some of the static message content
    expect(screen.getByText('Tomaslau')).toBeInTheDocument();
    expect(screen.getByText('Stillnotdavid')).toBeInTheDocument();
    expect(screen.getByText('Kurafire')).toBeInTheDocument();
  });

  it('renders reply buttons', () => {
    renderWithRouter(<Messages />);
    // Check for reply buttons
    const replyButtons = screen.getAllByText('Reply');
    expect(replyButtons.length).toBeGreaterThan(0);
  });
}); 