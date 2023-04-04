const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true,
      },
      course: [
        {
          type: String,
        },
      ],
      content: {
        type: String,
        required: true,
      },
      creationDate: {
        type: Date,
        default: Date.now
      }
});

const File = mongoose.model('File', fileSchema, "files");

module.exports = File;