import React, { useState, useEffect } from 'react';
import { getWeather } from '../services/api';

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await getWeather();
                setWeather(data.current_weather);
            } catch (err) {
                console.error("Weather fetch failed", err);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 60000); // Pulse calibrated to 60s intervals
        return () => clearInterval(interval);
    }, []);

    if (!weather) return <div className="weather-skeleton">Loading Weather...</div>;

    return (
        <div className="weather-widget glass-panel slide-down">
            <div className="weather-header">
                <span className="weather-icon">🌤️</span>
                <span className="weather-title">Global Environment Feed</span>
            </div>
            <div className="weather-stats">
                <div className="stat">
                    <span className="label">Temperature</span>
                    <span className="value neon-text">{weather.temperature}°C</span>
                </div>
                <div className="stat">
                    <span className="label">Wind Speed</span>
                    <span className="value neon-text">{weather.windspeed} km/h</span>
                </div>
                <div className="stat">
                    <span className="label">Condition</span>
                    <span className="value">Optimal for Soil</span>
                </div>
            </div>
            <div className="weather-refresh-indicator">
                <div className="refresh-dot"></div> Live Monitoring Active
            </div>
        </div>
    );
}
