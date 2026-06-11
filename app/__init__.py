"""Application package initialization."""

from flask import Flask

def init_app():
    """Initialize Flask application."""
    app = Flask(__name__)
    
    return app