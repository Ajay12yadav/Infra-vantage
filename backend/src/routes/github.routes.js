import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { verifyGitHubCredentials } from '../controllers/github.controller.js';

const router = express.Router();

router.post('/verify', authenticateToken, verifyGitHubCredentials);

export default router;