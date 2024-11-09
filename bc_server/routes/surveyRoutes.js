const express = require('express');
const surveyController = require('../controllers/surveyController');

const router = express.Router();

router.get('/owner', surveyController.getOwner);

router.get('/token', surveyController.getToken);

router.get('/survey/getName', surveyController.getMyNameByAddress);

router.get('/survey/getMyRequests', surveyController.getMyRequests);

router.get('/survey/getMyHistory', surveyController.getMyHistory);

router.get('/survey/getSurveyHistory', surveyController.getSurveyHistory);

module.exports = router;