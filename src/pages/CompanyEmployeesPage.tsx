import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import {
  createCompanyInvitation,
  listCompanyInvitations,
} from "../api/invitations";
import { getCompanyWorkspace } from "../api/workspace";
import { EmployeesHeader } from "../sections/employees/EmployeesHeader";
import { EmployeesInviteForm } from "../sections/employees/EmployeesInviteForm";
import { EmployeesMetrics } from "../sections/employees/EmployeesMetrics";
import { InvitationsList } from "../sections/employees/InvitationsList";
import {
  type CreateInvitationValues,
  type InvitationRecord,
} from "../sections/employees/employeesData";
import { getInvitationStatus } from "../sections/employees/employeesUtils";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";

export function CompanyEmployeesPage() {
  const { companyId } = useParams();
  const queryClient = useQueryClient();
  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });
  const invitationsQuery = useQuery({
    queryKey: ["company-invitations", companyId],
    queryFn: () => listCompanyInvitations(companyId!),
    enabled: Boolean(companyId),
  });
  const createInvitationMutation = useMutation({
    mutationFn: (values: CreateInvitationValues) =>
      createCompanyInvitation(companyId!, values),
  });

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }

  if (workspaceQuery.isLoading || invitationsQuery.isLoading) {
    return <EmployeesShell message="Loading employees..." />;
  }

  if (workspaceQuery.isError || invitationsQuery.isError) {
    return <EmployeesShell message="Unable to load employee access." tone="error" />;
  }

  const workspace = workspaceQuery.data!.data;
  const company = workspace.company;
  const viewerRole = workspace.viewerRole;
  const invitations = invitationsQuery.data!.data;
  const activeMemberCount = workspace.activeMemberCount;
  const pendingInviteCount = invitations.filter(
    (invitation) => getInvitationStatus(invitation) === "Pending",
  ).length;
  const acceptedInviteCount = invitations.filter(
    (invitation) => getInvitationStatus(invitation) === "Accepted",
  ).length;
  const adminInviteCount = invitations.filter((invitation) => invitation.role === "ADMIN").length;

  async function createInvitation(values: CreateInvitationValues): Promise<InvitationRecord> {
    const response = await createInvitationMutation.mutateAsync(values);
    const invitation = {
      ...response.data.invitation,
      token: response.data.token,
      inviteLink: response.data.inviteLink,
      emailSent: response.data.emailSent,
      emailError: response.data.emailError,
    };
    queryClient.setQueryData(
      ["company-invitations", companyId],
      { data: [invitation, ...invitations] },
    );
    return invitation;
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:flex-row lg:px-5 xl:gap-5 2xl:px-8">
        <WorkspaceSidebar
          activeItem="employees"
          companyId={company.id}
          companyName={company.displayName}
          defaultReportingYearId={workspace.reportingYears[0]?.id}
          viewerRole={viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <EmployeesHeader company={company} viewerRole={viewerRole} />

          <EmployeesMetrics
            acceptedInviteCount={acceptedInviteCount}
            activeMemberCount={activeMemberCount}
            adminInviteCount={adminInviteCount}
            pendingInviteCount={pendingInviteCount}
          />

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_430px] xl:gap-5 2xl:grid-cols-[minmax(0,1fr)_500px]">
            <InvitationsList invitations={invitations} />
            <EmployeesInviteForm createInvitation={createInvitation} />
          </div>
        </section>
      </div>
    </main>
  );
}

function EmployeesShell({
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
