import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

const getWeatherIcon = (weatherCode) => {
  if (!weatherCode) return "❓";
  const weatherIcons = {
    200: "⛈️", 201: "⛈️", 202: "⛈️", 210: "🌩️", 211: "🌩️", 212: "🌩️",
    221: "🌩️", 230: "⛈️", 231: "⛈️", 232: "⛈️", 300: "🌦️", 301: "🌦️",
    302: "🌦️", 500: "🌧️", 501: "🌧️", 502: "🌧️", 503: "🌧️", 504: "🌧️",
    511: "🌨️", 520: "🌧️", 521: "🌧️", 522: "🌧️", 600: "❄️", 601: "❄️",
    602: "❄️", 611: "🌨️", 612: "🌨️", 613: "🌨️", 615: "🌨️", 616: "🌨️",
    620: "🌨️", 621: "🌨️", 622: "🌨️", 701: "🌫️", 711: "🌫️", 721: "🌫️",
    731: "🌫️", 741: "🌫️", 751: "🌫️", 761: "🌫️", 762: "🌫️", 771: "🌫️",
    781: "🌪️", 800: "☀️", 801: "⛅", 802: "🌥️", 803: "☁️", 804: "☁️"
  };
  return weatherIcons[weatherCode] || "❓";
};
const getWeatherAnimation = (weatherCode) => {
  switch (true) {
    case weatherCode >= 200 && weatherCode < 300:
      return { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: [0, -5, 0] }, transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" }, icon: "⛈️" };
    case weatherCode >= 300 && weatherCode < 600:
      return { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: [0, 5, 0] }, transition: { repeat: Infinity, duration: 1, ease: "easeInOut" }, icon: "🌧️" };
    case weatherCode >= 600 && weatherCode < 700:
      return { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: [0, 10, 0] }, transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }, icon: "❄️" };
    case weatherCode >= 700 && weatherCode < 800:
      return { initial: { opacity: 0 }, animate: { opacity: [0.5, 1, 0.5] }, transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }, icon: "🌫️" };
    case weatherCode === 800:
      return { initial: { scale: 0.5, opacity: 0 }, animate: { scale: [1, 1.2, 1], opacity: 1 }, transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }, icon: "☀️" };
    case weatherCode > 800 && weatherCode < 900:
      return { initial: { x: -10 }, animate: { x: [0, 10, 0] }, transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }, icon: "☁️" };
    default:
      return { icon: "❓" };
  }
};

// WeatherIcon component for rendering animated weather icons
const WeatherIcon = ({ weatherCode }) => {
  const { initial, animate, transition, icon } = getWeatherAnimation(weatherCode);
  return (
    <motion.p className="text-5xl sm:text-4xl mb-2" initial={initial} animate={animate} transition={transition}>
      {icon}
    </motion.p>
  );
};

// Main WeatherCard component
const WeatherCard = () => {
  const [selectedCountry, setSelectedCountry] = useState("Nigeria");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const countryCoordinates = useMemo(() => ({
    "United States": { lat: 37.7749, lon: -122.4194 },
    "United Kingdom": { lat: 51.5074, lon: -0.1278 },
    Canada: { lat: 45.4215, lon: -75.6972 },
    Australia: { lat: -33.8688, lon: 151.2093 },
    Germany: { lat: 52.5200, lon: 13.4050 },
    France: { lat: 48.8566, lon: 2.3522 },
    Nigeria: { lat: 6.5244, lon: 3.3792 },
    India: { lat: 28.6139, lon: 77.2090 },
    Japan: { lat: 35.6895, lon: 139.6917 },
    Brazil: { lat: -23.5505, lon: -46.6333 },
  }), []);

  const API_KEY = "555a700ee3f377657e52d9c114f4a51d";

  const fetchWeather = useCallback(() => {
    const { lat, lon } = countryCoordinates[selectedCountry];
    setWeatherLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data.main || !data.weather) throw new Error("Invalid weather data");
        setWeather({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windspeed: data.wind.speed,
          condition: data.weather[0].description,
          weathercode: data.weather[0].id,
        });
      })
      .catch((err) => {
        console.error("Weather fetch error:", err.message);
        setWeather(null);
      })
      .finally(() => setWeatherLoading(false));
  }, [selectedCountry, countryCoordinates]);

  useEffect(() => {
    if (selectedCountry) fetchWeather();
  }, [selectedCountry, fetchWeather]);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl shadow-md max-w-md mx-auto mt-8 sm:mt-4 sm:p-6">
      <h4 className="text-lg font-semibold text-center">🌍 Check Your Weather</h4>
      <div className="mt-3">
        <label className="block text-sm font-medium mb-2">Select Country:</label>
        <select
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-800 focus:outline-none text-black dark:bg-gray-300"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {Object.keys(countryCoordinates).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {weatherLoading ? (
        <p className="text-center text-gray-300 mt-4">Fetching weather...</p>
      ) : weather ? (
        <div className="text-center mt-4">
          <WeatherIcon weatherCode={weather.weathercode} />
          <p className="text-xl sm:text-lg font-bold">{weather.temperature}°C</p>
          <p className="text-gray-300 text-sm">Condition: {weather.condition}</p>
          <p className="text-gray-400 text-sm">Humidity: {weather.humidity}%</p>
          <p className="text-gray-400 text-sm">Wind Speed: {weather.windspeed} m/s</p>
        </div>
      ) : (
        <p className="text-center text-gray-300 mt-4">Weather data unavailable.</p>
      )}
    </div>
  );
};

export default WeatherCard;
