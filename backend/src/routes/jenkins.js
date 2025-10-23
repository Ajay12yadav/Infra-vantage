import express from 'express';
import { verifyJenkinsCredentials } from '../controllers/jenkins.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/verify', authenticateToken, verifyJenkinsCredentials);

export default router;