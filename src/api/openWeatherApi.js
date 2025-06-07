import {API_ENDPOINT} from '../constants';

const API_KEY = import.meta.env.VITE_OWM_API_KEY;

if (!API_KEY) {
  console.error("OpenWeatherMap API key not found. Please set VITE_OWM_API_KEY in your .env file.");
}

export const fetchRealWeather = async (city, units = 'metric') => {
  const url = `${API_ENDPOINT}?q=${city}&appid=${API_KEY}&units=${units}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error: ${response.status}`);
  }

  return response.json();
};