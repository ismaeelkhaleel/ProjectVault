import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, getUserFollowingList } from "../../../config/redux/action/authAction";
import { BASE_URL } from "../../../config";
import styles from "./Style.module.css";
import { useNavigate } from "react-router-dom";

function Following() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const userId = authState?.user?.profile?.user?._id;
  useEffect(() => {
    if (userId) {
      dispatch(getUserFollowingList(userId));
    }
  }, [dispatch, userId]);
  const following = authState?.userFollowingList || [];

  return (
    <div className={styles.profile_container_card_bottom_right_follower}>
      {following.length > 0 ? (
        <div>
          {following.map((following, index) => {
            return (
              <div
                className={
                  styles.profile_container_card_bottom_right_follower_item
                }
                key={index}
                onClick={() => {
                                  navigate(`/my_profile/${following._id}`);
                                  dispatch(getUserProfile(following._id));
                                }}
              >
                <div>
                  <img
                    src={`${BASE_URL}uploads/${following.profilePicture}`}
                    alt=""
                  />
                </div>
                <div className={styles.follower_info}>
                  <h3>{following.name}</h3>
                  <p>@{following.username}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No following found.</p>
      )}
    </div>
  );
}

export default Following;