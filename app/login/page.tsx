import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "../admin/forms";

export const metadata: Metadata = { title: "Sign in · Project Log" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/");
  return (
    <>
      <h1>Sign in</h1>
      <p className="muted">This project log is private.</p>
      <LoginForm />
    </>
  );
}
