import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Database,
  Droplets,
  FileCheck2,
  Globe2,
  Leaf,
  LineChart,
  Mail,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import procesgLogo from "../assets/procesg-logo-official.png";

const frameworkCards = [
  {
    letter: "P",
    title: "Protect",
    icon: ShieldCheck,
    tone: "teal",
    copy: "Equip leadership to manage climate risks, protect natural assets & build long-term resilience",
  },
  {
    letter: "r",
    title: "Responsibility",
    icon: Users,
    tone: "teal",
    copy: "Strengthen ethical conduct and accountability across leadership, operations & every business decision",
  },
  {
    letter: "o",
    title: "Opportunity",
    icon: LineChart,
    tone: "gold",
    copy: "Turn ESG into competitive advantage — access green finance, new markets, investor trust & transformation lever.",
  },
  {
    letter: "c",
    title: "Compliance",
    icon: FileCheck2,
    tone: "gold",
    copy: "Meet SEBI BRSR, GRI, TCFD & ISSB mandates with confidence and credibility",
  },
  {
    letter: "e",
    title: "Environment",
    icon: Leaf,
    tone: "teal",
    copy: "Measure, manage & reduce carbon footprint — from energy to emissions to net zero pathways",
  },
  {
    letter: "s",
    title: "Social",
    icon: Users,
    tone: "gold",
    copy: "Build fair, inclusive workplaces and responsible supply chains that people and investors can trust",
  },
  {
    letter: "G",
    title: "Governance",
    icon: Building2,
    tone: "teal",
    copy: "Strengthen board oversight, ESG reporting structures & accountability frameworks",
  },
];

const regionalAlignmentRows = [
  {
    theme: "Reporting adoption",
    icon: FileCheck2,
    world: {
      highlight: "95%",
      copy: "of the world's top 250 companies now publish carbon targets",
    },
    apac: {
      copy: "Mandatory ISSB disclosure phasing in across Australia, Singapore, Hong Kong, Malaysia & South Korea (2025–29)",
    },
    india: {
      highlight: "90%+",
      copy: "of NSE 100 companies now publish BRSR reports",
    },
  },
  {
    theme: "Green finance",
    icon: CircleDollarSign,
    world: {
      prefix: "Global sustainable finance:",
      highlight: "$15.06T",
      copy: "in 2026, projected ~$27T by 2031",
    },
    apac: {
      prefix: "APAC sustainable bonds hit",
      highlight: "$1T",
      copy: "outstanding (18.5% of global total); fastest-growing region at 21%+ CAGR",
    },
    india: {
      highlight: "₹35,000Cr+",
      copy: "green loans & RBI green finance available*",
    },
  },
  {
    theme: "Performance signal",
    icon: LineChart,
    world: {
      copy: "ESG-aligned firms widely cited as outperforming peers on long-run ROI",
    },
    apac: {
      copy: "Same ROI signal, reinforced by mandatory-disclosure capital access",
    },
    india: {
      highlight: "3x",
      copy: "ROI outperformance cited for ESG-aligned firms*",
    },
  },
  {
    theme: "Net-zero targets",
    icon: Target,
    world: {
      copy: "Most developed economies target net zero by 2050",
    },
    apac: {
      copy: "China: 2060 · Japan / South Korea: 2050 · region clusters 2050–2060",
    },
    india: {
      copy: "Net zero by 2070, with a 2030 interim milestone (500GW non-fossil, 45% emissions-intensity cut)",
    },
  },
];

const regionalAlignmentRegions = [
  { key: "world", label: "World", color: "#0b3158" },
  { key: "apac", label: "APAC", color: "#159f90" },
  { key: "india", label: "India", color: "#268f2f" },
] as const;

const workflow = [
  { title: "Collect Data", copy: "Bring site, supplier and operational inputs into one ESG data hub.", icon: Database },
  { title: "Validate Compliance", copy: "Map evidence to ESG/BRSR, SEBI and governance requirements.", icon: ClipboardCheck },
  { title: "Generate Reports", copy: "Create board-ready ESG/BRSR outputs and leadership summaries.", icon: FileCheck2 },
  { title: "Unlock Value", copy: "Convert disclosures into ESG performance, finance and strategy actions.", icon: Sparkles },
];

const serviceCards = [
  {
    title: "ESG Strategy & Roadmapping",
    copy: "Bespoke ESG frameworks, materiality assessments, gap analysis & sustainability strategy.",
    icon: Target,
  },
  {
    title: "ESG Reporting & Disclosure",
    copy: "GRI, TCFD, ISSB, SGX compliance. Sustainability reports and stakeholder communications.",
    icon: FileCheck2,
  },
  {
    title: "Net Zero & Decarbonisation",
    copy: "Carbon footprint measurement, SBTi pathway development and net zero roadmaps.",
    icon: Leaf,
  },
  {
    title: "Carbon Credits & Green Markets",
    copy: "CIX navigation, Article 6 / ITMO transactions, ASEAN green credit sourcing and offset strategy.",
    icon: LineChart,
  },
  {
    title: "Digital Transformation",
    copy: "Cloud ESG tech stack, process automation, advanced analytics and data governance.",
    icon: Database,
  },
  {
    title: "ESG Training & Capacity Building",
    copy: "Board-level and staff ESG literacy programs, certified workshops and change management.",
    icon: Users,
  },
];

