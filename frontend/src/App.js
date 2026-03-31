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
  Zap,
  Users,
  Clock,
  BarChart3,
  Shield,
  TrendingUp,
  CheckCircle2,
  X,
  Menu,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ─── Navbar ─── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo("how-it-works")}
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollTo("faq")}
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </button>
          <Button
            data-testid="navbar-cta-button"
            onClick={() => scrollTo("hero-waitlist")}
            className="bg-[#002FA7] hover:bg-[#002FA7]/90 text-white rounded-none text-sm px-6 h-9"
          >
            Join Waitlist
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          data-testid="mobile-menu-toggle"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-4 flex flex-col gap-3">
          <button
            onClick={() => scrollTo("how-it-works")}
            className="font-body text-sm text-left text-muted-foreground"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            className="font-body text-sm text-left text-muted-foreground"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollTo("faq")}
            className="font-body text-sm text-left text-muted-foreground"
          >
            FAQ
          </button>
          <Button
            onClick={() => scrollTo("hero-waitlist")}
            className="bg-[#002FA7] hover:bg-[#002FA7]/90 text-white rounded-none text-sm"
          >
            Join Waitlist
          </Button>
        </div>
      )}
    </nav>
  );
}

/* ─── Waitlist Form ─── */
function WaitlistForm({ variant = "default" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
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
      <div
        data-testid="waitlist-success-message"
        className={`flex items-center gap-2 py-3 ${isDark ? "text-green-300" : "text-green-700"}`}
      >
        <CheckCircle2 size={18} />
        <span className="font-body text-sm">You're in. We'll be in touch soon.</span>
      </div>
    );
  }

  return (
    <form
      data-testid="waitlist-form"
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
    >
      <Input
        data-testid="waitlist-email-input"
        type="email"
        placeholder="Enter your work email"
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
        {status === "loading" ? (
          "Joining..."
        ) : (
          <>
            Get Early Access <ArrowRight size={14} className="ml-1" />
          </>
        )}
      </Button>
      {status === "error" && (
        <p data-testid="waitlist-error-message" className="text-destructive text-xs mt-1 sm:mt-0 sm:self-center">
          {errorMsg}
        </p>
      )}
    </form>
  );
}

