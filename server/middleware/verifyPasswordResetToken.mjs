import { lookUpAccount } from '../auth/auth.db.mjs';
import { authenticateToken } from './verifier.mjs';

/**
 * Middleware to verify password reset tokens for signup/forgot password flows
 * This allows password creation without requiring a JWT token
 */
export const verifyPasswordResetToken = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    
    if (!email || !token) {
      return res.status(400).json({ 
        error: 'Email and verification token are required' 
      });
    }

    // Look up the account using the email
    const account = await lookUpAccount(email);
    
    if (!account) {
      console.log(`Password reset attempt for non-existent email: ${email}`);
      return res.status(404).json({ 
        error: 'Email not found' 
      });
    }

    // Check if the verification code matches
    const dbCode = account.verification_code;
    
    // Debug logging to identify data type issues
    console.log('🔍 Password Reset Token Debug:');
    console.log(`   Email: ${email}`);
    console.log(`   Input token: ${token} (type: ${typeof token})`);
    console.log(`   DB code: ${dbCode} (type: ${typeof dbCode})`);
    console.log(`   Strict equality (===): ${dbCode === token}`);
    console.log(`   Loose equality (==): ${String(dbCode) === String(token)}`);
    
    // Try both string and number comparison
    const inputTokenNum = Number(token);
    const dbCodeNum = Number(dbCode);
    
    console.log(`   Input as number: ${inputTokenNum} (type: ${typeof inputTokenNum})`);
    console.log(`   DB as number: ${dbCodeNum} (type: ${typeof dbCodeNum})`);
    console.log(`   Number equality: ${dbCodeNum === inputTokenNum}`);
    
    // Check if tokens match in any format
    const tokensMatch = dbCode === token || 
                       String(dbCode) === String(token) || 
                       dbCodeNum === inputTokenNum;
    
    if (!tokensMatch) {
      console.log(`❌ Invalid verification token for email: ${email}`);
      return res.status(403).json({ 
        error: 'Invalid verification token' 
      });
    }

    console.log(`✅ Verification token validated for email: ${email}`);
    
    // Add user information to request object
    req.user = {
      id: account.username,
      username: account.username,
      email: email,
      name: account.name,
      phone: account.phone,
      role: account.type
    };
    
    next();
    
  } catch (error) {
    console.error('Error in verifyPasswordResetToken middleware:', error);
    return res.status(500).json({ 
      error: 'Internal server error during token verification' 
    });
  }
};

/**
 * Enhanced password change middleware that supports both:
 * 1. JWT token authentication (for logged-in users)
 * 2. Verification token authentication (for signup/forgot password)
 */
export const authenticatePasswordChange = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    
    // If JWT token is present in headers, use standard authentication
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader && authHeader.split(' ')[1];
    
    if (jwtToken) {
      // Use existing JWT authentication
      return authenticateToken(req, res, next);
    }
    
    // Otherwise, use verification token authentication
    if (!email || !token) {
      return res.status(400).json({ 
        error: 'Email and verification token are required when not authenticated' 
      });
    }
    
    // Use verification token middleware
    return verifyPasswordResetToken(req, res, next);
    
  } catch (error) {
    console.error('Error in authenticatePasswordChange middleware:', error);
    return res.status(500).json({ 
      error: 'Internal server error during authentication' 
    });
  }
};
