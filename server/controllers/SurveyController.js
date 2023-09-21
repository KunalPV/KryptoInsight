import Survey from '../models/Survey.js';

const createSurvey = async (req, res) => {
    try {
        const { surveyName, surveyTag, totalReward, rewardPercentage, surveyCreator, questions, hashedData } = req.body;

        const balanceReward = Math.floor((rewardPercentage / 100) * totalReward);

        const newSurvey = await Survey.create({
            surveyName,
            surveyTag,
            totalReward,
            rewardPercentage,
            balanceReward,
            surveyCreator,
            questions,
            hashedData
        });

        res.status(200).json(newSurvey);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create survey' });
    }
}

const getAllSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find();
        res.status(200).json(surveys);
    } catch (error) {
        console.error('Error getting surveys: ', error);
        res.status(500).json({ error: 'Failed to get surveys.' })
    }
};

const getOwnerSurveys = async (req, res) => {
    try {
        const ownerSurveys = await Survey.find({ surveyCreator: req.userId });
        res.status(200).json(ownerSurveys);
    } catch (error) {
        console.error('Error getting owner surveys: ', error);
        res.status(500).json({ error: 'Failed to get surveys.' })
    }
}

const getAllSurveyExceptOwner = async (req, res) => {
    try {
        const surveys = await Survey.find({ surveyCreator: { $ne: req.userId } });
        res.status(200).json(surveys);
    } catch (error) {
        console.error('Error getting surveys: ', error);
        res.status(500).json({ error: 'Failed to get surveys expect owner.' })
    }
}

const getSurveyQuestionsFromId = async (req, res) => {
    try {
        const { id } = req.params;
        const survey = await Survey.findById(id);

        if(!survey) {
            return res.status(404).json({ error: 'Survey not found' });
        }

        return res.status(200).json(survey);
    } catch (error) {
        console.error('Error fetching survey questions: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getActiveSurveysCount = async (req, res) => {
    try {
        const userId = req.userId;
        const activeSurveysCount = await Survey.countDocuments({ 
            isActive: true, 
            surveyCreator: userId
        });
        res.status(200).json({ count: activeSurveysCount });
    } catch (error) {
        console.error("Error fetching active surveys: ", error);
        res.status(500).json({ error: "Failed to fetch active surveys" });
    }
};

const deleteSurvey = async (req, res) => {
    try {
        const surveyId = req.body.surveyId;
        const userId = req.userId;

        const survey = await Survey.findById(surveyId);

        if (!survey) {
            return res.status(404).json({ error: 'Survey not found' });
        }
        
        if (survey.surveyCreator.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this survey' });
        }

        await Survey.deleteOne({ _id: surveyId });

        return res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error) {
        console.error('Error deleting survey: ', error);
        return res.status(500).json({ error: 'Failed to delete survey' });
    }
}

const SurveyController = {
    createSurvey,
    getAllSurveys,
    getSurveyQuestionsFromId,
    getAllSurveyExceptOwner,
    getOwnerSurveys,
    getActiveSurveysCount,
    deleteSurvey
}

export default SurveyController;