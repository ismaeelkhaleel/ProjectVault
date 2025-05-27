import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfileByAdmin,
  verifyProfile,
  rejectRequest,
} from "../../../config/redux/action/adminAction/index";
import { blockAndUnblockUser } from "../../../config/redux/action/adminAction";
import { BASE_URL } from "../../../config";
import styles from "./ProfileDetail.module.css";

function ProfileDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const adminState = useSelector((state) => state.admin);
  const { id } = params;

  const profile = adminState?.unVerifiedProfileDetail?.profile;
  const isVerified = adminState?.unVerifiedProfileDetail?.profile?.verified;
  const isRejected =
    !adminState?.unVerifiedProfileDetail?.profile?.verifRequest;

  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    dispatch(getProfileByAdmin(id));
  }, [dispatch, id]);

  const handleVerify = () => {
    dispatch(verifyProfile(id));
    window.location.reload(true);
  };

  const handleReject = () => {
    dispatch(rejectRequest(id));
    window.location.reload(true);
  };

  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }
  const handleBlockToggle = () => {
    dispatch(blockAndUnblockUser(profile.user._id)).then(() => {
      dispatch(getProfileByAdmin(id));
    });
  };

  return (
    <div className={styles.container}>
      <h2>Profile Verification Detail</h2>
      <div className={styles.details}>
        <div className={styles.profileImage_container}>
          <img
            src={`${BASE_URL}uploads/${profile.user.profilePicture}`}
            alt="Profile"
            className={styles.profileImage}
            onClick={() =>
              openImageModal(
                `${BASE_URL}uploads/${profile.user.profilePicture}`
              )
            }
          />
        </div>

        <div className={styles.profiledetail_container}>
          <p>
            <strong>Name:</strong> {profile?.user?.name}
          </p>
          <p>
            <strong>Username:</strong> {profile?.user?.username}
          </p>
          <p>
            <strong>Enrollment Number:</strong> {profile?.enrollNumber}
          </p>
          <p>
            <strong>Faculty Number:</strong> {profile?.facNumber}
          </p>
          <p>
            <strong>Course:</strong> {profile?.course}
          </p>

          <div className={styles.idCardContainer}>
            <p>
              <strong>ID Card:</strong>
            </p>
            <img
              src={`${BASE_URL}${profile.idCard}`}
              alt="ID Card"
              className={styles.idCardImage}
              onClick={() => openImageModal(`${BASE_URL}${profile.idCard}`)}
            />
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.button} ${styles.verify}`}
              onClick={handleVerify}
              disabled={isVerified || isRejected}
            >
              {isVerified
                ? "Already Verified"
                : isRejected
                ? "Cannot Verify (Rejected)"
                : "Verify"}
            </button>
            <button
              className={`${styles.button} ${styles.reject}`}
              onClick={handleReject}
              disabled={isVerified || isRejected}
            >
              {isRejected
                ? "Already Rejected"
                : isVerified
                ? "Cannot Reject (Verified)"
                : "Reject"}
            </button>
          </div>
          <button
            className={`${styles.block_button} ${
              profile.user.blocked ? styles.verify : styles.reject
            }`}
            onClick={handleBlockToggle}
          >
            {profile.user.blocked ? "Unblock User" : "Block User"}
          </button>
        </div>
      </div>

      {modalImage && (
        <div className={styles.modal} onClick={closeImageModal}>
          <button className={styles.closeButton} onClick={closeImageModal}>
            ✖
          </button>
          <img src={modalImage} alt="Full Screen" />
        </div>
      )}
    </div>
  );
}

export default ProfileDetail;
