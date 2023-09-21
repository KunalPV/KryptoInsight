import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router();

router.get('/userBalance', authMiddleware.verifyAccessToken, userController.getUserBalance);

router.get('/userName', authMiddleware.verifyAccessToken, userController.getUsername);

router.get('/user/userAccount', authMiddleware.verifyAccessToken, userController.getUserAccount);

router.get('/userAccountDetails', authMiddleware.verifyAccessToken, userController.getUserAccountDetails);

router.get('/user/filled-surveys', authMiddleware.verifyAccessToken, userController.getUserFilledSurveys);

router.put('/user/updateUser', authMiddleware.verifyAccessToken, userController.updateUserBalance);

router.delete('/user/userAccount', authMiddleware.verifyAccessToken, userController.deleteUserAccount);

router.get('/user/userId/:userId', userController.getUsernameById);

export default router;