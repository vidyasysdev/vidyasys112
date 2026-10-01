export const LAUNCH_COLLEGE = "Vidyalankar Polytechnic";

export const VP_BRANCHES = [
  { code: "CO", name: "Computer Engineering" },
  { code: "IF", name: "Information Technology" },
  { code: "TE", name: "Electronics & Computer Engineering" },
] as const;

export type BranchCode = (typeof VP_BRANCHES)[number]["code"];

export const SEMESTERS = [1, 2, 3, 4, 5, 6] as const;

export const RESOURCE_TYPES = [
  "Subject Notes",
  "Study Material",
  "Important Questions",
  "Previous Exam Resources",
  "MSBTE Material",
  "Practical / Lab Resources",
  "Revision Resources",
] as const;
