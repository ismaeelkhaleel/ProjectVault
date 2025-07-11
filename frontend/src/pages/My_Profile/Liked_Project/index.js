import React, { useEffect } from "react";
import { getLikedProjects } from "../../../config/redux/action/projectAction";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Style.module.css";
import { useNavigate } from "react-router-dom";
import Image from "../../../assest/images/default.png";

function LikedProject() {
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project);
  const likedProjects = projectState?.likedProjects || [];
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(getLikedProjects(userId));
  }, [dispatch, userId]);

  return (
    <div className={styles.like_project_container}>
      {likedProjects.length === 0 ? (
        <p className={styles.no_projects}>No projects found.</p>
      ) : (
        <div className={styles.like_projects_grid}>
          {likedProjects.map((project, index) => (
            <div className={styles.like_project_card} key={index}>
              <img src={project.imagePath || Image} alt={project.title} />
              <h3 className={styles.like_project_title}>{project.title}</h3>
              <p className={styles.like_project_description}>
                {project.description.length > 100
                  ? project.description.slice(0, 100) + "..."
                  : project.description}
              </p>
              <p className={styles.projectTechs}>
                Tech: {project.technology?.join(", ")}
              </p>
              <p
                className={styles.like_project_button}
                onClick={() => {
                  navigate(`/project-details/${project._id}`);
                }}
              >
                See Full Project
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedProject;
