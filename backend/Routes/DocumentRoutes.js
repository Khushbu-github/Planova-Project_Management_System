const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { verifyToken } = require('../Middlewares/AuthMiddleware');
const DocumentController = require('../Controllers/DocumentController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Routes
router.post('/upload', verifyToken, upload.single('file'), DocumentController.uploadDocument);
router.get('/all', verifyToken, DocumentController.getAllDocuments);

module.exports = router;
