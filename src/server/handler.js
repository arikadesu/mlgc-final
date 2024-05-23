const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const getHistories = require('../services/getHistories');
const crypto = require('crypto');
const { InputError } = require('../exceptions/InputError');

async function postPredictHandler(req, res, next) {
  try {
    if (!req.file) throw new InputError('Image is required');

    const { model } = req.app.locals;
    const { confidenceScore, label, suggestion } = await predictClassification(model, req.file.buffer);

    const data = {
      id: crypto.randomUUID(),
      result: label,
      suggestion,
      confidenceScore,
      createdAt: new Date().toISOString()
    };

    await storeData(data.id, data);

    res.status(201).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    });
  } catch (error) {
    next(error);
  }
}

async function getHistoriesHandler(req, res, next) {
  try {
    res.status(200).json({
      status: 'success',
      data: await getHistories()
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { postPredictHandler, getHistoriesHandler };
