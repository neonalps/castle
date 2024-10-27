CREATE TABLE profile_permissions (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    permission TEXT NOT NULL,
    CONSTRAINT fk_profile_permissions_profile FOREIGN KEY (profile_id) REFERENCES profile(id)
);
