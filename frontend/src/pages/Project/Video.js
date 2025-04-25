import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import styles from "./Style.module.css";
import { useNavigate } from "react-router-dom";

function Video() {
  const navigate = useNavigate();
  const projectState = useSelector((state) => state.project);

  const currentProject = projectState?.projectDetails;
  const allProjects = projectState?.allProjects || [];

  const suggestedProjects = allProjects.filter((project) => {
    if (project._id === currentProject?._id) return false;

    return project.technology?.some((tech) =>
      currentProject?.technology?.includes(tech)
    );
  });

  return (
    <div className={styles.project_details_wrapper_bottom}>
      <div className={styles.project_details_wrapper_bottom_video}>
        <div className={styles.react_player_wrapper}>
          <ReactPlayer
            url={currentProject?.demoVideoPath}
            controls
            width="100%"
            height="100%"
            className={styles.react_player}
          />
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
