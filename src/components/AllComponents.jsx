import React, { useState, useContext, useMemo } from 'react';
import { CITIES } from '../constants';
import { useDebounce } from '../hooks/useDebounce';
import { ThemeContext } from '../context/ThemeContext';
import { toFahrenheit } from '../utils/dataTransformer';
import './Components.css';
import {useWeatherData} from "../hooks/useWeatherData.js";

// --- CitySelector ---
export const CitySelector = ({ selectedCity, onCityChange }) => {
  const [searchTerm,] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredCities = useMemo(() =>
      CITIES.filter(city =>
          city.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ), [debouncedSearchTerm]
  );

  return (
      <div className="city-selector">
        <select value={selectedCity} onChange={(e) => onCityChange(e.target.value)}>
          {filteredCities.length > 0 ? (
              filteredCities.map(city => <option key={city} value={city}>{city}</option>)
          ) : (
              <option disabled>No city found</option>
          )}
        </select>
      </div>
  );
};


// --- WeatherDisplay (Current Weather) ---
export const WeatherDisplay = ({ data, units }) => {
  if (!data) return <div className="weather-card">Loading current weather...</div>;
  const temp = units === 'metric' ? data.temp : toFahrenheit(data.temp);
  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
      <div className="weather-card current-weather">
        <h3>Current Weather in {data.city?.name}</h3>
        <img src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} alt={data.description} />
        <p className="temperature">{temp.toFixed(1)}{tempUnit}</p>
        <p>{data.description}</p>
        <p>Humidity: {data.humidity}%</p>
      </div>
  );
};

// --- ForecastList ---
export const ForecastList = ({ data, units }) => {
  if (!data || data.length === 0) return <div>Loading forecast...</div>;

  return (
      <div className="forecast-list">
        {data.map(day => (
            <ForecastCard key={day.date} day={day} units={units} />
        ))}
      </div>
  );
};

// --- ForecastCard (sub-component) ---
const ForecastCard = ({ day, units }) => {
  const temp = units === 'metric' ? day.avg_temp : toFahrenheit(day.avg_temp);
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const date = new Date(day.date);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
      <div className="weather-card forecast-card">
        <h4>{dayOfWeek}</h4>
        <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.description} />
        <p className="temperature">{temp.toFixed(1)}{tempUnit}</p>
      </div>
  );
};


// --- DataVisualization (SVG Chart) ---
export const DataVisualization = ({ data, units }) => {
  if (!data || data.length === 0) return <div>Loading chart data...</div>;

  const width = 700;
  const height = 300;
  const padding = 50;

  const temps = data.map(d => units === 'metric' ? d.avg_temp : toFahrenheit(d.avg_temp));
  const minTemp = Math.floor(Math.min(...temps) - 2);
  const maxTemp = Math.ceil(Math.max(...temps) + 2);

  const getX = (index) => padding + index * (width - 2 * padding) / (data.length - 1);
  const getY = (temp) => height - padding - ((temp - minTemp) / (maxTemp - minTemp)) * (height - 2 * padding);

  const path = data.map((d, i) => {
    const temp = units === 'metric' ? d.avg_temp : toFahrenheit(d.avg_temp);
    const x = getX(i);
    const y = getY(temp);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
      <div className="data-visualization">
        <h4>5-Day Temperature Forecast ({tempUnit})</h4>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Y Axis Labels */}
          <text x={padding - 10} y={getY(maxTemp) + 5} textAnchor="end">{maxTemp}</text>
          <text x={padding - 10} y={getY(minTemp) + 5} textAnchor="end">{minTemp}</text>
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--text-color)" />

          {/* X Axis Labels */}
          {data.map((d, i) => (
              <text key={d.date} x={getX(i)} y={height - padding + 20} textAnchor="middle">
                {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </text>
          ))}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--text-color)" />

          {/* Chart Line */}
          <path d={path} fill="none" stroke="var(--accent-color)" strokeWidth="3" />

          {/* Data Points */}
          {data.map((d, i) => {
            const temp = units === 'metric' ? d.avg_temp : toFahrenheit(d.avg_temp);
            return <circle key={d.date} cx={getX(i)} cy={getY(temp)} r="5" fill="var(--accent-color)" />;
          })}
        </svg>
      </div>
  );
};


// --- SettingsPanel ---
export const ThemeUnitSwitch = ({units, onUnitToggle, isDarkMode, onThemeToggle}) => {
  return (
      <div className="settings-panel">
        <div className="setting-item">
          <label className="switch">
            <input type="checkbox" onChange={onUnitToggle} checked={units === "imperial"} />
            <span className="slider round">
            <span className="label left">°C</span>
            <span className="label right">°F</span>
          </span>
          </label>
        </div>
        <div className="setting-item">
          <label className="switch">
            <input type="checkbox" onChange={onThemeToggle} checked={isDarkMode} />
            <span className="slider round">
            <span className="icon sun">☀️</span>
            <span className="icon moon">🌙</span>
          </span>
          </label>
        </div>
      </div>
  );
};

// --- WeatherWidget (Main Container) ---
export const WeatherWidget = () => {
  const { state, changeCity, toggleUnit } = useWeatherData();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('current'); // 'current', 'forecast', 'stats'
  const [isFading, setIsFading] = useState(false);

  const handleCityChange = (newCity) => {
    setIsFading(true);
    setTimeout(() => {
      changeCity(newCity);
      setIsFading(false);
    }, 300);
  };

  const renderContent = () => {
    if (state.isLoading) return <div className="loader">Loading...</div>;
    if (state.error) return <div className="error-message">Error: {state.error}</div>;
    if (!state.transformedData) return null;

    switch(activeTab) {
      case 'forecast':
        return <ForecastList data={state.transformedData.forecast} units={state.units} />;
      case 'stats':
        return <DataVisualization data={state.transformedData.forecast} units={state.units} />;
      case 'current':
      default:
        return <WeatherDisplay data={{...state.transformedData.current, city: state.transformedData.city}} units={state.units} />;
    }
  };

  return (
      <div className={`weather-widget ${theme}`}>
        <header>
          <h1>Weather Dashboard</h1>
          <ThemeUnitSwitch
              units={state.units}
              onUnitToggle={toggleUnit}
              isDarkMode={theme === "dark"}
              onThemeToggle={toggleTheme}
          />
        </header>

        <CitySelector selectedCity={state.city} onCityChange={handleCityChange} />

        <nav className="tabs">
          <button className={activeTab === 'current' ? 'active' : ''} onClick={() => setActiveTab('current')}>Current Weather</button>
          <button className={activeTab === 'forecast' ? 'active' : ''} onClick={() => setActiveTab('forecast')}>Forecast</button>
          <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>Statistics</button>
        </nav>

        <main className={`content ${isFading ? 'fading' : ''}`}>
          {renderContent()}
        </main>
      </div>
  );
};