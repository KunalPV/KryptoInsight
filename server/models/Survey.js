import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
    surveyName: {
        type: String,
        required: true
    },
    surveyTag: {
        type: String,
        required: true
    },
    totalReward: {
        type: Number,
        required: true,
        min: 0
    },
    rewardPercentage: {
        type: Number,
        required: true,
        min: 0
    },
    balanceReward: {
        type: Number,
        default: function() {
            return this.totalReward;
        },
        min: 0,
    },
    surveyCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    questions: [
        {
            questionText: { type: String, required: true },
            questionType: { type: String, required: true },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    hashedData: {
        type: String
    }
});

const Survey = mongoose.model('Survey', surveySchema);

export default Survey;