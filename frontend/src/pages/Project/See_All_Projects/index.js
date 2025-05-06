import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getAllProjects, getRecommendedProjects } from "../../../config/redux/action/projectAction";
import styles from "./Style.module.css";

const ProjectsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const projectState = useSelector((state) => state.project);
  const { recommendedProjects = [], allProjects = [] } = projectState;

  useEffect(() => {
    if (userId) {
      if (type === "recommended") {
        dispatch(getRecommendedProjects(userId));
      } else if (type === "top") {
        dispatch(getAllProjects());
      }
    }
  }, [type, userId, dispatch]);

  const projectsToDisplay =
    type === "recommended" ? recommendedProjects : allProjects;

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.heading}>
        {type === "recommended" ? "Recommended Projects" : "Top Projects"}
      </h2>

      {projectsToDisplay.length === 0 ? (
        <p className={styles.noProjects}>No projects found.</p>
      ) : (
        <div className={styles.projectsGrid}>
          {projectsToDisplay.map((project) => (
            <div key={project._id} className={styles.projectCardWrapper}>
              <div className={styles.projectCard}>
                {type === "recommended" && (
                  <div className={styles.tooltip}>
                    {project.match_percentage || 0}%
                  </div>
                )}
                <div className={styles.cardBody}>
                  <h5 className={styles.projectTitle}>{project.title}</h5>
                  <p className={styles.projectDesc}>
                    {project.description?.slice(0, 100)}...
                  </p>
                  <p className={styles.projectTechs}>
                    Tech: {project.technology?.join(", ")}
                  </p>
                  <a
                    href={`/project-details/${project._id}`}
                    className={styles.viewBtn}
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;