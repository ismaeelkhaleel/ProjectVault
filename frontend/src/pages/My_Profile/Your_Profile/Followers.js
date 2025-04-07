import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFollowerList } from "../../../config/redux/action/authAction";
import { BASE_URL } from "../../../config";
import styles from "./Style.module.css";

function Followers() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const userId = authState?.user?.profile?.user?._id;
  const followers = authState?.userFollowerList || [];

  useEffect(() => {
    if (userId) {
      dispatch(getUserFollowerList(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className={styles.profile_container_card_bottom_right_follower}>
      {followers.followers.length > 0 ? (
        <div>
          {followers.followers.map((follower, index) => {
            const isFollowing =
              authState?.user?.profile?.user?.following?.includes(follower._id);

            return (
              <div
                className={
                  styles.profile_container_card_bottom_right_follower_item
                }
                key={index}
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
