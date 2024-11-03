CREATE TABLE profile_auth_token (
    id SERIAL PRIMARY KEY,
    public_id TEXT NOT NULL,
    profile_id INTEGER NOT NULL,
    auth_token TEXT NOT NULL,
    auth_token_issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    auth_token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE (public_id),
    CONSTRAINT fk_profile_permissions_profile FOREIGN KEY (profile_id) REFERENCES profile(id)
);
