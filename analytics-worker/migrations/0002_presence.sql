-- Who is on the site right now. One row per visitor, refreshed by every event and by the
-- tracker's heartbeat (every 30 seconds while a tab is visible), and deleted when the tab is
-- closed or hidden. "Online now" is every row seen in the last 75 seconds.
CREATE TABLE IF NOT EXISTS presence (
  visitor     TEXT    PRIMARY KEY,
  session     TEXT    NOT NULL,
  first_seen  INTEGER NOT NULL,          -- epoch ms: when this visit started
  ts          INTEGER NOT NULL,          -- epoch ms: last heartbeat or event
  path        TEXT,
  title       TEXT,
  country     TEXT,
  region      TEXT,
  city        TEXT,
  device      TEXT,
  browser     TEXT,
  os          TEXT
);

CREATE INDEX IF NOT EXISTS idx_presence_ts ON presence (ts);

-- Where visitors are, finer than the country: Cloudflare's own approximate city and region.
ALTER TABLE events ADD COLUMN region TEXT;
ALTER TABLE events ADD COLUMN city TEXT;
