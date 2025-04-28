import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postComment, getAllComments } from "../../config/redux/action/commentAction";
import styles from "./Style.module.css";
import { BASE_URL } from "../../config";

const CommentSection = ({ projectId }) => {
  const dispatch = useDispatch();
  const commentState = useSelector((state) => state.comment);
  const [commentContent, setCommentContent] = useState("");

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (projectId) {
      dispatch(getAllComments(projectId));
    }
  }, [dispatch, projectId]);

  const handlePostComment = async () => {
    if (commentContent.trim() === "") return;

    await dispatch(postComment({
      projectId,
      content: commentContent,
      parentId: null,  
      userId: localStorage.getItem("userId"),
    }));

    setCommentContent("");
    dispatch(getAllComments(projectId));  
  };

  return (
    <div className={styles.commentSectionWrapper}>
      <div className={styles.currentUserCommentBox}>
        <div className={styles.currentUserInfo}>
          <img
            src={`${BASE_URL}uploads/${user?.profilePicture}`}
            alt=""
          />
          <div>
            <h4>{user?.name}</h4>
            <p>{user?.username}</p>
          </div>
        </div>

        <input
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
        />
        <button onClick={handlePostComment}>Post Comment</button>
      </div>

      <div className={styles.allComments}>
        {commentState?.comments?.length > 0 ? (
          commentState.comments.map((comment) => (
            <div key={comment._id} className={styles.singleComment}>
              <p><strong>{comment.user.name}:</strong> {comment.content}</p>
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