import React  from "react";
import styles from "./Style.module.css"
import Heatmap from "./Heatmap/index";
import Recommend from "./Recommend/index";

function Dashboard() {
  const userId = localStorage.getItem("userId");
  return (
    <div className={styles.dashboard_container}>
      <Heatmap userId={userId} />
      <Recommend userId={userId} />
    </div>
  );
}

export default Dashboard;
