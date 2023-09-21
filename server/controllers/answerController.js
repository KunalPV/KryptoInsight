import Answer from '../models/Answer.js';
import Survey from '../models/Survey.js';
import User from '../models/User.js'

const createAnswer = async (req, res) => {
    try {
        const { surveyId, answers } = req.body;
        const userId = req.userId;
        
        const survey = await Survey.findById(surveyId);
        
        if(!survey) {
            return res.status(404).json({ error: 'Survey not found.' });
        }
        
        const user = await User.findById(userId);

        if (user.filledSurveys.includes(surveyId)) {
            return res.status(400).json({ message: 'You have already filled the survey.' });
        }

        const questionData = {};
        survey.questions.forEach((question) => {
            questionData[question._id.toString()] = {
                questionText: question.questionText,
                questionType: question.questionType,
            }
        });

        const answersArray = answers.map(({ questionId, answer }) => ({
            question: questionId,
            questionName: questionData[questionId].questionText,
            answer: answer,
            answerType: questionData[questionId].questionType,
        }));

        const answer = new Answer({
            survey: surveyId,
            user: userId,
            answers: answersArray,
        });

        await User.findByIdAndUpdate(userId, {
            $addToSet: { filledSurveys: surveyId },
        });

        const updatedTotalReward = survey.totalReward - survey.balanceReward;

        if(updatedTotalReward <= 0 || survey.totalReward <= 0) {
            survey.isActive = false;

            if(survey.isActive === false) {
                return res.status(404).json({ message: 'Survey is not active, Survey is completed!' });
            }
        }
        survey.totalReward = updatedTotalReward;

        await Promise.all([answer.save(), survey.save()]);

        user.userBalance = user.userBalance + survey.balanceReward;
        await user.save();
        
        return res.status(201).json({ message: "Answer created successfully" });
    } catch (error) {
        console.error("Error creating answer: ", error);
        return res.status(500).json({ error: "Failed to create answer" });
    }
}

const answerController = {
    createAnswer,
}

export default answerController;