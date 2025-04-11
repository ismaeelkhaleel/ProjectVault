import React, { useEffect, useState } from "react";
import styles from "./Style.module.css";
import { useDispatch, useSelector } from "react-redux";
import Overview from "./Overview";
import { BASE_URL } from "../../../config";
import {
  getUserProfile,
  updateProfilePicture,
  followUser,
  unfollowUser,
  getUserFollowerList,
} from "../../../config/redux/action/authAction";
import Project from "./Project";
import Followers from "./Followers";
import Following from "./Following";
import { useParams } from "react-router-dom";
function Profile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const authState = useSelector((state) => state.auth);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const params = useParams();

  const { id } = params;
  const userId = localStorage.getItem("userId");

  const isOwner = String(id) === String(userId);

  const follower = authState?.user?.profile?.user?.followers || [];
  const isFollow = follower.includes(userId);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setIsImage(true);
    }
  };
  useEffect(() => {
    dispatch(getUserProfile(id));
    dispatch(getUserFollowerList(id));
  }, [dispatch, id]);

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("profilePicture", selectedImage);

    await dispatch(updateProfilePicture(formData));
    dispatch(getUserProfile(id));
    setIsImage(false);
  };

  return (
    <div className={styles.profile_container}>
      <div className={styles.profile_container_card}>
        <div className={styles.profile_container_card_top}>
          <div
            onClick={() => setActiveTab("Overview")}
            className={activeTab === "Overview" ? styles.activeTab : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            <h4>Overview</h4>
          </div>
          <div
            onClick={() => setActiveTab("Projects")}
            className={activeTab === "Projects" ? styles.activeTab : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
            <h4>Projects</h4>
          </div>
          <div
            onClick={() => setActiveTab("Followers")}
            className={activeTab === "Followers" ? styles.activeTab : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                clipRule="evenodd"
              />
              <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
            </svg>

            <h4>Followers</h4>
          </div>
          <div
            onClick={() => setActiveTab("Following")}
            className={activeTab === "Following" ? styles.activeTab : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
            <h4>Following</h4>
          </div>
        </div>
        <div className={styles.profile_container_card_bottom}>
          <div className={styles.profile_container_card_bottom_left}>
            <div className={styles.tooltip_container}>
              <label htmlFor="profilePicture">
                <img
                  src={`${BASE_URL}uploads/${authState?.user?.profile?.user?.profilePicture}`}
                  alt={authState?.user?.profile?.user?.username || ""}
                />
                {isOwner && (
                  <span className={styles.tooltip_text}>
                    Update Profile Picture
                  </span>
                )}
              </label>
              {isOwner && (
                <>
                  <input
                    type="file"
                    id="profilePicture"
                    hidden
                    onChange={handleImageChange}
                  />
                  {isImage && (
                    <button onClick={handleImageUpload}>Update</button>
                  )}
                </>
              )}
            </div>
            <div>
              <h1>
                {authState?.user?.profile?.user?.name}{" "}
                {authState?.user?.profile?.verified && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                )}
              </h1>
              <p>@{authState?.user?.profile?.user?.username}</p>
              <br></br>
              <p>
                <b>Joined At: </b>
                {authState?.user?.profile?.createdAt
                  ? authState.user.profile.createdAt.split("T")[0]
                  : "N/A"}
              </p>
            </div>
            <div>
              {isOwner ? (
                <button
                  onClick={() => {
                    setIsEditable(true);
                  }}
                >
                  Edit Profile
                </button>
              ) : isFollow ? (
                <button className={styles.profile_container_card_bottom_left_unfollow_button}
                  onClick={async () => {
                    await dispatch(unfollowUser({ userId, id }));
                    dispatch(getUserProfile(id))
                  }}
                >
                  unfollow
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await dispatch(followUser({ userId, id }));
                      dispatch(getUserProfile(id));
                  }}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
          <div className={styles.profile_container_card_bottom_right}>
            {activeTab === "Overview" && (
              <Overview isEditable={isEditable} setIsEditable={setIsEditable} />
            )}
            {activeTab === "Projects" && <Project />}
            {activeTab === "Followers" && <Followers />}
            {activeTab === "Following" && <Following />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
