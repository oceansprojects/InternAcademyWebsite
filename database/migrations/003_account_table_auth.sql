CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    type TEXT NOT NULL,

    provider TEXT NOT NULL,

    provider_account_id TEXT NOT NULL,

    refresh_token TEXT,

    access_token TEXT,

    expires_at BIGINT,

    token_type TEXT,

    scope TEXT,

    id_token TEXT,

    session_state TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(provider, provider_account_id)
);