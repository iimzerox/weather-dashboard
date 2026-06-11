/* UI Management */

class UIManager {
    constructor() {
        this.currentCity = null;
        this.currentWeather = null;
        this.currentForecast = null;
    }

    show(element) {
        if (typeof element === 'string') element = document.getElementById(element);
        element.classList.remove('hidden');
    }

    hide(element) {
        if (typeof element === 'string') element = document.getElementById(element);
        element.classList.add('hidden');
    }

    showLoading() {
        this.show('loading');
        this.hide('currentWeather');
        this.hide('forecastSection');
        this.hide('error');
    }

    hideLoading() { this.hide('loading'); }

    showError(message) {
        const errorEl = document.getElementById('error');
        errorEl.textContent = message;
        this.show('error');
        this.hide('currentWeather');
        this.hide('forecastSection');
        this.hide('loading');
    }

    hideError() { this.hide('error'); }

    displayWeather(weatherData) {
        this.currentCity = weatherData.city;
        this.currentWeather = weatherData;
        document.getElementById('cityName').textContent = `${weatherData.city}, ${weatherData.country}`;
        document.getElementById('weatherDesc').textContent = weatherData.description;
        document.getElementById('temperature').textContent = weatherService.formatTemperature(weatherData.temperature);
        document.getElementById('feelsLike').textContent = weatherService.formatTemperature(weatherData.feels_like);
        const iconEl = document.getElementById('weatherIcon');
        iconEl.src = weatherService.getWeatherUrl(weatherData.icon);
        iconEl.alt = weatherData.description;
        document.getElementById('humidity').textContent = `${weatherData.humidity}%`;
        document.getElementById('windSpeed').textContent = `${weatherService.formatWindSpeed(weatherData.wind_speed)} m/s`;
        document.getElementById('pressure').textContent = `${weatherData.pressure} mb`;
        document.getElementById('visibility').textContent = `${weatherService.formatVisibility(weatherData.visibility)} km`;
        document.getElementById('clouds').textContent = `${weatherData.clouds}%`;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('lastUpdate').textContent = timeStr;
        this.updateFavoriteButton(weatherData.city);
        this.show('currentWeather');
        this.hideError();
        this.hideLoading();
    }

    displayForecast(forecastData) {
        this.currentForecast = forecastData;
        const container = document.getElementById('forecastContainer');
        container.innerHTML = '';
        forecastData.forEach(day => {
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `<div class="forecast-date">${weatherService.formatDate(day.date)}</div><div class="forecast-icon">${weatherService.getWeatherIcon(day.icon)}</div><div class="forecast-desc">${day.description}</div><div class="forecast-temps"><div class="temp-range"><div class="temp-max">${weatherService.formatTemperature(day.temp_max)}°</div><div class="temp-min">${weatherService.formatTemperature(day.temp_min)}°</div></div></div><div class="forecast-details"><div>💧 ${day.humidity}%</div><div>💨 ${weatherService.formatWindSpeed(day.wind_speed)}</div></div>`;
            card.addEventListener('click', () => this.showDayDetails(day));
            container.appendChild(card);
        });
        this.show('forecastSection');
    }

    displayFavorites(favorites) {
        const container = document.getElementById('favoritesList');
        container.innerHTML = '';
        if (favorites.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No favorites yet. Add one!</p>';
            return;
        }
        favorites.forEach(city => {
            const item = document.createElement('div');
            item.className = 'favorite-item';
            item.innerHTML = `<button class="favorite-remove" data-city="${city}" title="Remove">×</button><div class="favorite-name">${city}</div><div class="favorite-icon">⭐</div><div class="favorite-desc">Click to view</div>`;
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favorite-remove')) {
                    document.getElementById('cityInput').value = city;
                    this.searchWeather();
                }
            });
            const removeBtn = item.querySelector('.favorite-remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                storage.removeFavorite(city);
                this.displayFavorites(storage.getFavorites());
            });
            container.appendChild(item);
        });
        this.show('favoritesSection');
    }

    updateFavoriteButton(city) {
        const btn = document.getElementById('favoriteBtn');
        if (storage.isFavorite(city)) {
            btn.textContent = '⭐ Remove from Favorites';
        } else {
            btn.textContent = '⭐ Add to Favorites';
        }
    }

    showDayDetails(day) { console.log('Day details:', day); }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        storage.setTheme(isDark);
        const btn = document.getElementById('themeToggle');
        btn.textContent = isDark ? '☀️' : '🌙';
    }

    initTheme() {
        const isDark = storage.getTheme() === 'dark';
        if (isDark) {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').textContent = '☀️';
        }
    }
}

const ui = new UIManager();