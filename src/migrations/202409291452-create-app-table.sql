CREATE TABLE app (
    id SERIAL PRIMARY KEY,
    public_id TEXT NOT NULL,
    name TEXT,
    base_url TEXT,
    message_group_id INTEGER,
    enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (public_id),
    UNIQUE (base_url),
    UNIQUE (message_group_id),
    CONSTRAINT fk_app_message_group FOREIGN KEY (message_group_id) REFERENCES message_group(id)
);
