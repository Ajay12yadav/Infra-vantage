CREATE TABLE IF NOT EXISTS service_credentials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    credentials JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, service_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);