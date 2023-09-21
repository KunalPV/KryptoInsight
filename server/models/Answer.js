import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answers: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
                required: true
            },
            questionName: {
                type: String,
                required: true,
            },
            answer: {
                type: String,
                required: true,
            },
            answerType: {
                type: String,
                required: true,
            },
        },
        
    ]
})

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;