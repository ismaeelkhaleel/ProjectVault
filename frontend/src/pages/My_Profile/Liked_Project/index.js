import React, { useEffect } from "react";
import { getLikedProjects } from "../../../config/redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";

function LikedProject() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const likedProjects = authState?.userLikedProjects || [];

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(getLikedProjects(userId));
    console.log(likedProjects);
  },[dispatch, userId]);

  return <div>Liked</div>;
}

export default LikedProject;
