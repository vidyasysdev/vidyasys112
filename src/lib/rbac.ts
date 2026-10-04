export const ROLE_KEYS = ["admin", "creator", "moderator", "ambassador", "user"] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const ROLE_LABELS: Record<RoleKey, string> = {
  admin: "Admin",
  creator: "Creator",
  moderator: "Moderator",
  ambassador: "Brand Ambassador",
  user: "Regular User",
};

export const ROLE_BADGE_CLASSES: Record<RoleKey, string> = {
  admin: "bg-purple-50 text-purple-700",
  creator: "bg-blue-50 text-blue-700",
  moderator: "bg-amber-50 text-amber-700",
  ambassador: "bg-rose-50 text-rose-700",
  user: "bg-panel-2 text-ink-muted",
};

export const ACCOUNT_STATUSES = ["active", "suspended", "disabled"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  disabled: "Disabled",
};

export const ACCOUNT_STATUS_BADGE_CLASSES: Record<AccountStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  suspended: "bg-red-50 text-red-700",
  disabled: "bg-panel-2 text-ink-muted",
};

export const PERMISSION_KEYS = [
  "manage_users",
  "change_roles",
  "create_content",
  "moderate_reports",
  "ambassador_tools",
  "manage_permissions",
  "manage_projects",
  "view_audit_log",
  "manage_settings",
] as const;
export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  manage_users: "Manage Users",
  change_roles: "Change Roles",
  create_content: "Create Content / Projects",
  moderate_reports: "Moderate Reports",
  ambassador_tools: "Brand Ambassador Tools",
  manage_permissions: "Manage Permissions",
  manage_projects: "Project Configuration",
  view_audit_log: "View Activity Logs",
  manage_settings: "Platform Settings",
};

export const PERMISSION_GROUPS: { title: string; permissions: PermissionKey[] }[] = [
  {
    title: "User Administration",
    permissions: ["manage_users", "change_roles"],
  },
  {
    title: "Content & Projects",
    permissions: ["create_content", "manage_projects"],
  },
  {
    title: "Moderation & Ambassadors",
    permissions: ["moderate_reports", "ambassador_tools"],
  },
  {
    title: "System",
    permissions: ["manage_permissions", "view_audit_log", "manage_settings"],
  },
];

/**
 * Default permission matrix (spec §4).
 * The Admin role is always granted everything inside has_permission()
 * at the database level; these defaults keep the UI matrix in sync.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<RoleKey, Record<PermissionKey, boolean>> = {
  admin: {
    manage_users: true,
    change_roles: true,
    create_content: true,
    moderate_reports: true,
    ambassador_tools: true,
    manage_permissions: true,
    manage_projects: true,
    view_audit_log: true,
    manage_settings: true,
  },
  creator: {
    manage_users: false,
    change_roles: false,
    create_content: true,
    moderate_reports: false,
    ambassador_tools: false,
    manage_permissions: false,
    manage_projects: false,
    view_audit_log: false,
    manage_settings: false,
  },
  moderator: {
    manage_users: false,
    change_roles: false,
    create_content: false,
    moderate_reports: true,
    ambassador_tools: false,
    manage_permissions: false,
    manage_projects: false,
    view_audit_log: false,
    manage_settings: false,
  },
  ambassador: {
    manage_users: false,
    change_roles: false,
    create_content: false,
    moderate_reports: false,
    ambassador_tools: true,
    manage_permissions: false,
    manage_projects: false,
    view_audit_log: false,
    manage_settings: false,
  },
  user: {
    manage_users: false,
    change_roles: false,
    create_content: false,
    moderate_reports: false,
    ambassador_tools: false,
    manage_permissions: false,
    manage_projects: false,
    view_audit_log: false,
    manage_settings: false,
  },
};

export const PROJECT_KEYS = [
  "notes",
  "academic_projects",
  "hardware_projects",
  "student_essentials",
] as const;
export type ProjectKey = (typeof PROJECT_KEYS)[number];

export const PROJECT_LABELS: Record<ProjectKey, string> = {
  notes: "Notes",
  academic_projects: "Academic Projects",
  hardware_projects: "Hardware Projects",
  student_essentials: "Student Essentials",
};

export const PROJECT_FEATURES: { key: string; label: string; description: string }[] = [
  {
    key: "create_listing",
    label: "Create Listing",
    description: "Allow permitted roles to create listings in this project",
  },
];

export function hasPerm(granted: string[] | null | undefined, permission: PermissionKey): boolean {
  return !!granted?.includes(permission);
}

export function isRole(value: unknown): value is RoleKey {
  return typeof value === "string" && (ROLE_KEYS as readonly string[]).includes(value);
}
