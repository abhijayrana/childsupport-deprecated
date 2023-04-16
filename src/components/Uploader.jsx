import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from "uuid";

const Input = styled("input")({
  display: "none",
});

function Uploader() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Add custom metadata
    const metadata = {
      uploader: "Username",
      createdAt: new Date(),
      fileName: file.name,
      fileType: file.type,
      fileIdentifier: uuidv4(),
    };

    formData.append("metadata", JSON.stringify(metadata));

    // Log formData key-value pairs
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch("http://localhost:3004/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading the file");
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);

      // Navigate to another page or show success message here
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <label htmlFor="contained-button-file">
        <Input
          accept=".pdf,.doc,.docx"
          id="contained-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <Button variant="contained" component="span">
          Choose file
        </Button>
      </label>
      {file && (
        <Box display="flex" alignItems="center" mt={2}>
          <InsertDriveFileIcon />
          <Typography ml={1}>{file.name}</Typography>
        </Box>
      )}
      <Button onClick={handleUpload} variant="contained">
        Upload
      </Button>
    </div>
  );
}

export default Uploader;
