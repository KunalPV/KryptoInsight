import User from '../models/User.js'
import Survey from '../models/Survey.js'

const getUsername = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ username: user.username });
    } catch (error) {
        console.error('Error getting username: ', error);
        res.status(500).json({ error: 'Failed to get username' })
    }
}

const getUserBalance = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ userBalance: user.userBalance });
    } catch (error) {
        console.error('Error getting user balance: ', error);
        res.status(500).json({ error: 'Failed to get user balance' })
    }
}

const getUsernameById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ userName: user.username });
    } catch (error) {
        console.error('Error fetching username by Id: ', error);
        res.status(500).json({ error: 'Failed to fetch username by Id' });
    }
}

const getUserAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user account: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getUserAccountDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userBalance = user.userBalance;

        const surveyCount = await Survey.countDocuments({ surveyCreator: userId });

        const userDetails = {
            username: user.username,
            userBalance,
            surveysCreated: surveyCount,
        };

        return res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error fetching user account details: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getUserFilledSurveys = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const filledSurveys = user.filledSurveys;

        return res.status(200).json({ filledSurveys });

    } catch (error) {
        console.error('Error fetching user filled surveys: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateUserBalance = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        user.userBalance = 0; // Set user balance to 0
        await user.save();
    
        return res.status(200).json({ message: 'User balance updated successfully.' });
        } catch (error) {
        console.error('Error updating user balance: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: 'Account deleted successfully.' });

    } catch (error) {
        console.error('Error deleting user account: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const userController = {
    getUsernameById,
    getUsername,
    getUserBalance,
    getUserAccount,
    getUserAccountDetails,
    getUserFilledSurveys,
    updateUserBalance,
    deleteUserAccount,
}

export default userController;