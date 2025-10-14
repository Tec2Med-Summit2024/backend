import { authenticatePasswordChange, verifyPasswordResetToken } from '../server/middleware/verifyPasswordResetToken.mjs';
import { lookUpAccount } from '../server/auth/auth.db.mjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../server/auth/auth.db.mjs');
jest.mock('jsonwebtoken');

const mockReq = {
  body: {},
  headers: {},
  user: null
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

const mockNext = jest.fn();

describe('Password Endpoint Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.body = {};
    mockReq.headers = {};
    mockReq.user = null;
    mockRes.status.mockClear();
    mockRes.json.mockClear();
    mockNext.mockClear();
  });

  describe('verifyPasswordResetToken Middleware', () => {
    test('should reject missing email', async () => {
      mockReq.body = { token: '123456' };
      
      await verifyPasswordResetToken(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Email and verification token are required' 
      });
    });

    test('should reject missing token', async () => {
      mockReq.body = { email: 'test@example.com' };
      
      await verifyPasswordResetToken(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Email and verification token are required' 
      });
    });

    test('should reject non-existent email', async () => {
      mockReq.body = { email: 'nonexistent@example.com', token: '123456' };
      lookUpAccount.mockResolvedValue(null);
      
      await verifyPasswordResetToken(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Email not found' 
      });
    });

    test('should reject invalid verification token', async () => {
      mockReq.body = { email: 'test@example.com', token: 'wrongtoken' };
      lookUpAccount.mockResolvedValue({
        username: 'testuser',
        verification_code: '123456',
        name: 'Test User',
        phone: '1234567890',
        type: 'Participant'
      });
      
      await verifyPasswordResetToken(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Invalid verification token' 
      });
    });

    test('should accept valid verification token', async () => {
      mockReq.body = { email: 'test@example.com', token: '123456' };
      lookUpAccount.mockResolvedValue({
        username: 'testuser',
        verification_code: '123456',
        name: 'Test User',
        phone: '1234567890',
        type: 'Participant'
      });
      
      await verifyPasswordResetToken(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toEqual({
        id: 'testuser',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890',
        role: 'Participant'
      });
    });

    test('should accept valid verification token with different data types', async () => {
      mockReq.body = { email: 'test@example.com', token: '123456' };
      lookUpAccount.mockResolvedValue({
        username: 'testuser',
        verification_code: 123456, // Number instead of string
        name: 'Test User',
        phone: '1234567890',
        type: 'Participant'
      });
      
      await verifyPasswordResetToken(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('authenticatePasswordChange Middleware', () => {
    test('should use JWT authentication when token is present', async () => {
      const mockJWTToken = 'jwt.token.here';
      mockReq.headers.authorization = `Bearer ${mockJWTToken}`;
      mockReq.body = { email: 'test@example.com', password: 'newpassword' };
      
      // Mock JWT verification
      jwt.verify.mockReturnValue({
        id: 'testuser',
        username: 'testuser',
        email: 'test@example.com',
        role: 'Participant'
      });
      
      // Mock the authenticateToken function
      const originalAuthenticateToken = jest.fn((req, res, next) => {
        req.user = { id: 'testuser', username: 'testuser', email: 'test@example.com', role: 'Participant' };
        next();
      });
      
      // Import and use the mocked function
      const { authenticateToken } = await import('../server/middleware/verifier.mjs');
      jest.spyOn({ authenticateToken }, 'authenticateToken').mockImplementation(originalAuthenticateToken);
      
      await authenticatePasswordChange(mockReq, mockRes, mockNext);
      
      expect(originalAuthenticateToken).toHaveBeenCalled();
    });

    test('should use verification token authentication when no JWT token', async () => {
      mockReq.headers = {};
      mockReq.body = { email: 'test@example.com', token: '123456' };
      
      // Mock lookUpAccount for verification token
      lookUpAccount.mockResolvedValue({
        username: 'testuser',
        verification_code: '123456',
        name: 'Test User',
        phone: '1234567890',
        type: 'Participant'
      });
      
      await authenticatePasswordChange(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toEqual({
        id: 'testuser',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890',
        role: 'Participant'
      });
    });

    test('should reject when no authentication method is available', async () => {
      mockReq.headers = {};
      mockReq.body = { email: 'test@example.com' }; // No token
      
      await authenticatePasswordChange(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Email and verification token are required when not authenticated' 
      });
    });
  });

  describe('Security Logging Tests', () => {
    test('should log password change attempts', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      mockReq.body = { email: 'test@example.com', token: '123456' };
      lookUpAccount.mockResolvedValue({
        username: 'testuser',
        verification_code: '123456',
        name: 'Test User',
        phone: '1234567890',
        type: 'Participant'
      });
      
      await verifyPasswordResetToken(mockReq, mockRes, mockNext);
      
      expect(consoleSpy).toHaveBeenCalledWith('✅ Verification token validated for email: test@example.com');
      
      consoleSpy.mockRestore();
    });

    test('should log invalid token attempts', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      mockReq.body = { email: 'test@example.com', token: 'wrongtoken' };
      lookUpAccount.mockResolvedValue({
        username: 'testuser',
        verification_code: '123456',
        name: 'Test User',
        phone: '1234567890',
        type: 'Participant'
      });
      
      await verifyPasswordResetToken(mockReq, mockRes, mockNext);
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ Invalid verification token for email: test@example.com');
      
      consoleSpy.mockRestore();
    });
  });
});

describe('Password Change Controller Tests', () => {
  let changePasswordController;

  beforeEach(() => {
    jest.clearAllMocks();
    // Import the controller function
    const { changePassword } = require('../server/auth/auth.controller.mjs');
    changePasswordController = changePassword;
    mockReq.body = {};
    mockReq.user = null;
    mockRes.status.mockClear();
    mockRes.json.mockClear();
  });

  test('should reject missing email', async () => {
    mockReq.body = { password: 'newpassword' };
    
    await changePasswordController(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
  });

  test('should reject missing password', async () => {
    mockReq.body = { email: 'test@example.com' };
    
    await changePasswordController(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
  });

  test('should log security warning for email mismatch', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    mockReq.body = { email: 'different@example.com', password: 'newpassword' };
    mockReq.user = { id: 'testuser', email: 'test@example.com' };
    
    // Mock the changePass function
    const { changePass } = require('../server/auth/auth.service.mjs');
    jest.spyOn({ changePass }, 'changePass').mockResolvedValue({ ok: true });
    
    await changePasswordController(mockReq, mockRes);
    
    expect(consoleSpy).toHaveBeenCalledWith('⚠️  Security warning: User testuser attempting to change password for different email different@example.com');
    
    consoleSpy.mockRestore();
  });

  test('should successfully change password', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    mockReq.body = { email: 'test@example.com', password: 'newpassword' };
    mockReq.user = { id: 'testuser', email: 'test@example.com' };
    
    // Mock the changePass function
    const { changePass } = require('../server/auth/auth.service.mjs');
    jest.spyOn({ changePass }, 'changePass').mockResolvedValue({ ok: true });
    
    await changePasswordController(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(consoleSpy).toHaveBeenCalledWith('✅ Password successfully changed for email: test@example.com, user: testuser');
    
    consoleSpy.mockRestore();
  });
});