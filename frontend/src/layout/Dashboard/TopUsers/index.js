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

  const { allProfiles, isError, message } = useSelector((state) => state.auth);

  const handleFollowToggle = async (id, isFollowing) => {
    if (isFollowing) {
      await dispatch(unfollowUser({ userId, id }));
    } else {
      await dispatch(followUser({ userId, id }));
    }

    refreshProfiles();
  };

  return (
    <div className={styles.container}>
      <h3>Top Users</h3>
      {isError && <p className={styles.error}>{message}</p>}

      <div className={styles.cardList}>
        {allProfiles?.length === 0 ? (
          <p>No suggestions available</p>
        ) : (
          allProfiles.map((profile) => {
            const profileUser = profile?.user;

            if (!profileUser || profileUser._id === userId) return null;

            const isFollowing = profileUser?.followers?.includes?.(userId);

            return (
              <div
                key={profile._id}
                className={styles.card}
                onClick={() => {
                  navigate(`/my_profile/${profileUser._id}`);
                }}
              >
                <img
                  src={`${BASE_URL}uploads/${profileUser.profilePicture}`}
                  alt="profile"
                  className={styles.profileImg}
                />

                <div className={styles.info}>
                  <div className={styles.nameRow}>
                    <h4>{profileUser.name || "Unknown"}</h4>
                  </div>
                  <p>{profileUser.followers?.length || 0} followers</p>

                  <button
                    className={`${
                      isFollowing ? styles.unfollowBtn : styles.followBtn
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(profileUser._id, isFollowing);
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
