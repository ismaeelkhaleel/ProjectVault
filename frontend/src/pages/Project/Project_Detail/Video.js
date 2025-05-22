import { useDispatch, useSelector } from "react-redux";
import styles from "./Style.module.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  decrementLikes,
  getLikedProjects,
  getProjectById,
  getSavedProjects,
  incrementLikes,
  saveProject,
  unsaveProject,
} from "../../../config/redux/action/projectAction";
import CommentSection from "./CommentSection";
import CustomVideoPlayer from "../../../components/CustomVideoPlayer";

function Video() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const projectState = useSelector((state) => state.project);

  const currentProject = projectState?.projectDetails;
  const allProjects = projectState?.allProjects || [];
  const userId = localStorage.getItem("userId");
  const currentProjectId = params.id;

  const suggestedProjects = allProjects.filter((project) => {
    if (project._id === currentProject?._id) return false;

    return project.technology?.some((tech) =>
      currentProject?.technology?.includes(tech)
    );
  });

  const likedProjects = projectState?.likedProjects || [];
  const savedProjects = projectState?.savedProjects || [];

  const likedProjectsArray = Array.isArray(likedProjects) ? likedProjects : [];
  const isLiked = likedProjectsArray.some(
    (project) => project._id === currentProject?._id
  );

  const savedProjectsArray = Array.isArray(savedProjects) ? savedProjects : [];
  const isSaved = savedProjectsArray.some(
    (project) => project._id === currentProject?._id
  );

  return (
    <div className={styles.project_details_wrapper_bottom}>
      <div className={styles.project_details_wrapper_bottom_video}>
        <div className={styles.react_player_wrapper}>
           <CustomVideoPlayer
            url={currentProject?.demoVideoPath}
          />
        </div>
        <div className={styles.project_details_wrapper_bottom_others_icon}>
          <div
            className={styles.project_details_wrapper_bottom_others_icon_item}
          >
            <h4>{currentProject?.views}</h4>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
              style={{ color: "#3498db" }}
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fillRule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            <span className={styles.tooltiptext}>Views</span>
          </div>
          <div
            className={styles.project_details_wrapper_bottom_others_icon_item}
          >
            <h4>{currentProject?.likes}</h4>
            {isLiked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
                onClick={async () => {
                  await dispatch(
                    decrementLikes({ projectId: currentProjectId, userId })
                  );
                  dispatch(getLikedProjects(userId));
                  dispatch(getProjectById(currentProjectId));
                }}
                style={{ cursor: "pointer", color: "#3498db" }}
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
                onClick={async () => {
                  await dispatch(
                    incrementLikes({ projectId: currentProjectId, userId })
                  );
                  dispatch(getLikedProjects(userId));
                  dispatch(getProjectById(currentProjectId));
                }}
                style={{ cursor: "pointer" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            )}
            <span className={styles.tooltiptext}>
              {isLiked ? "Liked" : "Like"}
            </span>
          </div>

          <div>
            {isSaved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
                onClick={() => {
                  dispatch(
                    unsaveProject({ projectId: currentProjectId, userId })
                  );
                }}
                style={{ cursor: "pointer", color: "#3498db" }}
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
                onClick={async () => {
                  await dispatch(
                    saveProject({ projectId: currentProjectId, userId })
                  );
                  dispatch(getSavedProjects(userId));
                }}
                style={{ cursor: "pointer" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            )}
            <span className={styles.tooltiptext}>
              {isSaved ? "Unsave" : "Save"}
            </span>
          </div>
        </div>
        <div className={styles.project_details_wrapper_bottom_comment}>
          <CommentSection projectId={currentProjectId} />
        </div>
      </div>
      <div className={styles.project_details_wrapper_bottom_suggested}>
        <div>
          {" "}
          <h4>Suggested Projects</h4>
        </div>
        <div>
          {suggestedProjects.length > 0 ? (
            suggestedProjects.map((project) => (
              <div
                key={project._id}
                className={
                  styles.project_details_wrapper_bottom_suggested_project_card
                }
                onClick={() => {
                  navigate(`/project-details/${project._id}`);
                }}
              >
                <h3>{project.title}</h3>
                <p>
                  {project.description?.length > 100
                    ? project.description.slice(0, 100) + "..."
                    : project.description}
                </p>
              </div>
            ))
          ) : (
            <p>No related projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Video;
