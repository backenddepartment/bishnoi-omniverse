'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  KeyRound,
  LayoutGrid,
  List,
  Loader2,
  LogOut,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
  XCircle,
} from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { Modal } from './Modal';
import { Box, DataTable, Tag, fmt } from './ui';

/**
 * Dashboard accounts: the Users page (admins), the Settings page (everyone), and the screen that
 * asks for a new password at first sign-in. Data comes from the analytics Worker's /admin/users
 * and /admin/me endpoints (analytics-worker/src/users.js).
 */

/* ------------------------------------------------------------------ *
 * Types and helpers
 * ------------------------------------------------------------------ */

export type Role = 'admin' | 'viewer';

export interface AdminUser {
  id: string;
  name: string;
  login: string;
  role: Role;
  status: 'active' | 'disabled';
  mustChange: boolean;
  createdAt: number;
  lastSignedIn: number | null;
  permissions: string[];
}

/** Calls the Worker as the signed-in user; throws with the Worker's message on failure. */
export type Api = <T = unknown>(path: string, init?: { method?: string; body?: unknown }) => Promise<T>;

export const ROLE_INFO: Record<Role, { label: string; blurb: string }> = {
  admin: { label: 'Admin', blurb: 'Everything, including adding and managing users and exporting raw data.' },
  viewer: { label: 'Viewer', blurb: "Sees all the analytics and who's online. Can't export or manage users." },
};

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] ?? '')).toUpperCase() || '?';
}

const dateTime = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const dateOnly = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' });

export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-crm-p font-semibold text-white"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Form pieces, after the CRM component sheet
 * ------------------------------------------------------------------ */

export function Field({
  label,
  hint,
  ...input
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 ml-1 block text-[13px] font-medium text-crm-ink-2">{label}</span>
      <input
        {...input}
        className="block h-[46px] w-full rounded-full border border-crm-outline bg-white px-5 text-[14px] text-crm-ink outline-none transition placeholder:text-crm-ink-4 hover:border-crm-ink-3 focus:border-crm-p focus:shadow-[0_0_0_3px_#b1d4f6] disabled:cursor-not-allowed disabled:bg-crm-bench disabled:text-crm-ink-3"
      />
      {hint && <span className="ml-5 mt-1.5 block text-[12.5px] text-crm-ink-3">{hint}</span>}
    </label>
  );
}

