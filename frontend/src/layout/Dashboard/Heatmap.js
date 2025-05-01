import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHeatMap } from "../../config/redux/action/authAction";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import styles from "./Heatmap.module.css";

const Heatmap = ({ userId }) => {
  const [activityData, setActivityData] = useState([]);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getHeatMap(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (authState?.userActivityData) {
      setActivityData(authState.userActivityData);
      console.log("Frontend Data:", authState.userActivityData);
    }
  }, [authState?.userActivityData]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contribution Activity</h2>
      <div className={styles.heatmap}>
        <CalendarHeatmap
          startDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
          endDate={new Date()}
          values={activityData}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count >= 4) return "color-github-4";
            if (value.count >= 3) return "color-github-3";
            if (value.count >= 2) return "color-github-2";
            return "color-github-1";
          }}
          tooltipDataAttrs={(value) => ({
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": value.date
              ? `${value.date}: ${value.count} activities`
              : "",
          })}
          showWeekdayLabels
        />
        <Tooltip id="heatmap-tooltip" className={styles.heatmap_tooltip} />
      </div>
    </div>
  );
};

export default Heatmap;
