import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import styles from "./Style.module.css";
import { useNavigate } from "react-router-dom";
import homepage from "../../assest/images/homepage.png";
import image1 from "../../assest/images/image1.jpeg";
import image2 from "../../assest/images/image2.jpeg";
import image3 from "../../assest/images/image3.jpg";
import image4 from "../../assest/images/image4.jpg";
import image5 from "../../assest/images/image5.jpg";
import image6 from "../../assest/images/image6.jpeg";
import image7 from "../../assest/images/image7.png";
import image8 from "../../assest/images/image8.jpg";
import image9 from "../../assest/images/image9.jpg";
import { getAllProjects } from "../../config/redux/action/projectAction";
import { useDispatch, useSelector } from "react-redux";
import Image from "../../assest/images/default.png";

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
];
function Homepage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project);
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const projects = projectState?.allProjects || [];
  const topThreeProjects = projects.slice(0, 3);

  useEffect(() => {
    console.log(topThreeProjects);
  }, [projects]);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  return (
    <div className={styles.homepage_container}>
      <div className={styles.homepage_container_wrapper}>
        {/*<=============== welcome section ================>*/}
        <div className={styles.welcomeSection}>
          <h3 className={styles.welcomeText}>
            <Typewriter
              options={{
                strings: [
                  isLoggedIn
                    ? `Welcome, ${loggedInUser?.name}`
                    : "Welcome, Guest!",
                  "Welcome to the CS Dept Portal!",
                ],
                autoStart: true,
                loop: true,
                delay: 100,
              }}
            />
          </h3>
          <div className={styles.welcomeSection_title}>
            <div className={styles.welcomeSection_title_left}>
              <h1 className={styles.title}>ProjectVault</h1>
              <p className={styles.subtitle}>
                This platform allows you to submit all kinds of projects and
                dissertations, providing a centralized space for easy access and
                management. It also enables students to explore and search
                through codes and resources, making project work and research
                more accessible and efficient.
              </p>
              <button
                className={styles.getStartedButton}
                onClick={() => {
                  navigate("/auth/register");
                }}
              >
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.welcomeSection_title_right}>
              <img src={homepage} alt="homepage" />
            </div>
          </div>
        </div>

        {/*<=============== images section ================>*/}
        <div className={styles.images_section_container}>
          <h2 className={styles.heading}>Department Images</h2>
          <img
            src={images[currentImage]}
            alt="Rotating"
            className={styles.sliderImage}
          />
        </div>

        {/*<=============== project section ================>*/}
        <div className={styles.project_section_container}>
          <h2 className={styles.heading}>Some Projects</h2>

          <div className={styles.project_grid}>
            {topThreeProjects.map((project, index) => (
              <div key={index} className={styles.project_card}>
                <img src={project.imagePath || Image} alt={project.title} />
                <h3>{project.title}</h3>
                <p>
                  {project.description.length > 150
                    ? project.description.slice(0, 150) + "..."
                    : project.description}
                </p>
                <p>Tech: {project.technology?.join(", ")}</p>
                <p
                  onClick={() => {
                    navigate(`/project-details/${project._id}`);
                  }}
                  className={styles.see_detail}
                >
                  See Detail
                </p>
              </div>
            ))}
          </div>

          <button onClick={() => navigate("/projects")}>
            Explore All Projects
          </button>
        </div>

        {/*<=============== About section ================>*/}
        <div className={styles.about_section_container}>
          <h2 className={styles.heading}>About This Platform</h2>
          <p className={styles.about_description}>
            This platform has been developed for the students of AMU's Computer
            Science Department to upload, manage, and showcase their academic
            projects and dissertations. It serves as a centralized knowledge
            base where others can easily explore, search, and learn from
            previous work — promoting collaboration, innovation, and academic
            continuity. By maintaining a well-organized repository of
            categorized project listings, the platform fosters idea sharing and
            provides juniors with valuable insights and inspiration for their
            own work. With a clean, structured interface, it enhances learning
            beyond the classroom and simplifies access to departmental
            achievements.
          </p>

          <div className={styles.feature_list}>
            <div className={styles.feature_item}>
              📂 Add and organize projects
            </div>
            <div className={styles.feature_item}>
              🔍 Search and explore code easily
            </div>
            <div className={styles.feature_item}>
              📘 Access dissertations and reports
            </div>
            <div className={styles.feature_item}>
              🎓 Benefit juniors with reference work
            </div>
          </div>
        </div>

        {/*<=============== Step-wise section ================>*/}
        <div className={styles.stepwise_direction_section_contanier}>
          <h2 className={styles.heading}>How It Works</h2>
          <div className={styles.step_list}>
            <div className={styles.step_item}>
              <span className={styles.step_number}>1</span>
              <div>
                <h3 className={styles.step_heading}>Register</h3>
                <p className={styles.step_description}>
                  Create an account using your valid email ID.
                </p>
              </div>
            </div>

            <div className={styles.step_item}>
              <span className={styles.step_number}>2</span>
              <div>
                <h3 className={styles.step_heading}>Verify Email</h3>
                <p className={styles.step_description}>
                  Verify your email with a one-time password (OTP).
                </p>
              </div>
            </div>

            <div className={styles.step_item}>
              <span className={styles.step_number}>3</span>
              <div>
                <h3 className={styles.step_heading}>Login</h3>
                <p className={styles.step_description}>
                  Sign in using your email and password.
                </p>
              </div>
            </div>

            <div className={styles.step_item}>
              <span className={styles.step_number}>4</span>
              <div>
                <h3 className={styles.step_heading}>Complete Profile</h3>
                <p className={styles.step_description}>
                  Update your personal details and upload a valid ID card to
                  verify your profile.
                </p>
              </div>
            </div>

            <div className={styles.step_item}>
              <span className={styles.step_number}>5</span>
              <div>
                <h3 className={styles.step_heading}>Upload Your Project</h3>
                <p className={styles.step_description}>
                  Add your project title, description, github repo
                  link,technology, year, categorize, demo video and
                  dessertation.
                </p>
              </div>
            </div>

            <div className={styles.step_item}>
              <span className={styles.step_number}>6</span>
              <div>
                <h3 className={styles.step_heading}>Explore Projects</h3>
                <p className={styles.step_description}>
                  Search and explore existing projects to get insights and learn
                  from others.
                </p>
              </div>
            </div>

            <div className={styles.step_item}>
              <span className={styles.step_number}>7</span>
              <div>
                <h3 className={styles.step_heading}>Learn & Contribute</h3>
                <p className={styles.step_description}>
                  Use the platform to grow academically and contribute your own
                  work to support future batches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
