"""OpenWeatherMap API integration."""

import requests
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models import Weather, DayForecast, Forecast


class WeatherAPI:
    """Interface for OpenWeatherMap API."""
    
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.openweathermap.org/data/2.5",
        units: str = "metric",
    ):
        """Initialize Weather API client.
        
        Args:
            api_key: OpenWeatherMap API key
            base_url: Base URL for API
            units: Units system (metric, imperial, standard)
        """
        self.api_key = api_key
        self.base_url = base_url
        self.units = units
        self.timeout = 10
    
    def _make_request(
        self, endpoint: str, params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Make HTTP request to API.
        
        Args:
            endpoint: API endpoint
            params: Query parameters
            
        Returns:
            JSON response
            
        Raises:
            requests.RequestException: If request fails
        """
        url = f"{self.base_url}{endpoint}"
        params["appid"] = self.api_key
        params["units"] = self.units
        
        response = requests.get(url, params=params, timeout=self.timeout)
        response.raise_for_status()
        return response.json()
    
    def get_current_weather(self, city: str) -> Optional[Weather]:
        """Get current weather for a city.
        
        Args:
            city: City name
            
        Returns:
            Weather object or None if not found
        """
        try:
            data = self._make_request("/weather", {"q": city})
            
            return Weather(
                city=data["name"],
                country=data["sys"]["country"],
                temperature=data["main"]["temp"],
                feels_like=data["main"]["feels_like"],
                humidity=data["main"]["humidity"],
                pressure=data["main"]["pressure"],
                wind_speed=data["wind"]["speed"],
                wind_deg=data["wind"].get("deg", 0),
                clouds=data["clouds"]["all"],
                description=data["weather"][0]["main"],
                icon=data["weather"][0]["icon"],
                visibility=data.get("visibility", 0),
                sunrise=data["sys"].get("sunrise"),
                sunset=data["sys"].get("sunset"),
                timestamp=datetime.now(),
            )
        except requests.RequestException as e:
            print(f"Error fetching weather: {e}")
            return None
    
    def get_forecast(self, city: str) -> Optional[List[DayForecast]]:
        """Get 5-day forecast for a city.
        
        Args:
            city: City name
            
        Returns:
            List of DayForecast objects
        """
        try:
            data = self._make_request("/forecast", {"q": city, "cnt": 40})
            
            # Group forecasts by day
            daily_forecasts: Dict[str, List[Forecast]] = {}
            
            for item in data["list"]:
                dt = datetime.fromtimestamp(item["dt"])
                date_key = dt.strftime("%Y-%m-%d")
                
                if date_key not in daily_forecasts:
                    daily_forecasts[date_key] = []
                
                forecast = Forecast(
                    timestamp=item["dt"],
                    temperature=item["main"]["temp"],
                    feels_like=item["main"]["feels_like"],
                    humidity=item["main"]["humidity"],
                    pressure=item["main"]["pressure"],
                    wind_speed=item["wind"]["speed"],
                    description=item["weather"][0]["main"],
                    icon=item["weather"][0]["icon"],
                    precipitation=item.get("rain", {}).get("3h", 0),
                )
                daily_forecasts[date_key].append(forecast)
            
            # Create day summaries
            day_forecasts = []
            for date_key, forecasts in sorted(daily_forecasts.items()):
                temps = [f.temperature for f in forecasts]
                day_forecasts.append(
                    DayForecast(
                        date=date_key,
                        temp_max=max(temps),
                        temp_min=min(temps),
                        description=forecasts[0].description,
                        icon=forecasts[0].icon,
                        humidity=sum(f.humidity for f in forecasts) // len(forecasts),
                        wind_speed=sum(f.wind_speed for f in forecasts) / len(forecasts),
                        precipitation=sum(f.precipitation for f in forecasts),
                        forecasts=forecasts,
                    )
                )
            
            return day_forecasts
        except requests.RequestException as e:
            print(f"Error fetching forecast: {e}")
            return None
    
    def get_weather_by_coordinates(
        self, lat: float, lon: float
    ) -> Optional[Weather]:
        """Get current weather by coordinates.
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Weather object
        """
        try:
            data = self._make_request("/weather", {"lat": lat, "lon": lon})
            
            return Weather(
                city=data["name"],
                country=data["sys"]["country"],
                temperature=data["main"]["temp"],
                feels_like=data["main"]["feels_like"],
                humidity=data["main"]["humidity"],
                pressure=data["main"]["pressure"],
                wind_speed=data["wind"]["speed"],
                wind_deg=data["wind"].get("deg", 0),
                clouds=data["clouds"]["all"],
                description=data["weather"][0]["main"],
                icon=data["weather"][0]["icon"],
                visibility=data.get("visibility", 0),
                sunrise=data["sys"].get("sunrise"),
                sunset=data["sys"].get("sunset"),
                timestamp=datetime.now(),
            )
        except requests.RequestException as e:
            print(f"Error fetching weather by coordinates: {e}")
            return None
