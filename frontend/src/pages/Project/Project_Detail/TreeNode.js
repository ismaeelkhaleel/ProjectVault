// TreeNode.js

import React, { useState } from "react";

const IGNORED_NAMES = [".git"];

const TreeNode = ({ node, setSelectedFile, selectedFile }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleFileClick = () => {
    setSelectedFile(node); // 👈 Update selected file in parent
  };

  if (IGNORED_NAMES.includes(node.name)) {
    return null;
  }

  // Check if this node is the currently selected file
  const isActive = selectedFile && selectedFile.path === node.path;

  return (
    <div style={{ marginLeft: "20px" }}>
      {node.type === "folder" ? (
        <div
          onClick={handleToggle}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <span style={{ marginRight: "5px" }}>{expanded ? "📂" : "📁"}</span>
          <span>{node.name}</span>
        </div>
      ) : (
        <div
          onClick={handleFileClick}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: isActive ? "red" : "inherit", // 🔥 Here we apply red color if active
            fontWeight: isActive ? "bold" : "normal", // 🔥 Bold for active file
          }}
        >
          <span style={{ marginRight: "5px" }}>📄</span>
          <span>{node.name}</span>
        </div>
      )}

      {expanded && node.children && (
        <div style={{ marginLeft: "20px" }}>
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              setSelectedFile={setSelectedFile}
              selectedFile={selectedFile} // 👈 Pass selectedFile to child nodes also
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;