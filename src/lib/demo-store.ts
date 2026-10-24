/**
 * Local demo data store for the admin panel.
 *
 * When Supabase auth is not configured yet (`ADMIN_DEMO_LOGIN=true` and no real
 * Supabase project in the environment), the admin panel reads and writes a small
 * JSON store inside `.vidyasys-demo/` so the whole panel — roles, account
 * statuses, account creation and the audit log — can be demonstrated end to end.
 *
 * Everything here runs on the server only. As soon as real Supabase credentials
 * are configured, `isDemoStoreActive()` returns false and every call site falls
 * back to the real database.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import {
  DEMO_ADMIN_COOKIE,
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_USER_ID,
  isDemoAdminEnabled,
  parseDemoSession,
} from "@/lib/demo-admin";
import type { RoleKey, AccountStatus } from "@/lib/rbac";

// Re-exported for admin pages that need the bootstrap identity.
export { DEMO_ADMIN_USER_ID };

export interface DemoProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  branch: string | null;
  role: RoleKey;
  account_status: AccountStatus;
  verification_status: string;
  created_at: string;
  /** Only seeded demo accounts that may sign in carry a password. */
  password?: string;
}

export interface DemoAuditEntry {
  id: string;
  action: string;
  actor_label: string;
  target_id: string | null;
  target_label: string | null;
  previous_value: string | null;
  new_value: string | null;
  created_at: string;
}

export const DEMO_DIR = path.join(process.cwd(), ".vidyasys-demo");
const USERS_FILE = path.join(DEMO_DIR, "users.json");
const AUDIT_FILE = path.join(DEMO_DIR, "audit-log.json");
const MAX_AUDIT_ENTRIES = 200;

/** Real Supabase credentials present in the environment? */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return !!url && !url.includes("your-project") && !url.startsWith("your_");
}

/** Use the local JSON store instead of the database? */
export function isDemoStoreActive(): boolean {
  return isDemoAdminEnabled() && !isSupabaseConfigured();
}

/** Current demo identity for call sites that need a "current user". */
export async function getDemoAuthContext(): Promise<{
  userId: string;
  email: string;
  role: RoleKey;
} | null> {
  if (!isDemoStoreActive()) return null;

  const store = await cookies();
  return parseDemoSession(store.get(DEMO_ADMIN_COOKIE)?.value);
}

const SEED_USERS: DemoProfile[] = [
  {
    id: "seed-1",
    user_id: "demo-1a2b3c",
    email: "aarav.sharma@vpt.edu.in",
    full_name: "Aarav Sharma",
    branch: "Computer Engineering",
    role: "user",
    account_status: "active",
    verification_status: "verified",
    created_at: "2026-01-12T09:15:00.000Z",
  },
  {
    id: "seed-2",
    user_id: "demo-4d5e6f",
    email: "diya.patel@vpt.edu.in",
    full_name: "Diya Patel",
    branch: "Information Technology",
    role: "creator",
    account_status: "active",
    verification_status: "verified",
    created_at: "2026-02-03T14:40:00.000Z",
  },
  {
    id: "seed-3",
    user_id: "demo-7g8h9i",
    email: "rohan.iyer@vit.edu.in",
    full_name: "Rohan Iyer",
    branch: "Mechanical Engineering",
    role: "user",
    account_status: "active",
    verification_status: "pending",
    created_at: "2026-03-21T11:05:00.000Z",
  },
  {
    id: "seed-4",
    user_id: "demo-j1k2l3",
    email: "meera.nair@vpt.edu.in",
    full_name: "Meera Nair",
    branch: "Electronics & Telecom",
    role: "moderator",
    account_status: "active",
    verification_status: "verified",
    created_at: "2026-04-08T08:20:00.000Z",
  },
  {
    id: "seed-5",
    user_id: "demo-m4n5o6",
    email: "kabir.shah@vidyasys.in",
    full_name: "Kabir Shah",
    branch: "Computer Engineering",
    role: "ambassador",
    account_status: "active",
    verification_status: "verified",
    created_at: "2026-05-17T16:30:00.000Z",
  },
  {
    id: "seed-6",
    user_id: "demo-p7q8r9",
    email: "ananya.rao@vpt.edu.in",
    full_name: "Ananya Rao",
    branch: "Civil Engineering",
    role: "user",
    account_status: "suspended",
    verification_status: "verified",
    created_at: "2026-06-02T10:10:00.000Z",
  },
  {
    id: "seed-7",
    user_id: "demo-yash001",
    email: "yash@vidyasys.in",
    full_name: "Yash",
    branch: "Computer Engineering",
    role: "ambassador",
    account_status: "active",
    verification_status: "verified",
    created_at: "2026-10-20T09:00:00.000Z",
    password: "rajbhosale",
  },
];

