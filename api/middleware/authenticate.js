const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            res.status(401).json({
                status: 'Authentication failed',
                error: {message: err.message}
            })
        } else {
            req.body.userId = decoded.userId;
            next();
        }
    })
};
