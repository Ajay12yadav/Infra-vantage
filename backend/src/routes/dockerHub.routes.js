import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { verifyDockerHubCredentials, getDockerHubRepositories } from '../controllers/dockerhub.controller.js';

const router = express.Router();

router.post('/verify', authenticateToken, verifyDockerHubCredentials);
router.get('/repositories', authenticateToken, getDockerHubRepositories);

export default router;