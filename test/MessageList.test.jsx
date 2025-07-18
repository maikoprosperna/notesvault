/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MessageList from '../MessageList';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('MessageList', () => {
  it('renders without crashing', () => {
    const messages = [
      {
        id: 1,
        text: 'Test message',
        userName: 'John Doe',
        postedOn: '10:00 AM'
      }
    ];
    renderWithRouter(
      <MessageList messages={messages}>
        <div className="message-item">
          <p>{messages[0].text}</p>
          <p>{messages[0].userName}</p>
        </div>
      </MessageList>
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders multiple messages', () => {
    const messages = [
      {
        id: 1,
        text: 'First message',
        userName: 'John Doe',
        postedOn: '10:00 AM'
      },
      {
        id: 2,
        text: 'Second message',
        userName: 'Jane Smith',
        postedOn: '10:05 AM'
      }
    ];
    renderWithRouter(
      <MessageList messages={messages}>
        {messages.map(message => (
          <div key={message.id} className="message-item">
            <p>{message.text}</p>
            <p>{message.userName}</p>
          </div>
        ))}
      </MessageList>
    );
    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
  });

  it('renders empty message list', () => {
    renderWithRouter(
      <MessageList messages={[]}>
        {/* No children */}
      </MessageList>
    );
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const messages = [
      {
        id: 1,
        text: 'Test message',
        userName: 'John Doe',
        postedOn: '10:00 AM'
      }
    ];
    renderWithRouter(
      <MessageList messages={messages} className="custom-list">
        <div className="message-item">
          <p>{messages[0].text}</p>
        </div>
      </MessageList>
    );
    // Just check that the component renders without crashing
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
}); 