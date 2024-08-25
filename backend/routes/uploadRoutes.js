const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { Readable } = require('stream');
const path = require('path');
const router = express.Router();

// Multer setup for in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Accept PDF files only
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
});

// Helper function to convert a buffer to a stream
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Indicates end of the stream
  return stream;
}

router.post('/resume', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Prepare the destination path
  const destinationPath = path.join(__dirname, '../public/resume', req.file.originalname.replace(/\s/g, '_'));
console.log("destinationPath",destinationPath)
  // Convert buffer to stream
  const fileStream = bufferToStream(req.file.buffer);

  // Save the stream to a file
  const writeStream = fs.createWriteStream(destinationPath);
  fileStream.pipe(writeStream);

  writeStream.on('finish', () => {
    res.status(200).json({ message: 'File uploaded successfully.', path: destinationPath });
  });

  writeStream.on('error', (error) => {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error while uploading the file.' });
  });
});






router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    file.detectedFileExtension != ".jpg" &&
    file.detectedFileExtension != ".png"
  ) {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
      .then(() => {
        res.send({
          message: "Profile image uploaded successfully",
          url: `/host/profile/${filename}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

module.exports = router;
