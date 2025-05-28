import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getAllProjects,
  getRecommendedProjects,
} from "../../../config/redux/action/projectAction";
import styles from "./Style.module.css";
import categories from "../../../data/categories";
import technologies from "../../../data/technologies";
import years from "../../../data/years";
import Image from "../../../assest/images/default.png";

const ProjectsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const projectState = useSelector((state) => state.project);
  const { recommendedProjects = [], allProjects = [] } = projectState;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (userId) {
      if (type === "recommended") {
        dispatch(getRecommendedProjects(userId));
      } else if (type === "top") {
        dispatch(getAllProjects());
      } else {
        dispatch(getAllProjects());
      }
    }
  }, [type, userId, dispatch]);

  const projectsToDisplay =
    type === "recommended" ? recommendedProjects : allProjects;

  const filteredProjects = projectsToDisplay.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technology?.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      project.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = selectedYear
      ? project.year.toString() === selectedYear
      : true;
    const matchesTech = selectedTech
      ? project.technology?.some((tech) =>
          tech.toLowerCase().includes(selectedTech.toLowerCase())
        )
      : true;

    const matchesCategory = selectedCategory
      ? project.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchesSearch && matchesYear && matchesTech && matchesCategory;
  });
  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.heading}>
        {type === "recommended" ? "Recommended Projects" : "Top Projects"}
      </h2>

      <div className={styles.filterWrapper}>
        <input
          type="text"
          placeholder="Search by title, technology or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBox}
        />

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>

        <select
          value={selectedTech}
          onChange={(e) => setSelectedTech(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Technologies</option>
          {technologies.map((tech) => (
            <option key={tech.value} value={tech.value}>
              {tech.label}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <p className={styles.noProjects}>No projects found.</p>
      ) : (
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => (
            <div key={project._id} className={styles.projectCardWrapper}>
              <div className={styles.projectCard}>
                {type === "recommended" && (
                  <div className={styles.tooltip}>
                    {project.match_percentage || 0}%
                  </div>
                )}
                <div className={styles.cardBody}>
                  <img src={project.imagePath || Image} alt={project.title} />
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
