import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';

const router = express.Router();

// Route for user registration
// POST /api/auth/register
router.post('/register', register);

// Route for user login
// POST /api/auth/login
router.post('/login', login);

// Route for getting user profile
// GET /api/auth/profile
router.get('/profile', getProfile);

export default router;