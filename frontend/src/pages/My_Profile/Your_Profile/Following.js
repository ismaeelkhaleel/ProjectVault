import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  getUserFollowingList } from "../../../config/redux/action/authAction";
import { BASE_URL } from "../../../config";
import styles from "./Style.module.css";

function Following() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

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
            const isFollowing =
              authState?.user?.profile?.user?.following?.includes(following._id);

            return (
              <div
                className={
                  styles.profile_container_card_bottom_right_follower_item
                }
                key={index}
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