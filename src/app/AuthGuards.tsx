import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { getCurrentSession } from "../api/auth";
import { ApiError } from "../api/client";

function AuthLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef3ef] px-4 text-[#16211b]">
      <div className="rounded-lg border border-white/70 bg-white/60 px-5 py-4 text-sm font-semibold shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl">
        Checking session...
      </div>
    </main>
  );
}

export function useSessionQuery() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentSession,
    retry: false,
    staleTime: 60_000,
  });
}

export function RequireAuth() {
  const location = useLocation();
  const sessionQuery = useSessionQuery();
  const currentPath = `${location.pathname}${location.search}`;

  if (sessionQuery.isLoading) {
    return <AuthLoading />;
  }

  if (sessionQuery.isError) {
    const error = sessionQuery.error;

    if (error instanceof ApiError && error.status === 401) {
      return <Navigate replace state={{ from: currentPath }} to="/login" />;
    }

    return (
      <main className="grid min-h-screen place-items-center bg-[#eef3ef] px-4 text-[#16211b]">
        <div className="max-w-md rounded-lg border border-[#e2c6bd] bg-[#fff7f3] p-5 text-sm leading-6 text-[#8a3f2a]">
          Unable to load your session. Please refresh and try again.
        </div>
      </main>
    );
  }

  const session = sessionQuery.data!.data;

  if (
    session.needsCompanyOnboarding &&
    location.pathname !== "/onboarding/company" &&
    location.pathname !== "/invite" &&
    location.pathname !== "/vendor/invite"
  ) {
    return <Navigate replace to="/onboarding/company" />;
  }

  return <Outlet />;
}

export function RequireCompanyAccess() {
  const { companyId } = useParams();
  const sessionQuery = useSessionQuery();

  if (sessionQuery.isLoading) {
    return <AuthLoading />;
  }

  if (sessionQuery.isError) {
    return <Navigate replace to="/login" />;
  }

  const session = sessionQuery.data!.data;
  const hasAccess =
    session.user.isPlatformOwner ||
    session.memberships.some((membership) => membership.companyId === companyId);

  if (!hasAccess) {
    const vendorMembership = session.vendorMemberships[0];

    return (
      <Navigate
        replace
        to={vendorMembership ? `/vendor/${vendorMembership.vendorId}` : "/login"}
      />
    );
  }

  return <Outlet />;
}

export function RequireVendorPortal() {
  const { vendorId } = useParams();
  const sessionQuery = useSessionQuery();

  if (sessionQuery.isLoading) {
    return <AuthLoading />;
  }

  if (sessionQuery.isError) {
    return <Navigate replace to="/login" />;
  }

  const session = sessionQuery.data!.data;
  const hasAccess = session.vendorMemberships.some(
    (membership) => membership.vendorId === vendorId,
  );

  if (!hasAccess) {
    const companyMembership = session.memberships[0];

    return (
      <Navigate
        replace
        to={companyMembership ? `/app/${companyMembership.companyId}` : "/login"}
      />
    );
  }

  return <Outlet />;
}

export function RequireCompanyOnboarding() {
  const sessionQuery = useSessionQuery();

  if (sessionQuery.isLoading) {
    return <AuthLoading />;
  }

  if (sessionQuery.isError) {
    return <Navigate replace to="/login" />;
  }

  const session = sessionQuery.data!.data;
  const firstCompany = session.memberships[0];
  const firstVendor = session.vendorMemberships[0];

  if (!session.needsCompanyOnboarding && firstCompany) {
    return <Navigate replace to={`/app/${firstCompany.companyId}`} />;
  }

  if (!session.needsCompanyOnboarding && firstVendor) {
    return <Navigate replace to={`/vendor/${firstVendor.vendorId}`} />;
  }

  return <Outlet />;
}
