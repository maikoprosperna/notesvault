/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import FAQs from '../FAQs';

describe('FAQs', () => {
  it('renders without crashing', () => {
    const rawFaqs = [
      {
        id: 1,
        question: 'What is this?',
        answer: 'This is a test answer.',
        titleClass: 'text-primary',
        textClass: 'text-muted'
      }
    ];
    
    render(<FAQs rawFaqs={rawFaqs} />);
    expect(screen.getByText('What is this?')).toBeInTheDocument();
    expect(screen.getByText('This is a test answer.')).toBeInTheDocument();
  });

  it('renders multiple FAQs', () => {
    const rawFaqs = [
      {
        id: 1,
        question: 'First question?',
        answer: 'First answer.',
        titleClass: 'text-primary',
        textClass: 'text-muted'
      },
      {
        id: 2,
        question: 'Second question?',
        answer: 'Second answer.',
        titleClass: 'text-success',
        textClass: 'text-info'
      }
    ];
    
    render(<FAQs rawFaqs={rawFaqs} />);
    expect(screen.getByText('First question?')).toBeInTheDocument();
    expect(screen.getByText('First answer.')).toBeInTheDocument();
    expect(screen.getByText('Second question?')).toBeInTheDocument();
    expect(screen.getByText('Second answer.')).toBeInTheDocument();
  });
});
