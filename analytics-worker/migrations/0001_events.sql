-- One row per tracked event. A visitor is a random id the browser keeps (lib/analytics.ts) and no IP
-- address is stored, so a row cannot be traced back to a person.
CREATE TABLE IF NOT EXISTS events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ts           INTEGER NOT NULL,          -- epoch milliseconds (server clock)
  type         TEXT    NOT NULL,          -- pageview | click | engagement | conversion
  path         TEXT    NOT NULL,
  title        TEXT,
  referrer     TEXT,                      -- referring host only, '' for direct / internal
  visitor      TEXT    NOT NULL,
  session      TEXT    NOT NULL,
  country      TEXT,
  device       TEXT,                      -- desktop | mobile | tablet
  browser      TEXT,
  os           TEXT,
  label        TEXT,                      -- click: link/button text; conversion: its kind
  target       TEXT,                      -- click: href; conversion: product id etc.
  category     TEXT,                      -- click: internal | outbound | email | phone | whatsapp | download | button
  value        INTEGER,                   -- engagement: seconds on page
  scroll       INTEGER,                   -- engagement: deepest scroll, 0-100
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_ts ON events (ts);
CREATE INDEX IF NOT EXISTS idx_events_type_ts ON events (type, ts);
CREATE INDEX IF NOT EXISTS idx_events_visitor_ts ON events (visitor, ts);

-- Failed admin logins, for the lockout in handleLogin. `ip` is a keyed hash, not the address.
CREATE TABLE IF NOT EXISTS login_attempts (
  ip  TEXT    NOT NULL,
  ts  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_ts ON login_attempts (ip, ts);
