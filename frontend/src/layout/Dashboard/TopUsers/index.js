import React, { useEffect } from "react";
import styles from "./Style.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  followUser,
  unfollowUser,
  getAllProfiles,
} from "../../../config/redux/action/authAction";
import { BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

function TopUsers({ userId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allProfiles, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userId) {
      dispatch(getAllProfiles());
    }
  }, [dispatch, userId]);

  const handleFollowToggle = async (id, isFollowing) => {
    if (isFollowing) {
      await dispatch(unfollowUser({ userId, id }));
    } else {
      await dispatch(followUser({ userId, id }));
    }

    dispatch(getAllProfiles());
  };

  return (
    <div className={styles.container}>
      <h3>Suggested for You</h3>
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
                {/* Only show if match_percentage is available */}
                {profile?.match_percentage && (
                  <div className={styles.tooltip}>
                    {profile.match_percentage}% match
                  </div>
                )}

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
