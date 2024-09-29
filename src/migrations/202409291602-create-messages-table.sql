CREATE TABLE messages (
    timestamp TEXT,
    profile_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_encrypted BOOLEAN NOT NULL,
    PRIMARY KEY (timestamp, profile_id),
    CONSTRAINT fk_profiles_messages FOREIGN KEY (profile_id) REFERENCES profiles (id)
);
