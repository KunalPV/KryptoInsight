import jwt from 'jsonwebtoken';

const verifyAccessToken = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if(!accessToken) {
        return res.status(401).json({ error: 'Access token not found.' });
    }

    try {
        const decodedToken = jwt.verify(accessToken, 'This is a secure secret key');
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid access token.' });
    }
}

const authMiddleware = {
    verifyAccessToken,
}

export default authMiddleware;