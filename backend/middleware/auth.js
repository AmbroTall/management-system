const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.split(' ')[1];  

    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;  // Add decoded user info to request
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;
