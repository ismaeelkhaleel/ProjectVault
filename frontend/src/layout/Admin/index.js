import React, { useEffect } from "react";
import styles from "./Style.module.css";
import { getUnVerifiedProfiles } from "../../config/redux/action/adminAction/index";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminState = useSelector((state) => state.admin);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(getUnVerifiedProfiles(userId));
  }, [dispatch, userId]);

  const profiles = adminState?.unVerifiedProfiles?.profiles || [];

  return (
    <div className={styles.dashboard}>
      <h2>Unverified Profiles</h2>
      {profiles.length === 0 ? (
        <p>No user requests for verification</p>
      ) : (
        <div className={styles.profileList}>
          {profiles.map((profile) => (
            <div
              className={styles.card}
              key={profile._id}
              onClick={() => {
                navigate(`/profile-verify/detail/${profile._id}`);
              }}
            >
              <img
                src={`${BASE_URL}uploads/${profile.user.profilePicture}`}
                alt="Profile"
                className={styles.profileImage}
              />
              <div className={styles.details}>
                <h4>{profile.user.name}</h4>
                {profile.course.length > 0 ? (
                  <p>
                    <b>Course:</b>
                    {profile.course}
                  </p>
                ) : (
                  <p>
                    <b>Course:</b>N/A
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
