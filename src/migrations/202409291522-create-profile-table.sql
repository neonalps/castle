CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    public_id TEXT NOT NULL,
    app_id INTEGER NOT NULL,
    hashed_login TEXT NOT NULL,
    encrypted_local_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (public_id),
    UNIQUE (app_id, hashed_login),
    CONSTRAINT fk_profile_app FOREIGN KEY (app_id) REFERENCES app(id)
);
