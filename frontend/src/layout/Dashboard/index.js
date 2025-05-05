import React, { useEffect, useCallback } from "react";
import styles from "./Style.module.css";
import Heatmap from "./Heatmap/index";
import RecommendProjects from "./RecommendProjects/index";
import RecommendProfiles from "./RecommendProfiles/index";
import TopUsers from "./TopUsers/index";
import TopProjects from "./TopProjects/index";
import { useDispatch } from "react-redux";
import {
  getAllProfiles,
  getRecommendedProfiles,
} from "../../config/redux/action/authAction";

function Dashboard() {
  const userId = localStorage.getItem("userId");
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
      <Heatmap userId={userId} />
      <RecommendProjects userId={userId} />
      <TopProjects userId={userId} />
      <RecommendProfiles userId={userId} refreshProfiles={refreshProfiles} />
      <TopUsers userId={userId} refreshProfiles={refreshProfiles} />
    </div>
  );
}

export default Dashboard;
