import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  getCodeTree,
  getFileContent,
} from "../../../config/redux/action/projectAction/index";
import { useParams } from "react-router-dom";
import TreeNode from "./TreeNode";
import styles from "./Style.module.css";

function Code() {
  const dispatch = useDispatch();
  const params = useParams();
  const projectId = params.id;
  const projectState = useSelector((state) => state.project);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef(null); 

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
  const handleCopyCode = () => {
    if (codeRef.current) {
      navigator.clipboard
        .writeText(codeRef.current.textContent)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Failed to copy code:", error);
        });
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
            selectedFile={selectedFile}
          />
        ))}
      </div>

      <div className={styles.project_details_wrapper_bottom_code_section}>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {projectState?.projectDetails?.zipFilePath && (
            <a
              href={`${projectState?.projectDetails?.zipFilePath}`}
              download
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Download Full Code (Zip)
            </a>
          )}
        </div>
        {selectedFile ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>{selectedFile.name}</h3>
              {isCopied ? (
                <button
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                    style={{ width: "20px" }}
                  >
                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                    <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
                  </svg>
                  Copied
                </button>
              ) : (
                <button
                  onClick={handleCopyCode}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                    style={{ width: "20px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                    />
                  </svg>
                  Copy Code
                </button>
              )}
            </div>

            <div
              className={
                styles.project_details_wrapper_bottom_file_content_wrapper
              }
              ref={codeRef}
            >
              <SyntaxHighlighter language="javascript" style={oneDark}>
                {projectState.selectedFile?.content || "Loading content..."}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <div>Select a file to view its content</div>
        )}
      </div>
    </div>
  );
}

export default Code;
