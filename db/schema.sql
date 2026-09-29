-- Postgres schema (mirrors Django migration accounts/0001_initial).
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(254) NOT NULL UNIQUE,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    code_hash   VARCHAR(128) NOT NULL,          -- hashed 6-digit login code
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checkouts (
    id                BIGSERIAL PRIMARY KEY,
    user_id           BIGINT REFERENCES users(id) ON DELETE SET NULL,
    email             VARCHAR(254) NOT NULL,
    phone             VARCHAR(30)  NOT NULL,    -- stored in E.164, e.g. +919876543210
    shipping_address  TEXT         NOT NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS checkouts_user_id_idx ON checkouts(user_id);
