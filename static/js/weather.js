/* Weather API Management */

class WeatherService {
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;
    }

    async getWeather(city) {
        try {
            const response = await fetch(`${this.baseUrl}/weather/${encodeURIComponent(city)}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    }

    async getForecast(city) {
        try {
            const response = await fetch(`${this.baseUrl}/forecast/${encodeURIComponent(city)}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw error;
        }
    }

    async getWeatherByCoordinates(lat, lon) {
        try {
            const response = await fetch(`${this.baseUrl}/weather/geo?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather by coordinates:', error);
            throw error;
        }
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': '☀️', '01n': '🌙',
            '02d': '🌤️', '02n': '🌤️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return iconMap[iconCode] || '🌡️';
    }

    getWeatherUrl(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    }

    formatTemperature(temp) { return Math.round(temp); }
    formatWindSpeed(speed) { return Math.round(speed * 10) / 10; }
    formatVisibility(visibility) { return (visibility / 1000).toFixed(1); }
    formatTime(timestamp) { const date = new Date(timestamp * 1000); return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }
    formatDate(dateString) { const date = new Date(dateString); return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
}

const weatherService = new WeatherService();