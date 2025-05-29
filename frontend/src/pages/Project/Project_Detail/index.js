import React, { useEffect, useState } from "react";
import styles from "./Style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllProjects,
  getLikedProjects,
  getProjectById,
  getSavedProjects,
  incrementViews,
} from "../../../config/redux/action/projectAction";
import { deleteProject } from "../../../config/redux/action/adminAction";
import { getAllComments } from "../../../config/redux/action/commentAction";
import Video from "./Video";
import Instruction from "./Instruction";
import Code from "./Code";
import Dessertation from "./Dessertation";

function Project() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [viewMore, setViewMore] = useState(false);
  const [activeTab, setActiveTab] = useState("Guide");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const projectState = useSelector((state) => state.project);
  const { id } = params;
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = localStorage.getItem("userId");
  const isAdmin = user?.type === "admin";

  useEffect(() => {
    dispatch(incrementViews(id));
    dispatch(getProjectById(id));
    dispatch(getAllProjects());
    dispatch(getLikedProjects(userId));
    dispatch(getSavedProjects(userId));
    dispatch(getAllComments(id));
  }, [dispatch, id, userId]);

  const handleDelete = async () => {
    await dispatch(deleteProject(projectState?.projectDetails?._id));
    setShowConfirmModal(false);
    navigate("/admin/projects");
  };

  const tabOptions = ["Guide", "Preview", "Source Code", "Dissertation"];

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
                onClick={() => setViewMore(!viewMore)}
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
                onClick={() =>
                  navigate(
                    `/my_profile/${projectState?.projectDetails?.userId?._id}`
                  )
                }
              >
                {projectState?.projectDetails?.userId?.name}
              </span>
            </p>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              Uploaded At{" "}
              <span style={{ fontWeight: "bolder" }}>
                {projectState?.projectDetails?.createdAt.slice(0, 10)}
              </span>
            </p>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              Under the supervison of{" "}
              <span style={{ fontWeight: "bolder" }}>
                {projectState?.projectDetails?.supervisor || "N/A"}
              </span>
            </p>
          </div>
          {isAdmin && (
            <div style={{ marginTop: "1rem" }}>
              <span
                className={styles.delete_project_button}
                onClick={() => setShowConfirmModal(true)}
              >
                Delete This Project
              </span>
            </div>
          )}
        </div>

        <div className={styles.project_details_wrapper_middle}>
          <div className={styles.project_details_wrapper_middle_options}>
            {tabOptions.map((tab) => (
              <div
                key={tab}
                className={`${
                  styles.project_details_wrapper_middle_options_item
                } ${activeTab === tab ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <h4>{tab}</h4>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.project_details_wrapper_bottom}>
          {activeTab === "Preview" && <Video />}
          {activeTab === "Guide" && <Instruction />}
          {activeTab === "Source Code" && <Code />}
          {activeTab === "Dissertation" && <Dessertation />}
        </div>
      </div>

      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this project?</p>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button className={styles.confirmButton} onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Project;
