CREATE TABLE message (
    timestamp TEXT,
    message_group_id INTEGER NOT NULL,
    content BYTEA NOT NULL,
    is_encrypted BOOLEAN NOT NULL,
    PRIMARY KEY (timestamp, message_group_id),
    CONSTRAINT fk_message_message_group FOREIGN KEY (message_group_id) REFERENCES message_group(id)
);
