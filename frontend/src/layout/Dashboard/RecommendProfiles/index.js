import React from "react";
import styles from "./Style.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  followUser,
  unfollowUser,
} from "../../../config/redux/action/authAction";
import { BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

function TopUsers({ userId ,refreshProfiles }) {
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
      <h3>Suggested for You</h3>
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
