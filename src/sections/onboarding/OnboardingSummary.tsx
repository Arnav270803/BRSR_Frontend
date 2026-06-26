const summaryCards = [
  {
    title: "Company profile",
    value: "Core identity",
    text: "Legal details and primary business location.",
    accent: "border-[#7da58b]",
  },
  {
    title: "Financial year",
    value: "Annual setup",
    text: "Used when creating reporting years.",
    accent: "border-[#8f9fc1]",
  },
  {
    title: "Admin access",
    value: "Auto assigned",
    text: "The creator becomes the first company admin.",
    accent: "border-[#c2a970]",
  },
  {
    title: "BRSR workspace",
    value: "Ready next",
    text: "Reporting years and GHG activities follow this setup.",
    accent: "border-[#9aa7a0]",
  },
];

export function OnboardingSummary() {
  return (
    <aside className="grid content-start gap-4">
      <div className="rounded-lg border border-white/70 bg-white/45 p-5 shadow-[0_20px_70px_rgba(35,47,38,0.12)] backdrop-blur-2xl">
        <p className="text-sm font-semibold text-[#426a52]">Setup overview</p>
        <h2 className="mt-2 text-xl font-semibold text-[#142019]">
          One profile, one workspace.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#62706a]">
          This information becomes the base company record used across the BRSR
          product flow.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {summaryCards.map((card) => (
          <section
            className={`rounded-lg border border-white/70 border-t-4 ${card.accent} bg-white/50 p-4 shadow-sm backdrop-blur-xl`}
            key={card.title}
          >
            <p className="text-xs font-semibold tracking-[0.12em] text-[#65716a] uppercase">
              {card.title}
            </p>
            <p className="mt-2 text-lg font-semibold text-[#16211b]">{card.value}</p>
            <p className="mt-2 text-sm leading-5 text-[#68756d]">{card.text}</p>
          </section>
        ))}
      </div>
    </aside>
  );
}
