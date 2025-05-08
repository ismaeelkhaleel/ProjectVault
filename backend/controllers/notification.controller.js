import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  const id = req.params.id;
  try {
    const notifications = await Notification.find({ recipient: id })
      .sort({ createdAt: -1 })
      .populate("sender", "username")
      .exec();

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markAsSeen = async (req, res) => {
  const id = req.params.id;
  try {
    await Notification.updateMany({ recipient: id }, { seen: true });
    res.json({ message: "All notifications marked as seen" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  try {
    const deleted = await Notification.findByIdAndDelete(notificationId);
    res.json({
      message: "Notification deleted successfully",
      notificationId,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

export const deleteAllNotifications = async (req, res) => {
  const id = req.params.id;
  try {
    await Notification.deleteMany({ recipient: id });
    res.json({ message: "All notifications deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notifications" });
  }
};
