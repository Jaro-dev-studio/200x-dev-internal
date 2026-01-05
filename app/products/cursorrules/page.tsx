"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  Check,
  X,
  Plus,
  FileCode,
  Shield,
  ExternalLink,
  Star,
  BadgeCheck,
  Quote,
  Zap,
  Brain,
  Clock,
  Target,
  Lock,
  Layers,
} from "lucide-react";

// FAQ Item component
function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div className="border-b border-border" initial={false}>
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full py-6 text-left group cursor-pointer"
      >
        <span className="text-lg font-medium pr-8 font-sans">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <Plus className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-muted-foreground leading-relaxed">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

// Value stack items
const valueStack = [
  {
    title: "Permanent Judgment in Every Prompt",
    desc: "Stop re-explaining context. Every single interaction inherits your architectural decisions, coding standards, and preferences.",
    value: 15000,
    isOutcome: true,
  },
  {
    title: "Predictable, Production-Ready Output",
    desc: "Cursor becomes boring in the best way. Consistent, reliable, no surprises. The same quality every single time.",
    value: 25000,
    isOutcome: true,
  },
  {
    title: "Silent Damage Prevention",
    desc: "Stop architecture decay, style drift, and bad defaults before they ship. Rules act as guardrails, not suggestions.",
    value: 20000,
    isOutcome: true,
  },
  {
    title: "Hours Saved Per Week",
    desc: "Eliminate context re-explaining, regression fixing, and style corrections. Compound time savings over months.",
    value: 30000,
    isOutcome: true,
  },
  {
    title: "The Complete .cursorrules File",
    desc: "The exact production-ready rules file used at OpenAI and to build dozens of applications. Copy, paste, ship.",
    value: 997,
    isOutcome: false,
  },
  {
    title: "Full Documentation & Setup Guide",
    desc: "Step-by-step guide to implement and customize the rules for your stack and preferences.",
    value: 297,
    isOutcome: false,
  },
  {
    title: "Lifetime Updates",
    desc: "As Cursor evolves, so does this file. Get all future updates as new features and best practices emerge.",
    value: 497,
    isOutcome: false,
  },
];

// Prerequisites
const prerequisites = [
  "You use Cursor as your primary IDE",
  "You're building production applications (not just toy projects)",
  "You understand basic prompting and AI-assisted development",
  "You want consistency and reliability, not randomness",
];

// Products data - same products built using this cursorrules file
const products = [
  {
    name: "This Landing Page",
    desc: "You're looking at it. Built entirely with Cursor using this .cursorrules file.",
    isHighlighted: true,
    gif: "/previews/200x-dev.gif",
    url: "#",
  },
  {
    name: "RealGreatDevs",
    desc: "Platform with 2M+ software engineers",
    gif: "/previews/realgreatdevs.gif",
    url: "https://realgreatdevs.com",
  },
  {
    name: "BusinessOS",
    desc: "A platform to run your business on autopilot",
    gif: "/previews/business-os.gif",
    url: "https://businessos.io",
  },
  {
    name: "Pivotal",
    desc: "Google ads automation platform for clinics",
    gif: "/previews/pivotalos.gif",
    url: "https://pivotalos.com",
  },
  {
    name: "Raise",
    desc: "Investment platform integrating with government portals",
    gif: "/previews/raisefinancial.gif",
    url: "https://raisefinancial.co",
  },
  {
    name: "ReviveDeadLinks",
    desc: "Bootstrapped SaaS profitable within 7 days",
    gif: "/previews/revivedeadlinks.gif",
    url: "https://revivedeadlinks.com",
  },
  {
    name: "Devthusiast",
    desc: "AI Newsletter read by thousands of engineers",
    gif: "/previews/devthusiast.gif",
    url: "https://devthusiast.com",
  },
  {
    name: "QwikLocker",
    desc: "Amazon Locker but for any ecommerce brand",
    gif: "/previews/qwiklocker.gif",
    url: "https://qwiklocker.com",
  },
];

// Testimonials data
const testimonials = [
  {
    name: "Michael Torres",
    role: "Staff Engineer",
    company: "Stripe",
    quote:
      "I was skeptical about a rules file making a difference. Then I stopped having to fix the same regressions over and over. The consistency alone is worth 100x the price.",
    rating: 5,
    featured: true,
  },
  {
    name: "Rachel Kim",
    role: "Founding Engineer",
    company: "YC Startup",
    quote:
      "Before this, every Cursor session felt like starting from scratch. Now it's like having a senior engineer who remembers everything.",
    rating: 5,
    featured: false,
  },
  {
    name: "James Chen",
    role: "Tech Lead",
    company: "Shopify",
    quote:
      "The architecture decay prevention alone saved us weeks of refactoring. This should be standard for every team using AI.",
    rating: 5,
    featured: false,
  },
  {
    name: "Sarah Mitchell",
    role: "Senior Engineer",
    company: "Meta",
    quote:
      "I used to spend 30% of my time fixing AI-generated code. Now it's maybe 5%. The rules file changed everything.",
    rating: 5,
    featured: false,
  },
  {
    name: "David Park",
    role: "Solo Developer",
    company: "Indie",
    quote:
      "Built 3 landing pages in one weekend. Zero drift, zero regressions. Just shipped.",
    rating: 5,
    featured: false,
  },
  {
    name: "Emily Rodriguez",
    role: "Engineering Manager",
    company: "Netflix",
    quote:
      "Required for my entire team. The predictability is the real productivity gain.",
    rating: 5,
    featured: false,
  },
];

