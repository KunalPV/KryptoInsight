import express from 'express';
import SurveyController from '../controllers/SurveyController.js';
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/survey', SurveyController.createSurvey);

// router.get('/surveys', SurveyController.getAllSurveys);

router.get('/survey/:id', SurveyController.getSurveyQuestionsFromId);

router.get('/surveys/', authMiddleware.verifyAccessToken, SurveyController.getAllSurveyExceptOwner);

router.get('/owner-surveys', authMiddleware.verifyAccessToken, SurveyController.getOwnerSurveys);

router.get('/surveys/activeSurveys', authMiddleware.verifyAccessToken, SurveyController.getActiveSurveysCount);

router.delete('/survey', authMiddleware.verifyAccessToken, SurveyController.deleteSurvey);

export default router;