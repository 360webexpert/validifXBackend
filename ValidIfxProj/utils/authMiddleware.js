// authenticationMiddleware.js

const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({ message: 'No token provided.' });
    }
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        console.log('req.userId', req.userId)
        console.log('decoded.id', decoded.id)
        req.userId = decoded.id;
        next();
    });
};

module.exports = authenticateToken;
