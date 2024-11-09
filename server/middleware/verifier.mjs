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
    // TODO: Implement this function with authentication // update done
    req.user =  'tturner@tec2med.com';
    req.role = 'Participant'; 
    next();
};