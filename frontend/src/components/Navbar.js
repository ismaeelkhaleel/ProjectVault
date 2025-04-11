import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../assest/images/logo.png";
import { BASE_URL } from "../config/index";

function Navbar() {
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profileToggle, setProfileToggle] = useState(false);

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const loggedInUser = user?.profile?.user;
  const token = localStorage.getItem("token");

  const handleProfileToggle = () => {
    setProfileToggle(!profileToggle);
  };

  const handleLogout = async () => {
    localStorage.clear();
    window.location.reload();
    setTimeout(() => {
      navigate("/auth/login");
    }, 100);
  };

  return (
    <div className={styles.navbar_container}>
      <div className={styles.navbar_card}>
        <div className={styles.navbar_card_left}>
          <img
            src={Logo}
            alt="ProjectVault_Logo"
            onClick={() => {
              navigate("/");
            }}
          />
          {token ? (
            <h2
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              {loggedInUser?.username}
            </h2>
          ) : (
            <h2
              onClick={() => {
                navigate("/");
              }}
            >
              ProjectVault
            </h2>
          )}
        </div>
        {token ? (
          <div className={styles.navbar_card_right}>
            <div className={styles.navbar_card_right_item}>
              <div className={styles.tooltip_container}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className={styles.tooltip_text}>Add New Project</span>
              </div>
            </div>
            <div className={styles.navbar_card_right_item}>
              <div
                className={styles.tooltip_container}
                onClick={handleProfileToggle}
              >
                <img
                  src={`${BASE_URL}uploads/${loggedInUser?.profilePicture}`}
                  alt={loggedInUser?.username}
                />
                <span className={styles.tooltip_text}>Profile</span>
              </div>
            </div>
            {profileToggle && (
              <div className={styles.navbar_card_right_profile}>
                <div className={styles.navbar_card_right_profile_top}>
                  <div className={styles.navbar_card_right_profile_top_image}>
                    <img
                      src={`${BASE_URL}uploads/${loggedInUser?.profilePicture}`}
                      alt=""
                    />
                    <div>
                      <h4 style={{ cursor: "pointer" }}>
                        {loggedInUser?.username}
                      </h4>
                      <p>{loggedInUser?.name}</p>
                    </div>
                  </div>
                  <div onClick={handleProfileToggle}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <hr></hr>
                <div className={styles.navbar_card_right_profile_middle}>
                  <div
                    className={styles.navbar_card_right_profile_middle_item}
                    onClick={() => {
                      navigate(`/my_profile/${loggedInUser._id}`);
                      setProfileToggle(!profileToggle);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h4>Your Profile</h4>
                  </div>
                  <div
                    className={styles.navbar_card_right_profile_middle_item}
                    onClick={() => {
                      navigate("/dashboard");
                      setProfileToggle(!profileToggle);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
                      <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
                      <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
                      <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
                    </svg>

                    <h4>Dashboard</h4>
                  </div>
                  <div
                    className={styles.navbar_card_right_profile_middle_item}
                    onClick={() => {
                      navigate("/your_project");
                      setProfileToggle(!profileToggle);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                    </svg>
                    <h4>Your Projects</h4>
                  </div>
                  <div
                    className={styles.navbar_card_right_profile_middle_item}
                    onClick={() => {
                      navigate("/saved_project");
                      setProfileToggle(!profileToggle);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h4>Saved Projects</h4>
                  </div>
                  <div
                    className={styles.navbar_card_right_profile_middle_item}
                    onClick={() => {
                      navigate("/liked_project");
                      setProfileToggle(!profileToggle);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                    <h4>Liked Projects</h4>
                  </div>
                  <div
                    className={styles.navbar_card_right_profile_middle_item}
                    onClick={() => {
                      navigate("/comment_project");
                      setProfileToggle(!profileToggle);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h4>Comments</h4>
                  </div>
                  <div className={styles.navbar_card_right_profile_middle_item}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <h4>New Project</h4>
                  </div>
                </div>
                <hr></hr>
                <div
                  className={styles.navbar_card_right_profile_bottom}
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h4>Sign Out</h4>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.navbar_card_right}>
            <h3 onClick={() => navigate("/auth/login")}>Login</h3>
            <h3 onClick={() => navigate("/auth/register")}>Sign Up</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
