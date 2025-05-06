import UserActivity from "../models/userActivity.model.js";
import mongoose from "mongoose";

export const heatMap = async (req, res) => {
  try {
    const userId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(userId);

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // Heatmap data (daily counts)
    const heatmapData = await UserActivity.aggregate([
      {
        $match: {
          userId: objectId,
          activityDate: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$activityDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const heatmap = heatmapData.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    // Monthly summary for each activityType
    const monthlyData = await UserActivity.aggregate([
      {
        $match: {
          userId: objectId,
          activityDate: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: {
            activityType: "$activityType",
            year: { $year: "$activityDate" },
            month: { $month: "$activityDate" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Initialize structure
    const activityTypes = [
      "login",
      "comment",
      "like",
      "project_submission",
      "comment_like",
      "project_save",
    ];

    const summaryByMonth = {};
    activityTypes.forEach((type) => {
      summaryByMonth[type] = new Array(12).fill(0);
    });

    monthlyData.forEach((item) => {
      const { activityType, month, year } = item._id;
      const date = new Date(year, month - 1); // month is 1-based
      const diffInMonths =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth());

      const index = 11 - diffInMonths; // index 11 is current month
      if (index >= 0 && index < 12) {
        summaryByMonth[activityType][index] += item.count;
      }
    });

    res.json({ heatmap, summaryByMonth });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
