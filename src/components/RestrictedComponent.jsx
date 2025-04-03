import React, { useState, useEffect } from "react";

const LocationDisplay = () => {
  const [location, setLocation] = useState({ country: "Unknown", state: "Unknown" });
  const [isAllowed, setIsAllowed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Fetch user IP & region info
        const ipResponse = await fetch("https://ipinfo.io/json?token=302a6f025bd996");
        const ipData = await ipResponse.json();
        const userIP = ipData.ip || "127.0.0.1"; // Fallback for local testing

        console.log("Detected IP:", userIP);

        // Call backend API with IP
        const response = await fetch(`http://localhost:8087/api/geo/location?ip=${userIP}`);

        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }

        const data = await response.json();
        
        if (!data.country) {
          throw new Error("Invalid response received");
        }

        setLocation({ country: data.country || "Unknown", state: data.state || data.region || "Unknown" });
        setIsAllowed(data.allowed ?? true);
      } catch (error) {
        console.error("Error fetching location:", error);
        setError("Unable to fetch location data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="text-center p-4">
      {loading ? (
        <p className="text-blue-500">Fetching location...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : isAllowed ? (
        <p>
          <span className="font-bold text-gray-500">Your location :</span> <span className="font-bold"> {location.state},   {location.country} </span>
        </p>
      ) : (
        <div className="text-red-600 font-bold">
          Access from <span className="underline">{location.country}</span> is restricted.
        </div>
      )}
    </div>
  );
};

export default LocationDisplay;
