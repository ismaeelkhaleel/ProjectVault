import React, { useEffect } from "react";
import styles from "./Style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getSavedProjects } from "../../../config/redux/action/projectAction";
import { useNavigate } from "react-router-dom";

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
              <h3 className={styles.save_project_title}>{project.title}</h3>
              <p className={styles.save_project_description}>
                {project.description.length > 100
                  ? project.description.slice(0, 100) + "..."
                  : project.description}
              </p>
              <div>
                <p
                  className={styles.save_project_button}
                  onClick={() => {
                    navigate(`/project-details/${project._id}`);
                  }}
                >
                  See Full Project
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedProject;
