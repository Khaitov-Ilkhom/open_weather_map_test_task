const mockData = {
  "london": {  },
  "new york": {},
};

mockData.london = {
  cod: '200',
  list: Array(40).fill(0).map((_, i) => ({
    dt: Date.now() / 1000 + i * 3 * 3600,
    main: {
      temp: 15 + Math.sin(i / 5) * 5,
      feels_like: 14 + Math.sin(i / 5) * 5,
      temp_min: 13 + Math.sin(i / 5) * 5,
      temp_max: 17 + Math.sin(i / 5) * 5,
      humidity: 60 + Math.random() * 20,
    },
    weather: [{
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }],
    wind: { speed: 5 + Math.random() * 5 },
  })),
  city: { name: 'London', country: 'GB' },
};

mockData['new york'] = { ...mockData.london, city: { name: 'New York', country: 'US' }};
mockData['tokyo'] = { ...mockData.london, city: { name: 'Tokyo', country: 'JP' }};
mockData['sydney'] = { ...mockData.london, city: { name: 'Sydney', country: 'AU' }};
mockData['cairo'] = { ...mockData.london, city: { name: 'Cairo', country: 'EG' }};


export const fetchMockWeather = (city) => {
  console.log(`%c[MOCK API] Fetching weather for ${city}`, 'color: orange;');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = mockData[city.toLowerCase()];
      if (data) {
        resolve(data);
      } else {
        reject(new Error(`Mock data for city "${city}" not found.`));
      }
    }, 500);
  });
};