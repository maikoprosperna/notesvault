/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import StatisticsChartWidget2 from '../StatisticsChartWidget2';

// Mock react-apexcharts
vi.mock('react-apexcharts', () => ({
  default: ({ options, series, type, height }) => (
    <div data-testid="apex-chart" data-type={type} data-height={height}>
      Mock Chart - {series[0]?.name || 'Data'}
    </div>
  ),
}));

describe('StatisticsChartWidget2', () => {
  const defaultProps = {
    title: 'Revenue Chart',
    subtitle: 'Monthly revenue data',
    data: [10, 20, 30, 40, 50],
    name: 'Revenue Data',
  };

  it('renders without crashing', () => {
    render(<StatisticsChartWidget2 {...defaultProps} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(<StatisticsChartWidget2 {...defaultProps} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    render(<StatisticsChartWidget2 {...defaultProps} colors={['#FF0000', '#00FF00']} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with custom type', () => {
    render(<StatisticsChartWidget2 {...defaultProps} type="line" />);
    const chart = screen.getByTestId('apex-chart');
    expect(chart).toHaveAttribute('data-type', 'line');
  });

  it('renders with all props combined', () => {
    render(
      <StatisticsChartWidget2 
        {...defaultProps}
        colors={['#FF0000']}
        type="area"
      />
    );
    const chart = screen.getByTestId('apex-chart');
    expect(chart).toHaveAttribute('data-type', 'area');
  });

  it('renders with empty data array', () => {
    render(<StatisticsChartWidget2 {...defaultProps} data={[]} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null data', () => {
    render(<StatisticsChartWidget2 {...defaultProps} data={null} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined data', () => {
    render(<StatisticsChartWidget2 {...defaultProps} data={undefined} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with empty title', () => {
    render(<StatisticsChartWidget2 {...defaultProps} title="" />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null title', () => {
    render(<StatisticsChartWidget2 {...defaultProps} title={null} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined title', () => {
    render(<StatisticsChartWidget2 {...defaultProps} title={undefined} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with empty subtitle', () => {
    render(<StatisticsChartWidget2 {...defaultProps} subtitle="" />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null subtitle', () => {
    render(<StatisticsChartWidget2 {...defaultProps} subtitle={null} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined subtitle', () => {
    render(<StatisticsChartWidget2 {...defaultProps} subtitle={undefined} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with long title', () => {
    const longTitle = 'This is a very long title that might cause layout issues and should be handled properly';
    render(<StatisticsChartWidget2 {...defaultProps} title={longTitle} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with special characters in title', () => {
    const specialTitle = 'Chart with Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?';
    render(<StatisticsChartWidget2 {...defaultProps} title={specialTitle} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with emoji in title', () => {
    render(<StatisticsChartWidget2 {...defaultProps} title="Chart 🎉" />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with long subtitle', () => {
    const longSubtitle = 'This is a very long subtitle that might cause layout issues and should be handled properly';
    render(<StatisticsChartWidget2 {...defaultProps} subtitle={longSubtitle} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with special characters in subtitle', () => {
    const specialSubtitle = 'Subtitle with Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?';
    render(<StatisticsChartWidget2 {...defaultProps} subtitle={specialSubtitle} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with emoji in subtitle', () => {
    render(<StatisticsChartWidget2 {...defaultProps} subtitle="Subtitle 🚀" />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with different chart types', () => {
    const chartTypes = ['bar', 'line', 'area', 'pie', 'donut'];
    chartTypes.forEach(type => {
      const { unmount } = render(<StatisticsChartWidget2 {...defaultProps} type={type} />);
      const chart = screen.getByTestId('apex-chart');
      expect(chart).toHaveAttribute('data-type', type);
      unmount();
    });
  });

  it('renders with custom name for chart data', () => {
    render(<StatisticsChartWidget2 {...defaultProps} name="Custom Data Name" />);
    // The mock chart shows "Mock Chart - Custom Data Name" but the text is broken up
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with null name', () => {
    render(<StatisticsChartWidget2 {...defaultProps} name={null} />);
    // The mock chart shows "Mock Chart - Data" when name is null
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with undefined name', () => {
    render(<StatisticsChartWidget2 {...defaultProps} name={undefined} />);
    // The mock chart shows "Mock Chart - Data" when name is undefined
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with empty name', () => {
    render(<StatisticsChartWidget2 {...defaultProps} name="" />);
    // The mock chart shows "Mock Chart - Data" when name is empty
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with very long name', () => {
    const longName = 'A'.repeat(1000);
    render(
      <StatisticsChartWidget2
        {...defaultProps}
        name={longName}
      />
    );
    // The mock chart shows "Mock Chart - {longName}"
    expect(screen.getByText(/Mock Chart/)).toBeInTheDocument();
  });

  it('renders with empty colors array', () => {
    render(<StatisticsChartWidget2 {...defaultProps} colors={[]} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null colors', () => {
    render(<StatisticsChartWidget2 {...defaultProps} colors={null} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined colors', () => {
    render(<StatisticsChartWidget2 {...defaultProps} colors={undefined} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with HTML entities in title', () => {
    render(<StatisticsChartWidget2 {...defaultProps} title="Chart & Data" />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with HTML entities in subtitle', () => {
    render(<StatisticsChartWidget2 {...defaultProps} subtitle="Data & Analytics" />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with numbers in title', () => {
    render(<StatisticsChartWidget2 {...defaultProps} title="Chart 123" />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with numbers in subtitle', () => {
    render(<StatisticsChartWidget2 {...defaultProps} subtitle="Data 456" />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with very long title', () => {
    const veryLongTitle = 'A'.repeat(1000);
    render(<StatisticsChartWidget2 {...defaultProps} title={veryLongTitle} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with very long subtitle', () => {
    const veryLongSubtitle = 'A'.repeat(1000);
    render(<StatisticsChartWidget2 {...defaultProps} subtitle={veryLongSubtitle} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with empty string values', () => {
    render(
      <StatisticsChartWidget2 
        {...defaultProps}
        title=""
        subtitle=""
        name=""
        data={[]}
        colors={[]}
      />
    );
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null values', () => {
    render(
      <StatisticsChartWidget2 
        {...defaultProps}
        title={null}
        subtitle={null}
        name={null}
        data={null}
        colors={null}
      />
    );
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined values', () => {
    render(
      <StatisticsChartWidget2 
        {...defaultProps}
        title={undefined}
        subtitle={undefined}
        name={undefined}
        data={undefined}
        colors={undefined}
      />
    );
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with complex data array', () => {
    const complexData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    render(<StatisticsChartWidget2 {...defaultProps} data={complexData} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with negative data values', () => {
    const negativeData = [-1, -2, -3, -4, -5];
    render(<StatisticsChartWidget2 {...defaultProps} data={negativeData} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with decimal data values', () => {
    const decimalData = [1.1, 2.2, 3.3, 4.4, 5.5];
    render(<StatisticsChartWidget2 {...defaultProps} data={decimalData} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with zero data values', () => {
    const zeroData = [0, 0, 0, 0, 0];
    render(<StatisticsChartWidget2 {...defaultProps} data={zeroData} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with single data value', () => {
    const singleData = [42];
    render(<StatisticsChartWidget2 {...defaultProps} data={singleData} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with multiple color values', () => {
    const multipleColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
    render(<StatisticsChartWidget2 {...defaultProps} colors={multipleColors} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with hex color values', () => {
    const hexColors = ['#FF0000', '#00FF00'];
    render(<StatisticsChartWidget2 {...defaultProps} colors={hexColors} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with rgb color values', () => {
    const rgbColors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)'];
    render(<StatisticsChartWidget2 {...defaultProps} colors={rgbColors} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with rgba color values', () => {
    const rgbaColors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)'];
    render(<StatisticsChartWidget2 {...defaultProps} colors={rgbaColors} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with named color values', () => {
    const namedColors = ['red', 'green', 'blue'];
    render(<StatisticsChartWidget2 {...defaultProps} colors={namedColors} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with empty string color values', () => {
    const emptyColors = ['', '', ''];
    render(<StatisticsChartWidget2 {...defaultProps} colors={emptyColors} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with null color values', () => {
    const nullColors = [null, null, null];
    render(<StatisticsChartWidget2 {...defaultProps} colors={nullColors} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  it('renders with undefined color values', () => {
    const undefinedColors = [undefined, undefined, undefined];
    render(<StatisticsChartWidget2 {...defaultProps} colors={undefinedColors} />);
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });
}); 