CREATE TABLE profile (
    id TEXT,
    app_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    hashed_email TEXT NOT NULL,
    encrypted_local_key TEXT NOT NULL,
    merkle TEXT,
    PRIMARY KEY (id),
    UNIQUE (app_id, hashed_email),
    CONSTRAINT fk_profile_app FOREIGN KEY (app_id) REFERENCES app(id)
);
