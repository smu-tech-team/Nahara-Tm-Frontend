import axios from "axios";
import Image from "./image";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";



const FeaturedPost = () => {
   

    const getWeatherIcon = (weatherCode) => {
        if (!weatherCode) return "❓"; // If undefined, return unknown icon
      
        const weatherIcons = {
          200: "⛈️", // Thunderstorm with light rain
          201: "⛈️", // Thunderstorm with rain
          202: "⛈️", // Thunderstorm with heavy rain
          210: "🌩️", // Light thunderstorm
          211: "🌩️", // Thunderstorm
          212: "🌩️", // Heavy thunderstorm
          221: "🌩️", // Ragged thunderstorm
          230: "⛈️", // Thunderstorm with light drizzle
          231: "⛈️", // Thunderstorm with drizzle
          232: "⛈️", // Thunderstorm with heavy drizzle
      
          300: "🌦️", // Drizzle
          301: "🌦️", // Drizzle rain
          302: "🌦️", // Heavy drizzle
          500: "🌧️", // Light rain
          501: "🌧️", // Moderate rain
          502: "🌧️", // Heavy rain
          503: "🌧️", // Very heavy rain
          504: "🌧️", // Extreme rain
      
          511: "🌨️", // Freezing rain
          520: "🌧️", // Light rain showers
          521: "🌧️", // Rain showers
          522: "🌧️", // Heavy rain showers
      
          600: "❄️", // Light snow
          601: "❄️", // Snow
          602: "❄️", // Heavy snow
          611: "🌨️", // Sleet
          612: "🌨️", // Light shower sleet
          613: "🌨️", // Shower sleet
          615: "🌨️", // Light rain and snow
          616: "🌨️", // Rain and snow
          620: "🌨️", // Light shower snow
          621: "🌨️", // Shower snow
          622: "🌨️", // Heavy shower snow
      
          701: "🌫️", // Mist
          711: "🌫️", // Smoke
          721: "🌫️", // Haze
          731: "🌫️", // Dust
          741: "🌫️", // Fog
          751: "🌫️", // Sand
          761: "🌫️", // Dust
          762: "🌫️", // Volcanic ash
          771: "🌫️", // Squalls
          781: "🌪️", // Tornado
      
          800: "☀️", // Clear sky
          801: "⛅", // Few clouds
          802: "🌥️", // Scattered clouds
          803: "☁️", // Broken clouds
          804: "☁️", // Overcast clouds
        };
      
        return weatherIcons[weatherCode] || "❓"; // Return icon or unknown symbol
      };


       
      
      
      const [subscriptionData, setSubscriptionData] = useState({
        name: "",
        email: "",
        preferences: "",
    });

    const [subscriptionMessage, setSubscriptionMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [weather, setWeather] = useState(null);
    
    const [selectedCountry, setSelectedCountry] = useState("United States");  
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // Controls the popup visibility



    const countryCoordinates = useMemo(
        () => ({
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
        }),
        []
      );

      const API_KEY = "555a700ee3f377657e52d9c114f4a51d"; // Replace with your real API key

      const fetchWeather = useCallback(() => {
        const { lat, lon } = countryCoordinates[selectedCountry];
        setWeatherLoading(true);
      
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error(`API request failed: ${res.status} ${res.statusText}`);
            }
            return res.json();
          })
          .then((data) => {
            if (!data.main || !data.weather) {
              throw new Error("Invalid weather data received.");
            }
      
            setWeather({
              temperature: data.main.temp,
              humidity: data.main.humidity,
              windspeed: data.wind.speed,
              condition: data.weather[0].description,
              weathercode: data.weather[0].id,
            });
          })
          .catch((err) => {
            console.error("Error fetching weather:", err.message);
            setWeather(null); // Reset weather data if fetch fails
          })
          .finally(() => {
            setWeatherLoading(false);
          });
      }, [selectedCountry, countryCoordinates]);
      
      useEffect(() => {
        if (selectedCountry) {
          fetchWeather();
        }
      }, [selectedCountry, fetchWeather]);


