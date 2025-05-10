import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadProject } from "../../../config/redux/action/projectAction";
import styles from "./Style.module.css";
import categoryOptions from "../../../data/categories";
import technologyOptions from "../../../data/technologies";
import yearOptions from "../../../data/years";
import Select from "react-select";
import { getUserProfile } from "../../../config/redux/action/authAction";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubRepo: "",
    category: "",
    technology: "",
    year: "",
  });

  const [demoVideo, setDemoVideo] = useState(null);
  const [desertation, setDesertation] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const authState = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const { isLoading, isError, uploadSuccess } = useSelector(
    (state) => state.project
  );

  const verified = authState?.user?.profile?.verified;
  const isDisabled = isLoading || !verified;

  useEffect(() => {
    dispatch(getUserProfile(userId));
  }, [dispatch, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    console.log(authState);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "demoVideo") setDemoVideo(files[0]);
    if (name === "desertation") setDesertation(files[0]);
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Project title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.githubRepo.trim())
      errors.githubRepo = "GitHub repo link is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.technology.trim())
      errors.technology = "Technology is required";
    if (!formData.year.trim()) errors.year = "Year is required";
    if (!demoVideo) errors.demoVideo = "Please upload a demo video";
    if (!desertation) errors.desertation = "Please upload a dissertation";

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("userId", userId);
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("githubRepo", formData.githubRepo);
    formDataToSubmit.append("category", formData.category);
    formDataToSubmit.append("technology", formData.technology);
    formDataToSubmit.append("year", formData.year);
    formDataToSubmit.append("demoVideoPath", demoVideo);
    formDataToSubmit.append("desertationPath", desertation);

    dispatch(uploadProject(formDataToSubmit));
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#e1e0e0",
      border: "none",
      borderColor: state.isFocused ? "none" : "none",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      minHeight: "40px",
      fontSize: "14px",
      borderRadius: "6px",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e0f2fe",
      color: "#0369a1",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0369a1",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
      overflowY: "auto",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    }),
  };
  useEffect(() => {
    if (uploadSuccess) {
      navigate("/your_project");
      window.location.reload(true);
    }
  }, [uploadSuccess, navigate]);

  return (
    <div className={styles.main_container}>
      {!verified && (
        <p>
          You are not a verified user, Please update your profile to verify your
          account{" "}
          <b
            onClick={() => {
              navigate(`/my_profile/${userId}`);
            }}
          >
            click here
          </b>{" "}
        </p>
      )}
      <div className={styles.container}>
        <h2 className={styles.heading}>Add Project</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={styles.input}
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter Project Title"
            />
            {validationErrors.title && (
              <p className={styles.error}>{validationErrors.title}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter Project Description"
            />
            {validationErrors.description && (
              <p className={styles.error}>{validationErrors.description}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="githubRepo" className={styles.label}>
              GitHub Repository
            </label>
            <input
              type="url"
              id="githubRepo"
              name="githubRepo"
              className={styles.input}
              value={formData.githubRepo}
              onChange={handleInputChange}
              placeholder="Enter Github Repository Link"
            />
            {validationErrors.githubRepo && (
              <p className={styles.error}>{validationErrors.githubRepo}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Technology</label>
            <Select
              styles={customSelectStyles}
              isMulti
              options={technologyOptions}
              value={selectedTechnologies}
              onChange={(selected) => {
                setSelectedTechnologies(selected);
                setFormData((prev) => ({
                  ...prev,
                  technology: selected.map((tech) => tech.value).join(", "),
                }));
              }}
              placeholder="Select technologies"
            />
            {validationErrors.technology && (
              <p className={styles.error}>{validationErrors.technology}</p>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <Select
                styles={customSelectStyles}
                options={categoryOptions}
                value={categoryOptions.find(
                  (opt) => opt.value === formData.category
                )}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, category: selected.value }))
                }
                placeholder="Select a category"
              />
              {validationErrors.category && (
                <p className={styles.error}>{validationErrors.category}</p>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="year" className={styles.label}>
                Year
              </label>
              <Select
                styles={customSelectStyles}
                id="year"
                name="year"
                options={yearOptions}
                value={yearOptions.find(
                  (option) => option.value === formData.year
                )}
                onChange={(selectedOption) =>
                  setFormData((prev) => ({
                    ...prev,
                    year: selectedOption.value,
                  }))
                }
                placeholder="Select year"
              />
              {validationErrors.year && (
                <p className={styles.error}>{validationErrors.year}</p>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Demo Video</label>
            <input
              type="file"
              id="demoVideo"
              name="demoVideo"
              accept="video/*"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            {validationErrors.demoVideo && (
              <p className={styles.error}>{validationErrors.demoVideo}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Dissertation File</label>
            <input
              type="file"
              id="desertation"
              name="desertation"
              accept="application/pdf"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            {validationErrors.desertation && (
              <p className={styles.error}>{validationErrors.desertation}</p>
            )}
          </div>

          {submitError && <p className={styles.error}>{submitError}</p>}
          {isError && <p className={styles.error}>{isError}</p>}
          {isLoading && <p>Please wait we are proceeding your request</p>}

          <div className={styles.tooltipWrapper}>
            <button
              type="submit"
              className={styles.button}
              disabled={isDisabled}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            {!verified && (
              <span className={styles.tooltip}>You are not verified</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
