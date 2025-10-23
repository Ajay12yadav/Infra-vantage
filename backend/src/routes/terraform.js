import express from 'express';
import { verifyTerraformCredentials } from '../controllers/terraform.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/verify', authenticateToken, verifyTerraformCredentials);

export default router;