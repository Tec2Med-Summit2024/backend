/**
 * Middleware to verify the username in the request
 */
export const verifyUsername = (req, res, next, username) => {
    // TODO: Implement this function
	// return res.status(400).json({ error: 'Invalid username' });
    req.username = username;
    next();
};


