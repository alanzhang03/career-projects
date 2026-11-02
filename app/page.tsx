import Image from "next/image";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getCompanies } from "@/lib/store";

export default async function Home() {
  const [companies, admin] = await Promise.all([getCompanies(), isAdmin()]);
  return (
    <>
      <h1>Career</h1>
      <p className="muted">Pick a company to see the projects from that role.</p>
      {admin ? (
        <Link href="/admin/new" className="edit-link">
          + Add company
        </Link>
      ) : null}

      <div className="company-grid">
        {companies.map((c) => (
          <Link key={c.slug} href={`/${c.slug}`} className="card company-card">
            {c.logo ? (
              <Image
                src={c.logo}
                alt=""
                width={96}
                height={40}
                className={c.invertLogoInDark ? "logo invert-dark" : "logo"}
              />
            ) : null}
            <h2>{c.name}</h2>
            <p>{c.role}</p>
            <p className="muted small">
              {c.start} – {c.end ?? <span className="current">Present</span>}
            </p>
            <p className="muted small">
              {c.projects.length} project{c.projects.length === 1 ? "" : "s"}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
