import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verificationCode: {
        type: Number,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userBalance: {
        type: Number,
        default: 0,
        min: 0,
    },
    filledSurveys: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Survey",
        },
    ],
})

const User = mongoose.model('User', userSchema);

export default User;