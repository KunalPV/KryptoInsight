import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

const secretKey = "This is a secure secret key";
const saltRounds = 10;

const mailConfig = {
    service: 'gmail',
    auth: {
        user: "funnyastro34@gmail.com",
        pass: "idjfqfnucxvgzybo"
    },
}

const transporter = nodemailer.createTransport(mailConfig);

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const sendVerificationCodeEmail = async (email, verificationCode) => {
    transporter.sendMail({
        from: '"KryptoInsight" <funnyastro34@gmail.com>',
        to: email,
        subject: 'KryptoInsight Verification Code',
        html: `
            <h1>Your verfication code.</h1>
            <p>Your verification code is: ${verificationCode}</p>
        `
    }).then(() => {
        console.log('Mail sent successfully');
    }).catch(() => {
        console.log("Mail Error");
    })
};

const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const verificationCode = generateVerificationCode();
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationCode,
        })

        await newUser.save();

        sendVerificationCodeEmail(email, verificationCode);

        const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });

        return res.status(200).json({ token: token, message: 'User created successfully!.' });
    } catch(error) {
        console.log('Error in signup: ', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const verifyCode = async (req, res) => {
    const { verificationCode } = req.body;

    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(200).json({ message: 'User is already verified.' });
        }

        if (user.verificationCode !== Number(verificationCode)) {
            console.log(user.verificationCode)
            console.log(verificationCode)
            return res.status(400).json({ message: 'Invalid verification code.' });
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({ message: 'User successfully verified.' });
    } catch (error) {
        console.log('Error in verifyCodeController: ', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const resendVerificationCode = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified.' });
        }

        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;

        await user.save();

        sendVerificationCodeEmail(email, verificationCode);

        return res.status(200).json({ message: 'Verification code resent successfully.' });
    } catch (error) {
        console.log('Error in resendVerificationCode: ', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const signupController = {
    createUser,
    verifyCode,
    resendVerificationCode
}

export default signupController;