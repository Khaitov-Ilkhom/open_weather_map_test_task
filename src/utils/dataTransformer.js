export const toFahrenheit = (celsius) => (celsius * 9/5) + 32;

export const toCelsius = (fahrenheit) => (fahrenheit - 32) * 5/9;


export const transformWeatherData = (data) => {
  if (!data || !data.list) {
    return {
      current: null,
      forecast: [],
      stats: { min: null, max: null, avg: null },
    };
  }

  const current = {
    temp: data.list[0].main.temp,
    feels_like: data.list[0].main.feels_like,
    humidity: data.list[0].main.humidity,
    description: data.list[0].weather[0].description,
    icon: data.list[0].weather[0].icon,
    wind_speed: data.list[0].wind.speed,
  };

  const dailyData = data.list.reduce((acc, reading) => {
    const date = new Date(reading.dt * 1000).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reading);
    return acc;
  }, {});

  const forecast = Object.keys(dailyData).slice(0, 5).map(date => {
    const dayReadings = dailyData[date];
    const avgTemp = dayReadings.reduce((sum, r) => sum + r.main.temp, 0) / dayReadings.length;
    const avgHumidity = dayReadings.reduce((sum, r) => sum + r.main.humidity, 0) / dayReadings.length;

    const icons = dayReadings.map(r => r.weather[0].icon);
    const mostCommonIcon = icons.sort((a,b) => icons.filter(v => v===a).length - icons.filter(v => v===b).length).pop();

    return {
      date,
      avg_temp: avgTemp,
      avg_humidity: avgHumidity,
      description: dayReadings[0].weather[0].description, // Simplification
      icon: mostCommonIcon,
    };
  });

  const allTemps = data.list.map(r => r.main.temp);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const avgTemp = allTemps.reduce((sum, t) => sum + t, 0) / allTemps.length;

  const stats = {
    min: minTemp,
    max: maxTemp,
    avg: avgTemp,
  };

  return { current, forecast, stats, city: data.city };
};