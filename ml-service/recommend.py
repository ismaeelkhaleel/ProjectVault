from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def get_recommendations(user_skills, projects, top_n=3, min_score=0.000):
    project_corpus = [
        " ".join(p.get("technology", []))*4 + " " + p.get("description", "")
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
        projects[i]["match_percentage"] = round(score * 100, 2)  # Add match percentage

    print("User skills:", user_skills)
    for i, p in enumerate(projects):
        print(
            f"Project {i}: {p.get('title', 'Untitled')} | Score: {p['score']} | Match: {p['match_percentage']}%"
        )

    filtered_projects = [p for p in projects if p["score"] >= min_score]

    filtered_projects.sort(key=lambda x: x["score"], reverse=True)

    return filtered_projects[:top_n]
