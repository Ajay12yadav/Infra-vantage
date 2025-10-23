import fetch from 'node-fetch';

export const verifyAnsibleCredentials = async (req, res) => {
  try {
    const { url, username, password } = req.body;

    if (!url || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'URL, username and password are required'
      });
    }

    const response = await fetch(`${url}/api/v2/ping/`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      }
    });

    if (!response.ok) {
      throw new Error('Invalid Ansible credentials');
    }

    res.json({
      success: true,
      message: 'Ansible credentials verified successfully'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};