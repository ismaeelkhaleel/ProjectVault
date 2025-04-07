import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyProfile,
  getUserProjects,
  saveProject,
  unsaveProject,
} from "../../../config/redux/action/authAction";
import styles from "./Style.module.css";

function Project() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const savedProjects = authState?.user?.profile?.user?.saveProjects;
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    const userId = authState?.user?.profile?.user?._id;
    if (userId) {
      dispatch(getUserProjects(userId));
    }
  }, [authState?.user?.profile?.user?._id]);

  return (
    <div className={styles.profile_container_card_bottom_right_projects}>
      <div
        className={styles.profile_container_card_bottom_right_projects_wrapper}
      >
        {authState.userProjects.length > 0 ? (
          authState.userProjects
            .filter((project) => project && project.title)
            .map((project, index) => (
              <div
                key={index}
                className={
                  styles.profile_container_card_bottom_right_projects_item
                }
              >
                <div>
                  <h2
                    className={
                      styles.profile_container_card_bottom_right_projects_title
                    }
                  >
                    {project.title}
                  </h2>
                  <p
                    className={
                      styles.profile_container_card_bottom_right_projects_description
                    }
                  >
                    {project.description
                      ? `${project.description.substring(0, 80)}...`
                      : "No description available"}
                  </p>
                </div>

                <div
                  className={
                    styles.profile_container_card_bottom_right_projects_icon
                  }
                  onClick={() => {
                    const projectId = project._id;
                    const userId = authState?.user?.profile?.user?._id;

                    if (savedProjects.includes(projectId)) {
                      dispatch(unsaveProject({ projectId, userId })).then(
                        () => {
                          dispatch(getMyProfile());
                          dispatch(getUserProjects(userId));
                        }
                      );
                    } else {
                      dispatch(saveProject({ projectId, userId })).then(() => {
                        dispatch(getMyProfile());
                        dispatch(getUserProjects(userId));
                      });
                    }
                  }}
                >
                  {savedProjects.includes(project._id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                      color="#2980b9"
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
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))
        ) : (
          <h2>No Project added yet</h2>
        )}
      </div>
    </div>
  );
}

export default Project;
