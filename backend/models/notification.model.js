import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['follow', 'comment', 'reply', 'like_project', 'like_comment'],
    required: true,
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
