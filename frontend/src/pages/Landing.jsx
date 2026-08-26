import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessagesSquare,
  Ticket,
  BookOpen,
  ArrowRight,
  Mail,
} from "lucide-react";
import { NovaMark, NovaWordmark, GithubIcon, LinkedinIcon } from "../components/NovaMark";

const log = [
  { from: "Guest", text: "My export keeps failing at ninety percent." },
  {
    from: "Nova",
    text: "Your last three exports timed out on the invoices table. Retrying now with a longer window.",
  },
  { from: "Guest", text: "That worked — thank you." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <Nav />
      <Hero />
      <LogLine />
      <Features />
      <Contact />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="max-w-6xl mx-auto px-6 py-7 flex items-center justify-between">
      <NovaWordmark size={22} className="text-lg" />
      <nav className="flex items-center gap-8">
        <a href="#contact" className="text-sm text-muted hover:text-paper transition-colors hidden sm:inline">
          Contact
        </a>
        <Link to="/login" className="text-sm text-muted hover:text-paper transition-colors">
          Sign in
        </Link>
        <Link
          to="/register"
          className="text-sm border border-nova-dim/60 hover:border-nova text-paper rounded-full px-5 py-2 transition-colors"
        >
          Request access
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 pb-28 grid lg:grid-cols-[1.05fr_1fr] gap-16 items-center">
      <div>
        <div className="flex items-center gap-3 mb-7 font-mono text-xs tracking-[0.2em] text-nova-dim uppercase">
          <span className="w-8 h-px bg-nova-dim/60" />
          Private support infrastructure
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-medium leading-[1.08] tracking-tight mb-7">
          Every conversation, given <em className="italic text-nova">the attention</em> it deserves.
        </h1>
        <p className="text-lg text-paper-dim max-w-md mb-10 leading-relaxed">
          Nova pairs your knowledge base with an AI that reads the full thread before
          it answers, and gives your team a quiet, precise console to watch it happen.
        </p>
        <div className="flex items-center gap-6">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-nova hover:bg-nova-dim text-ink font-medium rounded-full px-6 py-3 text-sm transition-colors"
          >
            Request access <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="text-sm text-muted hover:text-paper transition-colors">
            I already have an account
          </Link>
        </div>
      </div>

      <ConsoleHero />
    </section>
  );
}

/* Signature element: a concierge ledger, not a chat widget — a resolved
   case read out in plain lines, with a single slow gold glow breathing
   behind it. One restrained animated moment; nothing else on the page moves. */
function ConsoleHero() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="ambient-glow absolute -inset-10 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-nova) 0%, transparent 65%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-surface border border-line rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <div className="font-mono text-[11px] tracking-widest text-faint uppercase">
            Case No. 4471 — closed in 41s
          </div>
          <NovaMark size={16} />
        </div>

        <div className="p-6 space-y-5 min-h-72">
          {log.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.6 }}
            >
              <div className="font-mono text-[10px] tracking-widest text-faint uppercase mb-1.5">
                {entry.from}
              </div>
              <p
                className={`text-sm leading-relaxed ${
                  entry.from === "Nova" ? "text-paper font-display italic" : "text-paper-dim"
                }`}
              >
                {entry.text}
              </p>
              {i < log.length - 1 && (
                <div className="mt-5 h-px bg-line-soft" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="border-t border-line-soft px-5 py-3.5 font-mono text-[11px] text-faint tracking-wide">
          Grounded in 3 knowledge sources · cited, not invented
        </div>
      </motion.div>
    </div>
  );
}

function LogLine() {
  const stats = [
    { label: "AVG. FIRST RESPONSE", value: "< 2s" },
    { label: "RESOLVED WITHOUT ESCALATION", value: "78%" },
    { label: "AVAILABLE", value: "Around the clock" },
  ];
  return (
    <section className="border-y border-line-soft bg-surface/40">
      <div className="max-w-6xl mx-auto px-6 py-9 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-mono text-[11px] tracking-[0.15em] text-faint mb-1.5">{s.label}</div>
            <div className="font-display text-2xl font-medium text-paper">{s.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: MessagesSquare,
      title: "One thread, fully seen",
      body: "A customer opens a single conversation, gets an answer grounded in what you actually know, and closes it out once it's resolved. No clutter, no stale tabs.",
    },
    {
      icon: Ticket,
      title: "Escalate when it matters",
      body: "Anything that needs a human hand becomes a tracked ticket automatically, carried from open to resolved instead of lost at the bottom of a chat log.",
    },
    {
      icon: BookOpen,
      title: "Built on your knowledge, not guesses",
      body: "Every answer is grounded in the sources you provide and cited plainly, so the AI says what it knows instead of inventing what it doesn't.",
    },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="mb-12 max-w-lg">
        <h2 className="font-display text-3xl font-medium tracking-tight mb-3">
          A console, not a queue.
        </h2>
        <p className="text-paper-dim leading-relaxed">
          The parts that make Nova feel less like a helpdesk and more like
          something built to be trusted.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="border border-line rounded-xl p-7 bg-surface/60">
            <Icon size={19} className="text-nova mb-5" strokeWidth={1.6} />
            <h3 className="font-display text-lg font-medium mb-2.5">{title}</h3>
            <p className="text-sm text-muted leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const links = [
    { icon: GithubIcon, label: "GitHub", href: "https://github.com/HR-Builds" },
    {
      icon: LinkedinIcon,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hassan-rashid-dev",
    },
    { icon: Mail, label: "Email", href: "mailto:dev.hassanrashid@gmail.com" },
  ];
  return (
    <section id="contact" className="border-t border-line-soft bg-surface/30">
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="font-mono text-[11px] tracking-[0.2em] text-nova-dim uppercase mb-4">
          Built by
        </div>
        <h2 className="font-display italic text-3xl font-medium mb-8">Hassan Rashid</h2>
        <div className="flex items-center gap-4">
          {links.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-paper-dim hover:text-nova border border-line hover:border-nova-dim/60 rounded-full px-4 py-2.5 transition-colors"
            >
              <Icon size={15} strokeWidth={1.75} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line-soft">
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-faint">
        <NovaMark size={16} />
        <span>A quiet console for support that's actually watched.</span>
      </div>
    </footer>
  );
}
