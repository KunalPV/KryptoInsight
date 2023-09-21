import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import cors from 'cors';
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import surveyRoutes from './routes/surveyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import answerRoutes from './routes/answerRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        keys: [process.env.COOKIE_KEY],
    })
);

app.use(cookieParser());


const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 8000;

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
});

// Survey Routes
app.use('/api', surveyRoutes);

// Auth Routes
app.use('/api/auth', authRoutes);

// User Routes
app.use('/api/users', userRoutes);

// Answer Routes
app.use('/api', answerRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})