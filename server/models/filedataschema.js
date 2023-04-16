const mongoose = require('mongoose');

const fileInfoSchema = new mongoose.Schema({
    uploader: String,
    createdAt: Date,
    fileName: String,
    fileType: String,
    fileIdentifier: String,
    objectId: String,
});

const FileInfo = mongoose.model('File', fileInfoSchema, "files");

module.exports = FileInfo;