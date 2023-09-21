import express from 'express'
import answerController from '../controllers/answerController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/answers', authMiddleware.verifyAccessToken, answerController.createAnswer);

export default router;