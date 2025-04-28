import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCodeTree,
  getFileContent,
} from "../../config/redux/action/projectAction/index";
import { useParams } from "react-router-dom";
import TreeNode from "./TreeNode";
import styles from "./Style.module.css";

function Code() {
  const dispatch = useDispatch();
  const params = useParams();
  const projectId = params.id;
  const projectState = useSelector((state) => state.project);

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(getCodeTree(projectId));
    }
  }, [dispatch, projectId]);

  const handleFileSelection = (file) => {
    setSelectedFile(file);
    const relativePath = file.path
      .replace(/^.*\\uploads\\/, "uploads/")
      .replace(/\\/g, "/");

    if (!projectState.selectedFile || !projectState.selectedFile[file.path]) {
      dispatch(getFileContent({ projectId, filePath: relativePath }));
    }
  };

  return (
    <div className={styles.project_details_wrapper_bottom_code}>
      <div className={styles.project_details_wrapper_bottom_code_tree}>
        <h3>Code Structure</h3>
        {projectState.codeTree?.children?.map((node, index) => (
          <TreeNode
            key={index}
            node={node}
            setSelectedFile={handleFileSelection}
          />
        ))}
      </div>

      <div className={styles.project_details_wrapper_bottom_code_section}>
        {selectedFile ? (
          <div>
            <h3>{selectedFile.name}</h3>
            <pre className={styles.project_details_wrapper_bottom_file_content}>
              {projectState.selectedFile?.content ||
                "Loading content..."}
            </pre>
          </div>
        ) : (
          <div>Select a file to view its content</div>
        )}
      </div>
    </div>
  );
}

export default Code;
