import pool from '../config/db.config.js';

export const saveServiceCredentials = async (userId, serviceType, credentials) => {
  const query = `
    INSERT INTO service_credentials (user_id, service_type, credentials)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, service_type) 
    DO UPDATE SET 
      credentials = $3,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const result = await pool.query(query, [userId, serviceType, credentials]);
  return result.rows[0];
};

export const getServiceCredentials = async (userId, serviceType) => {
  const query = `
    SELECT * FROM service_credentials 
    WHERE user_id = $1 AND service_type = $2;
  `;

  const result = await pool.query(query, [userId, serviceType]);
  return result.rows[0];
};