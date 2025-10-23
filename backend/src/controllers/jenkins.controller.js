import fetch from 'node-fetch';

export const verifyJenkinsCredentials = async (req, res) => {
  try {
    const { url, username, token } = req.body;

    if (!url || !username || !token) {
      return res.status(400).json({
        success: false,
        message: 'URL, username and token are required'
      });
    }

    const response = await fetch(`${url}/api/json`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${token}`).toString('base64')}`
      }
    });

    if (!response.ok) {
      throw new Error('Invalid Jenkins credentials');
    }

    res.json({
      success: true,
      message: 'Jenkins credentials verified successfully'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};