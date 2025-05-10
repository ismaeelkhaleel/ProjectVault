from flask import Flask, request, jsonify
from recommend import get_projects_recommendations
from recommend import get_profile_recommendations

app = Flask(__name__)


@app.route("/recommend_projects", methods=["POST"])
def recommend_endpoint():
    data = request.get_json()
    skills = data.get("skills", [])
    projects = data.get("projects", [])
    top_n = data.get("top_n", 5)
    min_score = data.get("min_score", 0.0)

    recommended = get_projects_recommendations(
        skills, projects, top_n=top_n, min_score=min_score
    )
    return jsonify(recommended)


@app.route("/recommend-profiles", methods=["POST"])
def recommend_profiles():
    data = request.get_json()
    user_bio = data.get("bio", "")
    user_skills = data.get("skills", [])
    profiles = data.get("profiles", [])
    top_n = data.get("top_n", 5)
    min_score = data.get("min_score", 0.0)

    recommended = get_profile_recommendations(
        user_bio, user_skills, profiles, top_n=top_n, min_score=min_score
    )
    return jsonify(recommended)


if __name__ == "__main__":
    app.run(port=5001)