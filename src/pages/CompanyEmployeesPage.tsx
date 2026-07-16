import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import {
  createCompanyInvitation,
  listCompanyInvitations,
} from "../api/invitations";
import {
  listCompanySiteMembers,
  updateCompanySiteMemberAccess,
} from "../api/sites";
import { getCompanyWorkspace } from "../api/workspace";
import { ActiveMembersPanel } from "../sections/employees/ActiveMembersPanel";
import { EmployeesHeader } from "../sections/employees/EmployeesHeader";
import { EmployeesInviteForm } from "../sections/employees/EmployeesInviteForm";
import { EmployeesMetrics } from "../sections/employees/EmployeesMetrics";
import { InvitationsList } from "../sections/employees/InvitationsList";
import { SiteAccessPanel } from "../sections/employees/SiteAccessPanel";
import {
  type CreateInvitationValues,
  type InvitationRecord,
} from "../sections/employees/employeesData";
import { getInvitationStatus } from "../sections/employees/employeesUtils";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";
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
  const siteMembersQuery = useQuery({
    queryKey: ["company-site-members", companyId],
    queryFn: () => listCompanySiteMembers(companyId!),
    enabled: Boolean(companyId),
  });
  const createInvitationMutation = useMutation({
    mutationFn: (values: CreateInvitationValues) =>
      createCompanyInvitation(companyId!, values),
  });
  const updateSiteAccessMutation = useMutation({
    mutationFn: ({ siteIds, userId }: { siteIds: string[]; userId: string }) =>
      updateCompanySiteMemberAccess(companyId!, userId, siteIds),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["company-site-members", companyId] }),
        queryClient.invalidateQueries({ queryKey: ["company-workspace", companyId] }),
      ]);
    },
  });

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }

  if (workspaceQuery.isLoading || invitationsQuery.isLoading || siteMembersQuery.isLoading) {
    return <EmployeesShell message="Loading employees..." />;
  }

  if (workspaceQuery.isError || invitationsQuery.isError || siteMembersQuery.isError) {
    return <EmployeesShell message="Unable to load employee access." tone="error" />;
  }

  const workspace = workspaceQuery.data!.data;
  const company = workspace.company;
  const viewerRole = workspace.viewerRole;
  const activeSite = workspace.sites[0];
  const canManageAccess = viewerRole !== "USER";
  const invitations = invitationsQuery.data!.data;
  const siteMembers = siteMembersQuery.data!.data;
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
          currentSiteId={activeSite?.id}
          isPlatformOwner={workspace.isPlatformOwner}
          reportingYears={workspace.reportingYears}
          sites={workspace.sites}
          viewerRole={viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <EmployeesHeader
            canManageAccess={canManageAccess}
            company={company}
            viewerRole={viewerRole}
          />

          <EmployeesMetrics
            acceptedInviteCount={acceptedInviteCount}
            activeMemberCount={activeMemberCount}
            adminInviteCount={adminInviteCount}
            pendingInviteCount={pendingInviteCount}
          />

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_430px] xl:gap-5 2xl:grid-cols-[minmax(0,1fr)_500px]">
            <div className="grid gap-3 sm:gap-4 xl:gap-5">
              <ActiveMembersPanel
                activeMemberCount={activeMemberCount}
                viewerRole={viewerRole}
              />
              <SiteAccessPanel
                canManageAccess={canManageAccess}
                members={siteMembers}
                saveSiteAccess={(userId, siteIds) =>
                  updateSiteAccessMutation.mutateAsync({ siteIds, userId }).then(() => undefined)
                }
                sites={workspace.sites}
                viewerRole={viewerRole}
              />
              <InvitationsList invitations={invitations} />
            </div>
            <EmployeesInviteForm
              canCreate={canManageAccess}
              createInvitation={createInvitation}
            />
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
  return <WorkspacePageState message={message} tone={tone} />;
}
