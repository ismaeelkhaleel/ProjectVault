import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github.css'; 
import styles from "./Style.module.css";

function Instruction() {
  const projectState = useSelector((state) => state.project);
  const readmeURL = `${projectState?.projectDetails?.clonedPath}/README.md`;

  const [readmeContent, setReadmeContent] = useState("");

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        if (readmeURL) {
          const response = await fetch(readmeURL);
          const text = await response.text();
          setReadmeContent(text);
        }
      } catch (error) {
        console.error("Error fetching README:", error);
      }
    };

    fetchReadme();
  }, [readmeURL]);

  return (
    <div className={`${styles.project_details_wrapper_bottom_instructions} markdown-body`}>
      <div className={styles.project_details_wrapper_instructions_content}>
        {readmeContent ? (
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {readmeContent}
          </ReactMarkdown>
        ) : (
          <p>Loading README...</p>
        )}
      </div>
    </div>
  );
}

export default Instruction;