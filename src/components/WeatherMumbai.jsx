import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherMumbai = () => {
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=19.0728&longitude=72.8826&hourly=temperature_2m,rain,showers&forecast_days=1&timezone=Asia/Kolkata`
        );
        const hourly = response.data.hourly;
        const times = hourly.time;
        const temps = hourly.temperature_2m;
        const rains = hourly.rain;
        const showers = hourly.showers;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const currentTimeString = `${year}-${month}-${day}T${hour}:00`;

        const idx = times.indexOf(currentTimeString);
        if (idx !== -1) {
          setWeatherInfo({
            time: times[idx],
            temperature: temps[idx],
            rain: rains[idx],
            showers: showers[idx],
          });
        }
      } catch (err) {
        console.error("Error fetching weather data:", err);
      }
    };

    fetchWeatherData();
  }, []);

  if (!weatherInfo) return (
    <div style={{
      textAlign: "center",
      padding: "40px",
      color: "rgba(255,255,255,0.5)",
      background: "rgba(255,255,255,0.05)",
      borderRadius: "16px",
      border: "1px solid rgba(0,245,212,0.15)",
    }}>
      <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
      Loading weather data...
    </div>
  );

  const { time, temperature, rain, showers } = weatherInfo;

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return { from: "#ff4d6d", to: "#ff6b35" };
    if (temp >= 28) return { from: "#ffa500", to: "#ffd166" };
    return { from: "#00f5d4", to: "#00b4d8" };
  };

  const tempColors = getTemperatureColor(temperature);

  const cards = [
    {
      icon: "🌡️",
      label: "Temperature",
      value: `${temperature}°C`,
      sub: temperature >= 35 ? "Very Hot" : temperature >= 28 ? "Warm" : "Pleasant",
      color: tempColors.from,
      gradient: `linear-gradient(135deg, ${tempColors.from}20, ${tempColors.to}10)`,
      border: `${tempColors.from}40`,
    },
    {
      icon: "🌧️",
      label: "Rainfall",
      value: `${rain} mm`,
      sub: rain > 5 ? "Heavy Rain" : rain > 0 ? "Light Rain" : "No Rain",
      color: "#4fc3f7",
      gradient: "linear-gradient(135deg, #4fc3f720, #0288d110)",
      border: "#4fc3f740",
    },
    {
      icon: "🌦️",
      label: "Showers",
      value: `${showers} mm`,
      sub: showers > 5 ? "Heavy Showers" : showers > 0 ? "Light Showers" : "No Showers",
      color: "#ce93d8",
      gradient: "linear-gradient(135deg, #ce93d820, #ab47bc10)",
      border: "#ce93d840",
    },
  ];

  return (
    <section style={{
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      border: "1px solid rgba(0,245,212,0.2)",
      padding: "32px 24px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{
          fontSize: "1.4rem",
          fontWeight: "800",
          background: "linear-gradient(90deg, #00f5d4, #00b4d8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "6px",
        }}>🌤 Mumbai Weather — Live</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem" }}>
          Updated at {new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
        {/* Live dot */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "8px" }}>
          <span style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "#00f5d4",
            boxShadow: "0 0 8px #00f5d4",
            display: "inline-block",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ color: "#00f5d4", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.08em" }}>LIVE DATA</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: "flex",
        gap: "16px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            flex: "1",
            minWidth: "150px",
            maxWidth: "220px",
            background: card.gradient,
            border: `1px solid ${card.border}`,
            borderRadius: "16px",
            padding: "24px 16px",
            textAlign: "center",
            transition: "transform 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{card.icon}</div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
              {card.label}
            </p>
            <p style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: card.color,
              lineHeight: 1,
              marginBottom: "6px",
            }}>{card.value}</p>
            <span style={{
              background: `${card.color}20`,
              border: `1px solid ${card.color}40`,
              color: card.color,
              fontSize: "0.72rem",
              padding: "2px 10px",
              borderRadius: "50px",
              fontWeight: "600",
            }}>{card.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeatherMumbai;