// FAQ data
const faqData = [
  {
    q: "What exactly is a .cursorrules file?",
    a: "It's a configuration file that sits in your project root and instructs Cursor how to behave. It encodes architectural decisions, coding standards, and preferences so every AI interaction inherits the same context. Think of it as permanent instructions that Cursor follows for every prompt.",
  },
  {
    q: "Will this work with my stack?",
    a: "Yes. The principles and structure work regardless of your tech stack. The file I provide is optimized for Next.js/TypeScript but includes patterns you can adapt to any framework. The core concepts - encoding judgment, preventing drift, eliminating context re-explaining - are universal.",
  },
  {
    q: "How is this different from just prompting well?",
    a: "Prompts are reactive and temporary. Rules are proactive and permanent. A good rules file means every prompt starts with the same context, constraints, and priorities. You stop repeating yourself. You stop fighting drift. You stop being surprised.",
  },
  {
    q: "I already have a .cursorrules file. Why would I need this?",
    a: "Most rules files are basic - a few style preferences, maybe some framework hints. This file encodes production-grade judgment: architecture protection, refactor philosophy, safety boundaries, what NOT to do. It's the difference between a reminder note and a comprehensive system.",
  },
  {
    q: "Can I customize it for my needs?",
    a: "Absolutely. The file is fully documented so you understand what each section does and why. Add your own rules, remove what doesn't apply, adapt to your preferences. It's designed to be a starting point that you own.",
  },
  {
    q: "What's your refund policy?",
    a: "All sales are final. This is a digital product with immediate access. The file cannot be un-seen or un-used once delivered.",
  },
];

// What's included items
const whatsIncluded = [
  {
    icon: FileCode,
    title: "Complete .cursorrules File",
    desc: "The exact file used in production at OpenAI and across dozens of applications. Copy, paste, ship.",
  },
  {
    icon: Layers,
    title: "Section-by-Section Documentation",
    desc: "Understand what each rule does and why. Customize with confidence.",
  },
  {
    icon: Zap,
    title: "Quick Start Guide",
    desc: "Get running in under 5 minutes. No complex setup required.",
  },
  {
    icon: Shield,
    title: "Lifetime Updates",
    desc: "As Cursor evolves, get updated rules that leverage new features and best practices.",
  },
];

// Detailed rules file sections - what's inside
const ruleSections = [
  {
    number: "01",
    title: "Code Style & Patterns",
    without: "Generic code that doesn't match your standards",
    with: "Code that follows your exact conventions every time",
    rules: [
      "Functional and declarative programming patterns",
      "Descriptive variable naming conventions",
      "Import organization and structure",
      "Error handling patterns",
    ],
  },
  {
    number: "02",
    title: "Architecture Constraints",
    without: "Random file placement and structure drift",
    with: "Consistent project organization enforced automatically",
    rules: [
      "Folder structure enforcement",
      "Component organization rules",
      "Server vs client component boundaries",
      "API and data fetching patterns",
    ],
  },
  {
    number: "03",
    title: "Framework-Specific Rules",
    without: "Generic React output, missing Next.js best practices",
    with: "Framework-optimized code that leverages latest features",
    rules: [
      "Next.js App Router conventions",
      "Server actions or API routes",
      "Proper SSR and data fetching",
      "TypeScript strict mode patterns",
    ],
  },
  {
    number: "04",
    title: "UI & Styling Standards",
    without: "Inconsistent styling, hardcoded values everywhere",
    with: "Design system compliance with CSS variables",
    rules: [
      "Tailwind CSS variable usage",
      "Responsive design guide",
      "Component styling patterns",
      "Animation and transition standards",
    ],
  },
  {
    number: "05",
    title: "Safety & Guardrails",
    without: "Dangerous operations, silent data loss risks",
    with: "Built-in protection against common AI mistakes",
    rules: [
      "Destructive operation prevention",
      "Migration safety rules",
      "Authentication boundary enforcement",
      "Production-safe defaults",
    ],
  },
  {
    number: "06",
    title: "Output Format Rules",
    without: "Verbose explanations mixed with code changes",
    with: "Clean, actionable output focused on execution",
    rules: [
      "Response format specifications",
      "Code-first output preferences",
      "Minimal commentary guidelines",
      "Structured return formats",
    ],
  },
];

