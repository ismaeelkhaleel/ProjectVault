import { useEffect, useState } from "react";
import socket from "../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNotifications,
  markAsSeen,
  deleteAllNotifications,
  deleteNotification,
} from "../config/redux/action/NotificationAction/index";
import styles from "./NotificationListener.module.css";

const NotificationListener = ({ userId }) => {
  const [realtimeNotifs, setRealtimeNotifs] = useState([]);
  const dispatch = useDispatch();

  const notificationState = useSelector((state) => state.notification);
  const fetchedNotifications = Array.isArray(notificationState?.notifications)
    ? notificationState.notifications
    : Array.isArray(notificationState)
    ? notificationState
    : [];

  const allNotifications = [
    ...realtimeNotifs,
    ...fetchedNotifications.filter(
      (notif) => !realtimeNotifs.some((r) => r._id === notif._id)
    ),
  ];

  useEffect(() => {
    if (userId) {
      socket.emit("register", userId);
    }

    socket.on("notification", (data) => {
      setRealtimeNotifs((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  useEffect(() => {
    if (userId) {
      dispatch(getAllNotifications(userId));
    }
    console.log(notificationState);
  }, [dispatch, userId]);

  const handleMarkAllAsRead = async () => {
    await dispatch(markAsSeen(userId));
    dispatch(getAllNotifications(userId));
  };
  const handleSingleDeleteNotification = async (notificationId) => {
    await dispatch(deleteNotification(notificationId));
    await dispatch(getAllNotifications(userId));
    setRealtimeNotifs((prev) => prev.filter((n) => n._id !== notificationId));
  };
  const handleAllDeleteNotification = async () => {
    await dispatch(deleteAllNotifications(userId));
    await dispatch(getAllNotifications(userId));
    setRealtimeNotifs([]);
  };

  const renderMessage = (notif) => {
    const senderName = notif.sender?.username || "Someone";

    switch (notif.type) {
      case "follow":
        return `${senderName} started following you.`;
      case "like_project":
        return `${senderName} liked your project.`;
      case "comment":
        return `${senderName} commented on your project.`;
      case "reply":
        return `${senderName} replied to your comment.`;
      case "comment_like":
        return `${senderName} liked your comment.`;
      default:
        return "You have a new notification.";
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h4 className={styles.title}>Notifications</h4>
        {allNotifications.length > 0 && (
          <div className={styles.wrapper_header}>
            <button
              className={styles.markReadBtn}
              onClick={handleAllDeleteNotification}
            >
              Delete All
            </button>
            <button
              onClick={handleMarkAllAsRead}
              className={styles.markReadBtn}
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
      {allNotifications.length > 0 ? (
        <div className={styles.notificationList}>
          {allNotifications.map((notif, idx) => (
            <div
              key={notif._id || idx}
              className={`${styles.notificationCard} ${
                notif.seen ? styles.seen : styles.unseen
              }`}
            >
              <div>🔔 {renderMessage(notif)}</div>
              <div className={styles.delete_notification}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                  onClick={() => {
                    handleSingleDeleteNotification(notif._id);
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.notificationList}>
          <div className={styles.notificationCard}>
            No Notification Available
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationListener;
