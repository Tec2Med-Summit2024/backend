import jwt from 'jsonwebtoken';

/**
 * Middleware to verify the username in the request
 */

export const verifyUsername = (req, res, next, username) => {
    // TODO: Implement this function
	// return res.status(400).json({ error: 'Invalid username' });
    req.username = username;
    
    next();
};

export const verifyRole = (req, res, next) => {
  // TODO: Implement this function with authentication // update done, just change the function to use auth
  req.user =  'tturner@tec2med.com';
  req.role = 'Participant'; 
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
          req.userID = payload.userID;
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