/* ─── Waitlist Counter ─── */
function WaitlistCounter({ variant = "default" }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`${API}/waitlist/count`);
        setCount(res.data.count);
      } catch {
        setCount(0);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const isDark = variant === "dark";

  if (count === null) return null;

  const displayCount = count + 1247; // Social proof seed

  return (
    <div data-testid="waitlist-counter" className="flex items-center gap-2 mt-4">
      <span className={`w-2 h-2 rounded-full pulse-dot ${isDark ? "bg-green-400" : "bg-[#002FA7]"}`} />
      <span
        className={`font-mono text-xs tracking-wide ${
          isDark ? "text-white/70" : "text-muted-foreground"
        }`}
      >
        {displayCount.toLocaleString()} sales leaders joined
      </span>
    </div>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section
      data-testid="hero-section"
      className="pt-28 pb-20 lg:pt-36 lg:pb-28 px-6 lg:px-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="animate-fade-up">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground">
              AI-Native Sales Agency
            </span>
          </div>

          <h1
            data-testid="hero-heading"
            className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] animate-fade-up-delay-1"
          >
            Your sales team,
            <br />
            <span className="text-[#002FA7]">without the team.</span>
          </h1>

          <p className="font-body text-base md:text-lg leading-relaxed text-foreground/70 max-w-xl animate-fade-up-delay-2">
            Citius replaces your SDR team with AI that prospects, personalizes outreach, and books
            meetings — at 10x the scale, a fraction of the cost.
          </p>

          <div id="hero-waitlist" className="animate-fade-up-delay-3">
            <WaitlistForm />
            <WaitlistCounter />
          </div>
        </div>

        {/* Right column — abstract visual */}
        <div className="lg:col-span-5 animate-fade-up-delay-4">
          <div className="border border-border p-1">
            <img
              src="https://images.pexels.com/photos/12843342/pexels-photo-12843342.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Abstract geometric pattern"
              className="w-full h-auto object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
const features = [
  {
    num: "01",
    icon: Zap,
    title: "AI-Powered Prospecting",
    desc: "AI researches target accounts, identifies decision-makers, and crafts deeply personalized outreach — referencing company news, job changes, and tech stack.",
  },
  {
    num: "02",
    icon: Clock,
    title: "Automated Scheduling",
    desc: "Handles the full back-and-forth of meeting booking — timezone coordination, rescheduling, and confirmations. What took 3-5 emails happens instantly.",
  },
  {
    num: "03",
    icon: Users,
    title: "1 Human = 10 SDRs",
    desc: "One account manager oversees hundreds of accounts. The role shifts from execution to supervision. AI handles 80-90% of the pipeline work.",
  },
  {
    num: "04",
    icon: TrendingUp,
    title: "Continuous Learning",
    desc: "Every open, reply, and booked meeting feeds back into the system. The AI compounds in intelligence over time — a data flywheel your competitors can't replicate.",
  },
];

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      data-testid="how-it-works-section"
      className="py-20 lg:py-28 px-6 lg:px-12 bg-secondary"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-4">
            How It Works
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Scale through compute,
            <br />
            not headcount.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border">
          {features.map((f, i) => (
            <div
              key={f.num}
              data-testid={`feature-card-${f.num}`}
              className="p-8 lg:p-12 bg-white border border-border hover:-translate-y-0.5 transition-transform duration-200 relative group"
            >
              <span className="font-mono text-xs text-muted-foreground absolute top-4 right-4">
                {f.num}
              </span>
              <f.icon
                size={24}
                strokeWidth={1.5}
                className="text-[#002FA7] mb-6"
              />
              <h3 className="font-heading text-xl md:text-2xl font-medium tracking-tight mb-3">
                {f.title}
              </h3>
              <p className="font-body text-sm md:text-base leading-relaxed text-foreground/70">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing Comparison ─── */
function PricingSection() {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="py-20 lg:py-28 px-6 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-4">
            The Numbers
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Flip the economics.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Traditional */}
          <div
            data-testid="pricing-traditional"
            className="p-8 lg:p-12 bg-secondary border border-border"
          >
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-6">
              Traditional Agency
            </span>

            <div className="mb-8">
              <span className="font-heading text-6xl md:text-7xl font-bold tracking-tighter text-foreground/30 strikethrough-text">
                25-30%
              </span>
              <p className="font-body text-sm text-muted-foreground mt-2">
                Gross margins
              </p>
            </div>

            <ul className="space-y-4 font-body text-sm text-foreground/60">
              <li className="flex items-start gap-3">
                <X size={16} className="text-destructive mt-0.5 shrink-0" />
                <span>$60-80K per SDR + commission + benefits</span>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-destructive mt-0.5 shrink-0" />
                <span>14-month average tenure, constant turnover</span>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-destructive mt-0.5 shrink-0" />
                <span>50-100 accounts per rep maximum</span>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-destructive mt-0.5 shrink-0" />
                <span>Inconsistent messaging quality</span>
              </li>
              <li className="flex items-start gap-3">
                <X size={16} className="text-destructive mt-0.5 shrink-0" />
                <span>$150-200K revenue per employee</span>
              </li>
            </ul>
          </div>

          {/* Citius */}
          <div
            data-testid="pricing-citius"
            className="p-8 lg:p-12 bg-white border-2 border-[#002FA7] relative"
          >
            <span className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.15em] uppercase bg-[#002FA7] text-white px-3 py-1">
              Citius
            </span>

            <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-6">
              AI-Native Agency
            </span>

            <div className="mb-8">
              <span className="font-heading text-6xl md:text-7xl font-bold tracking-tighter text-[#002FA7]">
                65-75%
              </span>
              <p className="font-body text-sm text-muted-foreground mt-2">
                Gross margins
              </p>
            </div>

            <ul className="space-y-4 font-body text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[#002FA7] mt-0.5 shrink-0" />
                <span>AI handles 80-90% of prospecting work</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[#002FA7] mt-0.5 shrink-0" />
                <span>1 human oversees what required 10 SDRs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[#002FA7] mt-0.5 shrink-0" />
                <span>24/7 operation across all timezones</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[#002FA7] mt-0.5 shrink-0" />
                <span>Consistent brand voice, zero drift</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[#002FA7] mt-0.5 shrink-0" />
                <span>$400-800K revenue per employee</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
const testimonials = [
  {
    quote:
      "We replaced a 12-person SDR team and tripled our meeting volume in the first quarter. The ROI was immediate.",
    name: "Marcus Chen",
    title: "VP of Sales, Alloy Systems",
    img: "https://images.unsplash.com/photo-1659353221237-6a1cfb73fd90?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBkaXZlcnNlJTIwZm91bmRlciUyMGhlYWRzaG90fGVufDB8fHx8MTc3NDk2Nzk2Nnww&ixlib=rb-4.1.0&q=85&w=200",
  },
  {
    quote:
      "The personalization quality is what shocked me. Every email reads like it was researched for 20 minutes. It's done in seconds.",
    name: "Sarah Lindström",
    title: "Founder & CEO, NordBase",
    img: "https://images.unsplash.com/photo-1720874129553-1d2e66076b16?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBkaXZlcnNlJTIwZm91bmRlciUyMGhlYWRzaG90fGVufDB8fHx8MTc3NDk2Nzk2Nnww&ixlib=rb-4.1.0&q=85&w=200",
  },
  {
    quote:
      "Our cost per meeting dropped by 73%. We went from burning cash on SDR salaries to reinvesting in product.",
    name: "Adaeze Okafor",
    title: "Head of Growth, Cubist AI",
    img: "https://images.pexels.com/photos/29852895/pexels-photo-29852895.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200",
  },
];

function TestimonialsSection() {
  return (
    <section
      data-testid="testimonials-section"
      className="py-20 lg:py-28 px-6 lg:px-12 bg-secondary"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-4">
            From Early Users
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            They made the switch.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
          {testimonials.map((t, i) => (
            <div
              key={i}
              data-testid={`testimonial-card-${i}`}
              className="p-8 lg:p-10 bg-white border border-border flex flex-col justify-between"
            >
              <p className="font-body text-sm md:text-base leading-relaxed text-foreground/80 mb-8">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover grayscale"
                />
                <div>
                  <p className="font-heading text-sm font-medium">{t.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqItems = [
  {
    q: "How is this different from other sales automation tools?",
    a: "Most tools automate steps — we replace the entire function. Citius doesn't just send emails; it researches, strategizes, personalizes, and optimizes continuously. It's a full AI sales team, not a mail-merge tool.",
  },
  {
    q: "What happens to my existing SDR team?",
    a: "They evolve from execution to oversight. One account manager can review AI-generated outreach and handle escalated conversations across hundreds of accounts. Your best people become force-multipliers.",
  },
  {
    q: "How does the AI personalization actually work?",
    a: "Our AI analyzes a prospect's company news, job changes, technology stack, competitive landscape, and social activity. Every message is uniquely crafted — far beyond name and company variables.",
  },
  {
    q: "What channels does Citius support?",
    a: "Email, LinkedIn, and multi-step sequences across channels. We handle the full cadence from first touch to meeting booked, including follow-ups and rescheduling.",
  },
  {
    q: "What are the pricing tiers?",
    a: "We're finalizing pricing during our early access period. Waitlist members will receive founding member rates significantly below our eventual public pricing. Join now to lock in the best terms.",
  },
  {
    q: "How quickly can I see results?",
    a: "Most clients see their first AI-booked meetings within the first week. The system continuously improves — by month two, you'll see a compounding data flywheel effect on reply rates and meeting conversions.",
  },
];

function FAQSection() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="py-20 lg:py-28 px-6 lg:px-12"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-4">
            FAQ
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Questions? Answers.
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger
                data-testid={`faq-trigger-${i}`}
                className="font-heading text-base md:text-lg font-medium text-left py-5 hover:no-underline"
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent
                data-testid={`faq-content-${i}`}
                className="font-body text-sm md:text-base leading-relaxed text-foreground/70 pb-5"
              >
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
    <section
      data-testid="final-cta-section"
      className="py-24 lg:py-32 px-6 lg:px-12 bg-[#0A0A0A] text-white"
    >
      <div className="max-w-3xl mx-auto text-center">
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-white/50 block mb-6">
          Limited Early Access
        </span>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
          The future of sales
          <br />
          is already here.
        </h2>
        <p className="font-body text-base md:text-lg leading-relaxed text-white/60 mb-10 max-w-xl mx-auto">
          Join 1,000+ sales leaders getting early access to AI-native outbound.
          Founding member rates won't last.
        </p>
        <div className="flex justify-center">
          <WaitlistForm variant="dark" />
        </div>
        <div className="flex justify-center">
          <WaitlistCounter variant="dark" />
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer
      data-testid="footer"
      className="py-8 px-6 lg:px-12 border-t border-border"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-heading text-sm font-bold tracking-tighter">
          Citius
        </span>
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
      <PricingSection />
      <TestimonialsSection />
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
