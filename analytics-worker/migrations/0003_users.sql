-- Dashboard accounts. Passwords are stored only as salted PBKDF2 hashes (src/users.js).
-- The first sign-in with ADMIN_USERNAME / ADMIN_PASSWORD creates the first admin here; after that
-- the table is the only way in. To recover a lost admin: delete every row, then sign in with the
-- ADMIN_USERNAME / ADMIN_PASSWORD secrets again.
CREATE TABLE IF NOT EXISTS users (
  id               TEXT    PRIMARY KEY,
  name             TEXT    NOT NULL,
  login            TEXT    NOT NULL UNIQUE,   -- username or email, lower case
  password_hash    TEXT    NOT NULL,
  role             TEXT    NOT NULL,          -- admin | viewer
  status           TEXT    NOT NULL DEFAULT 'active',   -- active | disabled
  must_change      INTEGER NOT NULL DEFAULT 0,          -- 1: asked for a new password at next sign-in
  pwd_changed_at   INTEGER NOT NULL,          -- epoch ms; sign-ins issued before this are refused
  created_at       INTEGER NOT NULL,
  created_by       TEXT,
  last_signed_in   INTEGER
);
