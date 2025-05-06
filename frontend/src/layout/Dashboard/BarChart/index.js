import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useDispatch, useSelector } from "react-redux";
import { getHeatMap } from "../../../config/redux/action/authAction";
import activityTypesList from "../activityTypes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const HorizontalBarChart = ({ userId }) => {
  const dispatch = useDispatch();
  const { userActivityData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userId) {
      dispatch(getHeatMap(userId));
    }
  }, [dispatch, userId]);

  const summaryByMonth = userActivityData?.summaryByMonth || {};

  const activityTotals = activityTypesList.map((activity) => {
    const values = summaryByMonth[activity.key] || [];
    return values.reduce((sum, val) => sum + val, 0);
  });

  const chartData = {
    labels: activityTypesList.map((a) => a.label),
    datasets: [
      {
        label: "Total",
        data: activityTotals,
        backgroundColor: activityTypesList.map((a) => a.color),
        barThickness: 10,
        categoryPercentage: 1.0,
        barPercentage: 1.0,
        datalabels: {
          anchor: "end",
          align: "end",
        },
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#000",
        font: {
          weight: "bold",
        },
        formatter: Math.round,
      },
    },
    scales: {
      x: {
        display: Legend,
      },
      y: {
        display: Legend,
      },
    },
  };

  return (
    <div>
      {activityTotals.length ? (
        <div>
          <div style={{ height: "250px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <p>No activity data found for this user.</p>
      )}
    </div>
  );
};

export default HorizontalBarChart;