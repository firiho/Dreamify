"""
This module contains the namespace and resources for managing stories.
"""

from flask import request, current_app
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required

from ..functions.prepare_data import assemble_payload
from ..database.queries import get_story, get_child_from_parent
from ..functions.jwt_functions import get_current_parent

# Create a chapters namespace
stories = Namespace(
    "stories", path="/stories", description="Story management operations"
)


# Define a model for the story generation endpoint
generate_story_model = stories.model(
    "GenerateStory",
    {
        "child_id": fields.String(
            required=True, description="The ID of the kid"
        ),
        "topic": fields.String(
            required=True, description="Topic of the story"
        ),
        "image_style": fields.String(
            required=True,
            description="Style of the image",
            enum=["Cartoon", "Realistic", "Fantasy", "Watercolor", "Anime"],
        ),
    },
)


@stories.route("/generate", strict_slashes=False)
class GenerateStory(Resource):
    """
    This class represents a resource for generating stories.
    """

    @jwt_required()
    @stories.expect(generate_story_model, validate=True)
    @stories.response(200, "Success")
    @stories.response(400, "Validation Error")
    @stories.response(500, "Internal Server Error")
    def post(self):
        """
        Generate a story based on the provided data.
        """
        try:
            # Get the data from the request
            data = request.json

            # Return an error if no data is provided and a 400 status code
            if not data:
                return {"Error": "No data provided"}, 400

            # Assemble the payload
            payload = assemble_payload(
                child_id=data["child_id"],
                topic=data["topic"],
                image_style=data["image_style"],
            )

            # Return the payload and a 200 status code
            return payload, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500


@stories.route("/child_stories", strict_slashes=False)
class ChildStories(Resource):
    """
    Represents the stories of a child.
    """

    @jwt_required()
    @stories.response(200, "Success")
    @stories.response(401, "Unauthorized, please log in")
    @stories.response(404, "Child Not Found")
    @stories.response(500, "Internal Server Error")
    @stories.doc(params={"child_id": "The ID of the child, required"})
    def get(self):
        """
        Get all stories for a child.
        """
        try:
            # Get the parent
            parent = get_current_parent()

            if not parent:
                return {"error": "Unauthorized, please log in"}, 401

            # Get the child_id from the query parameter
            child_id = request.args.get("child_id", None)

            # Return an error if child_id is not provided
            if not child_id:
                return {"Error": "Parameter 'child_id' is required"}, 400

            # Get the child
            child = get_child_from_parent(parent.user_id, child_id)

            # Return an error if the child does not exist
            if not child:
                return {"error": "Child does not exist."}, 404

            # Define the payload
            payload = {
                "stories": [
                    {
                        # Get all attributes of the story but not the private ones
                        attribute: getattr(story, attribute)
                        for attribute in vars(story)
                        if not attribute.startswith("_")
                    }
                    for story in child.stories
                ]
            }

            # Return the story data and a 200 status code
            return payload, 200
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500


@stories.route("/chapters", strict_slashes=False)
class StoryChapters(Resource):
    """
    Represents the chapters of a story.
    """

    @jwt_required()
    @stories.response(200, "Success")
    @stories.response(404, "Story Not Found")
    @stories.response(500, "Internal Server Error")
    @stories.doc(params={"story_id": "The ID of the story, required"})
    def get(self):
        """
        Get all chapters for a story.
        """
        try:
            # Use query parameter to get story_id
            story_id = request.args.get("story_id", None)

            # Return an error if story_id is not provided
            if not story_id:
                return {"Error": "Parameter 'story_id' is required"}, 400

            # Get the story
            story = get_story(story_id)

            # Return an error if the story does not exist
            if not story:
                return {"error": "Story does not exist."}, 404

            # Define the payload
            payload = {
                "chapters": [
                    {
                        # Get all attributes of the chapter but not the private ones
                        attribute: getattr(chapter, attribute)
                        for attribute in vars(chapter)
                        if not attribute.startswith("_")
                    }
                    for chapter in story.chapters
                ]
            }

            # Return the story data and a 200 status code
            return payload, 200
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500
