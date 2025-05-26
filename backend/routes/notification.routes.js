import express from 'express';
import { deleteAllNotifications, deleteNotification, getNotifications, markAsSeen } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/notification/:id', getNotifications);
router.put('/notification/mark-as-seen/:id', markAsSeen);
router.delete("/delete-notification/:id", deleteNotification);
router.delete("/delete-all-notification/:id", deleteAllNotifications);

export default router;
