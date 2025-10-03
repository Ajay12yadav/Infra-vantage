import pool from '../config/db.config.js';
import Docker from 'dockerode';
import Jenkins from 'jenkins';
import { saveServiceCredentials, getServiceCredentials } from '../models/serviceCredentials.js';

export const addServiceCredentials = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { serviceType, credentials } = req.body;

    const saved = await saveServiceCredentials(userId, serviceType, credentials);

    res.json({
      success: true,
      message: 'Service credentials saved successfully',
      data: {
        id: saved.id,
        serviceType: saved.service_type,
        updatedAt: saved.updated_at
      }
    });

  } catch (error) {
    console.error('Failed to save credentials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save credentials'
    });
  }
};

export const fetchDockerHubData = async (req, res) => {
  const userId = req.user.id;

  try {
    const creds = await pool.query(
      `SELECT credentials FROM service_credentials 
       WHERE user_id = $1 AND service_type = 'dockerhub'`,
      [userId]
    );

    if (!creds.rows.length) {
      return res.status(404).json({ message: 'Docker Hub credentials not found' });
    }

    const { username, password } = creds.rows[0].credentials;
    
    // Use Docker API to fetch repositories
    const auth = { username, password };
    const response = await fetch(
      `https://hub.docker.com/v2/repositories/${username}/?page_size=100`,
      { headers: { Authorization: `JWT ${auth}` } }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchJenkinsData = async (req, res) => {
  const userId = req.user.id;

  try {
    const creds = await pool.query(
      `SELECT credentials FROM service_credentials 
       WHERE user_id = $1 AND service_type = 'jenkins'`,
      [userId]
    );

    if (!creds.rows.length) {
      return res.status(404).json({ message: 'Jenkins credentials not found' });
    }

    const { url, username, apiToken } = creds.rows[0].credentials;
    
    const jenkins = new Jenkins({
      baseUrl: url,
      crumbIssuer: true,
      headers: { Authorization: `Basic ${Buffer.from(`${username}:${apiToken}`).toString('base64')}` }
    });

    // Fetch jobs and their status
    const jobs = await jenkins.jobs.list();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserServiceCredentials = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serviceType } = req.params;

    const credentials = await getServiceCredentials(userId, serviceType);

    if (!credentials) {
      return res.status(404).json({
        success: false,
        message: 'No credentials found for this service'
      });
    }

    res.json({
      success: true,
      data: {
        serviceType: credentials.service_type,
        credentials: credentials.credentials
      }
    });

  } catch (error) {
    console.error('Failed to get credentials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve credentials'
    });
  }
};