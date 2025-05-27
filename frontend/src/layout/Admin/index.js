import React, { useEffect } from "react";
import styles from "./Style.module.css";
import {
  getUnVerifiedProfiles,
  getUserCount,
  getProjectCount,
  getCommentCount,
} from "../../config/redux/action/adminAction/index";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

// Chart.js imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const adminState = useSelector((state) => state.admin);
  const { unVerifiedProfiles, userCount, projectCount, commentCount } =
    adminState;

  const profiles = unVerifiedProfiles?.profiles || [];

  useEffect(() => {
    dispatch(getUnVerifiedProfiles(userId));
    dispatch(getUserCount());
    dispatch(getProjectCount());
    dispatch(getCommentCount());
  }, [dispatch, userId]);

  // Doughnut chart data
  const doughnutData = {
    labels: ["Users", "Projects", "Views", "Comments"],
    datasets: [
      {
        label: "Platform Stats",
        data: [
          userCount?.totalUsers || 0,
          projectCount?.totalProjects || 0,
          projectCount?.totalViews || 0,
          commentCount || 0,
        ],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.heading}>Admin Dashboard</h2>

      <div className={styles.chartsContainer}>
        <div
          className={styles.chartBox}
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h3 style={{ textAlign: "center" }}>Platform Overview</h3>
          <Doughnut data={doughnutData} />
        </div>

        <div className={styles.statsCard}>
          <h3>Platform Stats</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <h4>Users</h4>
              <p>{userCount?.totalUsers || 0}</p>
            </div>
            <div className={styles.statBox}>
              <h4>Projects</h4>
              <p>{projectCount?.totalProjects || 0}</p>
            </div>
            <div className={styles.statBox}>
              <h4>Views</h4>
              <p>{projectCount?.totalViews || 0}</p>
            </div>
            <div className={styles.statBox}>
              <h4>Comments</h4>
              <p>{commentCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className={styles.heading}>Unverified Profiles</h2>
      {profiles.length === 0 ? (
        <p style={{ textAlign: "center" }}>No further user for verification</p>
      ) : (
        <div className={styles.profileList}>
          {profiles.map((profile) => (
            <div
              className={styles.card}
              key={profile._id}
              onClick={() =>
                navigate(`/admin/user-profile/detail/${profile._id}`)
              }
            >
              <img
                src={`${BASE_URL}uploads/${profile.user.profilePicture}`}
                alt="Profile"
                className={styles.profileImage}
              />
              <div className={styles.details}>
                <h4>{profile.user.name}</h4>
                <p>
                  <b>Course:</b> {profile.course || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
