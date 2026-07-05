import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { getCompanyWorkspace } from "../api/workspace";

export function CompanyReportingYearRedirectPage({
  target,
}: {
  target: "data" | "ghg-setup";
}) {
  const { companyId } = useParams();
  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }

  if (workspaceQuery.isLoading) {
    return <RedirectShell message="Opening reporting year..." />;
  }

  if (workspaceQuery.isError) {
    return <RedirectShell message="Unable to find a reporting year." tone="error" />;
  }

  const workspace = workspaceQuery.data!.data;
  const reportingYear = workspace.reportingYears[0];
  const site = workspace.sites[0];

  if (!reportingYear) {
    return <Navigate replace to={`/app/${companyId}/reporting-years`} />;
  }

  if (!site) {
    return <RedirectShell message="Create a site before opening this workspace." tone="error" />;
  }

  return (
    <Navigate
      replace
      to={`/app/${companyId}/sites/${site.id}/reporting-years/${reportingYear.id}/${target}`}
    />
  );
}

function RedirectShell({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef3ef] px-4 text-[#16211b]">
      <div
        className={`rounded-lg border p-5 text-sm font-semibold shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl ${
          tone === "error"
            ? "border-[#e2c6bd] bg-[#fff7f3] text-[#8a3f2a]"
            : "border-white/70 bg-white/60"
        }`}
      >
        {message}
      </div>
    </main>
  );
}
