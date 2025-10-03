// src/middleware/auth.middleware.js

import jwt from 'jsonwebtoken';
import pool from '../config/db.config.js';

// Verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check admin role
export const isAdmin = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    if (result.rows[0]?.role !== 'admin') 
      return res.status(403).json({ message: 'Admin access required' });

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Rate limiting
export const rateLimiter = (attempts, timeWindow) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if (requests.has(ip)) {
      const { count, firstAttempt } = requests.get(ip);

      if (now - firstAttempt > timeWindow) {
        requests.set(ip, { count: 1, firstAttempt: now });
        return next();
      }

      if (count >= attempts) {
        return res.status(429).json({
          message: `Too many attempts. Try again in ${Math.ceil((timeWindow - (now - firstAttempt)) / 1000)}s`
        });
      }

      requests.set(ip, { count: count + 1, firstAttempt });
    } else {
      requests.set(ip, { count: 1, firstAttempt: now });
    }

    next();
  };
};

// ======================= CHECK TOKEN BLACKLIST =======================
export const checkTokenBlacklist = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const result = await pool.query('SELECT * FROM blacklisted_tokens WHERE token = $1', [token]);
    if (result.rows.length > 0) return res.status(401).json({ message: 'Token has been revoked' });

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// ======================= VERIFY REFRESH TOKEN =======================
export const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const result = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (!result.rows.length) return res.status(401).json({ message: 'Invalid refresh token' });

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// ======================= VALIDATE SERVICE ACCESS =======================
export const validateServiceAccess = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT is_active FROM service_credentials WHERE user_id = $1 AND service_type = $2',
      [req.user.id, req.params.serviceType]
    );

    if (!result.rows.length || !result.rows[0].is_active)
      return res.status(403).json({ message: 'No active credentials found for this service' });

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({
      success: false,
      message: 'No authentication token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified for user:', decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
