const express = require('express');
const router = express.Router();
const { postPredictHandler, getHistoriesHandler } = require('./handler');
const multer = require('multer');

const upload = multer({
  limits: { fileSize: 1000000 }, // 1MB
  storage: multer.memoryStorage()
});

router.post('/predict', upload.single('image'), postPredictHandler);
router.get('/predict/histories', getHistoriesHandler);

module.exports = router;
