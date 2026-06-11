"""Weather Dashboard - Flask Application"""

from flask import Flask
from config import Config

def create_app():
    """Application factory function."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Register blueprints
    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Not found"}, 404
    
    @app.errorhandler(500)
    def server_error(e):
        return {"error": "Server error"}, 500
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)