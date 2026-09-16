import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getCollegeFromEmail(email: string): string | null {
  const domain = email.split("@")[1];
  if (!domain) return null;
  return domain;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateOrderNumber(collegeCode: string): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${collegeCode.toUpperCase()}-${num}`;
}

export const APPROVED_DOMAINS = [
  "vit.edu.in",
  "vp.edu.in",
  "vpt.edu.in",
  "iitb.ac.in",
  "bits-pilani.ac.in",
  "dtu.ac.in",
  "annauniv.edu",
  "rvce.edu.in",
];

export function isApprovedDomain(email: string): boolean {
  const domain = email.split("@")[1];
  return domain ? APPROVED_DOMAINS.includes(domain) : false;
}
