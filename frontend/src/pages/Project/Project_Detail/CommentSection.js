import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postComment,
  getAllComments,
  likeComment,
  dislikeComment,
  editComment,
  deleteComment,
} from "../../../config/redux/action/commentAction";
import styles from "./Style.module.css";
import { BASE_URL } from "../../../config";
import { formatDistanceToNowStrict } from "date-fns";
import { useNavigate } from "react-router-dom";

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
  const [isReplyActive, setIsReplyActive] = useState(false);
  const [openReplies, setOpenReplies] = useState({});
  const [replyInputVisible, setReplyInputVisible] = useState({});
  const [replyContents, setReplyContents] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (projectId) {
      dispatch(getAllComments(projectId));
    }
  }, [dispatch, projectId]);

  const handlePostComment = async () => {
    if (commentContent.trim() === "") return;

    await dispatch(
      postComment({
        projectId,
        content: commentContent,
        parentId: null,
        userId,
      })
    );

    setCommentContent("");
    setIsActive(false);
    dispatch(getAllComments(projectId));
  };

  const handleCancelComment = () => {
    setCommentContent("");
    setIsActive(false);
  };
  const handleReplyCancel = () => {
    setReplyContents("");
    setIsReplyActive(false);
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const getReplies = (parentId) => {
    return commentState?.comments?.comments?.filter(
      (c) => c.parentId && String(c.parentId._id) === String(parentId)
    );
  };
  const handleReplyChange = (commentId, value) => {
    setReplyContents((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const handlePostReply = async (parentId) => {
    const replyContent = replyContents[parentId]?.trim();
    if (!replyContent) return;

    await dispatch(
      postComment({
        projectId,
        content: replyContent,
        parentId,
        userId,
      })
    );

    setReplyContents((prev) => ({ ...prev, [parentId]: "" }));
    setReplyInputVisible((prev) => ({ ...prev, [parentId]: false }));
    setIsReplyActive(false);
    dispatch(getAllComments(projectId));
  };

  // Edit comment functions
  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditedContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleSaveEdit = async (commentId) => {
    if (editedContent.trim() === "") return;

    await dispatch(
      editComment({
        commentId,
        content: editedContent,
        projectId,
      })
    );

    setEditingCommentId(null);
    setEditedContent("");
    dispatch(getAllComments(projectId));
  };

  return (
    <div className={styles.commentSectionWrapper}>
      <div className={styles.currentUserCommentBox}>
        <div className={styles.currentUserInfo}>
          <img
            src={`${BASE_URL}uploads/${user?.profilePicture}`}
            alt={user?.username}
            onClick={() => {
              navigate(`/my_profile/${userId}`);
            }}
            style={{ cursor: "pointer" }}
          />
          <div>
            <h4
              onClick={() => {
                navigate(`/my_profile/${userId}`);
              }}
              style={{ cursor: "pointer" }}
            >
              {user?.name}
            </h4>
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
          placeholder="Unsure about something? Or have an idea? Type here..."
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
          commentState?.comments?.comments
            ?.filter((comment) => comment.parentId === null)
            ?.map((comment) => (
              <div key={comment._id} className={styles.singleComment}>
                <div>
                  <div className={styles.singleComment_image}>
                    <img
                      src={`${BASE_URL}uploads/${comment?.userId?.profilePicture}`}
                      alt={comment?.userId?.username}
                      onClick={() => {
                        navigate(`/my_profile/${comment?.userId?._id}`);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <div className={styles.singleComment_info}>
                    <div className={styles.singleComment_header}>
                      <div>
                        <h4
                          onClick={() => {
                            navigate(`/my_profile/${comment?.userId?._id}`);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {comment?.userId?.username}
                        </h4>
                        <span>{getShortTimeAgo(comment?.createdAt)}</span>
                      </div>
                      {comment?.userId?._id === userId && (
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="size-4"
                            style={{
                              width: "20px",
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={async () => {
                              await dispatch(
                                deleteComment({
                                  commentId: comment?._id,
                                  projectId,
                                })
                              );
                              dispatch(getAllComments(projectId));
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {editingCommentId === comment._id ? (
                      <>
                        <input
                          type="text"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className={styles.editInput}
                        />
                        <div className={styles.buttonRow}>
                          <button
                            onClick={handleCancelEdit}
                            className={styles.cancelBtn}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(comment._id)}
                            className={styles.postBtn}
                          >
                            Save
                          </button>
                        </div>
                      </>
                    ) : (
                      <p>{comment?.content}</p>
                    )}
                    
                    <div className={styles.singleComment_footer}>
                      <div>
                        <p>{comment?.likes}</p>
                        <div>
                          {comment?.likeBy?.includes(userId) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6"
                              style={{ color: "#3498db" }}
                              onClick={async () => {
                                await dispatch(
                                  dislikeComment({
                                    commentId: comment?._id,
                                    userId,
                                  })
                                );
                                dispatch(getAllComments(projectId));
                              }}
                            >
                              <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-6"
                              onClick={async () => {
                                await dispatch(
                                  likeComment({
                                    commentId: comment?._id,
                                    userId,
                                  })
                                );
                                dispatch(getAllComments(projectId));
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                            </svg>
                          )}
                        </div>
                        {comment?.userId?._id === userId && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="size-4"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEditComment(comment)}
                          >
                            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                            <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                          </svg>
                        )}
                      </div>
                      <p
                        onClick={() => {
                          setReplyInputVisible((prev) => ({
                            ...prev,
                            [comment._id]: !prev[comment._id],
                          }));
                          setIsReplyActive(false);
                        }}
                        style={{ cursor: "pointer" }}
                        className={styles.singleComment_footer_reply}
                      >
                        Reply
                      </p>
                    </div>
                    <div>
                      {replyInputVisible[comment._id] && (
                        <div className={styles.replyInputContainer}>
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyContents[comment._id] || ""}
                            onChange={(e) => {
                              handleReplyChange(comment._id, e.target.value);
                              setIsReplyActive(true);
                            }}
                            onFocus={() => setIsReplyActive(true)}
                          />
                          {isReplyActive && (
                            <div className={styles.buttonRow}>
                              <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                  setReplyInputVisible((prev) => ({
                                    ...prev,
                                    [comment._id]: false,
                                  }));
                                  handleReplyCancel();
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className={styles.postBtn}
                                onClick={() => handlePostReply(comment._id)}
                              >
                                Reply
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {getReplies(comment._id).length > 0 && (
                      <p
                        className={styles.viewReplies}
                        onClick={() => toggleReplies(comment._id)}
                        style={{ cursor: "pointer", color: "#3498db" }}
                      >
                        {openReplies[comment._id] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span>
                          {getReplies(comment._id).length}&nbsp;&nbsp;replies
                        </span>
                      </p>
                    )}

                    {openReplies[comment._id] &&
                      [...getReplies(comment._id)]
                        .sort(
                          (a, b) =>
                            new Date(a.createdAt) - new Date(b.createdAt)
                        )
                        .map((reply) => (
                          <div key={reply._id} className={styles.replyComment}>
                            <div className={styles.singleComment_image}>
                              <img
                                src={`${BASE_URL}uploads/${reply?.userId?.profilePicture}`}
                                alt={reply?.userId?.username}
                                onClick={() => {
                                  navigate(`/my_profile/${reply?.userId?._id}`);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                            <div className={styles.singleComment_info}>
                              <div className={styles.singleComment_header}>
                                <div>
                                  <h4
                                    onClick={() => {
                                      navigate(
                                        `/my_profile/${reply?.userId?._id}`
                                      );
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {reply?.userId?.username}
                                  </h4>
                                  <span>
                                    {getShortTimeAgo(reply?.createdAt)}
                                  </span>
                                </div>
                                {reply?.userId?._id === userId && (
                                  <div>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 16 16"
                                      fill="currentColor"
                                      className="size-4"
                                      style={{
                                        width: "20px",
                                        color: "red",
                                        cursor: "pointer",
                                      }}
                                      onClick={async () => {
                                        await dispatch(
                                          deleteComment({
                                            commentId: reply?._id,
                                            projectId,
                                          })
                                        );
                                        dispatch(getAllComments(projectId));
                                      }}
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              
                              {editingCommentId === reply._id ? (
                                <>
                                  <input
                                    type="text"
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className={styles.editInput}
                                  />
                                  <div className={styles.buttonRow}>
                                    <button
                                      onClick={handleCancelEdit}
                                      className={styles.cancelBtn}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSaveEdit(reply._id)}
                                      className={styles.postBtn}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <p>{reply?.content}</p>
                              )}
                              
                              <div className={styles.singleComment_footer}>
                                <div>
                                  <p>{reply?.likes}</p>
                                  <div>
                                    {reply?.likeBy?.includes(userId) ? (
                                      <svg
                                        onClick={async () => {
                                          await dispatch(
                                            dislikeComment({
                                              commentId: reply?._id,
                                              userId,
                                            })
                                          );
                                          dispatch(getAllComments(projectId));
                                        }}
                                        style={{
                                          color: "#3498db",
                                          cursor: "pointer",
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-5"
                                      >
                                        <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                      </svg>
                                    ) : (
                                      <svg
                                        onClick={async () => {
                                          await dispatch(
                                            likeComment({
                                              commentId: reply?._id,
                                              userId,
                                            })
                                          );
                                          dispatch(getAllComments(projectId));
                                        }}
                                        style={{ cursor: "pointer" }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="size-5"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                      </svg>
                                    )}
                                  </div>
                                  {reply?.userId?._id === userId && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 16 16"
                                      fill="currentColor"
                                      className="size-4"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleEditComment(reply)}
                                    >
                                      <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                                      <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
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