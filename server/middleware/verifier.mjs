import jwt from 'jsonwebtoken';

/**
 * Middleware to verify the username in the request
 */

// req.role = ? 
export const verifyUsername = (req, res, next, username) => {
    // TODO: Implement this function
	// return res.status(400).json({ error: 'Invalid username' });
    req.username = username;
    
    next();
};


export const verifyRole = (req, res, next) => {
    // TODO: Implement this function with authentication -> partner or attendee
    req.role = 'partner'; 
    next();
};

export const authenticateToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
            if (err) res.status(200).json(err.value);
            req.user = decode;
            next();  
        });
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};