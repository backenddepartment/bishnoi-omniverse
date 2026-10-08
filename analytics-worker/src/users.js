/**
 * Dashboard accounts: sign-in, sessions, roles, and the Users and Settings endpoints.
 *
 *   POST /admin/login                    { username, password } -> { token, expiresAt, user }
 *   GET  /admin/me                       the signed-in account
 *   POST /admin/me                       { name } change your display name
 *   POST /admin/me/password              { current, next } -> a fresh token (the old one stops working)
 *   GET  /admin/users                    every account                    (admin)
 *   POST /admin/users                    { name, login, role } -> account + temporary password (admin)
 *   POST /admin/users/:id                { name?, role?, status? }        (admin)
 *   POST /admin/users/:id/reset          -> a new temporary password      (admin)
 *   DELETE /admin/users/:id                                               (admin)
 *
 * Passwords are hashed with PBKDF2-SHA256 (100,000 rounds, the most Workers allows) and a random
 * salt per account. A sign-in token names the account and when it was issued; every request
 * re-reads the account, so disabling someone or resetting their password signs them out at once.
 *
 * The first sign-in with the ADMIN_USERNAME / ADMIN_PASSWORD secrets, while the users table is
 * empty, creates the first admin. After that the table is the only way in.
 */

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_LOGIN_FAILURES = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const PBKDF2_ROUNDS = 100_000;
const MIN_PASSWORD = 10;

/** What each role may do. Shown on the Users page as permission chips. */
export const ROLES = {
  admin: {
    label: 'Admin',
    permissions: ['analytics:view', 'live:view', 'countries:view', 'export:csv', 'users:manage', 'settings:own'],
  },
  viewer: {
    label: 'Viewer',
    permissions: ['analytics:view', 'live:view', 'countries:view', 'settings:own'],
  },
};

const encoder = new TextEncoder();

function base64url(bytes) {
  let binary = '';
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

function sameBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function safeEqual(a, b) {
  return sameBytes(await sha256(String(a)), await sha256(String(b)));
}

function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, max);
}

function randomId() {
  return base64url(crypto.getRandomValues(new Uint8Array(9)));
}

/** A temporary password that is easy to read out: three groups of four, no look-alike letters. */
export function temporaryPassword() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const chars = [...bytes].map((b) => alphabet[b % alphabet.length]);
  return `${chars.slice(0, 4).join('')}-${chars.slice(4, 8).join('')}-${chars.slice(8).join('')}`;
}

/* ------------------------------------------------------------------ *
 * Password hashing
 * ------------------------------------------------------------------ */

async function pbkdf2(password, salt, rounds) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: rounds }, key, 256);
  return new Uint8Array(bits);
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ROUNDS);
  return `pbkdf2$${PBKDF2_ROUNDS}$${base64url(salt)}$${base64url(hash)}`;
}

async function checkPassword(password, stored) {
  const [scheme, rounds, salt, hash] = String(stored).split('$');
  if (scheme !== 'pbkdf2' || !salt || !hash) return false;
  const actual = await pbkdf2(password, fromBase64url(salt), Number(rounds));
  return sameBytes(actual, fromBase64url(hash));
}

/* ------------------------------------------------------------------ *
 * Tokens and the signed-in account
 * ------------------------------------------------------------------ */

