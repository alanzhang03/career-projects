import type { Metadata } from "next";
import Link from "next/link";
import { getCompanies, storageLabel } from "@/lib/store";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Admin · Project Log" };

export default async function AdminPage() {
  const companies = await getCompanies();
  return (
    <>
      <div className="admin-head">
        <h1>Admin</h1>
        <form action={logout}>
          <button type="submit" className="btn">
            Sign out
          </button>
        </form>
      </div>
      <p className="muted small">Saving to {storageLabel}.</p>

      <Link href="/admin/new" className="btn primary admin-add">
        + Add company
      </Link>

      <ul className="project-list">
        {companies.map((c) => (
          <li key={c.slug} className="card">
            <div className="project-row-head">
              <h2>{c.name}</h2>
              <Link href={`/admin/${c.slug}`} className="edit-link">
                Edit
              </Link>
            </div>
            <ul className="admin-projects">
              {c.projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/admin/${c.slug}/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
              <li>
                <Link href={`/admin/${c.slug}/new`} className="edit-link">
                  + Add project
                </Link>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
