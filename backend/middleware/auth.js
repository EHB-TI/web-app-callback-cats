const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (req, res, next) => {
    // Get token
    let token;
    if(req.headers['x-access-token']) {
        // Token found in header
        token = req.headers['x-access-token'];
    } else if(req.headers.cookie) {
        // Token found in cookies
        token = req.headers.cookie.split('token=')[1];
    } else {
        // No token
        return res.status(401).json({ message: 'No token has been provided.', errorCode: 401 });
    }

    // Decode token
    let decoded;
    try {
        decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({ message: 'Provided token is invalid.', errorCode: 403 });
    }

    return next();
};

module.exports = verifyToken;