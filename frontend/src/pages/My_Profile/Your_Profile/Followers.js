import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, getUserFollowerList } from "../../../config/redux/action/authAction";
import { BASE_URL } from "../../../config";
import styles from "./Style.module.css";
import { useNavigate } from "react-router-dom";

function Followers() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const userId = authState?.user?.profile?.user?._id;
  useEffect(() => {
    if (userId) {
      dispatch(getUserFollowerList(userId));
    }
  }, [dispatch, userId]);
  const followers = authState?.userFollowerList || [];

  return (
    <div className={styles.profile_container_card_bottom_right_follower}>
      {followers.length > 0 ? (
        <div>
          {followers.map((follower, index) => {
            return (
              <div
                className={
                  styles.profile_container_card_bottom_right_follower_item
                }
                key={index}
                onClick={() => {
                  navigate(`/my_profile/${follower._id}`);
                  dispatch(getUserProfile(follower._id));
                }}
              >
                <div>
                  <img
                    src={`${BASE_URL}uploads/${follower.profilePicture}`}
                    alt=""
                  />
                </div>
                <div className={styles.follower_info}>
                  <h3>{follower.name}</h3>
                  <p>@{follower.username}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No followers found.</p>
      )}
    </div>
  );
}

export default Followers;
