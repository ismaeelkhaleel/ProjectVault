import React from "react";
import styles from "./Style.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  followUser,
  unfollowUser,
} from "../../../config/redux/action/authAction";
import { BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

function TopUsers({ userId, refreshProfiles }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { recommendProfiles, isError, message } = useSelector(
    (state) => state.auth
  );

  const handleFollowToggle = async (id, isFollowing) => {
    if (isFollowing) {
      await dispatch(unfollowUser({ userId, id }));
    } else {
      await dispatch(followUser({ userId, id }));
    }

    refreshProfiles();
  };

  const notFollowedProfiles = recommendProfiles?.filter(
    (p) => p.user?._id !== userId
  );

  return (
    <div className={styles.container}>
      <div className={styles.container_haider}>
        <h3>Suggested for You</h3>
        {notFollowedProfiles.length > 0 && (
          <div onClick={() => navigate("/user?type=suggested")}>
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

      {isError && <p className={styles.error}>{message}</p>}

      <div className={styles.cardList}>
        {notFollowedProfiles?.length === 0 ? (
          <p>No suggestions available</p>
        ) : (
          notFollowedProfiles.map((profile) => {
            const isFollowing = profile.user?.followers?.includes(userId);

            return (
              <div
                key={profile._id}
                className={styles.card}
                onClick={() => {
                  navigate(`/my_profile/${profile.user._id}`);
                }}
              >
                <div className={styles.tooltip}>
                  {profile?.match_percentage}% match
                </div>
                <img
                  src={`${BASE_URL}uploads/${profile?.user?.profilePicture}`}
                  alt="profile"
                  className={styles.profileImg}
                />
                <div className={styles.info}>
                  <div className={styles.nameRow}>
                    <h4>{profile.user?.name || "Unknown"}</h4>
                  </div>
                  <p>{profile.user?.followers?.length || 0} followers</p>
                  <button
                    className={`${
                      isFollowing ? styles.unfollowBtn : styles.followBtn
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(profile.user._id, isFollowing);
                    }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TopUsers;
