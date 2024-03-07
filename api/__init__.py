"""
This module initializes the Flask app and configures it.
"""

from flask import Flask

from .config import ApplicationConfig
from .extensions import bcrypt, jwt
from .database.models import db


def create_app() -> Flask:
    """
    Create and configure the Flask app.

    Returns:
        Flask: The configured Flask app.
    """
    app = Flask(__name__, static_folder="../build", static_url_path="/")
    # Load the configuration for the Flask app
    app.config.from_object(ApplicationConfig)

    # Initialize the Flask extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Create tables in the database
    with app.app_context():
        db.create_all()

    # Add a route for the index
    @app.route("/")
    def index() -> str:
        """
        Return a simple message for the index route.
        """
        return "<h1>Flask API for Dreamify</h1>"

    from .api import api_blueprint

    # Register the 'api' blueprint with the Flask app
    app.register_blueprint(api_blueprint)

    # Return the configured Flask app
    return app