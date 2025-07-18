/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import StatisticsChartWidget3 from '../StatisticsChartWidget3';

// Mock react-apexcharts
vi.mock('react-apexcharts', () => ({
  default: ({ options, series, type, height }) => (
    <div data-testid="apex-chart" data-type={type} data-height={height}>
      Mock Chart - {series[0]?.name || 'Data'}
    </div>
  ),
}));

describe('StatisticsChartWidget3', () => {
  const defaultProps = {
    title: 'Revenue',
    stats: '$50,000',
    data: [10, 20, 30, 40, 50],
    name: 'Revenue Data',
    lastMonthData: '$45,000',
    CurrentMonthData: '$55,000',
  };

  it('renders without crashing', () => {
    render(<StatisticsChartWidget3 {...defaultProps} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with title and stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    render(<StatisticsChartWidget3 {...defaultProps} colors={['#FF0000', '#00FF00']} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with custom type', () => {
    render(<StatisticsChartWidget3 {...defaultProps} type="line" />);
    const chart = screen.getByTestId('apex-chart');
    expect(chart).toHaveAttribute('data-type', 'line');
  });

  it('renders with custom strokeWidth', () => {
    render(<StatisticsChartWidget3 {...defaultProps} strokeWidth={5} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with custom borderRadius', () => {
    render(<StatisticsChartWidget3 {...defaultProps} borderRadius={10} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with monthly data', () => {
    render(<StatisticsChartWidget3 {...defaultProps} />);
    expect(screen.getByText('Last Month')).toBeInTheDocument();
    expect(screen.getByText('Current Month')).toBeInTheDocument();
    expect(screen.getByText('$45,000')).toBeInTheDocument();
    expect(screen.getByText('$55,000')).toBeInTheDocument();
  });

  it('renders with view button', () => {
    render(<StatisticsChartWidget3 {...defaultProps} />);
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        colors={['#FF0000']}
        type="area"
        strokeWidth={3}
        borderRadius={5}
      />
    );
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$45,000')).toBeInTheDocument();
    expect(screen.getByText('$55,000')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('renders with empty data array', () => {
    render(<StatisticsChartWidget3 {...defaultProps} data={[]} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null data', () => {
    render(<StatisticsChartWidget3 {...defaultProps} data={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined data', () => {
    render(<StatisticsChartWidget3 {...defaultProps} data={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with empty title', () => {
    render(<StatisticsChartWidget3 {...defaultProps} title="" />);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with null title', () => {
    render(<StatisticsChartWidget3 {...defaultProps} title={null} />);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with undefined title', () => {
    render(<StatisticsChartWidget3 {...defaultProps} title={undefined} />);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders with empty stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats="" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with null stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with undefined stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders with empty lastMonthData', () => {
    render(<StatisticsChartWidget3 {...defaultProps} lastMonthData="" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();
  });

  it('renders with null lastMonthData', () => {
    render(<StatisticsChartWidget3 {...defaultProps} lastMonthData={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();
  });

  it('renders with undefined lastMonthData', () => {
    render(<StatisticsChartWidget3 {...defaultProps} lastMonthData={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();
  });

  it('renders with empty CurrentMonthData', () => {
    render(<StatisticsChartWidget3 {...defaultProps} CurrentMonthData="" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Current Month')).toBeInTheDocument();
  });

  it('renders with null CurrentMonthData', () => {
    render(<StatisticsChartWidget3 {...defaultProps} CurrentMonthData={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Current Month')).toBeInTheDocument();
  });

  it('renders with undefined CurrentMonthData', () => {
    render(<StatisticsChartWidget3 {...defaultProps} CurrentMonthData={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Current Month')).toBeInTheDocument();
  });

  it('renders with long title', () => {
    const longTitle = 'This is a very long title that might cause layout issues and should be handled properly';
    render(<StatisticsChartWidget3 {...defaultProps} title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('renders with special characters in title', () => {
    const specialTitle = 'Revenue with Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?';
    render(<StatisticsChartWidget3 {...defaultProps} title={specialTitle} />);
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  it('renders with emoji in title', () => {
    render(<StatisticsChartWidget3 {...defaultProps} title="Revenue 🎉" />);
    expect(screen.getByText('Revenue 🎉')).toBeInTheDocument();
  });

  it('renders with numbers in stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats="12345" />);
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('renders with currency in stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats="$1,234.56" />);
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  it('renders with percentage in stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats="15.5%" />);
    expect(screen.getByText('15.5%')).toBeInTheDocument();
  });

  it('renders with different chart types', () => {
    const chartTypes = ['bar', 'line', 'area', 'pie', 'donut'];
    chartTypes.forEach(type => {
      const { unmount } = render(<StatisticsChartWidget3 {...defaultProps} type={type} />);
      const chart = screen.getByTestId('apex-chart');
      expect(chart).toHaveAttribute('data-type', type);
      unmount();
    });
  });

  it('renders with custom name for chart data', () => {
    render(<StatisticsChartWidget3 {...defaultProps} name="Custom Data Name" />);
    // The mock chart shows "Mock Chart - Custom Data Name" but the text is broken up
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with null name', () => {
    render(<StatisticsChartWidget3 {...defaultProps} name={null} />);
    // The mock chart shows "Mock Chart - Data" when name is null
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with undefined name', () => {
    render(<StatisticsChartWidget3 {...defaultProps} name={undefined} />);
    // The mock chart shows "Mock Chart - Data" when name is undefined
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with empty name', () => {
    render(<StatisticsChartWidget3 {...defaultProps} name="" />);
    // The mock chart shows "Mock Chart - Data" when name is empty
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with very long name', () => {
    const longName = 'A'.repeat(1000);
    render(
      <StatisticsChartWidget3
        {...defaultProps}
        name={longName}
      />
    );
    // The mock chart shows "Mock Chart - {longName}"
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with empty colors array', () => {
    render(<StatisticsChartWidget3 {...defaultProps} colors={[]} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null colors', () => {
    render(<StatisticsChartWidget3 {...defaultProps} colors={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined colors', () => {
    render(<StatisticsChartWidget3 {...defaultProps} colors={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null strokeWidth', () => {
    render(<StatisticsChartWidget3 {...defaultProps} strokeWidth={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined strokeWidth', () => {
    render(<StatisticsChartWidget3 {...defaultProps} strokeWidth={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null borderRadius', () => {
    render(<StatisticsChartWidget3 {...defaultProps} borderRadius={null} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined borderRadius', () => {
    render(<StatisticsChartWidget3 {...defaultProps} borderRadius={undefined} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with emoji in stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats="100 🚀" />);
    expect(screen.getByText('100 🚀')).toBeInTheDocument();
  });

  it('renders with HTML entities in title', () => {
    render(<StatisticsChartWidget3 {...defaultProps} title="Revenue & Sales" />);
    expect(screen.getByText('Revenue & Sales')).toBeInTheDocument();
  });

  it('renders with very long stats', () => {
    const longStats = '1,234,567,890,123,456,789';
    render(<StatisticsChartWidget3 {...defaultProps} stats={longStats} />);
    expect(screen.getByText(longStats)).toBeInTheDocument();
  });

  it('renders with negative stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats="-500" />);
    expect(screen.getByText('-500')).toBeInTheDocument();
  });

  it('renders with zero stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats="0" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with decimal stats', () => {
    render(<StatisticsChartWidget3 {...defaultProps} stats="12.34" />);
    expect(screen.getByText('12.34')).toBeInTheDocument();
  });

  it('renders with complex monthly data', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        lastMonthData="$1,234,567.89"
        CurrentMonthData="$2,345,678.90"
      />
    );
    expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
    expect(screen.getByText('$2,345,678.90')).toBeInTheDocument();
  });

  it('renders with negative monthly data', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        lastMonthData="-$500"
        CurrentMonthData="-$300"
      />
    );
    expect(screen.getByText('-$500')).toBeInTheDocument();
    expect(screen.getByText('-$300')).toBeInTheDocument();
  });

  it('renders with percentage monthly data', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        lastMonthData="15.5%"
        CurrentMonthData="20.3%"
      />
    );
    expect(screen.getByText('15.5%')).toBeInTheDocument();
    expect(screen.getByText('20.3%')).toBeInTheDocument();
  });

  it('renders with emoji in monthly data', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        lastMonthData="$45,000 🎉"
        CurrentMonthData="$55,000 🚀"
      />
    );
    expect(screen.getByText('$45,000 🎉')).toBeInTheDocument();
    expect(screen.getByText('$55,000 🚀')).toBeInTheDocument();
  });

  it('renders with special characters in monthly data', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        lastMonthData="$45,000 & Sales"
        CurrentMonthData="$55,000 & Revenue"
      />
    );
    expect(screen.getByText('$45,000 & Sales')).toBeInTheDocument();
    expect(screen.getByText('$55,000 & Revenue')).toBeInTheDocument();
  });

  it('renders with very long monthly data', () => {
    const longData = '1,234,567,890,123,456,789';
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        lastMonthData={longData}
        CurrentMonthData={longData}
      />
    );
    // Use getAllByText since there are multiple elements with the same text
    const elements = screen.getAllByText(longData);
    expect(elements).toHaveLength(2);
  });

  it('renders with zero monthly data', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        lastMonthData="0"
        CurrentMonthData="0"
      />
    );
    // Use getAllByText since there are multiple elements with "0"
    const elements = screen.getAllByText('0');
    expect(elements).toHaveLength(2);
  });

  it('renders with decimal monthly data', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        lastMonthData="12.34"
        CurrentMonthData="56.78"
      />
    );
    expect(screen.getByText('12.34')).toBeInTheDocument();
    expect(screen.getByText('56.78')).toBeInTheDocument();
  });

  it('renders with different strokeWidth values', () => {
    const strokeWidths = [1, 2, 3, 4, 5, 10];
    strokeWidths.forEach(width => {
      const { unmount } = render(<StatisticsChartWidget3 {...defaultProps} strokeWidth={width} />);
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with different borderRadius values', () => {
    const borderRadiuses = [0, 1, 2, 5, 10, 20];
    borderRadiuses.forEach(radius => {
      const { unmount } = render(<StatisticsChartWidget3 {...defaultProps} borderRadius={radius} />);
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with negative strokeWidth', () => {
    render(<StatisticsChartWidget3 {...defaultProps} strokeWidth={-1} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with negative borderRadius', () => {
    render(<StatisticsChartWidget3 {...defaultProps} borderRadius={-1} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with decimal strokeWidth', () => {
    render(<StatisticsChartWidget3 {...defaultProps} strokeWidth={2.5} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with decimal borderRadius', () => {
    render(<StatisticsChartWidget3 {...defaultProps} borderRadius={3.7} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with very large strokeWidth', () => {
    render(<StatisticsChartWidget3 {...defaultProps} strokeWidth={100} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with very large borderRadius', () => {
    render(<StatisticsChartWidget3 {...defaultProps} borderRadius={100} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with empty string values', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        title=""
        stats=""
        name=""
        data={[]}
        colors={[]}
        lastMonthData=""
        CurrentMonthData=""
      />
    );
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();
    expect(screen.getByText('Current Month')).toBeInTheDocument();
  });

  it('renders with null values', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        title={null}
        stats={null}
        name={null}
        data={null}
        colors={null}
        lastMonthData={null}
        CurrentMonthData={null}
      />
    );
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();
    expect(screen.getByText('Current Month')).toBeInTheDocument();
  });

  it('renders with undefined values', () => {
    render(
      <StatisticsChartWidget3 
        {...defaultProps}
        title={undefined}
        stats={undefined}
        name={undefined}
        data={undefined}
        colors={undefined}
        lastMonthData={undefined}
        CurrentMonthData={undefined}
      />
    );
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();
    expect(screen.getByText('Current Month')).toBeInTheDocument();
  });

  it('renders with complex data array', () => {
    const complexData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    render(<StatisticsChartWidget3 {...defaultProps} data={complexData} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with negative data values', () => {
    const negativeData = [-1, -2, -3, -4, -5];
    render(<StatisticsChartWidget3 {...defaultProps} data={negativeData} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with decimal data values', () => {
    const decimalData = [1.1, 2.2, 3.3, 4.4, 5.5];
    render(<StatisticsChartWidget3 {...defaultProps} data={decimalData} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with zero data values', () => {
    const zeroData = [0, 0, 0, 0, 0];
    render(<StatisticsChartWidget3 {...defaultProps} data={zeroData} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with single data value', () => {
    const singleData = [42];
    render(<StatisticsChartWidget3 {...defaultProps} data={singleData} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with multiple color values', () => {
    const multipleColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
    render(<StatisticsChartWidget3 {...defaultProps} colors={multipleColors} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with hex color values', () => {
    const hexColors = ['#FF0000', '#00FF00'];
    render(<StatisticsChartWidget3 {...defaultProps} colors={hexColors} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with rgb color values', () => {
    const rgbColors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)'];
    render(<StatisticsChartWidget3 {...defaultProps} colors={rgbColors} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with rgba color values', () => {
    const rgbaColors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)'];
    render(<StatisticsChartWidget3 {...defaultProps} colors={rgbaColors} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with named color values', () => {
    const namedColors = ['red', 'green', 'blue'];
    render(<StatisticsChartWidget3 {...defaultProps} colors={namedColors} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with empty string color values', () => {
    const emptyColors = ['', '', ''];
    render(<StatisticsChartWidget3 {...defaultProps} colors={emptyColors} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null color values', () => {
    const nullColors = [null, null, null];
    render(<StatisticsChartWidget3 {...defaultProps} colors={nullColors} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined color values', () => {
    const undefinedColors = [undefined, undefined, undefined];
    render(<StatisticsChartWidget3 {...defaultProps} colors={undefinedColors} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });
}); 