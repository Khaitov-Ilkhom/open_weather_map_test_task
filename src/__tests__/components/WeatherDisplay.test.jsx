import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WeatherDisplay } from '../../components/AllComponents';

describe('WeatherDisplay Component', () => {
  it('matches snapshot', () => {
    const mockData = {
      temp: 25,
      description: 'sunny',
      icon: '01d',
      humidity: 50,
      city: { name: 'Test City' }
    };
    const { asFragment } = render(<WeatherDisplay data={mockData} units="metric" />);
    expect(asFragment()).toMatchSnapshot();
  });
});