const getWeatherAnimation = (weatherCode) => {
  switch (true) {
    case weatherCode >= 200 && weatherCode < 300: // Thunderstorms
      return {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: [0, -5, 0] },
        transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" },
        icon: "⛈️",
      };

    case weatherCode >= 300 && weatherCode < 600: // Rain (Drizzle, Rain)
      return {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: [0, 5, 0] },
        transition: { repeat: Infinity, duration: 1, ease: "easeInOut" },
        icon: "🌧️",
      };

    case weatherCode >= 600 && weatherCode < 700: // Snow
      return {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: [0, 10, 0] },
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        icon: "❄️",
      };

    case weatherCode >= 700 && weatherCode < 800: // Fog, Mist
      return {
        initial: { opacity: 0 },
        animate: { opacity: [0.5, 1, 0.5] },
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        icon: "🌫️",
      };

    case weatherCode === 800: // Clear Sky
      return {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: [1, 1.2, 1], opacity: 1 },
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        icon: "☀️",
      };

    case weatherCode > 800 && weatherCode < 900: // Clouds
      return {
        initial: { x: -10 },
        animate: { x: [0, 10, 0] },
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        icon: "☁️",
      };

    default:
      return { icon: "❓" }; // Unknown
  }
};

const WeatherIcon = ({ weatherCode }) => {
  const { initial, animate, transition, icon } = getWeatherAnimation(weatherCode);

  return (
    <motion.p className="text-3xl" initial={initial} animate={animate} transition={transition}>
      {icon}
    </motion.p>
  );
};

