import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSignedIn } from "@/lib/auth";
import { getCompany } from "@/lib/store";
import { CompanyForm } from "../forms";

export default async function EditCompanyPage({
  params,
}: PageProps<"/admin/[company]">) {
  await requireSignedIn();
  const { company: slug } = await params;
  const company = slug === "new" ? undefined : await getCompany(slug);
  if (slug !== "new" && !company) notFound();

  return (
    <>
      <Link href="/admin" className="back">
        ← Admin
      </Link>
      <h1>{company ? `Edit ${company.name}` : "Add company"}</h1>
      <CompanyForm company={company} />
    </>
  );
}
