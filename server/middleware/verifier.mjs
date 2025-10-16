import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate JWT tokens
 * Extracts user information from token and adds it to request object
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Access token has expired' });
      }
      return res.status(401).json({ error: 'Access token is missing or invalid' });
    }

    // Add user information to request object - handle both username and id fields
    req.user = {
      id: decoded.id || decoded.username, // Support both id and username fields
      username: decoded.username || decoded.id, // Support both username and id fields
      role: decoded.role,
      email: decoded.email,
      name: decoded.name,
      phone: decoded.phone
    };
    
    next();
  });
};

/**
 * Middleware to verify username parameter matches authenticated user
 * Prevents users from accessing other users' resources
 */
export const verifyUsername = (req, res, next, username) => {
  // Allow GET requests for any user (read access)
  if (req.method === 'GET') {
    req.username = username;
    return next();
  }

  // Allow certain write operations that target resources (for example: POST /:username/cv-sent)
  // where the authenticated user is not the same as the :username path param.
  // This keeps existing protection for routes that should be restricted while allowing
  // the CV-send flow where an attendee sends to a partner.
  try {
    const originalUrl = req.originalUrl || req.url || '';
    if (originalUrl.includes('/cv-sent')) {
      req.username = username;
      return next();
    }
  } catch (e) {
    // ignore and continue to normal checks
  }
  
  // For other write operations (POST, PUT, DELETE, etc.), restrict to own user
  if (req.user && req.user.username !== username) {
    return res.status(403).json({ error: 'Access forbidden - can only modify own user data' });
  }
  
  req.username = username;
  next();
};