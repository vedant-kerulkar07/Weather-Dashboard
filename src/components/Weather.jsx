import { useEffect, useRef, useState } from "react";
import "./Weather.css";

import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

import WeatherCharts from "./WeatherCharts";

export const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  const API_KEY = import.meta.env.VITE_APP_ID;

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  
//  Search by City 
  
  const search = async (city) => {
    if (!city) return alert("Enter city name");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: allIcons[data.weather[0].icon] || clear_icon,
      });

      fetchForecastByCity(city);
    } catch (err) {
      console.error(err);
    }
  };

  
//  Forecast by City 
 
  const fetchForecastByCity = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();

      const formatted = data.list.slice(0, 12).map((item) => ({
        time: item.dt_txt.split(" ")[1].slice(0, 5),
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        wind: item.wind.speed,
      }));

      setForecastData(formatted);
    } catch (err) {
      console.error(err);
    }
  };


// Auto Detect Location 
 
  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      search("Pune");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Current weather
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );
          const data = await res.json();

          setWeatherData({
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            temperature: Math.floor(data.main.temp),
            location: data.name,
            icon: allIcons[data.weather[0].icon] || clear_icon,
          });

          // Forecast
          fetchForecastByCoords(latitude, longitude);
        } catch (err) {
          console.error(err);
          search("Pune");
        }
      },
      () => {
        // Permission denied → fallback
        search("Pune");
      }
    );
  };

 
 // Forecast by Coordinates 
 
  const fetchForecastByCoords = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();

      const formatted = data.list.slice(0, 12).map((item) => ({
        time: item.dt_txt.split(" ")[1].slice(0, 5),
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        wind: item.wind.speed,
      }));

      setForecastData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  // On App Load */
  
  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  return (
    <div className="weather">
      {/* Search */}
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search city..." />
        <img
          src={search_icon}
          alt="search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {weatherData && (
        <div className="weather-content">
          {/*  LEFT */}
          <div className="weather-left">
            <img src={weatherData.icon} alt="" className="weather-icon" />
            <h1 className="temperature">{weatherData.temperature}°C</h1>
            <h2 className="location">{weatherData.location}</h2>

            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>

              <div className="col">
                <img src={wind_icon} alt="" />
                <div>
                  <p>{weatherData.windSpeed} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="weather-right">
            {forecastData.length > 0 && (
              <WeatherCharts data={forecastData} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
