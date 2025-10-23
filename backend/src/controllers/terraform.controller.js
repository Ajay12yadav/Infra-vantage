import fetch from 'node-fetch';

export const verifyTerraformCredentials = async (req, res) => {
  try {
    const { organization, token } = req.body;

    if (!organization || !token) {
      return res.status(400).json({
        success: false,
        message: 'Organization and token are required'
      });
    }

    const response = await fetch(`https://app.terraform.io/api/v2/organizations/${organization}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/vnd.api+json'
      }
    });

    if (!response.ok) {
      throw new Error('Invalid Terraform credentials');
    }

    res.json({
      success: true,
      message: 'Terraform credentials verified successfully'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};