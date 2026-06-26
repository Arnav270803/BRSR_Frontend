import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth, RequireCompanyOnboarding } from "./AuthGuards";
import { AcceptInvitationPage } from "../pages/AcceptInvitationPage";
import { CompanyDataEntryPage } from "../pages/CompanyDataEntryPage";
import { CompanyEmployeesPage } from "../pages/CompanyEmployeesPage";
import { CompanyOnboardingPage } from "../pages/CompanyOnboardingPage";
import { CompanyGhgSetupPage } from "../pages/CompanyGhgSetupPage";
import { CompanyReportingYearRedirectPage } from "../pages/CompanyReportingYearRedirectPage";
import { CompanyReportingYearsPage } from "../pages/CompanyReportingYearsPage";
import { CompanySettingsPage } from "../pages/CompanySettingsPage";
import { CompanyWorkspacePage } from "../pages/CompanyWorkspacePage";
import { LoginPage } from "../pages/LoginPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/login" />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RequireAuth />}>
        <Route element={<AcceptInvitationPage />} path="/invite" />
        <Route element={<RequireCompanyOnboarding />}>
          <Route element={<CompanyOnboardingPage />} path="/onboarding/company" />
        </Route>
        <Route element={<CompanyWorkspacePage />} path="/app/:companyId" />
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
        <Route
          element={<CompanyGhgSetupPage />}
          path="/app/:companyId/reporting-years/:reportingYearId/ghg-setup"
        />
        <Route
          element={<CompanyDataEntryPage />}
          path="/app/:companyId/reporting-years/:reportingYearId/data"
        />
        <Route element={<CompanyEmployeesPage />} path="/app/:companyId/employees" />
        <Route element={<CompanySettingsPage />} path="/app/:companyId/settings" />
      </Route>
      <Route element={<Navigate replace to="/login" />} path="*" />
    </Routes>
  );
}
