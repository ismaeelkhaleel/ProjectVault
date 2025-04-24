import React from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import styles from "./Style.module.css";

function Video() {
  const projectState = useSelector((state) => state.project);
  return (
    <div className={styles.project_details_wrapper_bottom_video}>
      <h3>React Video Player</h3>
      <ReactPlayer
        url={projectState?.projectDetails?.demoVideoPath}
        controls
        width="100%"
        height="360px"
      />
    </div>
  );
}

export default Video;
