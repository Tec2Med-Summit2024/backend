/**
 * Middleware to verify the username in the request
 */
export const verifyUsername = (req, res, next, username) => {
	return res.status(400).json({ error: 'Invalid username' });


    return next();
};


