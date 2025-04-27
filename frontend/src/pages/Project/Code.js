import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCodeTree } from "../../config/redux/action/projectAction";
import { useParams } from "react-router-dom";

function Code() {
  const dispatch = useDispatch();
  const params = useParams();
  const projectState = useSelector((state) => state.project);
  const codePath = projectState?.projectDetails?.clonedPath;
  const projectId = params;

  useEffect(() => {
    console.log(codePath);
    dispatch(getCodeTree(projectId));
    console.log(projectState);
  },[dispatch, projectId]);

  return <div>Code</div>;
}

export default Code;
