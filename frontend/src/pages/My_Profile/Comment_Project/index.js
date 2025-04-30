import React, { useEffect } from "react";
import { getCommentedProjects } from "../../../config/redux/action/projectAction";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Style.module.css";
import { useNavigate } from "react-router-dom";

function CommentedProject() {
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project);
  const commentedProjects = projectState?.commentedProjects || [];
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(getCommentedProjects(userId));
    console.log(projectState);
  }, [dispatch, userId]);

  return (
    <div className={styles.comment_project_container}>
      {commentedProjects.length === 0 ? (
        <p className={styles.no_projects}>No projects found.</p>
      ) : (
        <div className={styles.comment_projects_grid}>
          {commentedProjects.map((project, index) => (
            <div className={styles.comment_project_card} key={index}>
              <h3 className={styles.comment_project_title}>{project.title}</h3>
              <p className={styles.comment_project_description}>
                {project.description.length > 100
                  ? project.description.slice(0, 100) + "..."
                  : project.description}
              </p>
              <div>
                <p
                  className={styles.comment_project_button}
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

export default CommentedProject;
