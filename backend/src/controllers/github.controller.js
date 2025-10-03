import { Octokit } from '@octokit/rest';

export const verifyGitHubCredentials = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token is required'
      });
    }

    const octokit = new Octokit({
      auth: token
    });

    // Verify token by getting user data
    const { data: user } = await octokit.users.getAuthenticated();

    // Get user's repositories
    const { data: repositories } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    });

    res.json({
      success: true,
      message: 'GitHub credentials verified successfully',
      data: {
        username: user.login,
        avatarUrl: user.avatar_url,
        repositories: repositories.map(repo => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          private: repo.private,
          updatedAt: repo.updated_at,
          language: repo.language,
          stars: repo.stargazers_count
        }))
      }
    });

  } catch (error) {
    console.error('GitHub verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid GitHub token'
    });
  }
};