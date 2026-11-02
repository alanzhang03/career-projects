import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSignedIn } from "@/lib/auth";
import { getCompany } from "@/lib/store";
import { ProjectForm } from "../../forms";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/[company]/[project]">) {
  await requireSignedIn();
  const { company: companySlug, project: projectSlug } = await params;
  const company = await getCompany(companySlug);
  const project =
    projectSlug === "new"
      ? undefined
      : company?.projects.find((p) => p.slug === projectSlug);
  if (!company || (projectSlug !== "new" && !project)) notFound();

  return (
    <>
      <Link href={`/${company.slug}`} className="back">
        ← {company.name}
      </Link>
      <h1>{project ? "Edit project" : `Add project at ${company.name}`}</h1>
      <ProjectForm companySlug={company.slug} project={project} />
    </>
  );
}
