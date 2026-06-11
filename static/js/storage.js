/* Local Storage Management */

class StorageManager {
    constructor() {
        this.favoritesKey = 'weather_favorites';
        this.themeKey = 'weather_theme';
        this.recentKey = 'weather_recent';
    }

    addFavorite(city) {
        const favorites = this.getFavorites();
        if (!favorites.includes(city)) {
            favorites.push(city);
            localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
            return true;
        }
        return false;
    }

    removeFavorite(city) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(c => c !== city);
        localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    }

    getFavorites() {
        const data = localStorage.getItem(this.favoritesKey);
        return data ? JSON.parse(data) : [];
    }

    isFavorite(city) {
        return this.getFavorites().includes(city);
    }

    setTheme(isDark) {
        localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    }

    getTheme() {
        return localStorage.getItem(this.themeKey) || 'light';
    }

    addRecent(city) {
        let recent = this.getRecent();
        recent = recent.filter(c => c !== city);
        recent.unshift(city);
        if (recent.length > 5) recent.pop();
        localStorage.setItem(this.recentKey, JSON.stringify(recent));
    }

    getRecent() {
        const data = localStorage.getItem(this.recentKey);
        return data ? JSON.parse(data) : [];
    }
}

const storage = new StorageManager();