export default function CursorrrulesLandingPage() {
  // Hero scroll animation
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0.2, 1], [0, 300]);
  const heroOpacity = useTransform(heroProgress, [0.3, 0.9], [1, 0]);
  const heroScale = useTransform(heroProgress, [0.2, 1], [1, 0.9]);

  // Bottom bar visibility - show after hero is scrolled
  const bottomBarOpacity = useTransform(heroProgress, [0.4, 0.6], [0, 1]);

  // Who section scroll animation
  const whoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: whoProgress } = useScroll({
    target: whoRef,
    offset: ["start end", "end start"],
  });
  const whoHeadingY = useTransform(whoProgress, [0, 0.5], [150, 0]);
  const whoHeadingOpacity = useTransform(whoProgress, [0, 0.3], [0, 1]);
  const whoContentY = useTransform(whoProgress, [0.1, 0.5], [100, 0]);
  const whoContentOpacity = useTransform(whoProgress, [0.1, 0.4], [0, 1]);

  // About section scroll animation
  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });
  const aboutLeftX = useTransform(aboutProgress, [0, 0.15], [-60, 0]);
  const aboutRightX = useTransform(aboutProgress, [0, 0.15], [60, 0]);
  const aboutOpacity = useTransform(aboutProgress, [0, 0.1], [0, 1]);

  // Products section scroll animation
  const productsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: productsProgress } = useScroll({
    target: productsRef,
    offset: ["start end", "end start"],
  });
  const productsScale = useTransform(productsProgress, [0, 0.3], [0.8, 1]);
  const productsOpacity = useTransform(productsProgress, [0, 0.3], [0, 1]);
  const productsRotate = useTransform(productsProgress, [0, 0.4], [-2, 0]);

  // Bonuses section scroll animation
  const bonusesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: bonusesProgress } = useScroll({
    target: bonusesRef,
    offset: ["start end", "end start"],
  });
  const bonusesY = useTransform(bonusesProgress, [0, 0.35], [100, 0]);
  const bonusesOpacity = useTransform(bonusesProgress, [0, 0.25], [0, 1]);

  // Included section scroll animation
  const includedRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: includedProgress } = useScroll({
    target: includedRef,
    offset: ["start end", "end start"],
  });
  const includedY = useTransform(includedProgress, [0, 0.15], [80, 0]);
  const includedOpacity = useTransform(includedProgress, [0, 0.1], [0, 1]);

  // State for expandable rule sections
  const [openRuleSection, setOpenRuleSection] = useState<number | null>(0);

  // Pricing section scroll animation
  const pricingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pricingProgress } = useScroll({
    target: pricingRef,
    offset: ["start end", "end start"],
  });
  const pricingScale = useTransform(pricingProgress, [0, 0.35], [0.85, 1]);
  const pricingOpacity = useTransform(pricingProgress, [0, 0.25], [0, 1]);
  const pricingY = useTransform(pricingProgress, [0, 0.35], [60, 0]);

  // FAQ section scroll animation
  const faqRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: faqProgress } = useScroll({
    target: faqRef,
    offset: ["start end", "end start"],
  });
  const faqY = useTransform(faqProgress, [0, 0.4], [80, 0]);
  const faqOpacity = useTransform(faqProgress, [0, 0.3], [0, 1]);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [mousePositions, setMousePositions] = useState<
    Record<number, { x: number; y: number }>
  >({});

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden noise-overlay">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Image src="/logo.png" alt="200x" width={24} height={24} />
            <span className="text-sm font-medium tracking-wide">200x</span>
          </div>
        </div>
      </motion.nav>

      {/* Bottom Bar CTA */}
      <motion.div
        style={{ opacity: bottomBarOpacity }}
        className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-5 md:left-auto md:right-6 z-50 p-4 md:p-0 bg-background/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-t border-border md:border-0"
      >
        <a
          href="#pricing"
          className="flex items-center justify-center gap-2 w-full md:w-auto py-3.5 md:py-3 md:px-8 bg-accent text-accent-foreground text-sm font-medium tracking-wide hover:brightness-110 transition-all md:shadow-lg md:shadow-accent/25 hover:md:shadow-xl hover:md:shadow-accent/30 hover:md:scale-105"
        >
          <span>Get the File</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center px-6 overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-5xl mx-auto text-center pt-8"
        >
          <motion.div className="overflow-hidden pb-2 mb-4">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.2]"
            >
              <span className="font-sans">Stop prompting. </span>
              <span className="font-serif italic text-accent">Start ruling.</span>
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground mb-6"
          >
            The Production-Ready .cursorrules File
          </motion.p>

          {/* VSL Video */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.33, 1, 0.68, 1] }}
            className="w-full max-w-3xl mx-auto mb-6"
          >
            <div className="relative aspect-video bg-muted/50 border border-border overflow-hidden group cursor-pointer">
              {/* Video placeholder gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-muted/80 via-background to-muted/60" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 md:w-24 md:h-24 bg-foreground text-background rounded-full flex items-center justify-center shadow-2xl group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                >
                  <Play
                    className="w-8 h-8 md:w-10 md:h-10 ml-1"
                    fill="currentColor"
                  />
                </motion.div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
                4:32
              </div>
            </div>

            {/* Course label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-xs tracking-[0.3em] text-muted-foreground uppercase mt-4"
            >
              Make Cursor Predictable, Safe, and Production-Ready
            </motion.p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex items-center justify-center"
          >
            <a
              href="#pricing"
              className="group inline-flex items-center justify-center gap-3 px-16 py-4 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition-all min-w-[320px]"
            >
              <span>Get Instant Access</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Who This Is For Section */}
      <section ref={whoRef} className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            style={{ y: whoHeadingY, opacity: whoHeadingOpacity }}
            className="mb-20"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">
              Who This Is For
            </p>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight font-sans">
              Engineers Who Are Tired of
              <br />
              <span className="font-serif italic text-accent">
                Fighting Unpredictable AI
              </span>
            </h2>
          </motion.div>

          {/* Problems */}
          <motion.div
            style={{ y: whoContentY, opacity: whoContentOpacity }}
            className="mb-24"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-12">
              The Problems You&apos;re Facing
            </p>

            <div className="space-y-6">
              {[
                {
                  num: "01",
                  title: "You re-explain context every single prompt",
                  desc: '"Remember we use X, not Y." "Follow our folder structure." "Don\'t over-abstract." Every. Single. Time.',
                },
                {
                  num: "02",
                  title: "You fix regressions Cursor shouldn't have made",
                  desc: "It worked yesterday. Now it's broken. Style drift, architecture decay, bad defaults creeping in.",
                },
                {
                  num: "03",
                  title: "Output quality varies wildly request to request",
                  desc: "Sometimes brilliant. Sometimes garbage. You never know what you're going to get.",
                },
              ].map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    delay: i * 0.15,
                    duration: 0.6,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  className="group relative"
                >
                  <div className="flex gap-6 p-6 md:p-8 border border-border bg-background hover:border-destructive/40 hover:bg-destructive/5 transition-all duration-300">
                    {/* Number */}
                    <motion.span
                      className="text-4xl md:text-5xl font-light text-destructive/40 font-mono shrink-0"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.2 + i * 0.15,
                        duration: 0.4,
                        type: "spring",
                      }}
                    >
                      {problem.num}
                    </motion.span>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-medium mb-3 font-sans text-foreground leading-tight">
                        {problem.title}
                      </h3>
                      <p className="text-base md:text-lg text-muted-foreground/80 font-mono leading-relaxed">
                        {problem.desc}
                      </p>
                    </div>
                  </div>

                  {/* Animated accent line */}
                  <motion.div
                    className="absolute left-0 top-0 w-1 h-full bg-destructive/60"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                    style={{ transformOrigin: "top" }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Risk Section - If You Don't Get This */}
      <section className="py-32 px-6 border-t border-border bg-destructive/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-destructive uppercase mb-6">
              Without a Rules File
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-sans mb-6">
              The Hidden Cost of <br />
              <span className="font-serif italic text-destructive">
                Prompting Without Rules
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most people use Cursor by re-explaining context every prompt,
              fixing regressions after the fact, fighting style drift, and
              trusting outputs they shouldn&apos;t.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-16 mb-16">
            {/* Time Wasted */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                {/* Clock visualization */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full transform -rotate-90"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-accent"
                    />
                    {/* Wasted portion - 40% of time */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="text-destructive"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      whileInView={{ strokeDashoffset: 283 * 0.6 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-4xl md:text-5xl font-bold text-destructive font-mono"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.5, duration: 0.4 }}
                    >
                      40%
                    </motion.span>
                    <span className="text-sm text-muted-foreground">
                      wasted
                    </span>
                  </div>
                </div>

                {/* Text content */}
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-medium font-sans mb-4">
                    Hours Lost to Context Re-Explaining
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Every prompt starts from zero. Every session requires the
                    same explanations. This alone costs hours per week. Those
                    hours compound.
                  </p>

                  {/* Time comparison */}
                  <div className="mt-6 flex items-center justify-center md:justify-start gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-destructive rounded-full" />
                      <span className="text-muted-foreground">
                        Re-explaining
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent rounded-full" />
                      <span className="text-muted-foreground">
                        Actual building
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Silent Damage */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-muted/20 border border-border p-8 md:p-12"
            >
              <h3 className="text-2xl md:text-3xl font-medium font-sans mb-8 text-center">
                The Damage You Don&apos;t See
              </h3>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {[
                  {
                    icon: Layers,
                    title: "Architecture Decay",
                    desc: "Slight structural degradation with every addition",
                  },
                  {
                    icon: Target,
                    title: "Style Divergence",
                    desc: "Inconsistent patterns creeping into your codebase",
                  },
                  {
                    icon: Brain,
                    title: "Bad Defaults",
                    desc: "Cursor's assumptions overriding your standards",
                  },
                  {
                    icon: Clock,
                    title: "Compound Debt",
                    desc: "Small issues becoming massive refactors",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4 p-4 bg-background border border-border"
                  >
                    <item.icon className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center mt-8 text-lg">
                The most dangerous Cursor failures aren&apos;t obvious bugs.
                They&apos;re invisible erosion that ships to production.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="border border-destructive/30 bg-background p-8 md:p-12"
          >
            <h3 className="text-lg font-medium font-sans mb-6 text-destructive">
              What Happens Without Rules:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Repeat the same context explanations endlessly",
                "Fix regressions that shouldn't have happened",
                "Watch output quality vary wildly",
                "Fight style drift after every session",
                "Trust outputs you shouldn't trust",
                "Spend more time fixing than building",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <X className="w-4 h-4 text-destructive shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transformation Section - What You Get */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-6">
              The Transformation
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-sans mb-6">
              With a Rules File, <br />
              <span className="font-serif italic text-accent">
                Everything Changes
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A .cursorrules file doesn&apos;t teach Cursor what to do. It
              teaches Cursor how to think.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-20 mb-16">
            {/* Judgment Not Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                {/* Icon visualization */}
                <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 bg-accent/10 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <Brain className="w-20 h-20 text-accent relative z-10" />
                </div>

                {/* Text content */}
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl md:text-3xl font-medium font-sans mb-4">
                    It Encodes Judgment, Not Instructions
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                    Prompts are reactive. Rules are priorities, constraints, and
                    taste. A good rules file captures architectural decisions,
                    coding standards, safety boundaries, refactor philosophy,
                    and what not to do.
                  </p>
                  <p className="text-accent font-medium">
                    This is experience, frozen into configuration.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Predictability */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <h3 className="text-2xl md:text-3xl font-medium font-sans mb-12 text-center">
                It Makes Cursor Predictable
              </h3>

              {/* Before/After comparison */}
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* WITHOUT */}
                <motion.div
                  className="relative border border-destructive/30 bg-destructive/5 p-8"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-xs text-destructive uppercase tracking-wider mb-6 font-medium">
                    Without Rules
                  </div>

                  <ul className="space-y-4">
                    {[
                      "Output quality varies request to request",
                      "Refactors slowly degrade structure",
                      'The codebase "drifts"',
                      "You're constantly surprised",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <X className="w-4 h-4 text-destructive shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* WITH */}
                <motion.div
                  className="relative border border-accent/30 bg-accent/5 p-8"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-xs text-accent uppercase tracking-wider mb-6 font-medium">
                    With Rules
                  </div>

                  <ul className="space-y-4">
                    {[
                      "Cursor behaves consistently",
                      "Outputs become predictable",
                      "You stop being surprised",
                      "Predictability is the productivity gain",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm text-foreground"
                      >
                        <Check className="w-4 h-4 text-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>

            {/* Context Elimination */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-muted/20 border border-border p-8 md:p-12"
            >
              <h3 className="text-2xl md:text-3xl font-medium font-sans mb-8 text-center">
                It Eliminates Context Re-Explaining
              </h3>

              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Instead of saying... */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                    Instead of saying:
                  </p>
                  <div className="space-y-3">
                    {[
                      '"Remember we use X, not Y"',
                      '"Follow our folder structure"',
                      '"Don\'t over-abstract"',
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3 bg-background border border-border font-mono text-sm text-muted-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* You say it once... */}
                <div>
                  <p className="text-xs text-accent uppercase tracking-wider mb-4">
                    You say it once, globally:
                  </p>
                  <div className="p-6 bg-accent/10 border border-accent/30">
                    <p className="text-lg font-medium text-foreground mb-4">
                      Every prompt inherits the same context.
                    </p>
                    <p className="text-accent font-mono text-sm">
                      This alone saves hours per week.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scales Across Time */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <h3 className="text-2xl md:text-3xl font-medium font-sans mb-8 text-center">
                It Scales Across Time and Projects
              </h3>

              <div className="text-center max-w-2xl mx-auto">
                <p className="text-xl text-muted-foreground mb-8">
                  Prompts don&apos;t scale. <span className="text-accent">Rules do.</span>
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Works on day 1",
                    "Works after 50 refactors",
                    "Works across new features",
                    "Works when you're tired",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="p-4 bg-accent/5 border border-accent/20"
                    >
                      <Check className="w-5 h-5 text-accent mb-2 mx-auto" />
                      <p className="text-sm text-foreground">{item}</p>
                    </motion.div>
                  ))}
                </div>

                <p className="text-muted-foreground mt-8">
                  It removes variability from you and the AI.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="border border-accent/30 bg-accent/5 p-8 md:p-12"
          >
            <h3 className="text-lg font-medium font-sans mb-6 text-accent">
              What You Get With Rules:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "A consistent senior engineer in every prompt",
                "A standards enforcer that never forgets",
                "A refactor partner you can trust",
                "Predictable, production-ready output",
                "Silent damage prevention before it ships",
                "Hours saved per week, compounding",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-xl md:text-2xl font-medium font-sans mb-4">
              Without rules, Cursor is a helpful assistant.
            </p>
            <p className="text-xl md:text-2xl font-medium font-sans text-accent">
              With rules, Cursor becomes infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who I Am Section */}
      <section
        ref={aboutRef}
        className="py-32 px-6 border-t border-border overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <motion.p
            style={{ opacity: aboutOpacity }}
            className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-16"
          >
            Why Should You Listen to Me?
          </motion.p>

          <div className="grid md:grid-cols-12 gap-12 md:gap-8">
            <motion.div
              style={{ x: aboutLeftX, opacity: aboutOpacity }}
              className="md:col-span-5"
            >
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 font-sans">
                Built by Someone Who{" "}
                <span className="font-serif italic text-accent">Ships</span>
              </h2>

              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  className="w-16 h-16 rounded-full overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/profile.jpeg"
                    alt="Jaro Vorobey"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div>
                  <a
                    href="https://www.linkedin.com/in/jaro-vorobey/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-lg hover:text-accent transition-colors"
                  >
                    Jaro Vorobey
                  </a>
                  <p className="text-muted-foreground text-sm">
                    Engineering Manager at{" "}
                    <a
                      href="https://openai.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      OpenAI
                    </a>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Founder of{" "}
                    <a
                      href="https://jaro.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Jaro.dev
                    </a>
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                I manage a team of 40+ engineers at OpenAI, the largest AI
                company in the world. We spend millions of dollars a month on
                world-class engineers, and this .cursorrules file is used by all
                of them.
              </p>
            </motion.div>

            <motion.div
              style={{ x: aboutRightX, opacity: aboutOpacity }}
              className="md:col-span-7 md:pt-4"
            >
              <ul className="space-y-6 mb-10">
                {[
                  {
                    content: (
                      <>
                        Leading a team of 40+ senior software engineers at
                        OpenAI
                      </>
                    ),
                  },
                  {
                    content: (
                      <>
                        Founded{" "}
                        <a
                          href="https://jaro.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          Jaro.dev
                        </a>
                        , a 7-figure software agency
                      </>
                    ),
                  },
                  {
                    content: <>Previously at JPMorgan Chase & Deutsche Bank</>,
                  },
                  {
                    content: (
                      <>
                        Top 1% by contributions on{" "}
                        <a
                          href="https://github.com/jarostaz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          GitHub
                        </a>
                      </>
                    ),
                  },
                  {
                    content: (
                      <>
                        This exact .cursorrules file has built dozens of
                        production apps
                      </>
                    ),
                  },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.4 + i * 0.15,
                      duration: 0.6,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                    className="flex items-center gap-4 text-lg"
                  >
                    <motion.span
                      className="w-2 h-2 bg-accent shrink-0"
                      whileInView={{ scale: [0, 1.5, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                    />
                    <span className="text-foreground/80">{item.content}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="text-lg font-medium text-foreground border-l-2 border-accent pl-6"
              >
                This .cursorrules file is the same one used to build this
                landing page you&apos;re reading right now.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 border-t border-border overflow-hidden relative">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-linear-to-b from-accent/2 via-transparent to-accent/2" />

        <motion.div
          className="max-w-6xl mx-auto relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
              },
            }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">
              What Others Say
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-sans mb-4">
              Engineers Are{" "}
              <span className="font-serif italic text-accent">
                Finally Consistent
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From fighting Cursor to commanding it
            </p>
          </motion.div>

          {/* Bento-style grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: [0.33, 1, 0.68, 1],
                    },
                  },
                }}
                className={`group relative overflow-hidden ${
                  testimonial.featured
                    ? "md:col-span-2 lg:col-span-2 lg:row-span-1"
                    : ""
                }`}
              >
                {/* Card with gradient border on hover */}
                <div
                  className={`relative h-full p-6 md:p-8 border border-border bg-background transition-all duration-500 group-hover:border-transparent ${
                    testimonial.featured
                      ? "bg-linear-to-br from-accent/5 to-transparent"
                      : ""
                  }`}
                >
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                    <div className="absolute -inset-px bg-linear-to-r from-accent/50 via-accent/20 to-accent/50 rounded-[1px]" />
                    <div className="absolute inset-px bg-background" />
                  </div>

                  {/* Header with rating and verified badge */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Star rating */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 fill-accent text-accent"
                        />
                      ))}
                    </div>

                    {/* Verified badge */}
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <BadgeCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Verified</span>
                    </div>
                  </div>

                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-accent/20" />
                  </div>

                  {/* Quote text */}
                  <p
                    className={`text-foreground/90 leading-relaxed mb-6 ${
                      testimonial.featured ? "text-lg md:text-xl" : "text-base"
                    }`}
                  >
                    {testimonial.quote}
                  </p>

                  {/* Author section */}
                  <div className="flex items-center gap-4 mt-auto">
                    {/* Avatar with gradient ring */}
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-linear-to-br from-accent to-accent/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-12 h-12 rounded-full bg-linear-to-br from-muted to-muted/50 flex items-center justify-center text-foreground font-semibold text-sm border-2 border-background">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {testimonial.role}{" "}
                        <span className="text-accent">
                          @ {testimonial.company}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Decorative corner accent for featured */}
                  {testimonial.featured && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-accent/10 to-transparent" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom stats bar */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: 0.3,
                  ease: [0.33, 1, 0.68, 1],
                },
              },
            }}
            className="mt-12 pt-8 border-t border-border"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-semibold text-accent font-mono">
                  1,000+
                </p>
                <p className="text-sm text-muted-foreground">
                  Engineers Using This File
                </p>
              </div>
              <div className="hidden md:block w-px h-12 bg-border" />
              <div>
                <p className="text-3xl md:text-4xl font-semibold text-accent font-mono">
                  50+
                </p>
                <p className="text-sm text-muted-foreground">
                  Production Apps Built
                </p>
              </div>
              <div className="hidden md:block w-px h-12 bg-border" />
              <div>
                <p className="text-3xl md:text-4xl font-semibold text-accent font-mono">
                  5hrs
                </p>
                <p className="text-sm text-muted-foreground">
                  Saved Per Week (Avg)
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Proof It Works Section */}
      <section
        ref={productsRef}
        className="py-32 px-6 border-t border-border overflow-hidden"
      >
        <motion.div
          style={{
            scale: productsScale,
            opacity: productsOpacity,
            rotate: productsRotate,
          }}
          className="max-w-6xl mx-auto"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
            Proof It Works
          </p>

          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-16 font-sans">
            Products Built Using{" "}
            <span className="font-serif italic text-accent">This File</span>
          </h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.04,
                  delayChildren: 0,
                },
              },
            }}
          >
            {products.map((product, i) => (
              <a
                key={i}
                href={product.url}
                target={product.url !== "#" ? "_blank" : undefined}
                rel={product.url !== "#" ? "noopener noreferrer" : undefined}
                className="cursor-pointer"
              >
                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      scale: 0.95,
                      y: 20,
                    },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    },
                  }}
                  onMouseEnter={() => setHoveredProduct(i)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    const marginX = rect.width * 0.05;
                    const marginY = rect.height * 0.05;
                    const isInInnerArea =
                      mouseX > marginX &&
                      mouseX < rect.width - marginX &&
                      mouseY > marginY &&
                      mouseY < rect.height - marginY;

                    if (isInInnerArea) {
                      setHoveredProduct(i);
                      const yOffset = mouseY - centerY;
                      const yDamping = yOffset < 0 ? 1.0 : 0.2;
                      setMousePositions((prev) => ({
                        ...prev,
                        [i]: {
                          x: centerX + (mouseX - centerX) * 0.2,
                          y: centerY + yOffset * yDamping,
                        },
                      }));
                    } else {
                      setHoveredProduct(null);
                    }
                  }}
                  className={`relative p-8 group hover:bg-muted/30 transition-colors h-full ${
                    product.isHighlighted
                      ? "bg-accent/10 border-l-2 border-accent"
                      : "bg-background"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3
                      className={`text-lg font-medium font-sans ${
                        product.isHighlighted ? "text-accent" : ""
                      }`}
                    >
                      {product.name}
                    </h3>
                    {product.url !== "#" && (
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.desc}
                  </p>

                  {/* GIF Preview on Hover */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: hoveredProduct === i ? 1 : 0,
                      scale: hoveredProduct === i ? 1 : 0.9,
                    }}
                    style={{
                      x: (mousePositions[i]?.x ?? 0) - 160,
                      y: (mousePositions[i]?.y ?? 0) - 210,
                    }}
                    transition={{
                      opacity: { duration: 0.2, ease: "easeInOut" },
                      scale: { duration: 0.2, ease: "easeInOut" },
                    }}
                    className="absolute left-0 top-0 z-50 pointer-events-none"
                  >
                    <div className="relative">
                      <div className="w-80 bg-muted rounded-lg overflow-hidden border border-border shadow-2xl">
                        <div className="h-48 flex items-center justify-center">
                          {product.gif ? (
                            <Image
                              src={product.gif}
                              alt={`${product.name} preview`}
                              width={320}
                              height={192}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Preview coming soon
                            </span>
                          )}
                        </div>
                        {product.url !== "#" && (
                          <div className="px-3 py-2 bg-background/80 border-t border-border text-xs text-muted-foreground text-center">
                            Click to open in new tab
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* What's Included Section */}
      <section ref={includedRef} className="py-32 px-6 border-t border-border">
        <motion.div
          style={{ y: includedY, opacity: includedOpacity }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
            What&apos;s Included
          </p>

          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 font-sans">
            Inside The Rules File
          </h2>

          <p className="text-muted-foreground text-lg mb-16 font-mono">
            6 comprehensive sections engineered for production reliability
          </p>

          {/* Expandable rule sections */}
          <div className="border-t border-border">
            {ruleSections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border-b border-border"
              >
                <button
                  onClick={() =>
                    setOpenRuleSection(openRuleSection === i ? null : i)
                  }
                  className="w-full py-6 md:py-8 flex items-start gap-3 md:gap-8 text-left group cursor-pointer"
                >
                  {/* Number */}
                  <span className="text-xl md:text-4xl font-light text-accent/60 font-mono shrink-0 w-8 md:w-12">
                    {section.number}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-medium font-sans mb-2 group-hover:text-accent transition-colors">
                      {section.title}
                    </h3>
                    <div className="flex flex-col gap-3 text-sm font-mono mt-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
                          Without
                        </span>
                        <span className="px-3 py-1.5 bg-muted/50 border border-border rounded-sm text-muted-foreground line-through decoration-muted-foreground/30">
                          {section.without}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-accent">
                          With Rules
                        </span>
                        <span className="px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-sm text-accent font-medium">
                          {section.with}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle icon */}
                  <motion.span
                    animate={{ rotate: openRuleSection === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 mt-1"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </motion.span>
                </button>

                {/* Expandable content */}
                <motion.div
                  initial={false}
                  animate={{
                    height: openRuleSection === i ? "auto" : 0,
                    opacity: openRuleSection === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 pl-11 md:pl-20">
                    <ul className="space-y-3">
                      {section.rules.map((rule, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{
                            opacity: openRuleSection === i ? 1 : 0,
                            x: openRuleSection === i ? 0 : -10,
                          }}
                          transition={{ delay: j * 0.05, duration: 0.3 }}
                          className="flex items-center gap-3 text-muted-foreground font-mono text-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-accent/50 shrink-0" />
                          {rule}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Additional deliverables */}
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            {whatsIncluded.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative p-8 border border-border bg-background hover:border-accent/40 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center border border-border bg-muted/30 group-hover:border-accent/30 transition-colors shrink-0">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium font-sans mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Results Promise Section */}
      <section className="py-32 px-6 border-t border-border overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-6">
              The Promise
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-sans mb-6">
              After Using This File, <br />
              <span className="font-serif italic text-accent">
                You Will Be Able To:
              </span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                icon: FileCode,
                title: "One-shot Next.js applications and landing pages",
                desc: "Stop iterating. Start shipping. The file knows your patterns.",
              },
              {
                icon: Shield,
                title: "Trust Cursor's output without constant review",
                desc: "Rules act as guardrails. Bad outputs get caught before they ship.",
              },
              {
                icon: Clock,
                title: "Eliminate hours of context re-explaining",
                desc: "Say it once. Have it remembered forever. Every prompt inherits your judgment.",
              },
              {
                icon: Lock,
                title: "Prevent silent architecture decay",
                desc: "No more style drift. No more structural erosion. Consistent quality, always.",
              },
              {
                icon: Target,
                title: "Get predictable, production-ready output",
                desc: "Boring is beautiful. Same quality every time. No surprises.",
              },
              {
                icon: Zap,
                title: "Build with AI as infrastructure, not just a tool",
                desc: "The difference between using AI and building with AI.",
              },
            ].map((promise, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -60, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="group relative"
              >
                <div className="relative flex items-start gap-6 p-8 border border-border bg-background hover:border-accent/40 transition-all duration-300">
                  {/* Gradient background on hover */}
                  <motion.div className="absolute inset-0 bg-linear-to-r from-accent/20 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon container with animation */}
                  <motion.div
                    className="relative z-10 shrink-0 w-14 h-14 flex items-center justify-center border border-border bg-background group-hover:border-accent/30 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <promise.icon className="w-6 h-6 text-accent" />
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10 flex-1">
                    <h3 className="text-lg font-medium font-sans mb-2 group-hover:text-accent transition-colors">
                      {promise.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {promise.desc}
                    </p>
                  </div>

                  {/* Animated check on the right */}
                  <motion.div
                    className="relative z-10 shrink-0 self-center"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                  </motion.div>
                </div>

                {/* Connecting line between items */}
                {i < 5 && (
                  <motion.div
                    className="absolute left-[43px] top-full w-px h-6 bg-linear-to-b from-border to-transparent"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                    style={{ transformOrigin: "top" }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-xl font-medium font-sans">
              A .cursorrules file replaces repeated prompting with{" "}
              <span className="text-accent">permanent judgment</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Stack Section */}
      <section ref={bonusesRef} className="py-32 px-6 border-t border-border">
        <motion.div
          style={{ y: bonusesY, opacity: bonusesOpacity }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
            What You Get
          </p>

          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-16 font-sans">
            The Complete{" "}
            <span className="font-serif italic text-accent">Value Stack</span>
          </h2>

          <div className="space-y-0">
            {valueStack.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.6,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className={`flex items-start justify-between py-6 border-b border-border ${
                  item.isOutcome ? "bg-accent/5 -mx-4 px-4" : ""
                }`}
              >
                <div className="flex items-start gap-4 flex-1 pr-8">
                  <Check
                    className={`w-5 h-5 mt-0.5 shrink-0 ${
                      item.isOutcome ? "text-accent" : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <h3
                      className={`text-lg font-medium mb-1 font-sans ${
                        item.isOutcome ? "text-foreground" : ""
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`font-medium ${
                      item.isOutcome
                        ? "text-xl text-accent"
                        : "text-lg text-muted-foreground"
                    }`}
                  >
                    ${item.value.toLocaleString()}{" "}
                    <span className="text-sm font-normal">value</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-8 border border-accent bg-accent/5"
          >
            <div className="text-center mb-8">
              <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
                Total Value:
              </p>
              <motion.div
                className="relative inline-block mb-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <span className="text-4xl md:text-5xl font-medium font-sans text-muted-foreground/60">
                  $91,791
                </span>
                <motion.div
                  className="absolute left-0 top-1/2 h-[3px] bg-destructive"
                  variants={{
                    hidden: { width: "0%", x: "-10%" },
                    visible: { width: "120%", x: "-10%" },
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                />
              </motion.div>
              <div className="w-16 h-px bg-accent/30 mx-auto mb-6" />
              <p className="text-xs tracking-[0.2em] text-accent uppercase mb-2">
                Your Price Today:
              </p>
              <motion.p
                className="text-6xl md:text-7xl font-medium font-sans text-accent"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                $49
              </motion.p>
              <motion.p
                className="inline-block mt-4 px-4 py-1.5 bg-accent/20 text-accent text-sm font-medium"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                One-Time Payment
              </motion.p>
            </div>
            <a
              href="#pricing"
              className="group flex items-center justify-center gap-3 w-full py-4 bg-accent text-accent-foreground text-sm font-medium tracking-wide hover:bg-accent/90 transition-colors"
            >
              <span>Get Instant Access</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Is This For You Section */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">
              Prerequisites
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-sans mb-6">
              Is This File{" "}
              <span className="font-serif italic text-accent">For You?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              This is for engineers who are serious about their craft.
            </p>
          </motion.div>

          <div className="space-y-4 mb-12">
            {prerequisites.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 border border-border"
              >
                <Check className="w-5 h-5 text-accent shrink-0" />
                <span className="text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-lg font-medium"
          >
            If you check all these boxes, you&apos;re ready for{" "}
            <span className="text-accent">predictable, production-ready AI</span>.
          </motion.p>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        ref={pricingRef}
        id="pricing"
        className="py-32 px-6 border-t border-border bg-accent/5"
      >
        <motion.div
          style={{ scale: pricingScale, opacity: pricingOpacity, y: pricingY }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-medium tracking-tight mb-4 font-sans"
          >
            Stop Re-Explaining. Start Ruling.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-medium text-accent mb-8 font-serif italic"
          >
            Get the Production-Ready .cursorrules File
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto"
          >
            The exact file used at OpenAI and to build dozens of production
            applications. Copy, paste, ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="p-12 border-2 border-accent bg-background max-w-lg mx-auto"
          >
            <h3 className="text-2xl font-medium mb-6 font-sans">
              Get the .cursorrules File
            </h3>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-6xl font-medium font-sans">$49</span>
            </div>
            <p className="text-muted-foreground mb-8">
              One-time payment. Lifetime updates.
            </p>

            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-2 md:gap-3 w-full py-4 md:py-5 bg-accent text-accent-foreground text-sm md:text-base font-medium tracking-wide hover:bg-accent/90 transition-colors mb-4"
            >
              <span>Get Instant Access Now</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <p className="text-sm text-muted-foreground">
              Secure checkout. Instant download.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <span>Lifetime Updates</span>
            <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
            <span>Full Documentation</span>
            <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
            <span>Instant Access</span>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-32 px-6 border-t border-border">
        <motion.div
          style={{ y: faqY, opacity: faqOpacity }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
            FAQ
          </p>

          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-16 font-sans">
            Questions
          </h2>

          <div>
            {faqData.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.5,
                  ease: [0.33, 1, 0.68, 1],
                }}
              >
                <FAQItem
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openFAQ === i}
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 border-t border-border"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-1">
            <Image src="/logo.png" alt="200x" width={24} height={24} />
            <span className="text-sm font-medium tracking-wide">200x</span>
          </div>

          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} 200x. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </main>
  );
}

