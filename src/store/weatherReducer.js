import {CITIES} from "../constants/index.js";

export const actionTypes = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  CHANGE_CITY: 'CHANGE_CITY',
  TOGGLE_UNIT: 'TOGGLE_UNIT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

export const initialState = {
  isLoading: true,
  error: null,
  city: CITIES[0],
  units: 'metric',
  weatherData: null,
  transformedData: null,
};

export function weatherReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_START:
      return { ...state, isLoading: true, error: null };
    case actionTypes.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        weatherData: action.payload.rawData,
        transformedData: action.payload.transformedData,
      };
    case actionTypes.FETCH_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case actionTypes.CHANGE_CITY:
      return { ...state, city: action.payload };
    case actionTypes.TOGGLE_UNIT:
      { const newUnits = state.units === 'metric' ? 'imperial' : 'metric';
      return { ...state, units: newUnits }; }
    case actionTypes.SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}