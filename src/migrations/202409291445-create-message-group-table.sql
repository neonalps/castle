CREATE TABLE message_group (
    id SERIAL PRIMARY KEY,
    public_id TEXT NOT NULL,
    profile_id INTEGER,
    merkle TEXT,
    UNIQUE (profile_id)
);