const engagementSteps = [
  {
    number: "01",
    title: "Diagnose",
    copy: "ESG maturity assessment, stakeholder mapping, material issues identification and regulatory gap analysis.",
    icon: LineChart,
    color: "#2379b8",
  },
  {
    number: "02",
    title: "Design",
    copy: "Bespoke ESG strategy, KPI framework, governance structure and transformation roadmap tailored to your sector.",
    icon: ClipboardCheck,
    color: "#169b86",
  },
  {
    number: "03",
    title: "Deploy",
    copy: "Project execution with embedded consultants, technology integration, training and change management.",
    icon: Sparkles,
    color: "#2e9132",
  },
  {
    number: "04",
    title: "Disclose",
    copy: "ESG report creation, investor communications, regulatory submissions and stakeholder engagement.",
    icon: FileCheck2,
    color: "#0b3158",
  },
  {
    number: "05",
    title: "Drive Value",
    copy: "Continuous performance tracking, benchmarking, and ongoing optimisation to embed ESG into business DNA.",
    icon: LineChart,
    color: "#f2a51a",
    featured: true,
  },
];

const focusAreas = [
  { title: "Reduce Emissions", copy: "Track and cut carbon footprint", icon: Sprout, color: "text-[#268f2f]" },
  { title: "Water Stewardship", copy: "Measure, manage, improve", icon: Droplets, color: "text-[#1469b2]" },
  { title: "Diversity & Inclusion", copy: "Build fair workplaces", icon: Users, color: "text-[#159f90]" },
  { title: "Ethics & Transparency", copy: "Strengthen governance", icon: ShieldCheck, color: "text-[#f2a50c]" },
];

const aboutCards = [
  { label: "Founded", value: "2020 in Singapore", tone: "bg-[#159f90]" },
  { label: "Focus", value: "ESG & Digital Transformation", tone: "bg-[#1469b2]" },
  { label: "Reach", value: "Singapore, APAC & Global", tone: "bg-[#268f2f]" },
  { label: "Expertise", value: "25+ years of leadership experience", tone: "bg-[#1d3e6f]" },
];

export function LandingPage() {
  return (
    <main className="landing-page min-h-screen overflow-x-clip bg-[#f6f8fb] text-[#07182e]">
      <HeroSection />
      <FrameworkSection />
      <RegionalAlignmentSection />
      <PlatformSection />
      <EngagementApproachSection />
      <AboutSection />
    </main>
  );
}

