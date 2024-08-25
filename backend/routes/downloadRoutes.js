// Inside downloadRoutes.js or whatever the file is named
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000; // or any port you prefer

// This line is necessary if your static files are served in a public directory at the root of your project.
app.use(express.static('public'));


function getFilePath(fileName) {
  const basePath = path.join(__dirname, 'public', 'resume');
  return path.join(basePath, fileName);
}


// Example backend route to serve a resume PDF by filename
app.get('/resume/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'public', 'resume', fileName);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send('File not found');
    }
  });
});




router.get("/profile/:file", (req, res) => {
  const address = path.join(__dirname, `../public/profile/${req.params.file}`);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    res.sendFile(address);
  });
});

module.exports = router;
