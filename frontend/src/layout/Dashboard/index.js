import React from "react";
import styles from "./Style.module.css";
import Heatmap from "./Heatmap/index";
import RecommendProjects from "./RecommendProjects/index";
import RecommendProfiles from "./RecommendProfiles/index";

function Dashboard() {
  const userId = localStorage.getItem("userId");
  return (
    <div className={styles.dashboard_container}>
      <Heatmap userId={userId} />
      <RecommendProjects userId={userId} />
      <RecommendProfiles userId={userId} />
    </div>
  );
}

export default Dashboard;
