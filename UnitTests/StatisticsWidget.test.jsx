/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import StatisticsWidget from '../StatisticsWidget';

describe('StatisticsWidget', () => {
  it('renders without crashing', () => {
    render(<StatisticsWidget />);
    expect(document.querySelector('.widget-flat')).toBeInTheDocument();
  });

  it('renders with title and stats', () => {
    render(<StatisticsWidget title="Total Users" stats="1,234" />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<StatisticsWidget title="Users" stats="100" icon="mdi mdi-account" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(document.querySelector('.mdi-account')).toBeInTheDocument();
  });

  it('renders with custom textClass', () => {
    render(<StatisticsWidget title="Users" stats="100" textClass="text-primary" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with custom bgclassName', () => {
    render(<StatisticsWidget title="Users" stats="100" bgclassName="bg-primary" />);
    expect(document.querySelector('.widget-flat.bg-primary')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(<StatisticsWidget title="Users" stats="100" description="Total number of users" />);
    const titleElement = screen.getByText('Users');
    expect(titleElement).toHaveAttribute('title', 'Total number of users');
  });

  it('renders with trend data', () => {
    const trend = {
      value: '+12%',
      time: 'Since last month',
      icon: 'mdi mdi-arrow-up',
      textClass: 'text-success'
    };
    render(<StatisticsWidget title="Users" stats="100" trend={trend} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('Since last month')).toBeInTheDocument();
    expect(document.querySelector('.mdi-arrow-up')).toBeInTheDocument();
  });

  it('renders with all props', () => {
    const trend = {
      value: '+5%',
      time: 'Since yesterday',
      icon: 'mdi mdi-arrow-down',
      textClass: 'text-danger'
    };
    render(
      <StatisticsWidget 
        title="Revenue" 
        stats="$50,000" 
        icon="mdi mdi-currency-usd"
        textClass="text-info"
        bgclassName="bg-light"
        description="Monthly revenue"
        trend={trend}
      />
    );
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(document.querySelector('.mdi-currency-usd')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
    expect(screen.getByText('Since yesterday')).toBeInTheDocument();
    expect(document.querySelector('.mdi-arrow-down')).toBeInTheDocument();
  });

  it('renders without icon when icon prop is not provided', () => {
    render(<StatisticsWidget title="Users" stats="100" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(document.querySelector('.widget-icon')).not.toBeInTheDocument();
  });

  it('renders without trend when trend prop is not provided', () => {
    render(<StatisticsWidget title="Users" stats="100" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.queryByText('Since last month')).not.toBeInTheDocument();
  });

  it('renders with empty title', () => {
    render(<StatisticsWidget title="" stats="100" />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with null title', () => {
    render(<StatisticsWidget title={null} stats="100" />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with undefined title', () => {
    render(<StatisticsWidget title={undefined} stats="100" />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with empty stats', () => {
    render(<StatisticsWidget title="Users" stats="" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders with null stats', () => {
    render(<StatisticsWidget title="Users" stats={null} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders with undefined stats', () => {
    render(<StatisticsWidget title="Users" stats={undefined} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders with long title', () => {
    const longTitle = 'This is a very long title that might cause layout issues and should be handled properly by the component';
    render(<StatisticsWidget title={longTitle} stats="100" />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('renders with special characters in title', () => {
    const specialTitle = 'Title with Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?';
    render(<StatisticsWidget title={specialTitle} stats="100" />);
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  it('renders with numbers in stats', () => {
    render(<StatisticsWidget title="Users" stats="12345" />);
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('renders with currency in stats', () => {
    render(<StatisticsWidget title="Revenue" stats="$1,234.56" />);
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  it('renders with percentage in stats', () => {
    render(<StatisticsWidget title="Growth" stats="15.5%" />);
    expect(screen.getByText('15.5%')).toBeInTheDocument();
  });

  it('renders with trend that has no icon', () => {
    const trend = {
      value: '+10%',
      time: 'Since last week',
      textClass: 'text-success'
    };
    render(<StatisticsWidget title="Users" stats="100" trend={trend} />);
    expect(screen.getByText('+10%')).toBeInTheDocument();
    expect(screen.getByText('Since last week')).toBeInTheDocument();
  });

  it('renders with trend that has no textClass', () => {
    const trend = {
      value: '+8%',
      time: 'Since yesterday',
      icon: 'mdi mdi-arrow-up'
    };
    render(<StatisticsWidget title="Users" stats="100" trend={trend} />);
    expect(screen.getByText('+8%')).toBeInTheDocument();
    expect(screen.getByText('Since yesterday')).toBeInTheDocument();
  });

  it('renders with trend that has empty values', () => {
    const trend = {
      value: '',
      time: '',
      icon: '',
      textClass: ''
    };
    render(<StatisticsWidget title="Users" stats="100" trend={trend} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with trend that has null values', () => {
    const trend = {
      value: null,
      time: null,
      icon: null,
      textClass: null
    };
    render(<StatisticsWidget title="Users" stats="100" trend={trend} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with trend that has undefined values', () => {
    const trend = {
      value: undefined,
      time: undefined,
      icon: undefined,
      textClass: undefined
    };
    render(<StatisticsWidget title="Users" stats="100" trend={trend} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with multiple custom classes', () => {
    render(<StatisticsWidget title="Users" stats="100" textClass="text-primary text-bold" bgclassName="bg-light bg-gradient" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with emoji in title', () => {
    render(<StatisticsWidget title="Users 🎉" stats="100" />);
    expect(screen.getByText('Users 🎉')).toBeInTheDocument();
  });

  it('renders with emoji in stats', () => {
    render(<StatisticsWidget title="Users" stats="100 🚀" />);
    expect(screen.getByText('100 🚀')).toBeInTheDocument();
  });

  it('renders with HTML entities in title', () => {
    render(<StatisticsWidget title="Users & Groups" stats="100" />);
    expect(screen.getByText('Users & Groups')).toBeInTheDocument();
  });

  it('renders with very long stats', () => {
    const longStats = '1,234,567,890,123,456,789';
    render(<StatisticsWidget title="Users" stats={longStats} />);
    expect(screen.getByText(longStats)).toBeInTheDocument();
  });

  it('renders with negative stats', () => {
    render(<StatisticsWidget title="Loss" stats="-500" />);
    expect(screen.getByText('-500')).toBeInTheDocument();
  });

  it('renders with zero stats', () => {
    render(<StatisticsWidget title="Users" stats="0" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with decimal stats', () => {
    render(<StatisticsWidget title="Average" stats="12.34" />);
    expect(screen.getByText('12.34')).toBeInTheDocument();
  });

  it('renders with complex trend data', () => {
    const trend = {
      value: '-2.5%',
      time: 'Since last quarter',
      icon: 'mdi mdi-arrow-down',
      textClass: 'text-danger text-bold'
    };
    render(<StatisticsWidget title="Revenue" stats="$45,678" trend={trend} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$45,678')).toBeInTheDocument();
    expect(screen.getByText('-2.5%')).toBeInTheDocument();
    expect(screen.getByText('Since last quarter')).toBeInTheDocument();
    expect(document.querySelector('.mdi-arrow-down')).toBeInTheDocument();
  });

  it('renders with different icon types', () => {
    render(<StatisticsWidget title="Users" stats="100" icon="fas fa-users" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(document.querySelector('.fas.fa-users')).toBeInTheDocument();
  });

  it('renders with multiple icon classes', () => {
    render(<StatisticsWidget title="Users" stats="100" icon="mdi mdi-account-multiple text-primary" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(document.querySelector('.mdi-account-multiple')).toBeInTheDocument();
  });

  it('renders with empty icon', () => {
    render(<StatisticsWidget title="Users" stats="100" icon="" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with null icon', () => {
    render(<StatisticsWidget title="Users" stats="100" icon={null} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with undefined icon', () => {
    render(<StatisticsWidget title="Users" stats="100" icon={undefined} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
}); 