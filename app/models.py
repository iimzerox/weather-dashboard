"""Data models for weather information."""

from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any
from datetime import datetime


@dataclass
class Weather:
    """Current weather information."""
    
    city: str
    country: str
    temperature: float
    feels_like: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_deg: int
    clouds: int
    description: str
    icon: str
    visibility: int
    uv_index: Optional[float] = None
    sunrise: Optional[int] = None
    sunset: Optional[int] = None
    timestamp: datetime = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        data = asdict(self)
        data['timestamp'] = self.timestamp.isoformat() if self.timestamp else None
        return data


@dataclass
class Forecast:
    """Weather forecast for a specific time."""
    
    timestamp: int
    temperature: float
    feels_like: float
    humidity: int
    pressure: int
    wind_speed: float
    description: str
    icon: str
    precipitation: float = 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return asdict(self)


@dataclass
class DayForecast:
    """Daily forecast summary."""
    
    date: str
    temp_max: float
    temp_min: float
    description: str
    icon: str
    humidity: int
    wind_speed: float
    precipitation: float
    forecasts: List[Forecast] = None
    
    def __post_init__(self) -> None:
        """Initialize empty forecasts list."""
        if self.forecasts is None:
            self.forecasts = []
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            'date': self.date,
            'temp_max': self.temp_max,
            'temp_min': self.temp_min,
            'description': self.description,
            'icon': self.icon,
            'humidity': self.humidity,
            'wind_speed': self.wind_speed,
            'precipitation': self.precipitation,
            'forecasts': [f.to_dict() for f in self.forecasts]
        }