// Inside your JSX (where you display weather)
{weather && weather.weathercode !== undefined ? (
    <WeatherIcon weatherCode={weather.weathercode} />
  ) : (
    <p className="text-gray-300 text-sm">Weather data unavailable.</p>
  )}
    
    
    const fetchPost = async (limit = 4) => {
        const res = await axios.get(`http://localhost:8087/api/post/featured?limit=${limit}`);
        return res.data;
    };
    
    // const subscribeUser = async (data) => {
    //     const res = await axios.post(`http://localhost:8087/api/subscribers/subscribe`, data);
    //     return res.data;
    // };
    const limit = 4; // You can dynamically change this value based on user input or logic
    const { isLoading, error, data } = useQuery({
        queryKey: ["featuredPosts", limit],
        queryFn: () => fetchPost(limit), // Pass limit to fetchPost
    });

   

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
          try {
            const savedEmail = localStorage.getItem("subscribedEmail");
            if (!savedEmail) return;
      
            const response = await axios.get(
              `http://localhost:8087/api/subscribers/status?email=${savedEmail}`
            );
      
            setIsSubscribed(response.data.isSubscribed);
            localStorage.setItem("isSubscribed", JSON.stringify(response.data.isSubscribed));
          } catch (error) {
            console.error("Error fetching subscription status:", error.response?.data || error.message);
          }
        };
      
        fetchSubscriptionStatus();
      }, [isSubscribed]); // Runs when isSubscribed changes
      
    
  // Subscribe handler
  const handleSubscribe = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8087/api/subscribers/subscribe`,
        data
      );
  
      if (response.status === 200) {
        localStorage.setItem("isSubscribed", "true"); // Persist subscription state
        localStorage.setItem("subscribedEmail", data.email); // Persist email
  
        setIsSubscribed(true);
        setSubscriptionData(data); // Update state
        setSubscriptionMessage("Thank you for subscribing!");
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      setSubscriptionMessage("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
    
  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      const savedEmail = localStorage.getItem("subscribedEmail");
      if (!savedEmail) {
        setSubscriptionMessage("No subscribed email found.");
        return;
      }
  
      await axios.delete(`http://localhost:8087/api/subscribers/unsubscribe?email=${savedEmail}`);
  
      localStorage.removeItem("isSubscribed");
      localStorage.removeItem("subscribedEmail");
  
      setIsSubscribed(false);
      setSubscriptionData({ email: "" });
      setSubscriptionMessage("You have successfully unsubscribed.");
    } catch (error) {
      console.error("Unsubscription failed:", error.response ? error.response.data : error.message);
      setSubscriptionMessage("Unsubscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

    if (isLoading) return <div className="text-center text-lg text-gray-500">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>;

    const posts = data || [];

    const localTime = posts[0]?.createdAt ? new Date(posts[0].createdAt).toLocaleString() : "Unknown Date";

    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* LEFT SECTION - Main Featured Post */}
            
            <div className="lg:col-span-2 flex flex-col bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden max-h-[600px]">
            {posts[0]?.img && (
          <img src={posts[0].img} 
          alt={posts[0].title}
           className="w-full h-64 object-cover" />
        )}
<div className="flex flex-col flex-grow p-6">
<div className="flex items-center justify-between text-gray-500 text-sm mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-500">#01</span>
              <Link to="/sports-news" className="text-blue-500 hover:underline">
                {posts[0]?.category}
              </Link>
            </div>
            <span className="text-gray-400">{localTime}</span>
            <span className="text-gray-400 font-bold">{posts[0]?.views}  views</span>

          </div>
          <Link to={posts[0]?.slug} className="block text-2xl font-semibold text-gray-900 dark:text-white hover:text-blue-500 transition">
            {posts[0]?.title}
            {posts[0]?.views}

          </Link>
          <p className="text-gray-700 dark:text-gray-500 mt-3 line-clamp-3">
            {posts[0]?.desc || "Discover more insights in this article."}
          </p>
          <Link to={posts[0]?.slug} className="mt-4 inline-block text-blue-500 hover:text-blue-700 font-medium">
            Read More →
          </Link>
        </div>
      </div>

      {/* NEWSLETTER SECTION */}
  <div className="flex flex-col bg-gray-800 dark:bg-gray-900 shadow-lg rounded-lg p-6 text-white">
  <h3 className="text-xl font-bold text-center mb-4">📩 Stay Updated</h3>
  <p className="text-center text-gray-300 mb-6">
    Subscribe to our newsletter and never miss an update.
  </p>

  {!isSubscribed ? (
    <form onSubmit={(e) => {
     e.preventDefault();
      handleSubscribe(subscriptionData); 
       //Subscription logic 
       setIsSubscribed(true); 
        //Set user as subscribed 
        setSubscriptionMessage("Thank you for subscribing!"); 
        }} 
        className="space-y-4" >
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:text-white dark:bg-gray-700"
          value={subscriptionData.name}
          onChange={(e) =>
            setSubscriptionData({ ...subscriptionData, name: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-black dark:text-white focus:outline-none dark:bg-gray-700"
          value={subscriptionData.email}
          onChange={(e) =>
            setSubscriptionData({ ...subscriptionData, email: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Preferences</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:text-white dark:bg-gray-700"
          placeholder="E.g., Sports, Tech, Business"
          value={subscriptionData.preferences}
          onChange={(e) =>
            setSubscriptionData({
              ...subscriptionData,
              preferences: e.target.value,
            })
          }
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  ) : (
    <>
      <button
        onClick={() => setShowPopup(true)} // Show popup for unsubscribe confirmation
        className="w-full bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition"
        disabled={loading}
      >
        {loading ? "Unsubscribing..." : "Unsubscribe"}
      </button>

      {/* Popup for confirming unsubscription */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Are you sure you want to unsubscribe?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              By unsubscribing, you will no longer receive updates and newsletters from us.
              Stay connected with the latest news by staying subscribed!
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)} // Cancel the popup
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUnsubscribe(); // Call the unsubscribe logic
                  setShowPopup(false); // Close the popup
                  setIsSubscribed(false); // Reset subscription status
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )}

  {subscriptionMessage && (
    <p className="mt-4 text-center text-green-500">{subscriptionMessage}</p>
  )}

      {/* Weather Forecast */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-center ">🌍 Check Your Weather</h4>

        {/* Country Selector */}
        <div className="mt-3">
          <label className="block text-sm  font-medium mb-2">Select Country:</label>
          <select
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:bg-gray-300"
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

        {/* Weather Info */}
       {/* Weather Info */}
        {weatherLoading ? (
        <p className="text-center text-gray-300 mt-3">Fetching weather...</p>
        ) : weather ? (
        <div className="text-center mt-4">
            <p className="text-3xl ">{getWeatherIcon(weather.weathercode)}</p>
            <p className="text-xl font-bold">{weather.temperature}°C</p>
            <p className="text-gray-300 text-sm">Condition: {weather.condition}</p>
            <p className="text-gray-400 text-sm">Humidity: {weather.humidity}%</p>
            <p className="text-gray-400 text-sm">Wind Speed: {weather.windspeed} m/s</p>
        </div>
        ) : (
        <p className="text-center text-gray-300 mt-3">Weather data unavailable.</p>
        )}

      </div>
    </div>

            {/* RIGHT SECTION - Ads */}
            <div className="lg:col-span-1 flex flex-col gap-8">
                <h2 className="text-lg font-bold dark:text-gray-600 text-gray-300">Sponsored Ads</h2>
                
                {/* Ads */}
                {[
                    { img: "SMUADS2.PNG.jpg", text: "Sabipredict is your number one prediction and free prediction site." },
                    { img: "SMUADS.PNG.jpg", text: "Exclusive deals for sports fans!" }
                ].map((ad, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                        <Image src={ad.img} className="w-full h-[180px] rounded-lg object-cover" />
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{ad.text}</p>
                        <Link to="/promo" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
                            {idx === 0 ? "Learn More →" : "Shop Now →"}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedPost;


