CREATE TABLE message_group (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER,
    merkle TEXT,
    UNIQUE (profile_id)
);
