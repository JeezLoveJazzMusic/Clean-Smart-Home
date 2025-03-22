import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./weather.module.css";
import clearDay from "../../assets/Weather icons/wi-day-sunny.svg";
import clearNight from "../../assets/Weather icons/wi-night-clear.svg";
import cloudyDay from "../../assets/Weather icons/wi-day-cloudy.svg";
import cloudyNight from "../../assets/Weather icons/wi-night-alt-cloudy.svg";
import partlyCloudyDay from "../../assets/Weather icons/wi-day-cloudy-high.svg";
import partlyCloudyNight from "../../assets/Weather icons/wi-night-alt-partly-cloudy.svg";
import rainyDay from "../../assets/Weather icons/wi-day-rain.svg";
import rainyNight from "../../assets/Weather icons/wi-night-alt-rain.svg";
import { useNavigate } from 'react-router-dom';

const Weather = () => {
    const navigate = useNavigate();
    const currentWeather = {
        time: new Date().toLocaleTimeString(),
        windSpeed: '15 km/h',
        temperature: '22°C',
        description: 'Sunny',
        weather: 'clear-day'
    };

    const [startIndex, setStartIndex] = useState(0);
    // Set forecastPerPage based on window width: 1 for mobile, 6 for desktop.
    const [forecastPerPage, setForecastPerPage] = useState(window.innerWidth < 600 ? 1 : 6);
    const [forecast, setForecast] = useState(null);
    const [location, setLocation] = useState('Malaysia');

    useEffect(() => {
        const handleResize = () => {
            setForecastPerPage(window.innerWidth < 600 ? 1 : 6);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const latitude = 3.1319;
        const longitude = 101.6841;
        const today = new Date().toISOString().split('T')[0];
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m,cloud_cover&start_date=${today}&end_date=${today}&timezone=auto`;
        axios.get(url)
            .then(response => {
                const data = response.data;
                setForecast(data.hourly);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error.message);
            });
    }, []);

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const modifier = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${modifier}`;
    };

    const getHour = (timeString) => {
        const [time, modifier] = timeString.split(" ");
        let [hours] = time.split(":");
        hours = parseInt(hours, 10);
        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }
        return hours;
    };

    const mapWeatherCode = (code) => {
        if (code === 2 || code === 3) return "Clear";
        if (code === 80) return "Partly Cloudy";
        if (code === 61) return "Rain";
        return "Clear";
    };

    const getWeatherIcon = (item) => {
        const desc = item.description.toLowerCase();
        const hour = getHour(item.time);
        const isDay = hour >= 7 && hour < 19;
        if (desc.includes("clear") || desc.includes("sunny")) {
            return isDay ? clearDay : clearNight;
        }
        if (desc.includes("partly cloudy")) {
            return isDay ? partlyCloudyDay : partlyCloudyNight;
        }
        if (desc.includes("cloudy")) {
            return isDay ? cloudyDay : cloudyNight;
        }
        if (desc.includes("rain")) {
            return isDay ? rainyDay : rainyNight;
        }
        return clearDay;
    };

    const forecastData = forecast 
        ? forecast.time.map((timeStr, index) => ({
            time: formatTime(timeStr),
            temperature: forecast.temperature_2m[index] + " °C",
            windSpeed: forecast.wind_speed_10m[index] + " km/h",
            humidity: forecast.relative_humidity_2m[index] + " %",
            precipitation: forecast.precipitation_probability[index] + " %",
            description: mapWeatherCode(forecast.weather_code[index])
        }))
        : [];

    const visibleForecast = forecastData.slice(startIndex, startIndex + forecastPerPage);

    const handleNext = () => {
        if (startIndex + forecastPerPage < forecastData.length) {
            setStartIndex(prev => Math.min(prev + forecastPerPage, forecastData.length - forecastPerPage));
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(prev => Math.max(prev - forecastPerPage, 0));
        }
    };

    return (
        <div className={styles["main-container"]}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    padding: "10px 15px",
                    fontSize: "14px",
                    backgroundColor: "#f87171",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 10, // Ensures the button stays on top
                }}
            >
                ⬅ Back
            </button>
            <h1>Today's Weather Report</h1>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Status:</strong> {currentWeather.description}</p>
            <p><strong>Time:</strong> {currentWeather.time}</p>
            <p><strong>Wind Speed:</strong> {currentWeather.windSpeed}</p>
            <p><strong>Outside Temperature:</strong> {currentWeather.temperature}</p>
            <div className={styles.forecastContainer}>
                <button className={`${styles.navButton} ${styles.prev}`} onClick={handlePrev}>‹</button>
                {visibleForecast.map((item, index) => (
                    <div key={index} className={styles.forecastColumn}>
                        <img src={getWeatherIcon(item)} alt={item.description} className={styles["weather-Icon"]} />
                        <p className={styles.time}><strong>{item.time}</strong></p>
                        <p>{item.description}</p>
                        <p>{item.temperature}</p>
                        <p><strong>Wind Speed:</strong> {item.windSpeed}</p>
                        <p><strong>Humidity:</strong> {item.humidity}</p>
                        <p><strong>Precipitation:</strong> {item.precipitation}</p>
                    </div>
                ))}
                <button className={`${styles.navButton} ${styles.next}`} onClick={handleNext}>›</button>
            </div>
        </div>
    );
};

export default Weather;