function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#001326] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_23%,rgba(20,105,178,0.30),transparent_34%),linear-gradient(135deg,#000d1e_0%,#062344_55%,#000d1d_100%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(135deg,rgba(54,197,205,0.18)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="absolute inset-x-0 bottom-0 h-36 opacity-50 [background-image:radial-gradient(circle_at_center,rgba(34,152,222,0.65)_1px,transparent_1.5px)] [background-size:28px_18px]" />

      <header className="relative z-20 border-b border-[#d9ddd8] bg-[#faf7f0] text-[#07182e]">
        <div className="mx-auto flex h-[76px] max-w-[1800px] items-center justify-between px-4 sm:h-[88px] sm:px-8 lg:px-12 xl:px-14">
          <a className="flex items-center" href="#top" aria-label="ProcesG home">
            <img className="h-[62px] w-auto sm:h-[72px]" src={procesgLogo} alt="ProcesG - ESG to Value Creation" />
          </a>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 text-[15px] font-semibold text-[#07182e] lg:flex xl:gap-12">
            <a className="relative py-3 transition hover:text-[#176b4d] after:absolute after:inset-x-0 after:bottom-0 after:mx-auto after:h-0.5 after:w-12 after:bg-[#268f2f]" href="#solutions">
              Solutions
            </a>
            <a className="py-3 transition hover:text-[#176b4d]" href="#platform">
              Platform
            </a>
            <a className="py-3 transition hover:text-[#176b4d]" href="#services">
              Services
            </a>
            <a className="py-3 transition hover:text-[#176b4d]" href="#contact">
              Contact
            </a>
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <Link
              className="inline-flex h-11 items-center justify-center px-2 text-sm font-semibold text-[#07182e] transition hover:text-[#176b4d]"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="inline-flex h-11 min-w-32 items-center justify-center gap-4 rounded-md bg-[#001f3b] px-5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(0,31,59,0.14)] transition hover:bg-[#073657]"
              to="/login"
            >
              <span>Sign Up</span>
              <ArrowRight className="text-[#e9b949]" size={18} strokeWidth={2.2} />
            </Link>
          </div>

          <button
            className="grid size-10 place-items-center rounded-md border border-[#cad2cc] bg-white/55 text-[#07182e] lg:hidden"
            type="button"
            aria-expanded={isMenuOpen}
            aria-label="Open navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMenuOpen ? (
          <nav className="grid gap-2 border-t border-[#d9ddd8] bg-[#faf7f0] px-5 py-4 text-sm font-semibold text-[#07182e] sm:px-8 lg:hidden">
            <a className="rounded-md bg-[#eef3ec] px-3 py-2.5 text-[#176b4d]" href="#solutions" onClick={() => setIsMenuOpen(false)}>
              Solutions
            </a>
            <a className="rounded-md px-3 py-2.5 hover:bg-[#eef3ec]" href="#platform" onClick={() => setIsMenuOpen(false)}>
              Platform
            </a>
            <a className="rounded-md px-3 py-2.5 hover:bg-[#eef3ec]" href="#services" onClick={() => setIsMenuOpen(false)}>
              Services
            </a>
            <a className="rounded-md px-3 py-2.5 hover:bg-[#eef3ec]" href="#contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link className="inline-flex h-11 items-center justify-center rounded-md border border-[#aebcb4] text-[#07182e]" to="/login">
                Login
              </Link>
              <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#001f3b] font-semibold text-white" to="/login">
                <span>Sign Up</span>
                <ArrowRight className="text-[#e9b949]" size={17} />
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <div id="top" className="relative z-10 mx-auto grid max-w-[1720px] items-center gap-10 px-4 py-12 sm:gap-12 sm:px-8 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-20 xl:py-24">
        <div>
          <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#18bfb4]/65 bg-[#031e37]/72 px-3 py-2 text-xs font-semibold text-[#18d8ca] shadow-[0_10px_34px_rgba(0,0,0,0.18)] sm:px-4 sm:text-sm">
            <ShieldCheck size={16} />
            <span className="min-w-0">Globally Trusted ESG/BRSR Consultancy</span>
          </p>

          <h1 className="mt-7 max-w-[840px] text-4xl leading-[1.1] font-bold tracking-normal text-white sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[70px]">
            <span className="block">Transforming ESG Complexity</span>
            <span className="block">
              into <span className="lp-accent">Business Opportunity</span>
            </span>
          </h1>

          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-semibold text-[#b9dfc0] sm:text-2xl">
            <span>Established 2020</span>
            <span aria-hidden="true">&bull;</span>
            <span>Singapore</span>
          </p>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#d9e6f4] sm:text-[20px] sm:leading-8">
            ProcesG helps organizations simplify ESG reporting, navigate evolving regulations,
            and turn sustainability into measurable business value. By embedding transformation
            into ESG, we drive efficiency, resilience, and sustainable growth.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-14 items-center justify-center gap-3 rounded-md bg-[#ffc34f] px-7 text-base font-bold text-[#07182e] shadow-[0_18px_44px_rgba(255,195,79,0.28)] transition hover:bg-[#ffd36f]"
              href="#contact"
            >
              <CalendarDays size={20} />
              Book Demo
            </a>
            <a
              className="inline-flex h-14 items-center justify-center gap-3 rounded-md border border-white/80 bg-white/6 px-7 text-base font-semibold text-white transition hover:bg-white hover:text-[#001326]"
              href="#platform"
            >
              <Play size={19} />
              Explore Platform
            </a>
          </div>

          <div className="mt-9 grid max-w-3xl grid-cols-1 gap-5 text-sm text-[#d9e7f5] sm:grid-cols-3">
            <TrustItem icon={ShieldCheck} label="ESG/BRSR & SEBI Aligned" />
            <TrustItem icon={LineChart} label="Data to Value Framework" />
            <TrustItem icon={Leaf} label="Social at Scale" />
          </div>
        </div>

        <HeroDashboard />
      </div>
    </section>
  );
}

function TrustItem({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) {
  return (
    <div className="flex items-center gap-3 border-r border-white/18 last:border-r-0 sm:last:border-r lg:pr-4 lg:last:border-r-0">
      <span className="grid size-10 shrink-0 place-items-center rounded-md border border-[#18bfb4]/45 bg-[#18bfb4]/10 text-[#5ee0d0]">
        <Icon size={20} />
      </span>
      <span className="leading-5">{label}</span>
    </div>
  );
}

function HeroDashboard() {
  return (
    <div className="relative min-h-0 lg:min-h-[580px]">
      <div className="relative rounded-lg border border-white/55 bg-white p-4 text-[#07182e] shadow-[0_30px_90px_rgba(0,0,0,0.34)] sm:p-5 lg:absolute lg:top-5 lg:right-5 lg:left-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-12 place-items-center rounded-md bg-[#001b3b] text-[#73e1cf]">
              <Leaf size={24} />
            </span>
            <div className="min-w-0">
              <p className="text-xl font-semibold">ESG Overview</p>
              <p className="text-xs font-semibold text-[#6d7890]">FY 2024-25</p>
            </div>
          </div>
          <button className="shrink-0 whitespace-nowrap rounded-md border border-[#d8e1ea] bg-[#f7fafc] px-3 py-2 text-xs font-semibold text-[#40516a]" type="button">
            FY 2024-25
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreRing label="Overall ESG Score" value="78" color="#1469b2" />
          <ScoreRing label="Environmental" value="82" color="#268f2f" />
          <ScoreRing label="Social" value="73" color="#f2a50c" />
          <ScoreRing label="Governance" value="79" color="#159f90" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.25fr]">
          <div className="rounded-lg border border-[#e1e7ef] bg-white p-4 shadow-sm">
            <p className="font-semibold text-[#07182e]">ESG/BRSR Compliance</p>
            <div className="mt-4 space-y-3">
              {["General Disclosures", "Management & Process Disclosures", "Principle-wise Performance", "Core Indicators", "Leadership Indicators"].map((item) => (
                <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-[#41516a]" key={item}>
                  <span className="grid size-5 place-items-center rounded-full bg-[#268f2f] text-white">
                    <Check size={13} />
                  </span>
                  <span className="min-w-0">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs font-semibold text-[#40516a]">5 / 5 Completed</p>
            <div className="mt-2 h-2 rounded-full bg-[#e6edf1]">
              <div className="h-full w-full rounded-full bg-[#268f2f]" />
            </div>
          </div>

          <div className="rounded-lg border border-[#e1e7ef] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold text-[#07182e]">Performance Trend</p>
              <div className="flex flex-wrap gap-3 text-[10px] font-semibold text-[#6d7890]">
                <span className="inline-flex items-center gap-1"><i className="size-2 rounded-sm bg-[#b9cddd]" /> FY 22-23</span>
                <span className="inline-flex items-center gap-1"><i className="size-2 rounded-sm bg-[#1469b2]" /> FY 23-24</span>
                <span className="inline-flex items-center gap-1"><i className="size-2 rounded-sm bg-[#268f2f]" /> FY 24-25</span>
              </div>
            </div>
            <div className="mt-6 grid h-44 grid-cols-3 items-end gap-2 border-b border-[#dce5ec] px-1 sm:gap-7 sm:px-4">
              <MiniBars values={[54, 38, 48]} labels={["Environment"]} />
              <MiniBars values={[62, 44, 52]} labels={["Social"]} />
              <MiniBars values={[78, 58, 72]} labels={["Governance"]} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-4 w-full rounded-lg border border-[#e5ebf1] bg-white p-5 text-[#07182e] shadow-[0_26px_70px_rgba(0,0,0,0.26)] lg:absolute lg:right-0 lg:bottom-4 lg:mt-0 lg:w-[44%]">
        <p className="font-bold">Top Focus Areas</p>
        <div className="mt-5 space-y-4">
          {focusAreas.map((area) => (
            <div className="flex items-start gap-3" key={area.title}>
              <area.icon className={area.color} size={25} />
              <div>
                <p className="text-sm font-bold">{area.title}</p>
                <p className="text-xs text-[#5c6b7c]">{area.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ label, value, color }: { label: string; value: string; color: string }) {
  const style = {
    background: `conic-gradient(${color} 0 78%, #e7edf2 78% 100%)`,
  };

  return (
    <div className="rounded-lg border border-[#e1e7ef] bg-[#fbfcfe] p-4 text-center shadow-sm">
      <p className="text-xs font-bold text-[#40516a]">{label}</p>
      <div className="mx-auto mt-4 grid size-24 place-items-center rounded-full" style={style}>
        <div className="grid size-[74px] place-items-center rounded-full bg-white">
          <div>
            <p className="text-2xl font-extrabold text-[#07182e]">{value}</p>
            <p className="-mt-1 text-[10px] font-semibold text-[#718092]">/100</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniBars({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <div className="flex h-full flex-col items-center justify-end">
      <div className="flex h-36 items-end gap-2">
        {values.map((value, index) => (
          <span
            className={[
              "w-4 rounded-t-sm",
              index === 0 ? "bg-[#b9cddd]" : index === 1 ? "bg-[#1469b2]" : "bg-[#268f2f]",
            ].join(" ")}
            key={value + index}
            style={{ height: `${value}%` }}
          />
        ))}
      </div>
      <p className="mt-3 text-[11px] font-semibold text-[#40516a]">{labels[0]}</p>
    </div>
  );
}

function FrameworkSection() {
  return (
    <section id="solutions" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-14">
        <div className="max-w-3xl">
          <p className="text-sm font-bold tracking-[0.18em] text-[#159f90] uppercase">
            ESG to Value Creation
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-normal text-[#07182e] sm:text-4xl md:text-5xl">
            Introducing the ProcesG
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#526173]">
            A practical path from ESG compliance to business value.
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-lg border border-white shadow-[0_24px_70px_rgba(10,35,70,0.14)] md:grid-cols-2 lg:grid-cols-7">
          {frameworkCards.map((card) => (
            <FrameworkCard key={card.letter} {...card} />
          ))}
        </div>

      </div>
    </section>
  );
}

function RegionalAlignmentSection() {
  return (
    <section className="bg-[#faf7f0] py-16 sm:py-20 lg:py-24" aria-labelledby="regional-alignment-title">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-[#159f90] uppercase">
              Global ESG landscape
            </p>
            <h2
              id="regional-alignment-title"
              className="mt-3 max-w-4xl font-serif text-3xl leading-tight font-bold tracking-normal text-[#07182e] sm:text-4xl md:text-5xl"
            >
              ESG Alignment Across World, APAC &amp; India
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-[#41516a] italic sm:text-lg">
              Reporting adoption, green finance, performance signal, and net-zero targets — one view by region
            </p>
          </div>

          <RegionalRoute />
        </div>

        <div className="mt-12 hidden overflow-hidden border-y border-[#d7dfd7] lg:block">
          <div className="grid grid-cols-[250px_repeat(3,minmax(0,1fr))] items-end border-b border-[#d7dfd7]">
            <div className="px-6 py-5 text-xs font-bold tracking-[0.14em] text-[#718078] uppercase">
              Comparison theme
            </div>
            {regionalAlignmentRegions.map((region) => (
              <div className="relative px-8 py-5 text-center" key={region.key}>
                <span
                  className="mx-auto mb-3 block size-3 rounded-full ring-4 ring-[#faf7f0]"
                  style={{ backgroundColor: region.color }}
                />
                <p className="text-xl font-extrabold" style={{ color: region.color }}>
                  {region.label}
                </p>
                <span
                  className="absolute inset-x-0 top-[26px] -z-0 h-px opacity-25"
                  style={{ backgroundColor: region.color }}
                />
              </div>
            ))}
          </div>

          {regionalAlignmentRows.map((row) => (
            <div
              className="grid min-h-[166px] grid-cols-[250px_repeat(3,minmax(0,1fr))] border-b border-[#d7dfd7] last:border-b-0"
              key={row.theme}
            >
              <div className="flex items-center gap-5 px-5 py-7">
                <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#e9f0e9] text-[#159f90]">
                  <row.icon size={31} strokeWidth={1.8} />
                </span>
                <h3 className="text-lg leading-6 font-extrabold text-[#07182e]">{row.theme}</h3>
              </div>
              {regionalAlignmentRegions.map((region) => (
                <RegionalAlignmentCell
                  cell={row[region.key]}
                  color={region.color}
                  finance={row.theme === "Green finance"}
                  key={region.key}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-8 lg:hidden">
          {regionalAlignmentRegions.map((region) => (
            <article className="border-t-2 pt-5" style={{ borderColor: region.color }} key={region.key}>
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full" style={{ backgroundColor: region.color }} />
                <h3 className="text-2xl font-extrabold" style={{ color: region.color }}>
                  {region.label}
                </h3>
              </div>
              <div className="mt-4 divide-y divide-[#d7dfd7]">
                {regionalAlignmentRows.map((row) => (
                  <div className="grid gap-3 py-5 sm:grid-cols-[180px_1fr]" key={row.theme}>
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e9f0e9] text-[#159f90]">
                        <row.icon size={20} />
                      </span>
                      <p className="font-bold text-[#07182e]">{row.theme}</p>
                    </div>
                    <RegionalAlignmentCell
                      cell={row[region.key]}
                      color={region.color}
                      finance={row.theme === "Green finance"}
                      mobile
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionalRoute() {
  return (
    <div className="relative mx-auto hidden h-40 w-full max-w-[430px] overflow-hidden lg:block" aria-hidden="true">
      <Globe2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#dfe9dc]" size={176} strokeWidth={0.7} />
      <div className="absolute inset-x-5 top-[76px] h-px bg-[#9eb3aa]" />
      <div className="absolute inset-x-2 top-[58px] flex items-start justify-between">
        {regionalAlignmentRegions.map((region) => (
          <div className="grid justify-items-center gap-2" key={region.key}>
            <span
              className="size-5 rounded-full border-4 border-[#faf7f0] shadow-[0_4px_12px_rgba(7,24,46,0.18)]"
              style={{ backgroundColor: region.color }}
            />
            <span className="text-xs font-extrabold tracking-[0.08em] uppercase" style={{ color: region.color }}>
              {region.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionalAlignmentCell({
  cell,
  color,
  finance,
  mobile = false,
}: {
  cell: { prefix?: string; highlight?: string; copy: string };
  color: string;
  finance: boolean;
  mobile?: boolean;
}) {
  return (
    <div className={mobile ? "min-w-0" : "flex min-w-0 flex-col justify-center border-l border-[#d7dfd7] px-8 py-7"}>
      {cell.prefix ? <p className="text-sm leading-6 text-[#41516a]">{cell.prefix}</p> : null}
      {cell.highlight ? (
        <p
          className="mt-1 text-3xl leading-none font-extrabold"
          style={{ color: finance ? "#d79b00" : color }}
        >
          {cell.highlight}
        </p>
      ) : null}
      <p className={["leading-7 text-[#31435a]", cell.highlight ? "mt-2" : "", mobile ? "text-sm sm:text-base" : "text-base"].join(" ")}>
        {cell.copy}
      </p>
    </div>
  );
}

function FrameworkCard({
  letter,
  title,
  icon: Icon,
  tone,
  copy,
}: {
  letter: string;
  title: string;
  icon: typeof ShieldCheck;
  tone: string;
  copy: string;
}) {
  const isGold = tone === "gold";

  return (
    <article
      className={[
        "min-h-[300px] border-b border-r border-white/70 p-7 transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(10,35,70,0.18)] lg:border-b-0",
        isGold ? "bg-[#ffc34f] text-[#07182e]" : "bg-[#159f90] text-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-4xl font-extrabold">{letter}</p>
          <p className="mt-3 text-lg font-extrabold underline underline-offset-4">{title}</p>
        </div>
        <Icon className={isGold ? "text-white/88" : "text-white/90"} size={42} />
      </div>
      <p className={["mt-8 text-base leading-7", isGold ? "text-[#07182e]" : "text-white"].join(" ")}>
        {copy}
      </p>
    </article>
  );
}

function PlatformSection() {
  return (
    <section id="platform">
      <div className="relative overflow-hidden bg-[#001326] py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(24,191,180,0.20),transparent_30%),radial-gradient(circle_at_80%_54%,rgba(20,105,178,0.26),transparent_34%)]" />
        <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div>
              <p className="text-sm font-bold tracking-[0.18em] text-[#5ee0d0] uppercase">
                Platform
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-normal sm:text-4xl md:text-5xl">
                From fragmented ESG data to board-ready ESG/BRSR reports
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#d9e7f5]">
                A focused workflow that moves teams from raw evidence to credible disclosures,
                performance insight and executive action.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {workflow.map((item, index) => (
                <article className="rounded-lg border border-white/14 bg-white/[0.07] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur" key={item.title}>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-md bg-[#ffc34f] text-[#07182e]">
                      <item.icon size={22} />
                    </span>
                    <span className="text-sm font-bold text-white/45">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#d9e7f5]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-lg border border-white/16 bg-white p-5 text-[#07182e] shadow-[0_34px_90px_rgba(0,0,0,0.28)] lg:p-7">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#159f90]">Action Plan</p>
                    <h3 className="mt-1 text-2xl font-extrabold">ESG/BRSR readiness dashboard</h3>
                  </div>
                  <span className="rounded-md bg-[#edf7f3] px-3 py-2 text-xs font-bold text-[#159f90]">
                    82% Ready
                  </span>
                </div>
                <div className="mt-6 overflow-hidden rounded-lg border border-[#e1e7ef]">
                  {[
                    ["General Disclosures", "Complete", "100%"],
                    ["Principle 2: Product Responsibility", "Review", "74%"],
                    ["GHG Scope Data", "In Progress", "68%"],
                    ["Leadership Indicators", "Evidence Needed", "51%"],
                  ].map(([name, status, progress]) => (
                    <div className="grid grid-cols-1 items-center gap-2 border-b border-[#e1e7ef] px-4 py-4 last:border-b-0 sm:grid-cols-[1fr_auto_90px] sm:gap-4" key={name}>
                      <p className="text-sm font-bold">{name}</p>
                      <p className="text-xs font-semibold text-[#526173]">{status}</p>
                      <div>
                        <p className="mb-1 text-xs font-bold text-[#1469b2] sm:text-right">{progress}</p>
                        <div className="h-1.5 rounded-full bg-[#e6edf1]">
                          <div className="h-full rounded-full bg-[#1469b2]" style={{ width: progress }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#e1e7ef] bg-[#f7fafc] p-5">
                <p className="font-extrabold">Focus heatmap</p>
                <div className="mt-5 grid grid-cols-5 gap-2">
                  {Array.from({ length: 25 }).map((_, index) => (
                    <span
                      className={[
                        "h-9 rounded-sm",
                        index % 5 === 0
                          ? "bg-[#ffc34f]"
                          : index % 3 === 0
                            ? "bg-[#1469b2]"
                            : index % 2 === 0
                              ? "bg-[#159f90]"
                              : "bg-[#dce8ef]",
                      ].join(" ")}
                      key={index}
                    />
                  ))}
                </div>
                <div className="mt-6 grid gap-3">
                  {["Evidence quality", "Regulatory confidence", "Board readiness"].map((label, index) => (
                    <div className="flex items-center justify-between text-sm font-semibold" key={label}>
                      <span>{label}</span>
                      <span className="text-[#159f90]">{[92, 86, 78][index]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="services" className="bg-[#f6f8fb] py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-14">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.18em] text-[#159f90] uppercase">
                Services
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-normal text-[#07182e] sm:text-4xl md:text-5xl">
                Built for every ESG team
              </h2>
            </div>
            <div className="rounded-lg border border-[#dce3eb] bg-white p-4 shadow-sm sm:flex sm:items-center sm:gap-3">
              <Link className="inline-flex h-11 items-center justify-center rounded-md border border-[#1d3e6f] px-5 text-sm font-bold text-[#1d3e6f] transition hover:bg-[#edf4fa]" to="/login">
                Login
              </Link>
              <Link className="mt-3 inline-flex h-11 items-center justify-center rounded-md bg-[#ffc34f] px-5 text-sm font-bold text-[#07182e] transition hover:bg-[#ffd36f] sm:mt-0" to="/login">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceCards.map((card) => (
              <article className="rounded-lg border border-[#dce3eb] bg-white p-6 shadow-[0_18px_50px_rgba(10,35,70,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(10,35,70,0.13)]" key={card.title}>
                <span className="grid size-12 place-items-center rounded-md bg-[#edf7f3] text-[#159f90]">
                  <card.icon size={24} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-[#07182e]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#526173]">{card.copy}</p>
                <a className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1469b2]" href="#contact">
                  Book Demo <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EngagementApproachSection() {
  return (
    <section id="engagement" className="bg-[#f7f8f6] py-16 sm:py-20 lg:py-24" aria-labelledby="engagement-approach-title">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-14">
        <div className="max-w-4xl">
          <p className="text-sm font-bold tracking-[0.2em] text-[#159f90] uppercase">
            How We Work
          </p>
          <h2
            id="engagement-approach-title"
            className="mt-3 text-3xl font-extrabold tracking-normal text-[#07182e] sm:text-4xl md:text-5xl"
          >
            Our Engagement Approach
          </h2>
          <p className="mt-4 text-base leading-7 text-[#526173] sm:text-lg">
            A clear path from ESG ambition to measurable business value.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-16">
          <div className="absolute top-16 right-[8%] left-[8%] hidden h-px bg-[#0b3158] xl:block" aria-hidden="true" />
          <div className="absolute top-[57px] left-[20%] hidden w-[60%] justify-between text-[#0b3158] xl:flex" aria-hidden="true">
            {[0, 1, 2, 3].map((marker) => (
              <ArrowRight className="bg-[#f7f8f6] px-1" key={marker} size={24} strokeWidth={1.8} />
            ))}
          </div>

          <div className="relative grid gap-7 md:grid-cols-2 xl:grid-cols-5 xl:gap-6">
            {engagementSteps.map((step) => (
              <article
                className={[
                  "relative min-w-0 px-5 py-6 sm:px-6 xl:px-3 xl:py-0",
                  step.featured ? "bg-[#fff5dc]" : "bg-white/70 xl:bg-transparent",
                ].join(" ")}
                key={step.number}
              >
                <div className="relative mx-auto w-fit xl:h-36">
                  <span
                    className="grid size-28 place-items-center rounded-full text-white shadow-[0_14px_34px_rgba(7,24,46,0.16)] sm:size-32"
                    style={{ backgroundColor: step.color }}
                  >
                    <step.icon size={48} strokeWidth={1.7} />
                  </span>
                  <span
                    className="absolute -top-3 -left-4 grid size-14 place-items-center rounded-full border-[3px] bg-[#f7f8f6] text-xl font-extrabold sm:size-16 sm:text-2xl"
                    style={{ borderColor: step.color, color: step.color }}
                  >
                    {step.number}
                  </span>
                </div>

                <div className="mt-6 border-l-[3px] pl-5 xl:mt-5" style={{ borderColor: step.color }}>
                  <h3 className="text-xl font-extrabold text-[#07182e] sm:text-2xl">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#45546a] sm:text-base">{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold tracking-[0.18em] text-[#159f90] uppercase">
              About ProcesG
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-normal text-[#07182e] sm:text-4xl md:text-5xl">
              Who We Are
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#526173]">
              ProcesG is an ESG & Transformation Consultancy established
              in 2020. We help organisations embed social priorities into strategy,
              operations, and reporting frameworks.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {aboutCards.map((card) => (
              <article className={`${card.tone} min-h-36 rounded-lg p-6 text-white shadow-[0_18px_48px_rgba(10,35,70,0.16)]`} key={card.label}>
                <p className="text-xl font-extrabold">{card.label}</p>
                <p className="mt-8 text-lg leading-7 font-semibold">{card.value}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div id="contact" className="bg-[#f6f8fb] px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
        <div className="mx-auto grid max-w-[1480px] overflow-hidden rounded-lg bg-[#001326] text-white shadow-[0_32px_90px_rgba(10,35,70,0.2)] lg:grid-cols-[1fr_420px]">
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="relative">
              <p className="text-sm font-bold tracking-[0.18em] text-[#5ee0d0] uppercase">
                Final step
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-normal sm:text-4xl md:text-5xl">
                Ready to turn ESG into value?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#d9e7f5]">
                See how ProcesG can simplify ESG/BRSR compliance, executive reporting and
                ESG transformation for your organisation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className="inline-flex h-13 items-center justify-center gap-3 rounded-md bg-[#ffc34f] px-6 text-sm font-bold text-[#07182e] transition hover:bg-[#ffd36f]" href="#contact">
                  <CalendarDays size={19} />
                  Book Demo
                </a>
                <Link className="inline-flex h-13 items-center justify-center rounded-md border border-white/70 px-6 text-sm font-bold text-white transition hover:bg-white hover:text-[#00162f]" to="/login">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          <form className="bg-white p-6 text-[#07182e] sm:p-8" onSubmit={(event) => event.preventDefault()}>
            <p className="text-xl font-extrabold">Request a conversation</p>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-[#40516a]">
                Name
                <input className="h-12 rounded-md border border-[#dce3eb] px-4 text-[#07182e] outline-none focus:border-[#159f90] focus:ring-3 focus:ring-[#159f90]/15" placeholder="Name" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[#40516a]">
                Work Email
                <input className="h-12 rounded-md border border-[#dce3eb] px-4 text-[#07182e] outline-none focus:border-[#159f90] focus:ring-3 focus:ring-[#159f90]/15" placeholder="Work Email" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[#40516a]">
                Company
                <input className="h-12 rounded-md border border-[#dce3eb] px-4 text-[#07182e] outline-none focus:border-[#159f90] focus:ring-3 focus:ring-[#159f90]/15" placeholder="Company" />
              </label>
              <button className="mt-2 inline-flex h-12 items-center justify-center rounded-md bg-[#159f90] px-5 text-sm font-bold text-white transition hover:bg-[#118879]" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#001326] px-5 py-10 text-white sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-9 border-b border-white/14 pb-8 lg:grid-cols-[1.15fr_0.85fr_1fr] lg:items-start">
          <div>
            <img className="h-20 w-auto" src={procesgLogo} alt="ProcesG - ESG to Value Creation" />
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#d9e7f5]">
              Bridging ESG obligations and business value for a sustainable tomorrow.
            </p>
            <div className="mt-5 flex gap-3">
              <SocialIcon
                href="https://www.linkedin.com/company/procesg/posts/?feedView=all"
                label="LinkedIn"
              >
                <span className="text-xs font-extrabold">in</span>
              </SocialIcon>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-3 text-sm font-semibold text-[#d9e7f5] sm:flex sm:items-center sm:gap-7 lg:justify-center">
            <a className="transition hover:text-[#ffc34f]" href="#about">About</a>
            <a className="transition hover:text-[#ffc34f]" href="#platform">Platform</a>
            <a className="transition hover:text-[#ffc34f]" href="#services">Services</a>
            <a className="transition hover:text-[#ffc34f]" href="#contact">Contact</a>
          </nav>

          <div className="grid gap-3 text-sm text-[#d9e7f5] lg:justify-end">
            <p className="flex items-center gap-3">
              <Mail size={18} className="text-[#ffc34f]" />
              transform@procesg.com
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-[#b7c6d7] sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2024 ProcesG. All rights reserved.</p>
          <div className="flex gap-6">
            <Link className="transition hover:text-white" to="/privacy">
              Privacy Policy
            </Link>
            <a className="transition hover:text-white" href="#top">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="grid size-9 place-items-center rounded-full border border-white/18 text-white/85 transition hover:border-[#ffc34f] hover:text-[#ffc34f]"
      href={href}
      rel="noreferrer"
      target="_blank"
      aria-label={label}
    >
      {children}
    </a>
  );
}
