/* Main Application Logic */

document.addEventListener('DOMContentLoaded', () => { initializeApp(); });

async function initializeApp() {
    ui.initTheme();
    displayFavorites();
    setupEventListeners();
    loadDefaultCity();
}

function setupEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', searchWeather);
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
    document.getElementById('geoButton').addEventListener('click', getLocationWeather);
    document.getElementById('themeToggle').addEventListener('click', () => { ui.toggleTheme(); });
    document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
    document.getElementById('forecastBtn').addEventListener('click', loadForecast);
}

async function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        ui.showError('Please enter a city name');
        return;
    }
    ui.showLoading();
    try {
        const weatherData = await weatherService.getWeather(city);
        storage.addRecent(city);
        ui.displayWeather(weatherData);
        await loadForecast();
        displayFavorites();
    } catch (error) {
        ui.showError(`Could not find weather for "${city}". Please check the spelling and try again.`);
    }
}

async function getLocationWeather() {
    if (!navigator.geolocation) {
        ui.showError('Geolocation is not supported by your browser');
        return;
    }
    ui.showLoading();
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const weatherData = await weatherService.getWeatherByCoordinates(latitude, longitude);
                ui.displayWeather(weatherData);
                await loadForecast();
            } catch (error) {
                ui.showError('Could not fetch weather for your location');
            }
        },
        (error) => { ui.showError('Permission denied for geolocation'); }
    );
}

async function loadForecast() {
    if (!ui.currentCity) return;
    try {
        const forecastData = await weatherService.getForecast(ui.currentCity);
        ui.displayForecast(forecastData);
    } catch (error) {
        console.error('Error loading forecast:', error);
    }
}

function toggleFavorite() {
    if (!ui.currentCity) return;
    const isFav = storage.isFavorite(ui.currentCity);
    if (isFav) {
        storage.removeFavorite(ui.currentCity);
    } else {
        storage.addFavorite(ui.currentCity);
    }
    ui.updateFavoriteButton(ui.currentCity);
    displayFavorites();
}

function displayFavorites() {
    const favorites = storage.getFavorites();
    ui.displayFavorites(favorites);
}

function loadDefaultCity() {
    const recent = storage.getRecent();
    if (recent.length > 0) {
        document.getElementById('cityInput').value = recent[0];
        searchWeather();
    } else {
        document.getElementById('cityInput').value = 'London';
        searchWeather();
    }
}

setInterval(() => {
    if (ui.currentCity) searchWeather();
}, 5 * 60 * 1000);