async function signingKey(env) {
  return crypto.subtle.importKey('raw', encoder.encode(String(env.SESSION_SECRET)), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

async function issueToken(env, userId) {
  const now = Date.now();
  const payload = base64url(encoder.encode(JSON.stringify({ uid: userId, iat: now, exp: now + TOKEN_TTL_MS })));
  const signature = await crypto.subtle.sign('HMAC', await signingKey(env), encoder.encode(payload));
  return { token: `${payload}.${base64url(signature)}`, expiresAt: now + TOKEN_TTL_MS };
}

/** The account as the dashboard sees it: never the password hash. */
export function publicUser(row) {
  const role = ROLES[row.role] ? row.role : 'viewer';
  return {
    id: row.id,
    name: row.name,
    login: row.login,
    role,
    status: row.status,
    mustChange: !!row.must_change,
    createdAt: row.created_at,
    lastSignedIn: row.last_signed_in ?? null,
    permissions: ROLES[role].permissions,
  };
}

/**
 * The signed-in account, or null: the token must be validly signed and unexpired, its account
 * active, and issued after the account's last password change.
 */
export async function currentUser(request, env) {
  const header = request.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const [payload, signature] = token.split('.');
  if (!payload || !signature || String(env.SESSION_SECRET ?? '').length < 32) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await signingKey(env), fromBase64url(signature), encoder.encode(payload));
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(fromBase64url(payload)));
    if (typeof data.exp !== 'number' || data.exp <= Date.now() || typeof data.uid !== 'string') return null;
    const row = await env.DB.prepare('SELECT * FROM users WHERE id = ?1').bind(data.uid).first();
    if (!row || row.status !== 'active' || Number(data.iat) < row.pwd_changed_at) return null;
    return row;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Sign-in
 * ------------------------------------------------------------------ */

export async function handleLogin(request, env, json) {
  if (String(env.SESSION_SECRET ?? '').length < 32) {
    return json(503, { message: 'The dashboard login has not been set up yet.' });
  }

  // Failed attempts are counted per IP, stored only as a keyed hash.
  const ipHash = base64url(await sha256(`${env.SESSION_SECRET}|${request.headers.get('CF-Connecting-IP') ?? ''}`));
  const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM login_attempts WHERE ip = ?1 AND ts > ?2')
    .bind(ipHash, Date.now() - LOGIN_WINDOW_MS)
    .first();
  if ((recent?.n ?? 0) >= MAX_LOGIN_FAILURES) {
    return json(429, { message: 'Too many failed attempts. Please wait 15 minutes and try again.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { message: 'Invalid request.' });
  }
  const login = clean(body?.username, 100).toLowerCase();
  const password = String(body?.password ?? '').slice(0, 200);

  const fail = async () => {
    await env.DB.prepare('INSERT INTO login_attempts (ip, ts) VALUES (?1, ?2)').bind(ipHash, Date.now()).run();
    return json(401, { message: 'Incorrect username or password.' });
  };

  let row = await env.DB.prepare('SELECT * FROM users WHERE login = ?1').bind(login).first();

  if (!row) {
    // First sign-in ever: the ADMIN_USERNAME / ADMIN_PASSWORD secrets create the first admin.
    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first();
    const envUser = String(env.ADMIN_USERNAME ?? '').trim().toLowerCase();
    if ((count?.n ?? 0) === 0 && envUser && env.ADMIN_PASSWORD) {
      const [userOk, passOk] = await Promise.all([safeEqual(login, envUser), safeEqual(password, env.ADMIN_PASSWORD)]);
      if (userOk && passOk) {
        const now = Date.now();
        const id = randomId();
        await env.DB.prepare(
          `INSERT INTO users (id, name, login, password_hash, role, status, must_change, pwd_changed_at, created_at, created_by)
           VALUES (?1, 'Administrator', ?2, ?3, 'admin', 'active', 0, ?4, ?4, 'setup')`
        )
          .bind(id, envUser, await hashPassword(password), now - 1)
          .run();
        row = await env.DB.prepare('SELECT * FROM users WHERE id = ?1').bind(id).first();
      }
    }
    if (!row) {
      // Spend the same time as a real check, so a missing account cannot be told from a wrong password.
      await checkPassword(password, `pbkdf2$${PBKDF2_ROUNDS}$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`);
      return fail();
    }
  } else if (!(await checkPassword(password, row.password_hash))) {
    return fail();
  }

  if (row.status !== 'active') {
    return json(403, { message: 'This account is turned off. Ask an administrator to turn it back on.' });
  }

  await env.DB.batch([
    env.DB.prepare('DELETE FROM login_attempts WHERE ip = ?1').bind(ipHash),
    env.DB.prepare('UPDATE users SET last_signed_in = ?1 WHERE id = ?2').bind(Date.now(), row.id),
  ]);
  const session = await issueToken(env, row.id);
  return json(200, { ...session, user: publicUser({ ...row, last_signed_in: Date.now() }) });
}

/* ------------------------------------------------------------------ *
 * Your own account
 * ------------------------------------------------------------------ */

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function handleMe(request, env, json, me, route) {
  if (route === '/admin/me' && request.method === 'GET') return json(200, { user: publicUser(me) });

  if (route === '/admin/me' && request.method === 'POST') {
    const body = await readJson(request);
    const name = clean(body?.name, 80);
    if (!name) return json(400, { message: 'Please enter your name.' });
    await env.DB.prepare('UPDATE users SET name = ?1 WHERE id = ?2').bind(name, me.id).run();
    return json(200, { user: publicUser({ ...me, name }) });
  }

  if (route === '/admin/me/password' && request.method === 'POST') {
    const body = await readJson(request);
    const current = String(body?.current ?? '');
    const next = String(body?.next ?? '').slice(0, 200);
    if (!(await checkPassword(current, me.password_hash))) return json(400, { message: 'Your current password is not right.' });
    if (next.length < MIN_PASSWORD) return json(400, { message: `Your new password needs at least ${MIN_PASSWORD} characters.` });
    if (next === current) return json(400, { message: 'Choose a password different from the current one.' });
    const now = Date.now();
    await env.DB.prepare('UPDATE users SET password_hash = ?1, must_change = 0, pwd_changed_at = ?2 WHERE id = ?3')
      .bind(await hashPassword(next), now, me.id)
      .run();
    // Every other session for this account stops working; this one gets a fresh token.
    const session = await issueToken(env, me.id);
    return json(200, { ...session, user: publicUser({ ...me, must_change: 0, pwd_changed_at: now }) });
  }

  return json(405, { message: 'Method not allowed.' });
}

/* ------------------------------------------------------------------ *
 * Managing accounts (admins only)
 * ------------------------------------------------------------------ */

async function activeAdmins(env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND status = 'active'").first();
  return row?.n ?? 0;
}

export async function handleUsers(request, env, json, me, route) {
  if (me.role !== 'admin') return json(403, { message: 'Only administrators can manage users.' });

  if (route === '/admin/users' && request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM users ORDER BY created_at').all();
    return json(200, { users: (results ?? []).map(publicUser), roles: ROLES });
  }

  if (route === '/admin/users' && request.method === 'POST') {
    const body = await readJson(request);
    const name = clean(body?.name, 80);
    const login = clean(body?.login, 100).toLowerCase();
    const role = ROLES[body?.role] ? body.role : 'viewer';
    if (!name) return json(400, { message: 'Please enter their name.' });
    if (!/^[a-z0-9._@+-]{3,100}$/.test(login)) {
      return json(400, { message: 'Use 3 or more letters, numbers, dots, dashes or @ for the username or email.' });
    }
    const exists = await env.DB.prepare('SELECT 1 FROM users WHERE login = ?1').bind(login).first();
    if (exists) return json(409, { message: `There is already an account for ${login}.` });
    const password = temporaryPassword();
    const now = Date.now();
    const id = randomId();
    await env.DB.prepare(
      `INSERT INTO users (id, name, login, password_hash, role, status, must_change, pwd_changed_at, created_at, created_by)
       VALUES (?1, ?2, ?3, ?4, ?5, 'active', 1, ?6, ?6, ?7)`
    )
      .bind(id, name, login, await hashPassword(password), role, now, me.id)
      .run();
    const row = await env.DB.prepare('SELECT * FROM users WHERE id = ?1').bind(id).first();
    return json(201, { user: publicUser(row), temporaryPassword: password });
  }

  const match = route.match(/^\/admin\/users\/([A-Za-z0-9_-]{6,40})(\/reset)?$/);
  if (!match) return json(404, { message: 'Not found.' });
  const target = await env.DB.prepare('SELECT * FROM users WHERE id = ?1').bind(match[1]).first();
  if (!target) return json(404, { message: 'That account no longer exists.' });
  const self = target.id === me.id;
  const lastAdmin = target.role === 'admin' && target.status === 'active' && (await activeAdmins(env)) <= 1;

  if (match[2] && request.method === 'POST') {
    // New temporary password; their current sessions stop working.
    const password = temporaryPassword();
    const now = Date.now();
    await env.DB.prepare('UPDATE users SET password_hash = ?1, must_change = 1, pwd_changed_at = ?2 WHERE id = ?3')
      .bind(await hashPassword(password), now, target.id)
      .run();
    return json(200, { user: publicUser({ ...target, must_change: 1, pwd_changed_at: now }), temporaryPassword: password });
  }

  if (!match[2] && request.method === 'POST') {
    const body = await readJson(request);
    const name = body?.name !== undefined ? clean(body.name, 80) : target.name;
    const role = body?.role !== undefined ? (ROLES[body.role] ? body.role : target.role) : target.role;
    const status = body?.status === 'disabled' || body?.status === 'active' ? body.status : target.status;
    if (!name) return json(400, { message: 'Please enter their name.' });
    if (self && status !== 'active') return json(400, { message: "You can't turn off your own account." });
    if (self && role !== 'admin') return json(400, { message: "You can't remove your own admin role. Ask another admin." });
    if (lastAdmin && (role !== 'admin' || status !== 'active')) {
      return json(400, { message: 'This is the only active admin. Make someone else an admin first.' });
    }
    // Turning an account off also ends its sessions straight away.
    const now = Date.now();
    await env.DB.prepare('UPDATE users SET name = ?1, role = ?2, status = ?3, pwd_changed_at = ?4 WHERE id = ?5')
      .bind(name, role, status, status !== target.status && status === 'disabled' ? now : target.pwd_changed_at, target.id)
      .run();
    return json(200, { user: publicUser({ ...target, name, role, status }) });
  }

  if (!match[2] && request.method === 'DELETE') {
    if (self) return json(400, { message: "You can't delete your own account." });
    if (lastAdmin) return json(400, { message: 'This is the only active admin. Make someone else an admin first.' });
    await env.DB.prepare('DELETE FROM users WHERE id = ?1').bind(target.id).run();
    return json(200, { deleted: target.id });
  }

  return json(405, { message: 'Method not allowed.' });
}
