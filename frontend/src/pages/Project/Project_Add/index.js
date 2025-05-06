import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadProject } from "../../../config/redux/action/projectAction";
import styles from "./Style.module.css";

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
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const { loading, error, project } = useSelector((state) => state.project);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "demoVideo") {
      setDemoVideo(files[0]);
    } else if (name === "desertation") {
      setDesertation(files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!demoVideo || !desertation) {
      setErrorMessage("Please upload both demo video and dissertation.");
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

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Add Project</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Project Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.input}
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="githubRepo" className={styles.label}>GitHub Repository</label>
          <input
            type="url"
            id="githubRepo"
            name="githubRepo"
            className={styles.input}
            value={formData.githubRepo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>Category</label>
          <input
            type="text"
            id="category"
            name="category"
            className={styles.input}
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="technology" className={styles.label}>Technology</label>
          <input
            type="text"
            id="technology"
            name="technology"
            className={styles.input}
            value={formData.technology}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="year" className={styles.label}>Year</label>
          <input
            type="number"
            id="year"
            name="year"
            className={styles.input}
            value={formData.year}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="demoVideo" className={styles.label}>Demo Video</label>
          <input
            type="file"
            id="demoVideo"
            name="demoVideo"
            accept="video/*"
            className={styles.fileInput}
            onChange={handleFileChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="desertation" className={styles.label}>Dissertation File</label>
          <input
            type="file"
            id="desertation"
            name="desertation"
            accept="application/pdf"
            className={styles.fileInput}
            onChange={handleFileChange}
            required
          />
        </div>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {error && <p className={styles.error}>{error}</p>}
        {loading && <p>Submitting...</p>}
        {project && <p className={styles.success}>Project created successfully!</p>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;