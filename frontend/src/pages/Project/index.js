import React, { useEffect, useState } from "react";
import styles from "./Style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllProjects,
  getLikedProjects,
  getProjectById,
  getSavedProjects,
} from "../../config/redux/action/projectAction";
import Video from "./Video";
import Instruction from "./Instruction";
import Code from "./Code";
function Project() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [viewMore, setViewMore] = useState(false);
  const [activeTab, setActiveTab] = useState("Demo Video");

  const projectState = useSelector((state) => state.project);

  const { id } = params;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(getProjectById(id));
    dispatch(getAllProjects());
    dispatch(getLikedProjects(userId));
    dispatch(getSavedProjects(userId));
  }, [dispatch, id, userId]);

  return (
    <div className={styles.project_details_container}>
      <div className={styles.project_details_wrapper}>
        <div className={styles.project_details_wrapper_top}>
          <div className={styles.project_details_wrapper_top_title}>
            <h1>{projectState?.projectDetails?.title}</h1>
          </div>
          <div className={styles.project_details_wrapper_top_desc}>
            <p>
              {viewMore
                ? projectState?.projectDetails?.description
                : projectState?.projectDetails?.description.slice(0, 150) +
                  "....."}
              &nbsp;&nbsp;
              <b
                onClick={() => {
                  setViewMore(!viewMore);
                }}
                style={{ cursor: "pointer", color: "#6dd5ed" }}
              >
                {viewMore ? "view less" : "view more"}
              </b>
            </p>
          </div>
          <div>
            <p>
              Uploaded By{" "}
              <span
                style={{ fontWeight: "bolder", cursor: "pointer" }}
                onClick={() => {
                  navigate(
                    `/my_profile/${projectState?.projectDetails?.userId?._id}`
                  );
                }}
              >
                {projectState?.projectDetails?.userId?.name}
              </span>
            </p>
          </div>
        </div>
        <div className={styles.project_details_wrapper_middle}>
          <div className={styles.project_details_wrapper_middle_options}>
            <div
              className={styles.project_details_wrapper_middle_options_item}
              onClick={() => {
                setActiveTab("Demo Video");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
              </svg>
              <h4>Demo Video</h4>
            </div>
            <div
              className={styles.project_details_wrapper_middle_options_item}
              onClick={() => {
                setActiveTab("Instructions");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>

              <h4>Instructions</h4>
            </div>
            <div
              className={styles.project_details_wrapper_middle_options_item}
              onClick={() => {
                setActiveTab("Code");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z"
                  clipRule="evenodd"
                />
              </svg>

              <h4>Code</h4>
            </div>
          </div>
        </div>
        <div className={styles.project_details_wrapper_bottom}>
          {activeTab === "Demo Video" && <Video />}
          {activeTab === "Instructions" && <Instruction />}
          {activeTab === "Code" && <Code />}
        </div>
      </div>
    </div>
  );
}

export default Project;
