import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHeatMap } from "../../../config/redux/action/authAction";
import dayjs from "dayjs";
import styles from "./Style.module.css";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

const getColor = (count) => {
  if (count >= 4) return "#1e3a8a";
  if (count >= 3) return "#3b82f6";
  if (count >= 2) return "#93c5fd";
  if (count >= 1) return "#dbeafe";
  return "#f3f4f6";
};

const generateCalendarData = (rawData) => {
  const dateMap = {};
  rawData.forEach((item) => {
    const date = dayjs(item.date).format("YYYY-MM-DD");
    dateMap[date] = item.count;
  });

  const baseDate = dayjs().endOf("month");
  const months = [];

  for (let i = 11; i >= 0; i--) {
    const monthStart = baseDate.subtract(i, "month").startOf("month");
    const monthEnd = monthStart.endOf("month");

    const days = [];
    const startDay = monthStart.day();
    for (let j = 0; j < startDay; j++) {
      days.push({ isEmpty: true });
    }

    let current = monthStart;
    while (current.isSameOrBefore(monthEnd)) {
      const date = current.format("YYYY-MM-DD");
      days.push({
        date,
        count: dateMap[date] || 0,
        day: current.day(),
        isEmpty: false,
      });
      current = current.add(1, "day");
    }

    months.push({
      month: monthStart.month(),
      label: monthStart.format("MMM"),
      days,
    });
  }

  return months;
};

const Heatmap = ({ userId }) => {
  const lastMonthRef = useRef(null);
  const [monthsData, setMonthsData] = useState([]);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getHeatMap(userId));
  }, [dispatch, userId]);


  useEffect(() => {
    if (authState?.userActivityData?.heatmap) {
      if (Array.isArray(authState.userActivityData?.heatmap)) {
        const transformed = generateCalendarData(authState.userActivityData.heatmap);
        setMonthsData(transformed);
        setTimeout(() => {
          lastMonthRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        console.error(
          "userActivityData is not an array:",
          authState.userActivityData.heatmap
        );
      }
    }
  }, [authState?.userActivityData.heatmap]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Contribution Activity</h3>
      <div className={styles.monthsWrapper}>
        <div className={styles.monthsContainer}>
          {monthsData.map((month, idx) => (
            <div
              key={idx}
              className={styles.month}
              ref={idx === monthsData.length - 1 ? lastMonthRef : null}
            >
              <div className={styles.monthLabel}>{month.label}</div>
              <div className={styles.weekdays}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className={styles.weekdayCell}>
                    {d}
                  </div>
                ))}
              </div>

              <div className={styles.calendar}>
                {month.days.map((day, dayIdx) => (
                  <div key={dayIdx} className={styles.dayCell}>
                    {!day.isEmpty ? (
                      <div
                        className={styles.circle}
                        title={`${day.date}: ${day.count} activities`}
                        style={{ backgroundColor: getColor(day.count) }}
                      ></div>
                    ) : (
                      <div
                        className={styles.circle}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.legend}>
        <span>Less</span>
        <div
          className={styles.legendColor}
          style={{ backgroundColor: "#f3f4f6" }}
        ></div>
        <div
          className={styles.legendColor}
          style={{ backgroundColor: "#dbeafe" }}
        ></div>
        <div
          className={styles.legendColor}
          style={{ backgroundColor: "#93c5fd" }}
        ></div>
        <div
          className={styles.legendColor}
          style={{ backgroundColor: "#3b82f6" }}
        ></div>
        <div
          className={styles.legendColor}
          style={{ backgroundColor: "#1e3a8a" }}
        ></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
