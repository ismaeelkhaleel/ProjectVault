import UserActivity from "../models/userActivity.model.js";
import mongoose from "mongoose";
export const heatMap = async (req, res) => {
  try {
    const userId = req.params.id;

    const activityData = await UserActivity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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

    const formattedData = activityData.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
