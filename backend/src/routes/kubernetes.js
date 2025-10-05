import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { kubernetesService } from '../services/kubernetes.service.js';

const router = express.Router();

router.get('/cluster-info', authenticateToken, async (req, res) => {
  try {
    const info = await kubernetesService.getClusterInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/pods', authenticateToken, async (req, res) => {
  try {
    const pods = await kubernetesService.getPods();
    res.json(pods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/deployments', authenticateToken, async (req, res) => {
  try {
    const deployments = await kubernetesService.getDeployments();
    res.json(deployments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/services', authenticateToken, async (req, res) => {
  try {
    const services = await kubernetesService.getServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch services'
    });
  }
});

export default router;