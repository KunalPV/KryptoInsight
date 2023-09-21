import jwtDecode from 'jwt-decode'

const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
}

const getUserIdFromToken = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.userId;
    } catch (error) {
        console.error('Error decoding token: ', error);
        return null;
    }
}

const tokenUtils = {
    isTokenExpired,
    getUserIdFromToken
}

export default tokenUtils;