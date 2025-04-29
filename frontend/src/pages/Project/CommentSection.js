import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postComment,
  getAllComments,
} from "../../config/redux/action/commentAction";
import styles from "./Style.module.css";
import { BASE_URL } from "../../config";
import { formatDistanceToNowStrict } from "date-fns";

function getShortTimeAgo(date) {
  const full = formatDistanceToNowStrict(new Date(date));
  const [value, unit] = full.split(" ");

  if (unit.startsWith("second")) return `${value}s`;
  if (unit.startsWith("minute")) return `${value}m`;
  if (unit.startsWith("hour")) return `${value}h`;
  if (unit.startsWith("day")) return `${value}d`;
  if (unit.startsWith("week")) return `${value}w`;
  if (unit.startsWith("month")) return `${value}mo`;
  if (unit.startsWith("year")) return `${value}y`;

  return full;
}

const CommentSection = ({ projectId }) => {
  const dispatch = useDispatch();
  const commentState = useSelector((state) => state.comment);
  const [commentContent, setCommentContent] = useState("");
  const [isActive, setIsActive] = useState(false);

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (projectId) {
      dispatch(getAllComments(projectId));
    }
    console.log(commentState);
  }, [dispatch, projectId, commentState]);

  const handlePostComment = async () => {
    if (commentContent.trim() === "") return;

    await dispatch(
      postComment({
        projectId,
        content: commentContent,
        parentId: null,
        userId: localStorage.getItem("userId"),
      })
    );

    setCommentContent("");
    dispatch(getAllComments(projectId));
  };

  const handleCancelComment = () => {
    setCommentContent("");
    setIsActive(false);
  };

  return (
    <div className={styles.commentSectionWrapper}>
      <div className={styles.currentUserCommentBox}>
        <div className={styles.currentUserInfo}>
          <img src={`${BASE_URL}uploads/${user?.profilePicture}`} alt="" />
          <div>
            <h4>{user?.name}</h4>
            <p>{user?.username}</p>
          </div>
        </div>

        <input
          value={commentContent}
          onChange={(e) => {
            setCommentContent(e.target.value);
            setIsActive(true);
          }}
          onFocus={() => setIsActive(true)}
          placeholder="Write a comment..."
          rows="3"
        />
        {isActive && (
          <div className={styles.buttonRow}>
            <button onClick={handleCancelComment} className={styles.cancelBtn}>
              Cancel
            </button>
            <button onClick={handlePostComment} className={styles.postBtn}>
              Post
            </button>
          </div>
        )}
      </div>

      <div className={styles.allComments}>
        {commentState?.comments?.comments?.length > 0 ? (
          commentState?.comments?.comments?.map((comment) => (
            <div key={comment._id} className={styles.singleComment}>
              <div>
                <div className={styles.singleComment_image}>
                  <img
                    src={`${BASE_URL}uploads/${comment?.userId?.profilePicture}`}
                    alt={comment?.userId?.username}
                  />
                </div>
                <div className={styles.singleComment_info}>
                  <div className={styles.singleComment_header}>
                    <h4>{comment?.userId?.username}</h4>
                    <span>{getShortTimeAgo(comment?.createdAt)}</span>
                  </div>
                  <p>{comment?.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first one!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
