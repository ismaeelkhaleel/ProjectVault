import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects } from "../../../config/redux/action/projectAction";
import styles from "./Style.module.css";
import { useNavigate } from "react-router-dom";
import Image from "../../../assest/images/default.png";

const TopProjects = ({ userId }) => {
  const dispatch = useDispatch();
  const { allProjects } = useSelector((state) => state.project);

  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);
      else if (width < 868) setVisibleCount(1);
      else if (width < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    if (userId) dispatch(getAllProjects());
  }, [dispatch, userId]);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + visibleCount, allProjects.length - visibleCount)
    );
  };

  const visibleProjects = allProjects.slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <div className={styles.top_container}>
      <div className={styles.top_container_haider}>
        <h3>Top Projects</h3>
        {allProjects.length > 0 && (
          <div onClick={() => navigate("/projects?type=top")}>
            <p className="mt-4 text-blue-600 underline">See All</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <div className={styles.carousel_wrapper}>
        <div className={styles.carousel_card_container}>
          <div>
            <button
              className={styles.arrow_button}
              onClick={handlePrev}
              disabled={startIndex === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {visibleProjects.map((project, index) => (
            <div
              key={index}
              className={styles.top_card}
              onClick={() => navigate(`/project-details/${project._id}`)}
            >
              <img
                src={project.imagePath || Image}
                alt={project.title}
                className={styles.top_card_image}
              />
              <h3 className={styles.top_card_title}>{project.title}</h3>
              <p className={styles.top_card_description}>
                {project.description.length > 200
                  ? project.description.slice(0, 200) + "..."
                  : project.description}
              </p>
            </div>
          ))}
          <div>
            <button
              className={styles.arrow_button}
              onClick={handleNext}
              disabled={startIndex + visibleCount >= allProjects.length}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProjects;
