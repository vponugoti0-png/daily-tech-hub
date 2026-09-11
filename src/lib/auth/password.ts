import bcrypt from "bcryptjs";

export const BCRYPT_COST = 12;
export const PASSWORD_MIN_LENGTH = 8;

/** Small denylist — optional breach-style check without calling external APIs. */
const COMMON = new Set(
  [
    "password",
    "password1",
    "password123",
    "12345678",
    "123456789",
    "qwerty123",
    "letmein",
    "admin123",
    "welcome1",
    "iloveyou",
    "monkey123",
    "dragon123",
    "master123",
    "login123",
    "abc12345",
    "passw0rd",
    "changeme",
    "demo1234", // allow demo seed only via seed script — block for new signups
    "learnfree",
  ].map((s) => s.toLowerCase()),
);

export type PasswordIssue =
  | "too_short"
  | "too_common"
  | "no_letter"
  | "no_number";

export function validatePassword(password: string): PasswordIssue | null {
  if (password.length < PASSWORD_MIN_LENGTH) return "too_short";
  if (COMMON.has(password.toLowerCase())) return "too_common";
  if (!/[A-Za-z]/.test(password)) return "no_letter";
  if (!/[0-9]/.test(password)) return "no_number";
  return null;
}

export function passwordErrorMessage(issue: PasswordIssue): string {
  switch (issue) {
    case "too_short":
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    case "too_common":
      return "Choose a less common password";
    case "no_letter":
      return "Password must include a letter";
    case "no_number":
      return "Password must include a number";
  }
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, BCRYPT_COST);
}

export function checkPassword(password: string, hash: string | null | undefined) {
  if (!hash) return false;
  try {
    return bcrypt.compareSync(password, hash);
  } catch {
    return false;
  }
}
