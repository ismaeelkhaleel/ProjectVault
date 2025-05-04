from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")


def get_projects_recommendations(user_skills, projects, top_n=3, min_score=0.000):
    project_corpus = [
        " ".join(p.get("technology", [])) * 4 + " " + p.get("description", "")
        for p in projects
    ]
    user_input = [" ".join(user_skills)]

    corpus = user_input + project_corpus
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(corpus)

    user_vec = vectors[0]
    project_vecs = vectors[1:]

    scores = cosine_similarity(user_vec, project_vecs)[0]

    for i, score in enumerate(scores):
        projects[i]["score"] = float(score)
        projects[i]["match_percentage"] = round(score * 100, 2)

    filtered_projects = [p for p in projects if p["score"] >= min_score]

    filtered_projects.sort(key=lambda x: x["score"], reverse=True)

    return filtered_projects[:top_n]


def get_profile_recommendations(
    user_bio, user_skills, profiles, top_n=5, min_score=0.0
):
    user_text = " ".join(user_skills) * 4 + " " + user_bio
    profile_texts = [
        " ".join(profile.get("skills", [])) * 4 + " " + profile.get("bio", "")
        for profile in profiles
    ]

    user_embedding = model.encode(user_text, convert_to_tensor=True)
    profile_embeddings = model.encode(profile_texts, convert_to_tensor=True)

    similarities = util.cos_sim(user_embedding, profile_embeddings)[0]

    for i, score in enumerate(similarities):
        profiles[i]["score"] = float(score)
        profiles[i]["match_percentage"] = round(float(score) * 100, 2)

    filtered_profiles = [p for p in profiles if p["score"] >= min_score]
    filtered_profiles.sort(key=lambda x: x["score"], reverse=True)

    return filtered_profiles[:top_n]
