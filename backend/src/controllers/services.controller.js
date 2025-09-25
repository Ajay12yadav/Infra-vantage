import pool from '../config/db.config.js';
import Docker from 'dockerode';
import Jenkins from 'jenkins';

export const addServiceCredentials = async (req, res) => {
  const { serviceType, credentials } = req.body;
  const userId = req.user.id; // From JWT auth middleware

  try {
    // Validate credentials before saving
    await validateCredentials(serviceType, credentials);

    const result = await pool.query(
      `INSERT INTO service_credentials 
       (user_id, service_type, credentials) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, service_type) 
       DO UPDATE SET credentials = $3, updated_at = NOW()
       RETURNING *`,
      [userId, serviceType, credentials]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
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