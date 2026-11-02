import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "career_admin";

// The session cookie is an HMAC keyed by ADMIN_PASSWORD, so changing the
// password signs out every device.
function sessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("career-admin").digest("hex");
}

function safeEqual(a: string, b: string) {
  const hash = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function checkPassword(input: string) {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password) && safeEqual(input, password!);
}

export async function isAdmin() {
  const expected = sessionToken();
  const actual = (await cookies()).get(COOKIE)?.value;
  return Boolean(expected && actual && safeEqual(actual, expected));
}

/** The whole site is private: pages send signed-out visitors to /login. */
export async function requireSignedIn() {
  if (!(await isAdmin())) redirect("/login");
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

export async function signIn() {
  (await cookies()).set(COOKIE, sessionToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}
