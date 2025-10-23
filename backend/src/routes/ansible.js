import express from 'express';
import { verifyAnsibleCredentials } from '../controllers/ansible.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/verify', authenticateToken, verifyAnsibleCredentials);

export default router;