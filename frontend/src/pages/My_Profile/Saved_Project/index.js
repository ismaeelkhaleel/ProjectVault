import React, { useEffect } from "react";
import styles from "./Style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getSavedProjects } from "../../../config/redux/action/projectAction";
import { useNavigate } from "react-router-dom";
import Image from "../../../assest/images/default.png";

function SavedProject() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project);
  const savedProjects = projectState?.savedProjects || [];

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(getSavedProjects(userId));
  }, [dispatch, userId]);

  return (
    <div className={styles.save_project_container}>
      {savedProjects.length === 0 ? (
        <p className={styles.no_projects}>No projects found.</p>
      ) : (
        <div className={styles.save_projects_grid}>
          {savedProjects.map((project, index) => (
            <div className={styles.save_project_card} key={index}>
              <img src={project.imagePath || Image} alt={project.title} />
              <h3 className={styles.save_project_title}>{project.title}</h3>
              <p className={styles.save_project_description}>
                {project.description.length > 150
                  ? project.description.slice(0, 150) + "..."
                  : project.description}
              </p>
              <p className={styles.projectTechs}>
                Tech: {project.technology?.join(", ")}
              </p>

              <p
                className={styles.save_project_button}
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

export default SavedProject;
