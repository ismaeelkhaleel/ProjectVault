import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getHeatMap } from "../../../config/redux/action/authAction";
import activityTypesList from "../activityTypes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const colors = activityTypesList.reduce((acc, item) => {
  acc[item.key] = item.color;
  return acc;
}, {});
const getLast12MonthsLabels = () => {
  const labels = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      d.toLocaleString("default", { month: "short", year: "numeric" })
    );
  }
  return labels;
};

const LineChart = ({ userId }) => {
  const dispatch = useDispatch();
  const { userActivityData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userId) {
      dispatch(getHeatMap(userId));
    }
  }, [dispatch, userId]);

  const summaryByMonth = userActivityData?.summaryByMonth || {};
  const labels = getLast12MonthsLabels();

  const datasets = Object.keys(summaryByMonth).map((type) => {
  const activityType = activityTypesList.find(item => item.key === type);
  return {
    label: activityType ? activityType.label : type,
    data: summaryByMonth[type],
    borderColor: colors[type] || "#000",
    backgroundColor: `${colors[type]}33`,
    tension: 0.3,
    fill: true,
    pointStyle: "circle",
    pointRadius: 4,
    pointHoverRadius: 6,
  };
});

  const chartData = {
    labels,
    datasets,
  };

  const allValues = Object.values(summaryByMonth).flat();
  const maxYValue = allValues.length ? Math.max(...allValues) : 10;
  const stepSize = Math.ceil(maxYValue / 5);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          padding: 15,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize,
        },
      },
    },
  };

  return (
    <div>
      {datasets.length ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No activity data found for this user.</p>
      )}
    </div>
  );
};

export default LineChart;
