require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  if (err instanceof InputError || err.statusCode) {
    return res.status(err.statusCode || 400).json({
      status: 'fail',
      message: err.message || 'Terjadi kesalahan dalam melakukan prediksi'
    });
  }
  if (err.code === 'LIMIT_FILE_SIZE') { 
    return res.status(413).json({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000'
    });
  }
  res.status(500).json({
    status: 'fail',
    message: 'Terjadi kesalahan dalam melakukan prediksi'
  });
});

(async () => {
  try {
    app.locals.model = await loadModel();
    const port = process.env.PORT || 3000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();
