import React, { useEffect, useCallback } from "react";
import styles from "./Style.module.css";
import Heatmap from "./Heatmap/index";
import RecommendProjects from "./RecommendProjects/index";
import RecommendProfiles from "./RecommendProfiles/index";
import TopUsers from "./TopUsers/index";
import TopProjects from "./TopProjects/index";
import LineChart from "./LineChart/index";
import BarChart from "./BarChart/index";
import Greeting from "./Greeting/index";
import { useDispatch } from "react-redux";
import {
  getAllProfiles,
  getRecommendedProfiles,
} from "../../config/redux/action/authAction";

function Dashboard() {
  const userId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const dispatch = useDispatch();

  const refreshProfiles = useCallback(() => {
    if (userId) {
      dispatch(getAllProfiles());
      dispatch(getRecommendedProfiles(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.greeting_container}>
        <Greeting name={user?.name} />
      </div>
      <div className={styles.charts_container}>
        <div>
          <h4>Your Activity(Past 12 Months)</h4>
        </div>
        <div>
          <div className={styles.line_chart_wrapper}>
            <LineChart userId={userId} />
          </div>
          <div className={styles.bar_chart_wrapper}>
            <BarChart userId={userId} />
          </div>
        </div>
      </div>

      <Heatmap userId={userId} />
      <RecommendProjects userId={userId} />
      <TopProjects userId={userId} />
      <RecommendProfiles userId={userId} refreshProfiles={refreshProfiles} />
      <TopUsers userId={userId} refreshProfiles={refreshProfiles} />
    </div>
  );
}

export default Dashboard;
