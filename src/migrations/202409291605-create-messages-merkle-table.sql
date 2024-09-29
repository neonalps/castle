CREATE TABLE messages_merkle (
    profile_id TEXT,
    merkle TEXT,
    PRIMARY KEY (profile_id),
    CONSTRAINT fk_profiles_messages_merkle FOREIGN KEY (profile_id) REFERENCES profiles (id)
);