function RoleChoice({ value, onChange, disabled }: { value: Role; onChange: (r: Role) => void; disabled?: boolean }) {
  return (
    <fieldset className="m-0 border-0 p-0" disabled={disabled}>
      <legend className="mb-1.5 ml-1 block p-0 text-[13px] font-medium text-crm-ink-2">Role</legend>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {(Object.keys(ROLE_INFO) as Role[]).map((role) => {
          const on = value === role;
          return (
            <label
              key={role}
              className={`flex cursor-pointer items-start gap-3 rounded-[18px] border p-3.5 transition ${
                on ? 'border-crm-p bg-crm-p-50 shadow-[inset_0_0_0_1px_#0c79e3]' : 'border-crm-rule hover:border-crm-outline'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <input type="radio" name="role" className="sr-only" checked={on} onChange={() => onChange(role)} />
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-[1.5px] ${
                  on ? 'border-crm-p bg-crm-p text-white' : 'border-crm-outline bg-white'
                }`}
                aria-hidden="true"
              >
                {on && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className="min-w-0">
                <b className="block text-[14px] font-semibold text-crm-ink">{ROLE_INFO[role].label}</b>
                <span className="block text-[12.5px] leading-snug text-crm-ink-3">{ROLE_INFO[role].blurb}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const btn = {
  primary:
    'inline-flex h-11 items-center justify-center gap-2 rounded-full bg-crm-p px-[22px] text-[14px] font-medium text-white transition hover:bg-crm-p-600 disabled:opacity-60',
  secondary:
    'inline-flex h-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-crm-p bg-white px-5 text-[14px] font-medium text-crm-ink transition hover:bg-crm-p-50 disabled:opacity-50',
  quiet:
    'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium text-crm-ink-2 transition hover:bg-crm-hover hover:text-crm-ink disabled:opacity-45',
  danger:
    'inline-flex h-11 items-center justify-center gap-2 rounded-full bg-crm-bad-bg px-5 text-[14px] font-medium text-crm-bad transition hover:bg-[#fbd5d2] disabled:opacity-50',
};

function ErrorNote({ text }: { text: string }) {
  return text ? (
    <p role="alert" className="mt-4 rounded-[14px] bg-crm-bad-bg px-4 py-3 text-[13px] text-[#7a1810]">
      {text}
    </p>
  ) : null;
}

/** The sign-in details to hand over: the username and a temporary password, with a copy button. */
function Credentials({ login, password }: { login: string; password: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Analytics dashboard sign-in\nUsername: ${login}\nTemporary password: ${password}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: the details are on screen to copy by hand. */
    }
  };
  return (
    <div className="rounded-[18px] bg-crm-p-50 p-4">
      <dl className="m-0 grid gap-2 text-[14px]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-crm-ink-3">Username</dt>
          <dd className="m-0 font-semibold text-crm-ink">{login}</dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-crm-ink-3">Temporary password</dt>
          <dd className="m-0 font-mono text-[15px] font-semibold tracking-wide text-crm-ink">{password}</dd>
        </div>
      </dl>
      <button type="button" onClick={copy} className={`${btn.secondary} mt-3.5 h-9 w-full text-[13px]`}>
        {copied ? <Check className="h-4 w-4 text-crm-p" aria-hidden="true" /> : <Copy className="h-4 w-4 text-crm-p" aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy sign-in details'}
      </button>
      <p className="m-0 mt-3 text-[12.5px] leading-relaxed text-crm-ink-3">
        This password is shown only once. They&apos;ll be asked to choose their own the first time they sign in.
      </p>
    </div>
  );
}

function PermissionChips({ permissions, max = 4 }: { permissions: string[]; max?: number }) {
  const shown = permissions.slice(0, max);
  const more = permissions.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((p) => (
        <span key={p} className="inline-flex h-7 items-center rounded-full bg-crm-rule-2 px-3 text-[12.5px] text-crm-ink-2">
          {p}
        </span>
      ))}
      {more > 0 && (
        <span className="inline-flex h-7 items-center rounded-full border border-crm-rule px-2.5 text-[12.5px] text-crm-ink-3" title={permissions.slice(max).join(', ')}>
          +{more}
        </span>
      )}
    </div>
  );
}

function RoleTag({ role }: { role: Role }) {
  return role === 'admin' ? (
    <span className="inline-flex h-[26px] items-center rounded-full bg-crm-p px-3 text-[12.5px] font-semibold text-white">Admin</span>
  ) : (
    <Tag tone="info">Viewer</Tag>
  );
}

function StatusLabel({ status }: { status: AdminUser['status'] }) {
  return status === 'active' ? (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-crm-ink-3">
      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-crm-bad">
      <XCircle className="h-4 w-4" aria-hidden="true" />
      Turned off
    </span>
  );
}

function YouTag() {
  return (
    <span className="inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-full bg-crm-p-50 px-2.5 text-[12.5px] font-medium text-crm-p-700">
      <span className="h-1.5 w-1.5 rounded-full bg-crm-p" aria-hidden="true" />
      you
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Users page
 * ------------------------------------------------------------------ */

const VIEW_KEY = 'bo-admin-users-view';

export function UsersView({ api, me }: { api: Api; me: AdminUser }) {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState('');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [adding, setAdding] = useState(false);
  const [managing, setManaging] = useState<AdminUser | null>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(VIEW_KEY) === 'list') setLayout('list');
    } catch {
      /* ignore */
    }
  }, []);
  const chooseLayout = (next: 'grid' | 'list') => {
    setLayout(next);
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const load = useCallback(async () => {
    try {
      const data = await api<{ users: AdminUser[] }>('/admin/users');
      setUsers(data.users);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the accounts.');
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const replace = (u: AdminUser) => setUsers((list) => (list ? list.map((x) => (x.id === u.id ? u : x)) : list));

  const sorted = useMemo(
    () => (users ? [...users].sort((a, b) => (a.id === me.id ? -1 : b.id === me.id ? 1 : a.name.localeCompare(b.name))) : []),
    [users, me.id]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-[15px] text-crm-ink-3">
          {users ? `${fmt.format(users.length)} ${users.length === 1 ? 'account' : 'accounts'}` : 'Loading accounts…'}
        </p>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-full border border-crm-rule bg-white p-1" role="group" aria-label="Show accounts as">
            {(
              [
                ['grid', LayoutGrid, 'Cards'],
                ['list', List, 'List'],
              ] as const
            ).map(([id, Icon, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={layout === id}
                aria-label={label}
                title={label}
                onClick={() => chooseLayout(id)}
                className={`grid h-9 w-9 place-items-center rounded-full transition ${
                  layout === id ? 'bg-crm-p text-white' : 'text-crm-ink-2 hover:bg-crm-hover hover:text-crm-ink'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setAdding(true)} className={btn.primary}>
            <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
            Add user
          </button>
        </div>
      </div>

      {error && <ErrorNote text={error} />}

      <div className="mt-5">
        {!users ? (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[300px] animate-pulse rounded-[22px] bg-crm-rule-2" />
            ))}
          </div>
        ) : layout === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {sorted.map((u) => (
              <article key={u.id} className="flex min-w-0 flex-col rounded-[22px] border border-crm-rule bg-white p-5">
                <div className="flex items-start gap-3.5">
                  <Avatar name={u.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="m-0 truncate text-[17px] font-semibold text-crm-ink">{u.name}</h3>
                      {u.id === me.id && <YouTag />}
                    </div>
                    <p className="m-0 mt-0.5 truncate text-[13.5px] text-crm-ink-3">{u.login}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <RoleTag role={u.role} />
                  <StatusLabel status={u.status} />
                </div>
                <dl className="m-0 mt-5 grid gap-2.5 text-[13.5px]">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-crm-ink-3">Last signed in</dt>
                    <dd className="m-0 text-right tabular-nums text-crm-ink">{u.lastSignedIn ? dateTime.format(u.lastSignedIn) : 'never'}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-crm-ink-3">Account added</dt>
                    <dd className="m-0 text-right tabular-nums text-crm-ink">{dateOnly.format(u.createdAt)}</dd>
                  </div>
                </dl>
                {/* The chips take the spare height, so every card's footer lines up at the bottom. */}
                <div className="mb-5 mt-5 flex-1">
                  <PermissionChips permissions={u.permissions} />
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-crm-rule pt-4">
                  <div className="min-w-0">
                    <b className="block text-[14px] font-semibold text-crm-ink">{u.permissions.length} permissions</b>
                    {u.mustChange && <span className="block text-[12.5px] text-crm-warn">Must change password</span>}
                  </div>
                  <button type="button" onClick={() => setManaging(u)} className={`${btn.primary} h-10 px-5`}>
                    Manage
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <DataTable
            noun="accounts"
            rows={sorted}
            rowKey={(u) => u.id}
            search={(u) => `${u.name} ${u.login} ${u.role}`}
            searchLabel="Search accounts"
            columns={[
              {
                key: 'user',
                head: 'User',
                render: (u) => (
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} size={36} />
                    <div className="min-w-0">
                      <span className="flex items-center gap-2 font-semibold text-crm-ink">
                        <span className="truncate">{u.name}</span>
                        {u.id === me.id && <YouTag />}
                      </span>
                      <span className="block truncate text-[12.5px] text-crm-ink-3">{u.login}</span>
                    </div>
                  </div>
                ),
              },
              { key: 'role', head: 'Role', render: (u) => <RoleTag role={u.role} /> },
              {
                key: 'status',
                head: 'Status',
                render: (u) => (
                  <div>
                    <StatusLabel status={u.status} />
                    {u.mustChange && <span className="block text-[12px] text-crm-warn">Must change password</span>}
                  </div>
                ),
              },
              { key: 'last', head: 'Last signed in', render: (u) => (u.lastSignedIn ? dateTime.format(u.lastSignedIn) : 'never') },
              { key: 'added', head: 'Added', render: (u) => dateOnly.format(u.createdAt) },
              { key: 'perms', head: 'Permissions', num: true, render: (u) => u.permissions.length },
              {
                key: 'manage',
                head: '',
                num: true,
                render: (u) => (
                  <button type="button" onClick={() => setManaging(u)} className={`${btn.secondary} h-9 px-4 text-[13px]`}>
                    Manage
                  </button>
                ),
              },
            ]}
          />
        )}
      </div>

      <AddUserModal
        open={adding}
        api={api}
        onClose={() => setAdding(false)}
        onCreated={(u) => setUsers((list) => (list ? [...list, u] : [u]))}
      />
      <ManageUserModal
        user={managing}
        me={me}
        api={api}
        onClose={() => setManaging(null)}
        onChanged={(u) => {
          replace(u);
          setManaging(u);
        }}
        onDeleted={(id) => {
          setUsers((list) => (list ? list.filter((x) => x.id !== id) : list));
          setManaging(null);
        }}
      />
    </div>
  );
}

function AddUserModal({
  open,
  api,
  onClose,
  onCreated,
}: {
  open: boolean;
  api: Api;
  onClose: () => void;
  onCreated: (u: AdminUser) => void;
}) {
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [role, setRole] = useState<Role>('viewer');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ user: AdminUser; temporaryPassword: string } | null>(null);

  // A fresh form every time it opens.
  useEffect(() => {
    if (open) {
      setName('');
      setLogin('');
      setRole('viewer');
      setError('');
      setCreated(null);
    }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api<{ user: AdminUser; temporaryPassword: string }>('/admin/users', {
        method: 'POST',
        body: { name, login, role },
      });
      setCreated(data);
      onCreated(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add the account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title={created ? 'Account created' : 'Add a user'}
      subtitle={created ? `Share these with ${created.user.name}.` : 'They get a temporary password and choose their own when they first sign in.'}
      footer={
        created ? (
          <button type="button" onClick={onClose} className={btn.primary}>
            Done
          </button>
        ) : (
          <>
            <button type="button" onClick={onClose} disabled={busy} className={btn.quiet}>
              Cancel
            </button>
            <button type="submit" form="add-user-form" disabled={busy} className={btn.primary}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Add user
            </button>
          </>
        )
      }
    >
      {created ? (
        <Credentials login={created.user.login} password={created.temporaryPassword} />
      ) : (
        <form id="add-user-form" onSubmit={submit} className="grid gap-4">
          <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} placeholder="e.g. Maria Santos" autoComplete="off" />
          <Field
            label="Username or email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            maxLength={100}
            placeholder="e.g. maria@bishnoiomniverse.com"
            autoComplete="off"
            hint="What they type to sign in."
          />
          <RoleChoice value={role} onChange={setRole} />
          <ErrorNote text={error} />
        </form>
      )}
    </Modal>
  );
}

function ManageUserModal({
  user,
  me,
  api,
  onClose,
  onChanged,
  onDeleted,
}: {
  user: AdminUser | null;
  me: AdminUser;
  api: Api;
  onClose: () => void;
  onChanged: (u: AdminUser) => void;
  onDeleted: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('viewer');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState<'reset' | 'delete' | 'disable' | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [lastId, setLastId] = useState('');

  // Load the account's values whenever a different account opens.
  if (user && user.id !== lastId) {
    setLastId(user.id);
    setName(user.name);
    setRole(user.role);
    setError('');
    setSaved(false);
    setNewPassword('');
  }

  const self = user?.id === me.id;
  const dirty = !!user && (name.trim() !== user.name || role !== user.role);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    run(async () => {
      const data = await api<{ user: AdminUser }>(`/admin/users/${user.id}`, { method: 'POST', body: { name, role } });
      onChanged(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const setStatus = (status: AdminUser['status']) =>
    user && run(async () => {
      const data = await api<{ user: AdminUser }>(`/admin/users/${user.id}`, { method: 'POST', body: { status } });
      onChanged(data.user);
    });

  const reset = () =>
    user && run(async () => {
      const data = await api<{ user: AdminUser; temporaryPassword: string }>(`/admin/users/${user.id}/reset`, { method: 'POST' });
      onChanged(data.user);
      setNewPassword(data.temporaryPassword);
    });

  const remove = () =>
    user && run(async () => {
      await api(`/admin/users/${user.id}`, { method: 'DELETE' });
      onDeleted(user.id);
    });

  const closeAll = () => {
    setLastId('');
    onClose();
  };

  return (
    <>
      <Modal
        open={!!user && !confirm}
        onClose={closeAll}
        busy={busy}
        width={560}
        title={user ? user.name : 'Manage user'}
        subtitle={user ? `${user.login} · ${ROLE_INFO[user.role].label}${self ? ' · this is you' : ''}` : undefined}
        footer={
          <>
            <button type="button" onClick={closeAll} disabled={busy} className={btn.quiet}>
              Close
            </button>
            <button type="submit" form="manage-user-form" disabled={busy || !dirty} className={btn.primary}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {saved ? 'Saved' : 'Save changes'}
            </button>
          </>
        }
      >
        {user && (
          <div className="grid gap-5">
            <form id="manage-user-form" onSubmit={save} className="grid gap-4">
              <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} autoComplete="off" />
              <Field label="Username or email" value={user.login} disabled hint="Usernames can't be changed. Add a new account instead." />
              <RoleChoice value={role} onChange={setRole} disabled={self} />
              {self && <p className="m-0 -mt-2 ml-1 text-[12.5px] text-crm-ink-3">You can&apos;t change your own role. Another admin can.</p>}
            </form>

            {newPassword && <Credentials login={user.login} password={newPassword} />}

            <section className="rounded-[18px] border border-crm-rule p-4">
              <h3 className="m-0 text-[15px] font-semibold text-crm-ink">Access</h3>
              <div className="mt-3 grid gap-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <b className="block text-[14px] font-medium text-crm-ink">Reset password</b>
                    <span className="block text-[12.5px] text-crm-ink-3">A new temporary password; they&apos;re signed out everywhere.</span>
                  </div>
                  <button type="button" disabled={busy} onClick={() => setConfirm('reset')} className={`${btn.secondary} h-9 px-4 text-[13px]`}>
                    <KeyRound className="h-4 w-4 text-crm-p" aria-hidden="true" />
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-crm-rule pt-3">
                  <div className="min-w-0">
                    <b className="block text-[14px] font-medium text-crm-ink">{user.status === 'active' ? 'Turn off account' : 'Turn account back on'}</b>
                    <span className="block text-[12.5px] text-crm-ink-3">
                      {self
                        ? "You can't turn off your own account."
                        : user.status === 'active'
                          ? 'They can no longer sign in; nothing is deleted.'
                          : 'They can sign in again with their current password.'}
                    </span>
                  </div>
                  {user.status === 'active' ? (
                    <button type="button" disabled={busy || self} onClick={() => setConfirm('disable')} className={`${btn.danger} h-9 px-4 text-[13px]`}>
                      Turn off
                    </button>
                  ) : (
                    <button type="button" disabled={busy} onClick={() => setStatus('active')} className={`${btn.secondary} h-9 px-4 text-[13px]`}>
                      Turn on
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-crm-rule pt-3">
                  <div className="min-w-0">
                    <b className="block text-[14px] font-medium text-crm-ink">Delete account</b>
                    <span className="block text-[12.5px] text-crm-ink-3">
                      {self ? "You can't delete your own account." : 'Removes the account for good. Analytics data is not affected.'}
                    </span>
                  </div>
                  <button type="button" disabled={busy || self} onClick={() => setConfirm('delete')} className={`${btn.danger} h-9 px-4 text-[13px]`}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </section>
            <ErrorNote text={error} />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirm === 'reset'}
        title={`Reset ${user?.name ?? ''}'s password?`}
        icon={<KeyRound className="h-[18px] w-[18px]" />}
        confirmLabel="Reset password"
        busy={busy}
        onConfirm={reset}
        onCancel={() => setConfirm(null)}
      >
        They&apos;ll be signed out everywhere and need the new temporary password, which you&apos;ll see next, to sign in.
      </ConfirmDialog>
      <ConfirmDialog
        open={confirm === 'disable'}
        title={`Turn off ${user?.name ?? ''}'s account?`}
        icon={<XCircle className="h-[18px] w-[18px]" />}
        confirmLabel="Turn off"
        tone="danger"
        busy={busy}
        onConfirm={() => setStatus('disabled')}
        onCancel={() => setConfirm(null)}
      >
        They&apos;re signed out at once and can&apos;t sign in until an admin turns the account back on.
      </ConfirmDialog>
      <ConfirmDialog
        open={confirm === 'delete'}
        title={`Delete ${user?.name ?? ''}'s account?`}
        icon={<Trash2 className="h-[18px] w-[18px]" />}
        confirmLabel="Delete account"
        tone="danger"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setConfirm(null)}
      >
        <span className="font-semibold text-crm-bad">This can&apos;t be undone.</span> The account and its sign-in are removed.
        The website&apos;s analytics are not affected.
      </ConfirmDialog>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Settings page
 * ------------------------------------------------------------------ */

export function SettingsView({
  api,
  me,
  expiresAt,
  onUser,
  onSession,
  onSignOut,
}: {
  api: Api;
  me: AdminUser;
  expiresAt: number;
  onUser: (u: AdminUser) => void;
  onSession: (s: { token: string; expiresAt: number; user: AdminUser }) => void;
  onSignOut: () => void;
}) {
  const [name, setName] = useState(me.name);
  const [nameBusy, setNameBusy] = useState(false);
  const [nameNote, setNameNote] = useState('');

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameBusy(true);
    setNameNote('');
    try {
      const data = await api<{ user: AdminUser }>('/admin/me', { method: 'POST', body: { name } });
      onUser(data.user);
      setNameNote('Saved.');
    } catch (err) {
      setNameNote(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setNameBusy(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Box title="Your profile" subtitle="How you appear to other admins.">
        <div className="flex items-center gap-4">
          <Avatar name={name || me.name} size={64} />
          <div className="min-w-0">
            <b className="block truncate text-[17px] font-semibold text-crm-ink">{me.name}</b>
            <span className="block truncate text-[13.5px] text-crm-ink-3">{me.login}</span>
            <div className="mt-2">
              <RoleTag role={me.role} />
            </div>
          </div>
        </div>
        <form onSubmit={saveName} className="mt-5 grid gap-3">
          <Field label="Display name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} autoComplete="name" />
          <div className="flex items-center gap-3">
            <button type="submit" disabled={nameBusy || !name.trim() || name.trim() === me.name} className={btn.primary}>
              {nameBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Save name
            </button>
            {nameNote && <span className="text-[13px] text-crm-ink-3">{nameNote}</span>}
          </div>
        </form>
        <div className="mt-5 border-t border-crm-rule pt-4">
          <p className="m-0 mb-2.5 text-[13px] font-medium text-crm-ink-2">What your role allows</p>
          <PermissionChips permissions={me.permissions} max={20} />
        </div>
      </Box>

      <div className="grid content-start gap-4">
        <Box title="Password" subtitle="Changing it signs you out on every other device.">
          <PasswordForm api={api} onSession={onSession} />
        </Box>

        <Box title="This session">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-crm-p-50 text-crm-p" aria-hidden="true">
                <ShieldCheck className="h-[18px] w-[18px]" />
              </span>
              <div>
                <b className="block text-[14px] font-medium text-crm-ink">Signed in until {dateTime.format(expiresAt)}</b>
                <span className="block text-[12.5px] text-crm-ink-3">Sign-ins last 12 hours, or until this tab is closed.</span>
              </div>
            </div>
            <button type="button" onClick={onSignOut} className={btn.secondary}>
              <LogOut className="h-4 w-4 text-crm-p" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </Box>
      </div>
    </div>
  );
}

/** Current, new and repeated password. Used on Settings and on the first-sign-in screen. */
export function PasswordForm({
  api,
  onSession,
  submitLabel = 'Change password',
}: {
  api: Api;
  onSession: (s: { token: string; expiresAt: number; user: AdminUser }) => void;
  submitLabel?: string;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDone(false);
    if (next.length < 10) return setError('Your new password needs at least 10 characters.');
    if (next !== again) return setError("The two new passwords don't match.");
    setBusy(true);
    try {
      const data = await api<{ token: string; expiresAt: number; user: AdminUser }>('/admin/me/password', {
        method: 'POST',
        body: { current, next },
      });
      setCurrent('');
      setNext('');
      setAgain('');
      setDone(true);
      onSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change the password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3.5">
      <Field label="Current password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
      <Field
        label="New password"
        type="password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        required
        minLength={10}
        autoComplete="new-password"
        hint="At least 10 characters. A short sentence is easy to remember and hard to guess."
      />
      <Field label="Repeat the new password" type="password" value={again} onChange={(e) => setAgain(e.target.value)} required autoComplete="new-password" />
      <ErrorNote text={error} />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className={btn.primary}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {submitLabel}
        </button>
        {done && (
          <span className="inline-flex items-center gap-1.5 text-[13px] text-crm-good">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Password changed
          </span>
        )}
      </div>
    </form>
  );
}

/** Shown instead of the dashboard while an account still has a temporary password. */
export function FirstPasswordScreen({
  api,
  me,
  onSession,
  onSignOut,
}: {
  api: Api;
  me: AdminUser;
  onSession: (s: { token: string; expiresAt: number; user: AdminUser }) => void;
  onSignOut: () => void;
}) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-crm-bench px-4 py-8 text-crm-ink">
      <div className="w-full max-w-[460px] rounded-[22px] bg-white p-7 shadow-[0_24px_60px_rgba(20,20,20,0.10)]">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-crm-p-50 text-crm-p" aria-hidden="true">
          <UserRound className="h-6 w-6" />
        </span>
        <h1 className="m-0 mt-4 text-[24px] font-semibold tracking-[-0.02em]">Welcome, {me.name.split(' ')[0]}</h1>
        <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-crm-ink-3">
          You signed in with a temporary password. Choose your own to continue to the analytics.
        </p>
        <div className="mt-6">
          <PasswordForm api={api} onSession={onSession} submitLabel="Save and continue" />
        </div>
        <button type="button" onClick={onSignOut} className={`${btn.quiet} mt-2 -ml-5`}>
          Sign out
        </button>
      </div>
    </div>
  );
}

