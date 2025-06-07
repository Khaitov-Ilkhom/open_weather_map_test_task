import { useReducer, useEffect, useCallback } from 'react';
import { weatherReducer, initialState, actionTypes } from '../store/weatherReducer';
import { transformWeatherData } from '../utils/dataTransformer';
import { throttle } from '../utils/throttle';
import { fetchRealWeather } from '../api/openWeatherApi';
import { fetchMockWeather } from '../api/mockWeatherApi';

const API_MODE = 'real';

const throttledFetch = throttle(API_MODE === 'real' ? fetchRealWeather : fetchMockWeather, 5000);

export const useWeatherData = () => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const fetchData = useCallback(async (city, units) => {
    dispatch({ type: actionTypes.FETCH_START });
    try {
      const rawData = await throttledFetch(city, units);
      if (rawData) {
        const transformedData = transformWeatherData(rawData);
        dispatch({
          type: actionTypes.FETCH_SUCCESS,
          payload: { rawData, transformedData },
        });
      }
    } catch (error) {
      dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
    }
  }, []);

  useEffect(() => {
    if (state.city) {
      fetchData(state.city, state.units);
    }
  }, [state.city, state.units, fetchData]);

  const changeCity = (newCity) => {
    if (newCity && newCity !== state.city) {
      dispatch({ type: actionTypes.CHANGE_CITY, payload: newCity });
    }
  };

  const toggleUnit = () => {
    dispatch({ type: actionTypes.TOGGLE_UNIT });
  };

  return { state, changeCity, toggleUnit };
};