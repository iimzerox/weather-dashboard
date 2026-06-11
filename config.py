"""Configuration settings for Weather Dashboard."""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration."""
    
    # Flask settings
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    DEBUG = os.getenv("FLASK_ENV") == "development"
    
    # API settings
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
    OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"
    
    # Weather settings
    UNITS = os.getenv("UNITS", "metric")  # metric, imperial, standard
    LANGUAGE = os.getenv("LANG", "en")
    
    # Cache settings
    CACHE_TIMEOUT = 600  # 10 minutes
    
    # Validation
    if not OPENWEATHER_API_KEY:
        raise ValueError("OPENWEATHER_API_KEY not found in environment variables")
