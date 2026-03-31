import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Mail,
  Linkedin,
  Calendar,
  CheckCircle2,
  X,
  Menu,
  Star,
  Target,
  PenLine,
  CalendarCheck,
  Zap,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ─── Navbar ─── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav
      data-testid="navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <span
          data-testid="navbar-logo"
          className="font-heading text-xl font-bold tracking-tighter cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Citius
        </span>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo("how-it-works")}
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo("results")}
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Results
          </button>
          <Button
            data-testid="navbar-cta-button"
            onClick={() => scrollTo("hero-waitlist")}
            className="bg-[#002FA7] hover:bg-[#002FA7]/90 text-white rounded-none text-sm px-6 h-9"
          >
            Get Early Access
          </Button>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-4 flex flex-col gap-3">
          <button onClick={() => scrollTo("how-it-works")} className="font-body text-sm text-left text-muted-foreground">How it works</button>
          <button onClick={() => scrollTo("results")} className="font-body text-sm text-left text-muted-foreground">Results</button>
          <Button onClick={() => scrollTo("hero-waitlist")} className="bg-[#002FA7] hover:bg-[#002FA7]/90 text-white rounded-none text-sm">Get Early Access</Button>
        </div>
      )}
    </nav>
  );
}

/* ─── Waitlist Form ─── */
function WaitlistForm({ variant = "default" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await axios.post(`${API}/waitlist`, { email: email.trim() });
      setStatus("success");
      setEmail("");
    } catch (err) {
      if (err.response?.status === 409) {
        setErrorMsg("You're already on the list!");
        setStatus("error");
      } else {
        setErrorMsg("Something went wrong. Try again.");
        setStatus("error");
      }
    }
  };

  const isDark = variant === "dark";

  if (status === "success") {
    return (
      <div data-testid="waitlist-success-message" className={`flex items-center gap-2 py-3 ${isDark ? "text-green-300" : "text-green-700"}`}>
        <CheckCircle2 size={18} />
        <span className="font-body text-sm">You're in. We'll be in touch soon.</span>
      </div>
    );
  }

  return (
    <form data-testid="waitlist-form" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <Input
        data-testid="waitlist-email-input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={`rounded-none h-11 flex-1 ${
          isDark
            ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/40"
            : "border-border focus-visible:ring-[#002FA7] focus-visible:border-[#002FA7]"
        }`}
      />
      <Button
        data-testid="waitlist-submit-button"
        type="submit"
        disabled={status === "loading"}
        className={`rounded-none h-11 px-6 font-body text-sm ${
          isDark
            ? "bg-white text-[#0A0A0A] hover:bg-white/90"
            : "bg-[#002FA7] text-white hover:bg-[#002FA7]/90"
        }`}
      >
        {status === "loading" ? "Joining..." : (<>Get Early Access <ArrowRight size={14} className="ml-1" /></>)}
      </Button>
      {status === "error" && (
        <p data-testid="waitlist-error-message" className="text-destructive text-xs mt-1 sm:mt-0 sm:self-center">{errorMsg}</p>
      )}
    </form>
  );
}

/* ─── Dashboard Mockup ─── */
function DashboardMockup() {
  const prospects = [
    { name: "Sarah Chen, CTO", company: "Vortex Data", channel: "Email", status: "Meeting booked", statusColor: "text-green-600", icon: Mail },
    { name: "Marcus Webb, VP Eng", company: "CloudScale", channel: "LinkedIn", status: "Replied", statusColor: "text-[#002FA7]", icon: Linkedin },
    { name: "Priya Nair, Head of Platform", company: "MetricsOps", channel: "Email", status: "Opened ×4", statusColor: "text-amber-600", icon: Mail },
    { name: "Tom Rodriguez, DevOps Lead", company: "InfraBuild", channel: "Email", status: "Sent", statusColor: "text-muted-foreground", icon: Mail },
    { name: "Ji-Young Park, Tech Lead", company: "DeployFast", channel: "LinkedIn", status: "Sent", statusColor: "text-muted-foreground", icon: Linkedin },
  ];

  return (
    <div data-testid="dashboard-mockup" className="border border-border bg-white shadow-2xl shadow-black/5 overflow-hidden">
      {/* Browser bar */}
      <div className="bg-[#F8F8F8] border-b border-border px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 text-center">
          <span className="font-mono text-[10px] text-muted-foreground">app.citius.com / outreach</span>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-4 space-y-4">
        {/* Campaign tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">Campaigns</span>
          <span className="bg-[#002FA7] text-white text-[10px] font-mono px-2.5 py-1">DevTools Startups <span className="opacity-70 ml-1">52</span></span>
          <span className="bg-secondary text-foreground/60 text-[10px] font-mono px-2.5 py-1">Cloud Infrastructure</span>
          <span className="bg-secondary text-foreground/60 text-[10px] font-mono px-2.5 py-1 hidden sm:inline-block">Data Engineering</span>
          <span className="bg-secondary text-foreground/60 text-[10px] font-mono px-2.5 py-1 hidden lg:inline-block">MLOps Platforms</span>
        </div>

        {/* Activity row */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground border-b border-border pb-3">
          <span>Activity</span>
          <span className="flex items-center gap-1"><Mail size={10} /> Emails today</span>
          <span className="flex items-center gap-1"><Linkedin size={10} /> LinkedIn touches</span>
          <span className="flex items-center gap-1"><Calendar size={10} /> Meetings booked</span>
        </div>

        {/* Campaign header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading text-xs font-medium">DevTools & Infra Outbound — <span className="text-muted-foreground">52 active sequences</span></p>
          </div>
          <span className="text-[10px] font-mono text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> AI running 24/7
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-secondary p-3">
            <p className="font-heading text-lg font-bold">1,340</p>
            <p className="font-mono text-[9px] text-muted-foreground">Emails sent this week</p>
          </div>
          <div className="bg-secondary p-3">
            <p className="font-heading text-lg font-bold">37%</p>
            <p className="font-mono text-[9px] text-muted-foreground">Open rate</p>
          </div>
          <div className="bg-secondary p-3">
            <p className="font-heading text-lg font-bold">13</p>
            <p className="font-mono text-[9px] text-muted-foreground">Meetings booked</p>
          </div>
          <div className="bg-secondary p-3">
            <p className="font-heading text-lg font-bold text-green-600">$0</p>
            <p className="font-mono text-[9px] text-muted-foreground">SDR cost this week</p>
          </div>
        </div>

        {/* Prospect table */}
        <div className="overflow-hidden">
          <div className="grid grid-cols-4 gap-0 text-[9px] font-mono text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mb-1">
            <span>Prospect</span>
            <span>Company</span>
            <span>Channel</span>
            <span>Status</span>
          </div>
          {prospects.map((p, i) => (
            <div key={i} className="grid grid-cols-4 gap-0 py-2 border-b border-border/50 last:border-0 items-center">
              <span className="font-body text-[11px] font-medium truncate pr-2">{p.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{p.company}</span>
              <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                <p.icon size={10} /> {p.channel}
              </span>
              <span className={`font-mono text-[10px] ${p.statusColor}`}>
                {p.status === "Meeting booked" && "✓ "}{p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section data-testid="hero-section" className="pt-28 pb-16 lg:pt-36 lg:pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="animate-fade-up">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground">
              AI-Native Sales Platform
            </span>
          </div>

          <h1 data-testid="hero-heading" className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.08] animate-fade-up-delay-1">
            The AI Platform for{" "}
            <br />
            <span className="text-[#002FA7]">Signal‑Driven Outbound</span>
          </h1>

          <p className="font-body text-base md:text-lg leading-relaxed text-foreground/70 max-w-lg animate-fade-up-delay-2">
            Turn high‑intent signals into qualified pipeline with deeply personalized outreach and automated meeting booking.
          </p>

          <div id="hero-waitlist" className="animate-fade-up-delay-3">
            <WaitlistForm />
          </div>

          <p className="font-mono text-[11px] text-muted-foreground animate-fade-up-delay-3">What you see inside Citius ↓</p>
        </div>

        <div className="lg:col-span-7 animate-fade-up-delay-4">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
const steps = [
  {
    num: "01",
    icon: Target,
    emoji: null,
    title: "You define your ideal client",
    desc: "Tell us who you're targeting — industry, company size, job title, tech stack. We build a prospect list and enrich every contact with fresh signals and intent data.",
    tag: "Live in 5 minutes",
  },
  {
    num: "02",
    icon: PenLine,
    emoji: null,
    title: "AI writes every message",
    desc: "Each email references real context about the prospect — recent company news, a new hire, their tech stack. No templates. Every message reads like it came from a senior partner.",
    tag: "1,000 touchpoints/day",
  },
  {
    num: "03",
    icon: CalendarCheck,
    emoji: null,
    title: "Meetings land in your calendar",
    desc: "When a prospect replies with interest, AI handles all scheduling — timezone coordination, confirmation sequences, reminders. You wake up to booked calls.",
    tag: "You just close deals",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" data-testid="how-it-works-section" className="py-20 lg:py-28 px-6 lg:px-12 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-4">How it works</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Your pipeline on autopilot
            <br />
            <span className="text-foreground/50">in three steps.</span>
          </h2>
          <p className="font-body text-base md:text-lg leading-relaxed text-foreground/60 mt-4">
            Set it up once. We research your targets, write every message, manage all follow‑ups, and book the calls — your consultants just show up and close.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
          {steps.map((s) => (
            <div key={s.num} data-testid={`step-card-${s.num}`} className="p-8 lg:p-10 bg-white border border-border relative group hover:-translate-y-0.5 transition-transform duration-200">
              <span className="font-mono text-xs text-muted-foreground absolute top-4 right-4">{s.num}</span>
              <s.icon size={24} strokeWidth={1.5} className="text-[#002FA7] mb-6" />
              <h3 className="font-heading text-lg md:text-xl font-medium tracking-tight mb-3">{s.title}</h3>
              <p className="font-body text-sm leading-relaxed text-foreground/70 mb-5">{s.desc}</p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#002FA7]">
                <Zap size={12} /> {s.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Results Section ─── */
function ResultsSection() {
  return (
    <section id="results" data-testid="results-section" className="py-20 lg:py-28 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-4">The numbers</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Real results from DevTools startups.
          </h2>
          <p className="font-body text-base md:text-lg leading-relaxed text-foreground/60 mt-4">
            Technical founders using Citius book more meetings with fewer people and keep dramatically more runway in the process.
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border mb-16">
          <div data-testid="metric-cac" className="p-8 lg:p-10 bg-white border border-border">
            <span className="font-heading text-5xl md:text-6xl font-bold tracking-tighter text-[#002FA7]">90%</span>
            <p className="font-heading text-base font-medium mt-2">Lower customer acquisition cost</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">vs hiring an in-house SDR</p>
          </div>
          <div data-testid="metric-calls" className="p-8 lg:p-10 bg-white border border-border">
            <span className="font-heading text-5xl md:text-6xl font-bold tracking-tighter text-[#002FA7]">3-5x</span>
            <p className="font-heading text-base font-medium mt-2">More discovery calls booked per month</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">vs an equivalent SDR headcount</p>
          </div>
          <div data-testid="metric-automated" className="p-8 lg:p-10 bg-white border border-border">
            <span className="font-heading text-5xl md:text-6xl font-bold tracking-tighter text-[#002FA7]">80%</span>
            <p className="font-heading text-base font-medium mt-2">Of outbound work automated</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">1 founder runs 500+ accounts</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border">
          <div data-testid="testimonial-card-0" className="p-8 lg:p-10 bg-white border border-border">
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-[#002FA7] text-[#002FA7]" />)}
            </div>
            <p className="font-body text-sm md:text-base leading-relaxed text-foreground/80 mb-8">
              "We went from 2 technical buyer calls a month to 11 in our first six weeks. The outreach was indistinguishable from our best developer advocate — except it ran while we slept."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#002FA7] flex items-center justify-center text-white font-heading text-sm font-bold">MK</div>
              <div>
                <p className="font-heading text-sm font-medium">Marcus K.</p>
                <p className="font-mono text-[10px] text-muted-foreground">Co-Founder, Cloud Infra Platform · Founding member</p>
              </div>
            </div>
          </div>
          <div data-testid="testimonial-card-1" className="p-8 lg:p-10 bg-white border border-border">
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-[#002FA7] text-[#002FA7]" />)}
            </div>
            <p className="font-body text-sm md:text-base leading-relaxed text-foreground/80 mb-8">
              "Multiple engineering leads replied asking how we knew so much about their stack. That's never happened with a generic cold email tool. The personalization is genuinely different."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-white font-heading text-sm font-bold">JL</div>
              <div>
                <p className="font-heading text-sm font-medium">Jamie L.</p>
                <p className="font-mono text-[10px] text-muted-foreground">CEO, Data Engineering Startup · Early access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Before vs After ─── */
function BeforeAfterSection() {
  const beforeItems = [
    "$70-80K per SDR before commission, benefits, or management overhead",
    "14-month average tenure — retrain from scratch every time someone leaves",
    "Quality varies rep to rep — every email sounds like a different person wrote it",
    "Your best rep leaves Friday. Their pipeline knowledge walks out the door.",
    "Scaling to 1,000 accounts = 10-20 more hires, salaries, and onboarding cycles",
  ];

  const afterItems = [
    "One flat monthly fee — no salary, no commission, no benefits, no churn",
    "Runs 24/7 across every timezone — Tokyo gets the same quality as New York",
    "Consistent brand voice in every single message — always on-brand, always polished",
    "All learning stays in the system and compounds with every send",
    "Scale to 10,000 accounts — it's a slider, not a headcount decision",
  ];

  return (
    <section data-testid="before-after-section" className="py-20 lg:py-28 px-6 lg:px-12 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-4">Before vs after Citius</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Stop running on a treadmill.
          </h2>
          <p className="font-body text-base md:text-lg leading-relaxed text-foreground/60 mt-4">
            Traditional SDR teams cost more the more you grow. Citius flips that equation entirely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Before */}
          <div data-testid="before-citius" className="p-8 lg:p-10 bg-white border border-border">
            <div className="flex items-center gap-2 mb-6">
              <X size={16} className="text-destructive" />
              <span className="font-heading text-base font-semibold">Before Citius</span>
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X size={14} className="text-destructive mt-1 shrink-0" />
                  <span className="font-body text-sm text-foreground/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div data-testid="after-citius" className="p-8 lg:p-10 bg-white border-2 border-[#002FA7] relative">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 size={16} className="text-[#002FA7]" />
              <span className="font-heading text-base font-semibold">After Citius</span>
            </div>
            <ul className="space-y-4">
              {afterItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={14} className="text-[#002FA7] mt-1 shrink-0" />
                  <span className="font-body text-sm text-foreground/80 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqItems = [
  {
    q: "How is this different from tools like Apollo or Instantly?",
    a: "Those are email automation tools — you still write the copy, build the lists, and manage replies. Citius replaces the entire SDR function. We research targets, write deeply personalized messages using real-time signals, manage multi-channel sequences, and book the meetings. You just show up.",
  },
  {
    q: "How personalized is the outreach really?",
    a: "Every message references real context — a prospect's recent funding round, a new engineering hire, their tech stack migration, competitive pressures. It reads like a senior partner spent 20 minutes researching before writing. Because the AI did.",
  },
  {
    q: "How long does it take to get started?",
    a: "Most teams are live in under a week. You define your ICP, we enrich and build the prospect list, you approve the messaging framework, and sequences start running. First meetings typically land within 5-7 business days.",
  },
  {
    q: "What if a prospect replies with a complex question?",
    a: "AI handles routine replies (scheduling, basic info requests) autonomously. Complex or high-stakes conversations get flagged and routed to your team instantly. You always stay in control of the conversations that matter.",
  },
  {
    q: "How much does it cost?",
    a: "We're finalizing pricing during our founding cohort. Early access members get locked-in rates significantly below our eventual public pricing. Join the waitlist to secure founding member terms.",
  },
  {
    q: "Do I need to replace my CRM?",
    a: "No. Citius integrates with your existing CRM (HubSpot, Salesforce, Pipedrive, etc.). All activity, meetings, and prospect data sync automatically. We fit into your workflow — not the other way around.",
  },
];

function FAQSection() {
  return (
    <section id="faq" data-testid="faq-section" className="py-20 lg:py-28 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-4">FAQ</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Common questions.
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger data-testid={`faq-trigger-${i}`} className="font-heading text-base md:text-lg font-medium text-left py-5 hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent data-testid={`faq-content-${i}`} className="font-body text-sm md:text-base leading-relaxed text-foreground/70 pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */
function FinalCTASection() {
  return (
    <section data-testid="final-cta-section" className="py-24 lg:py-32 px-6 lg:px-12 bg-[#0A0A0A] text-white">
      <div className="max-w-3xl mx-auto text-center">
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 block mb-6">
          Limited early access · founding cohort
        </span>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
          Your first 100 meetings
          <br />
          <span className="text-white/50">are on us.</span>
        </h2>
        <div className="flex justify-center mb-3">
          <WaitlistForm variant="dark" />
        </div>
        <p className="font-mono text-[11px] text-white/30">
          No spam. No pitch decks. Just early access.
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer data-testid="footer" className="py-8 px-6 lg:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-heading text-sm font-bold tracking-tighter">Citius</span>
        <p className="font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Citius. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ─── Landing Page ─── */
function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ResultsSection />
      <BeforeAfterSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
