CREATE TABLE message (
    timestamp TEXT,
    profile_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_encrypted BOOLEAN NOT NULL,
    PRIMARY KEY (timestamp, profile_id),
    CONSTRAINT fk_message_profile FOREIGN KEY (profile_id) REFERENCES profile(id)
);
