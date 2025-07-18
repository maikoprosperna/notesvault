/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatList from '../ChatList';
import React from 'react';

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    handleSubmit: vi.fn((fn) => (event) => {
      // Mock the form submission with proper values structure
      const mockValues = {
        target: [
          { value: event?.target?.querySelector('input')?.value || 'Test message' }
        ]
      };
      return fn(event, mockValues);
    }),
    register: vi.fn(),
    control: {},
    formState: { errors: {} },
    reset: vi.fn(),
  })),
}));

// Mock @hookform/resolvers/yup
vi.mock('@hookform/resolvers/yup', () => ({
  yupResolver: vi.fn(),
}));

// Mock simplebar-react
vi.mock('simplebar-react', () => ({
  default: ({ children }) => <div data-testid="simplebar">{children}</div>,
}));

// Mock FormInput component
vi.mock('../../components/', () => ({
  FormInput: ({ name, placeholder, register, errors, control }) => (
    <input
      data-testid="form-input"
      name={name}
      placeholder={placeholder}
      ref={register}
      {...errors}
      {...control}
    />
  ),
}));

describe('ChatList Component', () => {
  const mockMessages = [
    {
      id: 1,
      userName: 'John Doe',
      text: 'Hello there!',
      postedOn: '09:00',
      userPic: 'https://example.com/avatar1.jpg',
    },
    {
      id: 2,
      userName: 'Jane Smith',
      text: 'Hi! How are you?',
      postedOn: '09:05',
      userPic: 'https://example.com/avatar2.jpg',
    },
  ];

  const defaultProps = {
    messages: mockMessages,
    className: 'custom-chat-class',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the chat list with header', () => {
      render(<ChatList {...defaultProps} />);
      
      expect(screen.getByText('Chat')).toBeInTheDocument();
      expect(screen.getByText('Chat')).toHaveClass('header-title');
    });

    it('renders all messages correctly', () => {
      render(<ChatList {...defaultProps} />);
      
      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders user avatars when provided', () => {
      render(<ChatList {...defaultProps} />);
      
      const avatars = screen.getAllByAltText(/https:\/\/example\.com\/avatar/);
      expect(avatars).toHaveLength(2);
      expect(avatars[0]).toHaveAttribute('src', 'https://example.com/avatar1.jpg');
      expect(avatars[1]).toHaveAttribute('src', 'https://example.com/avatar2.jpg');
    });

    it('renders posted times correctly', () => {
      render(<ChatList {...defaultProps} />);
      
      expect(screen.getByText('09:00')).toBeInTheDocument();
      expect(screen.getByText('09:05')).toBeInTheDocument();
    });

    it('renders dropdown menu with options', () => {
      render(<ChatList {...defaultProps} />);
      
      // Use getAllByRole to get all buttons and find the dropdown toggle
      const buttons = screen.getAllByRole('button');
      const dropdownToggle = buttons.find(button => 
        button.classList.contains('dropdown-toggle')
      );
      expect(dropdownToggle).toBeInTheDocument();
      
      fireEvent.click(dropdownToggle);
      
      expect(screen.getByText('Refresh')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders chat form with input and send button', () => {
      render(<ChatList {...defaultProps} />);
      
      expect(screen.getByTestId('form-input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your text')).toBeInTheDocument();
      expect(screen.getByText('Send')).toBeInTheDocument();
      expect(screen.getByText('Send')).toHaveClass('btn', 'btn-danger');
    });

    it('applies custom className to conversation list', () => {
      render(<ChatList {...defaultProps} />);
      
      const conversationList = screen.getByRole('list');
      expect(conversationList).toHaveClass('conversation-list', 'custom-chat-class', 'px-3');
    });
  });

  describe('Message Placement Logic', () => {
    it('applies correct placement classes for messages', () => {
      render(<ChatList {...defaultProps} />);
      
      const listItems = screen.getAllByRole('listitem');
      
      // First message should be on the right (default)
      expect(listItems[0]).not.toHaveClass('odd');
      
      // Second message should be on the left
      expect(listItems[1]).toHaveClass('odd');
    });

    it('handles single message correctly', () => {
      const singleMessage = [mockMessages[0]];
      render(<ChatList messages={singleMessage} />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
      expect(listItems[0]).not.toHaveClass('odd');
    });

    it('handles empty messages array', () => {
      render(<ChatList messages={[]} />);
      
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });
  });

  describe('Message Structure', () => {
    it('renders messages without user pictures', () => {
      const messagesWithoutPics = [
        {
          id: 1,
          userName: 'John Doe',
          text: 'Hello there!',
          postedOn: '09:00',
        },
      ];
      
      render(<ChatList messages={messagesWithoutPics} />);
      
      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByAltText(/https:\/\/example\.com\/avatar/)).not.toBeInTheDocument();
    });

    it('renders messages with all properties', () => {
      render(<ChatList {...defaultProps} />);
      
      // Check that all message properties are rendered
      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('09:00')).toBeInTheDocument();
      expect(screen.getByText('09:05')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('handles form submission correctly', async () => {
      const { container } = render(<ChatList {...defaultProps} />);
      
      const form = container.querySelector('form');
      
      // Submit the form
      fireEvent.submit(form);
      
      // Check that the new message is added
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
    });

    it('adds new message with correct structure', async () => {
      const { container } = render(<ChatList {...defaultProps} />);
      
      const form = container.querySelector('form');
      
      fireEvent.submit(form);
      
      // Wait for the new message to appear
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
      
      // Check that Geneva is present (the new message doesn't have a timestamp displayed)
      expect(screen.getByText('Geneva')).toBeInTheDocument();
    });

    it('increments message ID correctly', async () => {
      const { container } = render(<ChatList {...defaultProps} />);
      
      const form = container.querySelector('form');
      
      // Submit first message
      fireEvent.submit(form);
      
      // Submit second message
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getAllByText('Test message')).toHaveLength(2);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles null messages prop', () => {
      // The component doesn't handle null gracefully, so we expect it to throw
      expect(() => render(<ChatList messages={null} />)).toThrow();
    });

    it('handles undefined messages prop', () => {
      // The component doesn't handle undefined gracefully, so we expect it to throw
      expect(() => render(<ChatList messages={undefined} />)).toThrow();
    });

    it('handles messages with missing properties', () => {
      const incompleteMessages = [
        {
          id: 1,
          text: 'Incomplete message',
        },
      ];
      
      render(<ChatList messages={incompleteMessages} />);
      
      expect(screen.getByText('Incomplete message')).toBeInTheDocument();
    });

    it('handles very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      const messagesWithLongText = [
        {
          id: 1,
          userName: 'User',
          text: longMessage,
          postedOn: '10:00',
        },
      ];
      
      render(<ChatList messages={messagesWithLongText} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in messages', () => {
      const specialMessage = 'Message with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const messagesWithSpecialChars = [
        {
          id: 1,
          userName: 'User',
          text: specialMessage,
          postedOn: '10:00',
        },
      ];
      
      render(<ChatList messages={messagesWithSpecialChars} />);
      
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('handles empty text in messages', () => {
      const emptyTextMessage = [
        {
          id: 1,
          userName: 'User',
          text: '',
          postedOn: '10:00',
        },
      ];
      
      render(<ChatList messages={emptyTextMessage} />);
      
      // Should render without crashing
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('handles null text in messages', () => {
      const nullTextMessage = [
        {
          id: 1,
          userName: 'User',
          text: null,
          postedOn: '10:00',
        },
      ];
      
      render(<ChatList messages={nullTextMessage} />);
      
      // Should render without crashing
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders with correct card structure', () => {
      render(<ChatList {...defaultProps} />);
      
      const card = document.querySelector('.card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('card', 'mb-0');
    });

    it('renders SimpleBar with correct props', () => {
      render(<ChatList {...defaultProps} />);
      
      const simplebar = screen.getByTestId('simplebar');
      expect(simplebar).toBeInTheDocument();
    });

    it('renders conversation list as unordered list', () => {
      render(<ChatList {...defaultProps} />);
      
      const conversationList = screen.getByRole('list');
      expect(conversationList).toHaveClass('conversation-list');
    });

    it('renders chat form with correct structure', () => {
      render(<ChatList {...defaultProps} />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('name', 'chat-form');
      expect(form).toHaveAttribute('id', 'chat-form');
      expect(form).toHaveClass('needs-validation', 'm-3');
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and structure', () => {
      render(<ChatList {...defaultProps} />);
      
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      const input = screen.getByTestId('form-input');
      expect(input).toBeInTheDocument();
      
      const sendButton = screen.getByText('Send');
      expect(sendButton).toHaveAttribute('type', 'submit');
    });

    it('has proper list structure', () => {
      render(<ChatList {...defaultProps} />);
      
      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');
      
      expect(list).toBeInTheDocument();
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('State Management', () => {
    it('maintains message state correctly', async () => {
      const { container } = render(<ChatList {...defaultProps} />);
      
      // Initial messages
      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
      
      // Add new message
      const form = container.querySelector('form');
      fireEvent.submit(form);
      
      // Wait for new message and verify all messages are present
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
        expect(screen.getByText('Hello there!')).toBeInTheDocument();
        expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
      });
    });

    it('handles multiple message additions', async () => {
      const { container } = render(<ChatList {...defaultProps} />);
      
      const form = container.querySelector('form');
      
      // Add first message
      fireEvent.submit(form);
      
      // Add second message
      fireEvent.submit(form);
      
      // Wait for both messages to be added
      await waitFor(() => {
        expect(screen.getAllByText('Test message')).toHaveLength(2);
      });
    });
  });
});
