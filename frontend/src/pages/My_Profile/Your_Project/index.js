import React, { useEffect } from "react";
import styles from "./Style.module.css";
import { getUserProjects } from "../../../config/redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";

function Your_Project() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");

  const userProjects = authState?.userProjects || [];

  useEffect(() => {
    dispatch(getUserProjects(userId));
  }, [dispatch, userId]);

  return (
    <div className={styles.your_project_container}>
      {userProjects.length === 0 ? (
        <p className={styles.no_projects}>No projects found.</p>
      ) : (
        <div className={styles.projects_grid}>
          {userProjects.map((project, index) => (
            <div className={styles.project_card} key={index}>
              <h3 className={styles.project_title}>{project.title}</h3>
              <p className={styles.project_description}>
                {project.description.length > 100
                  ? project.description.slice(0, 100) + "..."
                  : project.description}
              </p>
              <div>
                <p className={styles.project_button}>See Full Project</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Your_Project;
