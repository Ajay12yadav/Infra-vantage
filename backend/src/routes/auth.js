import express from 'express';
import { register, login, getProfile, refreshToken, logout } from '../controllers/auth.controller.js';
import { 
  verifyToken, 
  isAdmin, 
  rateLimiter, 
  checkTokenBlacklist,
  verifyRefreshToken 
} from '../middleware/auth.middleware.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// Public routes
router.post('/register', register);
router.post('/login', authLimiter, login);
router.post('/refresh-token', verifyRefreshToken, refreshToken);

// Protected routes
router.get('/profile', verifyToken, checkTokenBlacklist, getProfile);
router.post('/logout', verifyToken, checkTokenBlacklist, logout);

// Admin routes
router.get('/users', verifyToken, checkTokenBlacklist, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Health check route
router.get('/health', (req, res) => {
    res.json({ status: 'Auth service is running' });
});

export default router;