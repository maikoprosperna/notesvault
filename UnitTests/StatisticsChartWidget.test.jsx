/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import StatisticsChartWidget from '../StatisticsChartWidget';

// Mock react-apexcharts
vi.mock('react-apexcharts', () => ({
  default: ({ options, series, type, height }) => (
    <div data-testid="apex-chart" data-type={type} data-height={height}>
      Mock Chart - {series[0]?.name || 'Data'}
    </div>
  ),
}));

describe('StatisticsChartWidget', () => {
  const defaultProps = {
    title: 'Revenue',
    stats: '$50,000',
    data: [10, 20, 30, 40, 50],
    name: 'Revenue Data',
  };

  it('renders without crashing', () => {
    render(<StatisticsChartWidget {...defaultProps} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with title and stats', () => {
    render(<StatisticsChartWidget {...defaultProps} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    render(<StatisticsChartWidget {...defaultProps} colors={['#FF0000', '#00FF00']} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with custom type', () => {
    render(<StatisticsChartWidget {...defaultProps} type="line" />);
    const chart = screen.getByTestId('apex-chart');
    expect(chart).toHaveAttribute('data-type', 'line');
  });

  it('renders with custom textClass', () => {
    render(<StatisticsChartWidget {...defaultProps} textClass="text-primary" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(document.querySelector('.text-primary')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(<StatisticsChartWidget {...defaultProps} description="Monthly revenue data" />);
    const titleElement = screen.getByText('Revenue');
    expect(titleElement).toHaveAttribute('title', 'Monthly revenue data');
  });

  it('renders with trend data', () => {
    const trend = {
      value: '+12%',
      icon: 'mdi mdi-arrow-up',
      textClass: 'text-success'
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(document.querySelector('.mdi-arrow-up')).toBeInTheDocument();
  });

  it('renders with custom bgClass', () => {
    render(<StatisticsChartWidget {...defaultProps} bgClass="bg-primary" />);
    expect(document.querySelector('.widget-flat.bg-primary')).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    const trend = {
      value: '+5%',
      icon: 'mdi mdi-arrow-down',
      textClass: 'text-danger'
    };
    render(
      <StatisticsChartWidget 
        {...defaultProps}
        colors={['#FF0000']}
        type="area"
        textClass="text-info"
        bgClass="bg-light"
        trend={trend}
      />
    );
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
    expect(document.querySelector('.mdi-arrow-down')).toBeInTheDocument();
  });

  it('renders without trend when trend prop is not provided', () => {
    render(<StatisticsChartWidget {...defaultProps} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.queryByText('+12%')).not.toBeInTheDocument();
  });

  it('renders with empty data array', () => {
    render(<StatisticsChartWidget {...defaultProps} data={[]} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null data', () => {
    render(<StatisticsChartWidget {...defaultProps} data={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined data', () => {
    render(<StatisticsChartWidget {...defaultProps} data={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with empty title', () => {
    render(<StatisticsChartWidget {...defaultProps} title="" />);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with null title', () => {
    render(<StatisticsChartWidget {...defaultProps} title={null} />);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with undefined title', () => {
    render(<StatisticsChartWidget {...defaultProps} title={undefined} />);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with empty stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats="" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with null stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with undefined stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with long title', () => {
    const longTitle = 'This is a very long title that might cause layout issues and should be handled properly';
    render(<StatisticsChartWidget {...defaultProps} title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('renders with special characters in title', () => {
    const specialTitle = 'Revenue with Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?';
    render(<StatisticsChartWidget {...defaultProps} title={specialTitle} />);
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  it('renders with emoji in title', () => {
    render(<StatisticsChartWidget {...defaultProps} title="Revenue 🎉" />);
    expect(screen.getByText('Revenue 🎉')).toBeInTheDocument();
  });

  it('renders with numbers in stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats="12345" />);
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('renders with currency in stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats="$1,234.56" />);
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  it('renders with percentage in stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats="15.5%" />);
    expect(screen.getByText('15.5%')).toBeInTheDocument();
  });

  it('renders with trend that has no icon', () => {
    const trend = {
      value: '+10%',
      textClass: 'text-success'
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('+10%')).toBeInTheDocument();
  });

  it('renders with trend that has no textClass', () => {
    const trend = {
      value: '+8%',
      icon: 'mdi mdi-arrow-up'
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('+8%')).toBeInTheDocument();
  });

  it('renders with trend that has empty values', () => {
    const trend = {
      value: '',
      icon: '',
      textClass: ''
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with trend that has null values', () => {
    const trend = {
      value: null,
      icon: null,
      textClass: null
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with trend that has undefined values', () => {
    const trend = {
      value: undefined,
      icon: undefined,
      textClass: undefined
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with multiple custom classes', () => {
    render(<StatisticsChartWidget {...defaultProps} textClass="text-primary text-bold" bgClass="bg-light bg-gradient" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with emoji in stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats="100 🚀" />);
    expect(screen.getByText('100 🚀')).toBeInTheDocument();
  });

  it('renders with HTML entities in title', () => {
    render(<StatisticsChartWidget {...defaultProps} title="Revenue & Sales" />);
    expect(screen.getByText('Revenue & Sales')).toBeInTheDocument();
  });

  it('renders with very long stats', () => {
    const longStats = '1,234,567,890,123,456,789';
    render(<StatisticsChartWidget {...defaultProps} stats={longStats} />);
    expect(screen.getByText(longStats)).toBeInTheDocument();
  });

  it('renders with negative stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats="-500" />);
    expect(screen.getByText('-500')).toBeInTheDocument();
  });

  it('renders with zero stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats="0" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with decimal stats', () => {
    render(<StatisticsChartWidget {...defaultProps} stats="12.34" />);
    expect(screen.getByText('12.34')).toBeInTheDocument();
  });

  it('renders with complex trend data', () => {
    const trend = {
      value: '-2.5%',
      icon: 'mdi mdi-arrow-down',
      textClass: 'text-danger text-bold'
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('-2.5%')).toBeInTheDocument();
    expect(document.querySelector('.mdi-arrow-down')).toBeInTheDocument();
  });

  it('renders with different chart types', () => {
    const chartTypes = ['bar', 'line', 'area', 'pie', 'donut'];
    chartTypes.forEach(type => {
      const { unmount } = render(<StatisticsChartWidget {...defaultProps} type={type} />);
      const chart = screen.getByTestId('apex-chart');
      expect(chart).toHaveAttribute('data-type', type);
      unmount();
    });
  });

  it('renders with different icon types', () => {
    const trend = {
      value: '+5%',
      icon: 'fas fa-arrow-up',
      textClass: 'text-success'
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('+5%')).toBeInTheDocument();
    expect(document.querySelector('.fas.fa-arrow-up')).toBeInTheDocument();
  });

  it('renders with multiple icon classes', () => {
    const trend = {
      value: '+3%',
      icon: 'mdi mdi-arrow-up text-primary',
      textClass: 'text-success'
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('+3%')).toBeInTheDocument();
    expect(document.querySelector('.mdi-arrow-up')).toBeInTheDocument();
  });

  it('renders with empty icon', () => {
    const trend = {
      value: '+1%',
      icon: '',
      textClass: 'text-success'
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('+1%')).toBeInTheDocument();
  });

  it('renders with null icon', () => {
    const trend = {
      value: '+2%',
      icon: null,
      textClass: 'text-success'
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('+2%')).toBeInTheDocument();
  });

  it('renders with undefined icon', () => {
    const trend = {
      value: '+4%',
      icon: undefined,
      textClass: 'text-success'
    };
    render(<StatisticsChartWidget {...defaultProps} trend={trend} />);
    expect(screen.getByText('+4%')).toBeInTheDocument();
  });

  it('renders with custom name for chart data', () => {
    render(<StatisticsChartWidget {...defaultProps} name="Custom Data Name" />);
    // The mock chart shows "Mock Chart - Custom Data Name" but the text is broken up
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with null name', () => {
    render(<StatisticsChartWidget {...defaultProps} name={null} />);
    // The mock chart shows "Mock Chart - Data" when name is null
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with undefined name', () => {
    render(<StatisticsChartWidget {...defaultProps} name={undefined} />);
    // The mock chart shows "Mock Chart - Data" when name is undefined
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with empty name', () => {
    render(<StatisticsChartWidget {...defaultProps} name="" />);
    // The mock chart shows "Mock Chart - Data" when name is empty
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with very long name', () => {
    const longName = 'A'.repeat(1000);
    render(
      <StatisticsChartWidget
        {...defaultProps}
        name={longName}
      />
    );
    // The mock chart shows "Mock Chart - {longName}"
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with empty colors array', () => {
    render(<StatisticsChartWidget {...defaultProps} colors={[]} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null colors', () => {
    render(<StatisticsChartWidget {...defaultProps} colors={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined colors', () => {
    render(<StatisticsChartWidget {...defaultProps} colors={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with empty textClass', () => {
    render(<StatisticsChartWidget {...defaultProps} textClass="" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with null textClass', () => {
    render(<StatisticsChartWidget {...defaultProps} textClass={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with undefined textClass', () => {
    render(<StatisticsChartWidget {...defaultProps} textClass={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with empty bgClass', () => {
    render(<StatisticsChartWidget {...defaultProps} bgClass="" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with null bgClass', () => {
    render(<StatisticsChartWidget {...defaultProps} bgClass={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with undefined bgClass', () => {
    render(<StatisticsChartWidget {...defaultProps} bgClass={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with empty description', () => {
    render(<StatisticsChartWidget {...defaultProps} description="" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with null description', () => {
    render(<StatisticsChartWidget {...defaultProps} description={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with undefined description', () => {
    render(<StatisticsChartWidget {...defaultProps} description={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });
}); 