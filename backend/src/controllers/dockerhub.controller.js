import fetch from 'node-fetch';
import { getServiceCredentials } from '../models/serviceCredentials.js';

// ✅ Verify Docker Hub credentials
export const verifyDockerHubCredentials = async (req, res) => {
  try {
    const { username, token } = req.body;

    if (!username || !token) {
      return res.status(400).json({
        success: false,
        message: 'Username and token are required'
      });
    }

    // First authenticate with Docker Hub
    const loginResponse = await fetch('https://hub.docker.com/v2/users/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: token
      })
    });

    if (!loginResponse.ok) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Docker Hub credentials'
      });
    }

    const { token: hubToken } = await loginResponse.json();

    // Test repository access
    const repoResponse = await fetch(`https://hub.docker.com/v2/repositories/${username}/`, {
      headers: {
        'Authorization': `JWT ${hubToken}`,
        'Accept': 'application/json'
      }
    });

    if (!repoResponse.ok) {
      return res.status(401).json({
        success: false,
        message: 'Failed to access Docker Hub repositories'
      });
    }

    const repositories = await repoResponse.json();

    res.json({
      success: true,
      message: 'Docker Hub credentials verified successfully',
      data: {
        username,
        repositories: repositories.results || []
      }
    });

  } catch (error) {
    console.error('Docker Hub verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify Docker Hub credentials'
    });
  }
};

// ✅ Get repositories using stored credentials
export const getDockerHubRepositories = async (req, res) => {
  try {
    // Get stored Docker Hub credentials
    const credentials = await getServiceCredentials(req.user.id, 'dockerhub');

    if (!credentials) {
      return res.status(404).json({
        success: false,
        message: 'Docker Hub credentials not found'
      });
    }

    // Authenticate with Docker Hub
    const loginResponse = await fetch('https://hub.docker.com/v2/users/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: credentials.credentials.username,
        password: credentials.credentials.token
      })
    });

    if (!loginResponse.ok) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Docker Hub credentials'
      });
    }

    const { token } = await loginResponse.json();

    // Fetch repositories
    const repoResponse = await fetch(
      `https://hub.docker.com/v2/repositories/${credentials.credentials.username}/`,
      {
        headers: {
          'Authorization': `JWT ${token}`
        }
      }
    );

    if (!repoResponse.ok) {
      throw new Error('Failed to fetch repositories from Docker Hub');
    }

    const data = await repoResponse.json();

    res.json({
      success: true,
      repositories: data.results || []
    });

  } catch (error) {
    console.error('Docker Hub repository fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch repositories'
    });
  }
};
