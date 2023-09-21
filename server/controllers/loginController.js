import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const secretKey = process.env.JWT_SECRET_KEY;

const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        return res.status(200).json({ token: token, message: 'Login successfully!.' });
    } catch (error) {
        console.error('Error in login: ', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

export default loginController;