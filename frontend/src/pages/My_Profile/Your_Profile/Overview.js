import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyProfile,
  updateMyProfile,
} from "../../../config/redux/action/authAction";
import styles from "./Style.module.css";

function Overview({ isEditable, setIsEditable }) {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    bio: "",
    course: "",
    enrollNumber: "",
    facNumber: "",
    skills: "",
    idCard: null,
  });

  const [originalData, setOriginalData] = useState({});

  const hasChanges =
    JSON.stringify({
      ...formData,
      idCard: null,
    }) !==
    JSON.stringify({
      ...originalData,
      idCard: null,
    });

  // Form validation
  const isFormValid =
    formData.bio.trim() &&
    formData.course.trim() &&
    formData.enrollNumber.trim() &&
    formData.facNumber.trim();

  useEffect(() => {
    dispatch(getMyProfile());
  }, []);

  useEffect(() => {
    if (authState?.user?.profile) {
      const profile = authState.user.profile;

      const updatedProfile = {
        bio: profile.bio || "",
        course: profile.course || "",
        enrollNumber: profile.enrollNumber || "",
        facNumber: profile.facNumber || "",
        skills: Array.isArray(profile.skills)
          ? profile.skills.map((s) => s.trim()).join(", ")
          : profile.skills || "",
        idCard: profile.idCard || null,
      };

      setFormData(updatedProfile);
      setOriginalData(updatedProfile);
    }
  }, [authState?.user?.profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      idCard: file,
    }));
  };

  const handleUpdate = async () => {
    const updatedData = {
      bio: formData.bio.trim(),
      course: formData.course.trim(),
      enrollNumber: formData.enrollNumber.trim(),
      facNumber: formData.facNumber.trim(),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0),
      idCard: formData.idCard,
    };

    try {
      const resultAction = await dispatch(updateMyProfile(updatedData));

      if (updateMyProfile.fulfilled.match(resultAction)) {
        await dispatch(getMyProfile());

        setIsEditable(false);
        setOriginalData(updatedData);
      } else {
        console.error("Update failed", resultAction.payload?.message);
      }
    } catch (err) {
      console.error("Unexpected error during update", err);
    }
  };

  return (
    <div className={styles.profile_container_card_bottom_right_overview}>
      <div>
        <p>Description:</p>
        {isEditable ? (
          <textarea
            value={formData.bio}
            onChange={handleChange}
            name="bio"
          ></textarea>
        ) : (
          <h4>{formData.bio}</h4>
        )}
      </div>
      <div>
        <p>Course:</p>
        {isEditable ? (
          <div>
            <input
              list="courses"
              name="course"
              id="course"
              className={styles.dropdown_input}
              value={formData.course}
              onChange={handleChange}
            />
            <datalist id="courses">
              <option value="MSc (Cyber Security)" />
              <option value="MCA" />
              <option value="BSc (CS)" />
            </datalist>
          </div>
        ) : (
          <h4>{formData.course}</h4>
        )}
      </div>
      <div>
        <p>Enrollment Number:</p>
        {isEditable ? (
          <input
            value={formData.enrollNumber}
            onChange={handleChange}
            type="text"
            name="enrollNumber"
          />
        ) : (
          <h3>{formData.enrollNumber}</h3>
        )}
      </div>
      <div>
        <p>Faculty Number:</p>
        {isEditable ? (
          <input
            value={formData.facNumber}
            onChange={handleChange}
            type="text"
            name="facNumber"
          />
        ) : (
          <h3>{formData.facNumber}</h3>
        )}
      </div>
      <div>
        <p>Skills:</p>
        {isEditable ? (
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Enter skills separated by commas"
          />
        ) : (
          <ul>
            {formData.skills ? (
              formData.skills
                .split(",")
                .map((skill, i) => <li key={i}>&#8226;&nbsp;{skill.trim()}</li>)
            ) : (
              <p>No skills added yet.</p>
            )}
          </ul>
        )}
      </div>
      {isEditable && (
        <div>
          <p>Upload Your Id Card:</p>
          <input
            type="file"
            id="idCard_upload"
            hidden
            onChange={handleFileChange}
          />
          <label htmlFor="idCard_upload" className={styles.file_upload_label}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
            </svg>
          </label>
          {formData.idCard && (
            <p style={{ fontSize: "14px", marginTop: "5px" }}>
              Selected file: {formData.idCard.name}
            </p>
          )}
        </div>
      )}

      {isEditable && <button onClick={handleUpdate}>{authState.isLoading ? "Updating..." : "Update Profile"}</button>}
    </div>
  );
}

export default Overview;