async function readDemoUsers(): Promise<DemoProfile[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DemoProfile[]) : [];
  } catch {
    // First run (or unreadable file): seed the store.
    await writeDemoUsers(SEED_USERS);
    return SEED_USERS;
  }
}

async function writeDemoUsers(users: DemoProfile[]): Promise<void> {
  await fs.mkdir(DEMO_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

async function readAuditLog(): Promise<DemoAuditEntry[]> {
  try {
    const raw = await fs.readFile(AUDIT_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DemoAuditEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeAuditLog(entries: DemoAuditEntry[]): Promise<void> {
  await fs.mkdir(DEMO_DIR, { recursive: true });
  await fs.writeFile(
    AUDIT_FILE,
    JSON.stringify(entries.slice(0, MAX_AUDIT_ENTRIES), null, 2),
    "utf8"
  );
}

export async function demoLogAction(entry: {
  action: string;
  targetId?: string | null;
  targetLabel?: string | null;
  previousValue?: string | null;
  newValue?: string | null;
}): Promise<void> {
  const entries = await readAuditLog();
  entries.unshift({
    id: randomUUID(),
    action: entry.action,
    actor_label: DEMO_ADMIN_EMAIL,
    target_id: entry.targetId ?? null,
    target_label: entry.targetLabel ?? null,
    previous_value: entry.previousValue ?? null,
    new_value: entry.newValue ?? null,
    created_at: new Date().toISOString(),
  });
  await writeAuditLog(entries);
}

export async function demoListUsers(filter: {
  status?: string;
  role?: string;
} = {}): Promise<DemoProfile[]> {
  let users = await readDemoUsers();
  if (filter.status) users = users.filter((u) => u.account_status === filter.status);
  if (filter.role) users = users.filter((u) => u.role === filter.role);
  return [...users].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function demoCountUsers(): Promise<number> {
  return (await readDemoUsers()).length;
}

export async function demoSetUserRole(
  userId: string,
  role: RoleKey
): Promise<{ ok: boolean; error?: string }> {
  const users = await readDemoUsers();
  const target = users.find((u) => u.user_id === userId);
  if (!target) return { ok: false, error: "Account not found." };
  if (target.role === role) return { ok: true };

  const previous = target.role;
  target.role = role;
  await writeDemoUsers(users);
  await demoLogAction({
    action: "role_change",
    targetId: userId,
    targetLabel: target.email,
    previousValue: previous,
    newValue: role,
  });
  return { ok: true };
}

export async function demoSetAccountStatus(
  userId: string,
  status: AccountStatus
): Promise<{ ok: boolean; error?: string }> {
  const users = await readDemoUsers();
  const target = users.find((u) => u.user_id === userId);
  if (!target) return { ok: false, error: "Account not found." };
  if (target.account_status === status) return { ok: true };

  const previous = target.account_status;
  target.account_status = status;
  await writeDemoUsers(users);
  await demoLogAction({
    action: "account_status_change",
    targetId: userId,
    targetLabel: target.email,
    previousValue: previous,
    newValue: status,
  });
  return { ok: true };
}

export async function demoCreateUser(input: {
  email: string;
  fullName: string;
  role: RoleKey;
}): Promise<{ ok: boolean; error?: string }> {
  const users = await readDemoUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  users.unshift({
    id: randomUUID(),
    user_id: `demo-${randomUUID().slice(0, 8)}`,
    email,
    full_name: input.fullName.trim() || null,
    branch: null,
    role: input.role,
    account_status: "active",
    verification_status: "verified",
    created_at: new Date().toISOString(),
  });
  await writeDemoUsers(users);
  await demoLogAction({
    action: "user_created",
    targetLabel: email,
    newValue: input.role,
  });
  return { ok: true };
}

export async function demoAuditLog(action?: string): Promise<DemoAuditEntry[]> {
  const entries = await readAuditLog();
  return action ? entries.filter((e) => e.action === action) : entries;
}
