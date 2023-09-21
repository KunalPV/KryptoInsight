import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['short-text', 'long-text', 'number', 'yes-no'],
        required: true
    },
})

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;