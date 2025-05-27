import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectCount } from "../../../config/redux/action/adminAction";
import styles from "./Style.module.css";
import categories from "../../../data/categories";
import technologies from "../../../data/technologies";
import years from "../../../data/years";
import Fuse from "fuse.js";
import Image from "../../../assest/images/default.png";
const ProjectsPage = () => {
  const dispatch = useDispatch();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isAdmin = loggedInUser?.type === "admin";

  const adminState = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fuseResults, setFuseResults] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      dispatch(getProjectCount());
    }
  }, [dispatch, isAdmin]);

  const projectsToDisplay = Array.isArray(adminState.projectCount)
    ? adminState.projectCount
    : adminState.projectCount?.projects || [];

  useEffect(() => {
    console.log(adminState);
  }, [adminState]);

  useEffect(() => {
    if (!Array.isArray(projectsToDisplay)) {
      setFuseResults([]);
      return;
    }

    const fuse = new Fuse(projectsToDisplay, {
      keys: ["title", "category", "technology"],
      threshold: 0.3,
    });

    if (searchTerm.trim()) {
      const results = fuse.search(searchTerm);
      setFuseResults(results.map((res) => res.item));
    } else {
      setFuseResults(projectsToDisplay);
    }
  }, [searchTerm, projectsToDisplay]);

  const filteredProjects = (fuseResults || []).filter((project) => {
    const matchesYear = selectedYear
      ? project.year?.toString() === selectedYear
      : true;
    const matchesTech = selectedTech
      ? project.technology?.some((tech) =>
          tech.toLowerCase().includes(selectedTech.toLowerCase())
        )
      : true;
    const matchesCategory = selectedCategory
      ? project.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchesYear && matchesTech && matchesCategory;
  });

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.heading}>Projects</h2>

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
                <div className={styles.cardBody}>
                  <img src={project?.imagePath || Image} alt="" />
                  <h5 className={styles.projectTitle}>{project?.title}</h5>
                  <p className={styles.projectDesc}>
                    {project?.description?.slice(0, 100)}...
                  </p>
                  <p className={styles.projectTechs}>
                    Tech: {project?.technology?.join(", ")}
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
