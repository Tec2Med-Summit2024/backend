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


export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Bearer <token>
      jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: 'Invalid token',
          });
        } else {  
          req.user = payload.email;
          req.role = payload.role;
          next();
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Token is not provided',
      });
    }
  };