import { Link } from "react-router-dom";

const sections = [
  {
    title: "Information we collect",
    body: [
      "Account information such as name, email address, profile image, company name, role, and sign-in provider information from Google or LinkedIn when you choose to authenticate with those services.",
      "Company workspace information such as company details, sites, reporting years, employee access, selected GHG activities, BRSR-related records, uploaded or entered operational data, generated reports, and audit activity.",
      "Technical information such as browser type, device information, IP address, session cookies, request logs, and basic usage information needed to keep the service secure and reliable.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "To create and manage your account, authenticate users, provide role-based access, and route users to the correct company workspace.",
      "To let companies configure BRSR and GHG data fields, maintain site-specific records, invite employees, review records, and generate reports.",
      "To protect the platform, troubleshoot issues, improve the user experience, maintain audit trails, and support compliance-related workflows requested by your company.",
    ],
  },
  {
    title: "Google and LinkedIn sign-in",
    body: [
      "If you sign in with Google or LinkedIn, we receive only the account information needed to authenticate you, such as your name, email address, profile identifier, and profile image when available.",
      "We do not receive your Google or LinkedIn password. Authentication is handled by the respective provider and our backend creates a secure application session after verification.",
      "If the same verified email is used across providers, we may link those sign-in methods to the same BRSR Platform user account to avoid duplicate accounts.",
    ],
  },
  {
    title: "Sharing and disclosure",
    body: [
      "We do not sell personal information.",
      "Company data is shown only to authorized users for that company or site, based on their assigned role and access.",
      "We may share information with infrastructure, hosting, database, email, authentication, logging, or analytics providers only as needed to operate the platform.",
      "We may disclose information if required by law, security needs, fraud prevention, or to protect the rights and safety of users, companies, or the platform.",
    ],
  },
  {
    title: "Data retention",
    body: [
      "We keep account, company, BRSR, GHG, report, and audit information for as long as needed to provide the service, support company reporting workflows, meet legal or operational requirements, or resolve disputes.",
      "A company administrator may request correction, export, or deletion of company workspace data where technically and legally practical.",
    ],
  },
  {
    title: "Security",
    body: [
      "We use reasonable technical and organizational measures such as secure cookies, role-based access, encrypted transport, provider-based authentication, and controlled backend access to protect information.",
      "No online service can guarantee absolute security, but we work to keep access limited to authorized users and trusted operational systems.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can choose not to provide optional information, although some workspace features may require company, site, reporting year, or activity data to function.",
      "You can contact your company administrator to update your workspace access or request changes to company data.",
      "You can stop using Google or LinkedIn sign-in by removing access through the provider account settings, subject to your company's access requirements.",
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#eef3ef] px-5 py-6 text-[#15211a]">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#f8faf6_0%,#e8f0ed_48%,#f7efe6_100%)]" />

      <section className="mx-auto w-full max-w-4xl rounded-lg border border-white/70 bg-white/58 p-6 shadow-[0_24px_80px_rgba(35,47,38,0.14)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-[#d9e2dc] pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-[#426a52] uppercase">
              BRSR Platform
            </p>
            <h1 className="mt-4 text-3xl leading-tight font-semibold text-[#142019] sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607067]">
              This policy explains how BRSR Platform collects and uses information for
              company BRSR, ESG, GHG activity setup, data entry, access management, and
              reporting workflows.
            </p>
          </div>

          <Link
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-[#cdd9d1] bg-white/70 px-4 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none"
            to="/login"
          >
            Back to sign in
          </Link>
        </div>

        <div className="mt-6 rounded-lg border border-[#d9e2dc] bg-white/50 p-4 text-sm leading-6 text-[#5f6d65]">
          <p>
            <span className="font-semibold text-[#142019]">Last updated:</span> July 7,
            2026
          </p>
          <p className="mt-2">
            This policy is intended for users, company administrators, invited employees,
            and visitors who use or authenticate into the BRSR Platform.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-[#142019]">{section.title}</h2>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#5f6d65]">
                {section.body.map((item) => (
                  <li className="rounded-md border border-[#dce6df] bg-white/45 p-3" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-lg border border-[#d9e2dc] bg-[#f7faf7]/80 p-4">
          <h2 className="text-xl font-semibold text-[#142019]">Contact</h2>
          <p className="mt-3 text-sm leading-6 text-[#5f6d65]">
            For privacy questions, access requests, or company data requests, contact the
            BRSR Platform administrator or write to the support contact provided by your
            company workspace owner. If no dedicated contact is available yet, use the
            company or developer contact associated with this application.
          </p>
        </section>
      </section>
    </main>
  );
}
