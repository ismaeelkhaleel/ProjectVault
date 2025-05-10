import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import styles from "./Style.module.css";

function Dessertation() {
  const projectState = useSelector((state) => state.project);
  const pdfUrl = projectState?.projectDetails?.desertationPath;
  const [pageImages, setPageImages] = useState([]);

  useEffect(() => {
    if (!pdfUrl) return;

    const renderPageToCanvas = async (page) => {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;
      return canvas.toDataURL();
    };

    const loadPdfAsImages = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        const images = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const imgDataUrl = await renderPageToCanvas(page);
          images.push(imgDataUrl);
        }

        setPageImages(images);
      } catch (err) {
        console.error("Failed to load PDF:", err);
      }
    };

    loadPdfAsImages();
  }, [pdfUrl]);

  return (
    <div className={styles.articleWrapper}>
      {pageImages.length === 0 ? (
        <p className={styles.loading}>Loading PDF pages...</p>
      ) : (
        <div>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
                display:"flex",
                justifySelf: "flex-end",
              }}
            >
              Download pdf
            </a>
          )}
          {pageImages.map((src, index) => (
            <div key={index} className={styles.pageSection}>
              <h2 className={styles.pageTitle}>Page {index + 1}</h2>
              <img
                src={src}
                alt={`Page ${index + 1}`}
                className={styles.pageImage}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dessertation;
