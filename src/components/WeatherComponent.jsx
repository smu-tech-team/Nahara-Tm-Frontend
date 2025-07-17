import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const getWeatherIcon = (code) => {
  const c = parseInt(code);
  if (!c) return "❓";
  if (c < 300) return "⛈️";
  if (c < 600) return "🌧️";
  if (c < 700) return "❄️";
  if (c < 800) return "🌫️";
  if (c === 800) return "☀️";
  if (c < 900) return "☁️";
  return "❓";
};

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("Locating...");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_KEY = "555a700ee3f377657e52d9c114f4a51d";

  useEffect(() => {
    const cachedWeather = localStorage.getItem("weatherData");
    const cachedLocation = localStorage.getItem("locationData");
    const cacheTime = localStorage.getItem("cacheTime");

    if (cachedWeather && cachedLocation && cacheTime && Date.now() - cacheTime < 1800000) {
      setWeather(JSON.parse(cachedWeather));
      setLocation(cachedLocation);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const [locRes, weatherRes] = await Promise.all([
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`),
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
          ]);

          const locData = await locRes.json();
          const data = await weatherRes.json();

          const loc = locData?.address?.state || locData?.address?.city || "Unknown";
          const w = {
            temp: data.main.temp,
            humidity: data.main.humidity,
            wind: data.wind.speed,
            condition: data.weather[0].description,
            code: data.weather[0].id,
          };

          setLocation(loc);
          setWeather(w);
          localStorage.setItem("locationData", loc);
          localStorage.setItem("weatherData", JSON.stringify(w));
          localStorage.setItem("cacheTime", Date.now());
        } catch (err) {
          console.error("Fetch error:", err);
          setLocation("Location unavailable");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocation("Location unavailable");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="backdrop-blur-sm  animate-gradient-flow-x  waether-color text-white p-4 rounded-xl shadow-xl w-full max-w-sm mx-auto mt-6 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-300">{location}</h2>
          {loading ? (
            <p className="text-sm text-gray-400 mt-1">Loading...</p>
          ) : weather ? (
            <>
              <div className="text-3xl mt-1">{getWeatherIcon(weather.code)}</div>
              <p className="text-base font-semibold capitalize mt-1">{weather.condition}, {weather.temp}°C</p>
            </>
          ) : (
            <p className="text-sm text-red-400">Weather unavailable</p>
          )}
        </div>
        <button onClick={() => setShowMore(!showMore)} className="text-gray-300 hover:text-white transition">
          {showMore ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {showMore && weather && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-200">
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌬️ Wind: {weather.wind} m/s</p>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
