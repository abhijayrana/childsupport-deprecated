import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import PDFViewer from "./PDFViewer";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


function ReadFile() {
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);


  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:3004/api/listOfFiles");

      if (!response.ok) {
        throw new Error("Error fetching files");
      }

      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchFile = async (objectId) => {
    // const url = `http://localhost:3004/api/file/${objectId}`;
    // console.log(url)
    // setFileUrl(url);
    try {
      const response = await fetch(
        `http://localhost:3004/api/file/${objectId}`
      );
      console.log(response);
      const contentType = response.headers.get("content-type");
      console.log("File type:", fileType);

      if (contentType === "application/pdf") {
        setFileType("pdf");
        setFileUrl(response.url);
      } else if (
        contentType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFileType("docx");
        setFileUrl(response.url);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const renderContent = () => {
    if (fileType === "pdf") {
      return (
        <div>
          <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
          </p>
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      );
    } else if (fileType === "docx") {
      return (
        <iframe
        title="Office Web Viewer"
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
        style={{ width: "100%", height: "600px", border: "none" }}
      ></iframe>
      );
    }
  };

  return (
    <div>
      <h1>Documents List</h1>

      <h1>gggg</h1>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => handleFetchFile(file.objectId)}
            >
              {file.fileName}
            </span>{" "}
            - {file.fileType} - {file.uploader} -{" "}
            {new Date(file.createdAt).toLocaleDateString()} - {file.objectId}
          </li>
        ))}
      </ul>
      {/* {fileUrl && (
        <Box mt={2}>
          <iframe src={fileUrl} width="100%" height="500" title="File Viewer"></iframe>
        </Box>
      )} */}
      {fileUrl && renderContent()}

      {/* {PDFStatus && <PDFViewer url={fileUrl} />} */}
    </div>
  );
}

export default ReadFile;
