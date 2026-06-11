"""Flask routes for Weather Dashboard."""

from flask import Blueprint, render_template, jsonify, request, current_app
from app.weather_api import WeatherAPI

bp = Blueprint("main", __name__)

# Initialize API
weather_api = None


@bp.before_app_request
def init_api():
    """Initialize weather API on first request."""
    global weather_api
    if weather_api is None:
        weather_api = WeatherAPI(
            api_key=current_app.config["OPENWEATHER_API_KEY"],
            base_url=current_app.config["OPENWEATHER_BASE_URL"],
            units=current_app.config["UNITS"],
        )


@bp.route("/")
def index():
    """Render dashboard page."""
    return render_template("index.html")


@bp.route("/api/weather/<city>")
def get_weather(city):
    """Get current weather for a city.
    
    Args:
        city: City name
        
    Returns:
        JSON with weather data
    """
    weather = weather_api.get_current_weather(city)
    
    if not weather:
        return jsonify({"error": "City not found"}), 404
    
    return jsonify(weather.to_dict())


@bp.route("/api/forecast/<city>")
def get_forecast(city):
    """Get 5-day forecast for a city.
    
    Args:
        city: City name
        
    Returns:
        JSON with forecast data
    """
    forecasts = weather_api.get_forecast(city)
    
    if not forecasts:
        return jsonify({"error": "Forecast not found"}), 404
    
    return jsonify([f.to_dict() for f in forecasts])


@bp.route("/api/weather/geo", methods=["GET"])
def get_weather_by_geo():
    """Get weather by coordinates.
    
    Query params:
        lat: Latitude
        lon: Longitude
        
    Returns:
        JSON with weather data
    """
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)
    
    if lat is None or lon is None:
        return jsonify({"error": "Missing coordinates"}), 400
    
    weather = weather_api.get_weather_by_coordinates(lat, lon)
    
    if not weather:
        return jsonify({"error": "Weather not found"}), 404
    
    return jsonify(weather.to_dict())


@bp.route("/api/health")
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok"})
