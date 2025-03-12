document.addEventListener("DOMContentLoaded", function () {
    initDarkMode();
    initEventListeners();
    fetchWeather("Mumbai"); // Default city on load
});

// 🌍 OpenWeather API Details
const apiKey = "953d2721ce581801b172bd212f514a10"; // Replace with a valid API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

// 🔎 Select UI elements correctly
const searchInput = document.querySelector(".search-box");
const locationBtn = document.querySelector(".location-btn");
const cityDisplay = document.getElementById("cityName");
const temperatureDisplay = document.getElementById("temperature");
const conditionDisplay = document.getElementById("weatherCondition");
const humidityDisplay = document.getElementById("humidity");
const windDisplay = document.getElementById("windSpeed");
const pressureDisplay = document.getElementById("pressure");
const sunriseDisplay = document.getElementById("sunrise");
const sunsetDisplay = document.getElementById("sunset");
const forecastContainer = document.getElementById("fiveDayForecast");
const hourlyContainer = document.getElementById("hourlyForecast");

// 🌙 **Dark Mode Functionality**
function initDarkMode() {
    const toggleSwitch = document.getElementById("darkModeToggle");
    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const searchBox = document.querySelector(".search-box");

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        navbar.classList.add("bg-dark");
        searchBox.style.background = "#555";  // Adjust for dark mode
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener("change", function () {
        body.classList.toggle("dark-mode", toggleSwitch.checked);
        navbar.classList.toggle("bg-dark", toggleSwitch.checked);
        searchBox.style.background = toggleSwitch.checked ? "#555" : "#444"; // Adjust search box
        localStorage.setItem("darkMode", toggleSwitch.checked ? "enabled" : "disabled");
    });
}

// 🌤️ **Fetch Weather Data**
async function fetchWeather(city) {
    try {
        console.log(`Fetching: ${apiUrl}${city}&appid=${apiKey}&units=metric`); // Debugging
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error(`City "${city}" not found`);

        const data = await response.json();
        updateWeatherUI(data);
        fetchForecast(city);
    } catch (error) {
        console.error("Weather fetch error:", error);
        alert(error.message);
    }
}

// 📅 **Fetch 5-Day Forecast Data**
async function fetchForecast(city) {
    try {
        const response = await fetch(`${forecastUrl}${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error("Forecast not available");

        const data = await response.json();
        updateForecastUI(data);
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

// 🌡️ **Update Weather UI**
function updateWeatherUI(data) {
    if (!data || !data.main) return;

    cityDisplay.textContent = data.name || "Unknown";
    temperatureDisplay.textContent = `${Math.round(data.main.temp)}°C`;
    conditionDisplay.textContent = data.weather?.[0]?.main || "N/A";
    humidityDisplay.textContent = `${data.main.humidity}%`;
    windDisplay.textContent = `${data.wind.speed} km/h`;
    pressureDisplay.textContent = `${data.main.pressure} hPa`;
    sunriseDisplay.textContent = `Sunrise: ${formatTime(data.sys.sunrise)}`;
    sunsetDisplay.textContent = `Sunset: ${formatTime(data.sys.sunset)}`;
}

// 📊 **Update Forecast UI**
// function updateForecastUI(data) {
//     forecastContainer.innerHTML = "";
//     hourlyContainer.innerHTML = "";

//     if (!data || !data.list) return;

//     const uniqueDays = {};
//     data.list.forEach((item) => {
//         const date = new Date(item.dt * 1000).toDateString();
//         if (!uniqueDays[date]) {
//             uniqueDays[date] = item;
//         }
//     });

//     Object.values(uniqueDays).slice(0, 5).forEach((day) => {
//         forecastContainer.innerHTML += `
//             <div class="forecast-box">
//                 <p>${new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })}</p>
//                 <p>${Math.round(day.main.temp)}°C</p>
//             </div>
//         `;
//     });

//     for (let i = 0; i < 6; i++) {
//         const hour = data.list[i];
//         if (!hour) continue;

//         hourlyContainer.innerHTML += `
//             <div class="hour-box">
//                 <p>${formatTime(hour.dt)}</p>
//                 <p>${Math.round(hour.main.temp)}°C</p>
//             </div>
//         `;
//     }
// }

// 📊 **Update 5-Day Forecast UI**
function updateForecastUI(data) {
    forecastContainer.innerHTML = "";

    if (!data || !data.list) return;

    const uniqueDays = {};
    data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!uniqueDays[date]) {
            uniqueDays[date] = item;
        }
    });

    const weatherIcons = {
        "Clouds": "clouds.png",
        "Drizzle": "drizzle.png",
        "Clear": "clear.png",
        "Mist": "mist.png",
        "Rain": "rain.png"  // If you upload rain.png, replace this path accordingly
    };

    Object.values(uniqueDays).slice(0, 5).forEach((day) => {
        const condition = day.weather[0].main;
        const iconPath = weatherIcons[condition] || "./assets/default.png"; // Use default if not found

        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <img src="${iconPath}" alt="${condition}" class="forecast-icon">
                <span class="forecast-temp">${Math.round(day.main.temp)}°C</span>
                <span class="forecast-date">${new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" })}</span>
            </div>
        `;
    });
}


    Object.values(uniqueDays).slice(0, 5).forEach((day) => {
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        forecastContainer.innerHTML += `
            <div class="forecast-box" style="display: flex; align-items: center; justify-content: space-between;">
                <img src="${iconUrl}" alt="${day.weather[0].description}" style="width: 40px; height: 40px;">
                <p style="margin: 0; font-size: 18px;">${Math.round(day.main.temp)}°C</p>
                <p style="margin: 0; font-size: 14px;">${new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" })}</p>
            </div>
        `;
    });
}


// 📍 **Get User Location**
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    console.log(`Location: ${latitude}, ${longitude}`); // Debugging
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
                    );
                    if (!response.ok) throw new Error("Location weather not available");

                    const data = await response.json();
                    updateWeatherUI(data);
                    fetchForecast(data.name);
                } catch (error) {
                    console.error("Error getting location:", error);
                }
            },
            (error) => console.error("Geolocation error:", error)
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// 🕒 **Format Timestamp to Readable Time**
function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// 🎯 **Initialize Event Listeners**
function initEventListeners() {
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                fetchWeather(searchInput.value.trim());
            }
        });
    }

    if (locationBtn) {
        locationBtn.addEventListener("click", getUserLocation);
    }

    const toggleSwitch = document.getElementById("darkModeToggle");
    if (toggleSwitch) {
        toggleSwitch.addEventListener("change", function () {
            document.body.classList.toggle("dark-mode", toggleSwitch.checked);
            localStorage.setItem("darkMode", toggleSwitch.checked ? "enabled" : "disabled");
        });
    }
}
