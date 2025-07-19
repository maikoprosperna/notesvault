/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MessageItem from '../MessageItem';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('MessageItem', () => {
  it('renders without crashing', () => {
    const message = {
      id: 1,
      text: 'Test message',
      userName: 'John Doe',
      postedOn: '10:00 AM'
    };
    renderWithRouter(
      <MessageItem message={message}>
        <div className="inbox-item-img">
          <img src="https://example.com/avatar.jpg" className="rounded-circle" alt="user" />
        </div>
        <p className="inbox-item-author">{message.userName}</p>
        <p className="inbox-item-text">{message.text}</p>
        <p className="inbox-item-date">{message.postedOn}</p>
      </MessageItem>
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders with user information', () => {
    const message = {
      id: 1,
      text: 'Hello world',
      userName: 'Jane Smith',
      postedOn: '09:30 AM',
      userPic: 'https://example.com/avatar.jpg'
    };
    renderWithRouter(
      <MessageItem message={message}>
        <div className="inbox-item-img">
          <img src={message.userPic} className="rounded-circle" alt="user" />
        </div>
        <p className="inbox-item-author">{message.userName}</p>
        <p className="inbox-item-text">{message.text}</p>
        <p className="inbox-item-date">{message.postedOn}</p>
      </MessageItem>
    );
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('09:30 AM')).toBeInTheDocument();
  });

  it('renders with user picture', () => {
    const message = {
      id: 1,
      text: 'Test message',
      userName: 'John Doe',
      postedOn: '10:00 AM',
      userPic: 'https://example.com/avatar.jpg'
    };
    renderWithRouter(
      <MessageItem message={message}>
        <div className="inbox-item-img">
          <img src={message.userPic} className="rounded-circle" alt="user" />
        </div>
        <p className="inbox-item-author">{message.userName}</p>
        <p className="inbox-item-text">{message.text}</p>
        <p className="inbox-item-date">{message.postedOn}</p>
      </MessageItem>
    );
    const avatar = screen.getByAltText('user');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders without user picture', () => {
    const message = {
      id: 1,
      text: 'Test message',
      userName: 'John Doe',
      postedOn: '10:00 AM'
    };
    renderWithRouter(
      <MessageItem message={message}>
        <p className="inbox-item-author">{message.userName}</p>
        <p className="inbox-item-text">{message.text}</p>
        <p className="inbox-item-date">{message.postedOn}</p>
      </MessageItem>
    );
    expect(screen.queryByAltText('user')).not.toBeInTheDocument();
  });
}); 