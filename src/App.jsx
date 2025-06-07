import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import { WeatherWidget } from './components/AllComponents';

function App() {
  return (
      <ThemeProvider>
        <ErrorBoundary>
          <WeatherWidget />
        </ErrorBoundary>
      </ThemeProvider>
  );
}

export default App;