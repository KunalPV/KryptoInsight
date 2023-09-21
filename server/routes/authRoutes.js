import express from 'express';
import signupController from '../controllers/signupController.js';
import loginController from '../controllers/loginController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupController.createUser);

router.post('/verifyUser', authMiddleware.verifyAccessToken, signupController.verifyCode);

router.post('/resendVerifyCode', authMiddleware.verifyAccessToken, signupController.resendVerificationCode);

router.post('/login', loginController);

export default router;