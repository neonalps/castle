CREATE TABLE message_group (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER,
    merkle TEXT,
    UNIQUE (profile_id),
    CONSTRAINT fk_message_group_profile FOREIGN KEY (profile_id) REFERENCES profile(id)
);
