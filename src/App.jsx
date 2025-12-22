import bgImage from "./assets/weather-bg.jpg";
import "./App.css";
import { useState } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;

    try {
      setError("");
      setLoading(true);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${API_KEY}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setWeather(data);
    } catch {
      setWeather(null);
      setError("City not found");
    } finally {
      setLoading(false);
    }
  };

  const getOverlay = () => {
    if (!weather) return "rgba(0,0,0,0.30)";

    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("clear")) return "rgba(255,183,77,0.45)";
    if (condition.includes("cloud")) return "rgba(100,181,246,0.45)";
    if (condition.includes("rain")) return "rgba(79,195,247,0.45)";

    return "rgba(0,0,0,0.55)";
  };

  return (
    <div
  className="app"
  style={{
    backgroundImage: `
      linear-gradient(${getOverlay()}, rgba(0,0,0,0.7)),
      url(${bgImage})
    `,
  }}
>

      <div className="card">
        <h1>Weather</h1>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />

          <button onClick={fetchWeather} disabled={loading}>
            {loading ? "..." : "Get"}
          </button>
        </div>

        <div className="status">
          {error && <div className="error">{error}</div>}
        </div>

        {weather && (
          <div className="weather-card">
            <div className="weather-hero">
              <h2>{weather.name}</h2>
              <div className="temp">{Math.round(weather.main.temp)}°</div>
              <div className="condition">
                {weather.weather[0].main}
              </div>
            </div>

            <div className="weather-details">
              <div className="weather-box">
                <span>Humidity</span>
                <strong>{weather.main.humidity}%</strong>
              </div>

              <div className="weather-box">
                <span>Feels Like</span>
                <strong>{Math.round(weather.main.feels_like)}°C</strong>
              </div>

              <div className="weather-box">
                <span>Min Temp</span>
                <strong>{Math.round(weather.main.temp_min)}°C</strong>
              </div>

              <div className="weather-box">
                <span>Max Temp</span>
                <strong>{Math.round(weather.main.temp_max)}°C</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
