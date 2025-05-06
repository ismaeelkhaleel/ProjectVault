import React, { useEffect } from "react";
import styles from "./Style.module.css";
import { getUserProjects } from "../../../config/redux/action/projectAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Your_Project() {
  const projectState = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const userProjects = projectState?.projects || [];

  useEffect(() => {
    dispatch(getUserProjects(userId));
  }, [dispatch, userId]);

  return (
    <div className={styles.your_project_container}>
      {userProjects.length === 0 ? (
        <p className={styles.no_projects}>No projects found.</p>
      ) : (
        <div className={styles.your_projects_grid}>
          {userProjects.map((project, index) => (
            <div className={styles.your_project_card} key={index}>
              <h3 className={styles.your_project_title}>{project.title}</h3>
              <p className={styles.your_project_description}>
                {project.description.length > 100
                  ? project.description.slice(0, 100) + "..."
                  : project.description}
              </p>
              <p className={styles.projectTechs}>
                  Tech: {project.technology?.join(", ")}
                </p>
              <div>
                <p className={styles.your_project_button} onClick={()=> {navigate(`/project-details/${project._id}`)}}>See Full Project</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Your_Project;
