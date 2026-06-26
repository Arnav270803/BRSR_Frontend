import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { listReportingYears } from "../api/reportingYears";

export function CompanyReportingYearRedirectPage({
  target,
}: {
  target: "data" | "ghg-setup";
}) {
  const { companyId } = useParams();
  const reportingYearsQuery = useQuery({
    queryKey: ["reporting-years", companyId],
    queryFn: () => listReportingYears(companyId!),
    enabled: Boolean(companyId),
  });

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }

  if (reportingYearsQuery.isLoading) {
    return <RedirectShell message="Opening reporting year..." />;
  }

  if (reportingYearsQuery.isError) {
    return <RedirectShell message="Unable to find a reporting year." tone="error" />;
  }

  const reportingYear = reportingYearsQuery.data!.data[0];

  if (!reportingYear) {
    return <Navigate replace to={`/app/${companyId}/reporting-years`} />;
  }

  return (
    <Navigate
      replace
      to={`/app/${companyId}/reporting-years/${reportingYear.id}/${target}`}
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
