import { CompanyOnboardingForm } from "../sections/onboarding/CompanyOnboardingForm";
import { OnboardingSummary } from "../sections/onboarding/OnboardingSummary";

export function CompanyOnboardingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f1f5f1] px-5 py-6 text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#eaf2ef_42%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <section className="relative mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-5 py-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-[#426a52] uppercase">
              Company onboarding
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold text-[#142019] md:text-5xl">
              Create your company workspace.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5f6a64]">
              Set the company profile that will anchor reporting years, GHG
              activity selection, employee access, and BRSR data entry.
            </p>
          </div>

          <div className="rounded-lg border border-white/70 bg-white/45 px-4 py-3 text-sm text-[#53615a] shadow-sm backdrop-blur-xl">
            <p className="font-semibold text-[#16211b]">Creator role</p>
            <p className="mt-1">Assigned as company admin</p>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <CompanyOnboardingForm />
          <OnboardingSummary />
        </div>
      </section>
    </main>
  );
}
