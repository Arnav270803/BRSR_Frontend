import { Navigate, Route, Routes } from "react-router-dom";
import {
  RequireAuth,
  RequireCompanyAccess,
  RequireCompanyOnboarding,
  RequireVendorPortal,
} from "./AuthGuards";
import { AcceptInvitationPage } from "../pages/AcceptInvitationPage";
import { CompanyDataEntryPage } from "../pages/CompanyDataEntryPage";
import { CompanyEmployeesPage } from "../pages/CompanyEmployeesPage";
import { CompanyOnboardingPage } from "../pages/CompanyOnboardingPage";
import { CompanyGhgSetupPage } from "../pages/CompanyGhgSetupPage";
import { CompanyReportingYearRedirectPage } from "../pages/CompanyReportingYearRedirectPage";
import { CompanyReportingYearsPage } from "../pages/CompanyReportingYearsPage";
import { CompanyReportsPage } from "../pages/CompanyReportsPage";
import { CompanySettingsPage } from "../pages/CompanySettingsPage";
import { CompanySitesPage } from "../pages/CompanySitesPage";
import { CompanyWorkspacePage } from "../pages/CompanyWorkspacePage";
import { CompanyVendorsPage } from "../pages/CompanyVendorsPage";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { PrivacyPolicyPage } from "../pages/PrivacyPolicyPage";
import { VendorInvitationPage } from "../pages/VendorInvitationPage";
import { VendorPortalPage } from "../pages/VendorPortalPage";
import { VendorRequestPage } from "../pages/VendorRequestPage";

export default function App() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<PrivacyPolicyPage />} path="/privacy" />
      <Route element={<RequireAuth />}>
        <Route element={<AcceptInvitationPage />} path="/invite" />
        <Route element={<VendorInvitationPage />} path="/vendor/invite" />
        <Route element={<RequireCompanyOnboarding />}>
          <Route element={<CompanyOnboardingPage />} path="/onboarding/company" />
        </Route>
        <Route element={<RequireCompanyAccess />}>
          <Route element={<CompanyWorkspacePage />} path="/app/:companyId" />
          <Route element={<CompanyWorkspacePage />} path="/app/:companyId/sites/:siteId" />
          <Route element={<CompanySitesPage />} path="/app/:companyId/sites" />
          <Route
            element={<CompanyReportingYearRedirectPage target="ghg-setup" />}
            path="/app/:companyId/ghg-setup"
          />
          <Route
            element={<CompanyReportingYearRedirectPage target="data" />}
            path="/app/:companyId/data"
          />
          <Route
            element={<CompanyReportingYearsPage />}
            path="/app/:companyId/reporting-years"
          />
          <Route element={<CompanyReportsPage />} path="/app/:companyId/reports" />
          <Route
            element={<CompanyGhgSetupPage />}
            path="/app/:companyId/reporting-years/:reportingYearId/ghg-setup"
          />
          <Route
            element={<CompanyGhgSetupPage />}
            path="/app/:companyId/sites/:siteId/reporting-years/:reportingYearId/ghg-setup"
          />
          <Route
            element={<CompanyDataEntryPage />}
            path="/app/:companyId/reporting-years/:reportingYearId/data"
          />
          <Route
            element={<CompanyDataEntryPage />}
            path="/app/:companyId/sites/:siteId/reporting-years/:reportingYearId/data"
          />
          <Route
            element={<CompanyReportsPage />}
            path="/app/:companyId/sites/:siteId/reports"
          />
          <Route element={<CompanyEmployeesPage />} path="/app/:companyId/employees" />
          <Route element={<CompanyVendorsPage />} path="/app/:companyId/vendors" />
          <Route element={<CompanySettingsPage />} path="/app/:companyId/settings" />
        </Route>
        <Route element={<RequireVendorPortal />}>
          <Route element={<VendorPortalPage />} path="/vendor/:vendorId" />
          <Route
            element={<VendorRequestPage />}
            path="/vendor/:vendorId/requests/:requestId"
          />
        </Route>
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
