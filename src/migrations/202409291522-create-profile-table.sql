CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    public_id TEXT NOT NULL,
    app_id INTEGER NOT NULL,
    hashed_email TEXT NOT NULL,
    encrypted_local_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (public_id),
    UNIQUE (app_id, hashed_email),
    CONSTRAINT fk_profile_app FOREIGN KEY (app_id) REFERENCES app(id)
);
