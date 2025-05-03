import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendedProjects } from "../../../config/redux/action/projectAction";
import styles from "./Style.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Recommend = ({ userId }) => {
  const dispatch = useDispatch();
  const { recommendedProjects, isLoading, isError, message } = useSelector(
    (state) => state.project
  );

  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);  
  const navigate = useNavigate();

   
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);  
      else if (width < 1024) setVisibleCount(2);  
      else setVisibleCount(4); 
    };

    updateVisibleCount();  
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    if (userId) dispatch(getRecommendedProjects(userId));
  }, [dispatch, userId]);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 1, recommendedProjects.length - visibleCount)
    );
  };

  const visibleProjects = recommendedProjects.slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <div className={styles.recommend_container}>
      <div className={styles.recommend_container_haider}>
        <h2>Recommended Projects</h2>
        {recommendedProjects.length > 0 && (
          <div>
            <p
              className="mt-4 text-blue-600 underline"
              onClick={() => (window.location.href = "/recommended-projects")}
            >
              See All
            </p>
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

      {isLoading && <p>Loading...</p>}
      {isError && (
        <p className={styles.recommend_container_error_message}>{message}</p>
      )}

      <div className={styles.carousel_wrapper}>
        <div>
          <button
            className={styles.arrow_button}
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className={styles.carousel_card_container}>
          {visibleProjects.map((project, index) => (
            <div key={index} className={styles.recommend_card} onClick={()=>navigate(`/project-details/${project._id}`)}>
              <h3 className={styles.recommend_card_title}>{project.title}</h3>
              <p className={styles.recommend_card_description}>
                {project.description.length > 200
                  ? project.description.slice(0, 200) + "..."
                  : project.description}
              </p>
              <p className={styles.recommend_card_match}>
                {project.match_percentage}% Match
              </p>
            </div>
          ))}
        </div>

        <div>
          <button
            className={styles.arrow_button}
            onClick={handleNext}
            disabled={startIndex + visibleCount >= recommendedProjects.length}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
