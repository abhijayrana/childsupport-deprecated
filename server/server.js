const express = require("express");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt")
const {GridFsStorage} = require("multer-gridfs-storage")
const crypto = require("crypto");
const path = require("path");
require("dotenv").config();
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const Grid = require("gridfs-stream");
const FileInfo = require("./models/filedataschema")
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');


// const Grid = require('gridfs-stream');


const app = express();
const cors = require("cors");

const mongodburi = process.env.MONGOACCESSKEY;

app.use(cors());
app.use(express.json());

mongoose.connect(mongodburi, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let bucket;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", () => {
    console.log("Connected to MongoDB");
    bucket = new GridFSBucket(db.db, { bucketName: 'documents' });
  });


const storage = new GridFsStorage({
    url: mongodburi,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }

          const fileInfo = {
            filename: file.originalname,
            bucketName: "documents",
            metadata: req.body.metadata ? JSON.parse(req.body.metadata) : null,
          };
          console.log(req.body.metadata);
          resolve(fileInfo);
        });
      });
    },
  });
  
const upload = multer({ storage });


// Endpoint to handle file upload
app.post("/api/upload", upload.single("file"), async (req, res) => {

  const {uploader, createdAt, fileName, fileType, fileIdentifier } = JSON.parse(req.body.metadata);
  const objectId = req.file.id; // Access ObjectId of the uploaded file
  console.log('ObjectId:', objectId); // Log ObjectId to the console
  console.log('req.file:', req.file);

  try {
    const fileInformation = new FileInfo({
      uploader,
      createdAt,
      fileName,
      fileType,
      fileIdentifier,
      objectId,
    }) 
    await fileInformation.save();
    res.status(200).send({ message: "File uploaded successfully", fileInformation });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }


  });


app.get("/api/listOfFiles", async (req, res) => {
  try {
    const fileList = await FileInfo.find();
    res.json(fileList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
})

app.get("/api/file/:id", async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);

    // Check if the file exists
    const file = await bucket.find({ _id: fileId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set content type and file name headers
    res.setHeader("Content-Type", file[0].contentType);
    res.setHeader("Content-Disposition", `inline; filename=${file[0].filename}`);

    // Create a GridFSBucketReadStream and pipe it to the response
    const readStream = bucket.openDownloadStream(fileId);
    readStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Start server
const port = process.env.PORT || 3004;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

