"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Play,
  Check,
  X,
  Github,
  Twitter,
  ExternalLink,
  Plus,
} from "lucide-react";

// FAQ Item component
function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="border-b border-border"
      initial={false}
    >
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
        <p className="pb-6 text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
}

// Scroll-animated section wrapper with parallax
function ParallaxSection({ 
  children, 
  className = "",
  yOffset = 100,
  scaleFrom = 0.95,
}: { 
  children: React.ReactNode; 
  className?: string;
  yOffset?: number;
  scaleFrom?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [yOffset, 0, -yOffset]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [scaleFrom, 1, 1, scaleFrom]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Course modules data
const courseModules = [
  {
    number: "01",
    title: "The Mental Model Shift",
    before: "Treating AI like autocomplete",
    after: "Directing AI like a team of engineers",
    lessons: [
      "Why thinking of AI as a 'tool' kills productivity",
      "The cognitive bottleneck theory",
      "When AI outperforms humans (and when it doesn't)",
    ],
  },
  {
    number: "02",
    title: "Cursor Environment Mastery",
    before: "Default settings, no rules, constant context loss",
    after: "Optimized setup that maintains context across sessions",
    lessons: [
      "MCP setup and token management",
      "Documentation integration",
      "The cursor rules file",
      "Worktrees for parallel work",
    ],
  },
  {
    number: "03",
    title: "The Three Modes",
    before: "Using Agent mode for everything",
    after: "Strategic mode selection for each task type",
    lessons: [
      "Agent mode: when to YOLO",
      "Plan mode: thinking before doing",
      "Ask mode: exploration without changes",
    ],
  },
  {
    number: "04",
    title: "Prompting as Engineering",
    before: "Vague prompts, unpredictable outputs",
    after: "Precise specifications, consistent results",
    lessons: [
      "Prompting is specification writing",
      "Constraint-first prompting",
      "The inverse pyramid method",
      "Building reusable prompt primitives",
    ],
  },
  {
    number: "05",
    title: "The Agentic Development Loop",
    before: "Linear, one-shot attempts",
    after: "Iterative loops with quality gates",
    lessons: [
      "Plan -> Execute -> Critique -> Refine",
      "Agentic Test-Driven Development",
      "One-shot mentality",
      "When to intervene vs let it loop",
    ],
  },
  {
    number: "06",
    title: "Parallelization & Orchestration",
    before: "One task at a time",
    after: "Multiple agents working simultaneously",
    lessons: [
      "Running multiple agents simultaneously",
      "Bake-offs between models",
      "The plan/implement split",
      "Managing multiple contexts",
    ],
  },
  {
    number: "07",
    title: "Checkpoints & Recovery",
    before: "Starting over when things break",
    after: "Instant rollback, zero lost work",
    lessons: [
      "The checkpoint system",
      "Rollback strategies",
      "Escape patterns for stuck agents",
      "Strategic logging",
    ],
  },
  {
    number: "08",
    title: "Real-World Case Study",
    before: "Theory without practice",
    after: "See exactly how it's done",
    lessons: [
      "Full feature implementation walkthrough",
      "Every prompt annotated",
      "Decision commentary",
      "'Why I rejected X' moments",
    ],
  },
];

// Products data
const products = [
  { name: "RealGreatDevs", desc: "2M+ software engineer platform", hasLink: true, url: "https://realgreatdevs.com" },
  { name: "Studio.jaro.dev", desc: "AI chat, agent integrations, meeting summaries to tasks, team management with RBAC", hasLink: true, url: "https://studio.jaro.dev" },
  { name: "8 Apps at OpenAI", desc: "8 production applications shipped in 8 consecutive weeks", hasLink: false },
  { name: "PivotalOS", desc: "Complete operating system for businesses", hasLink: false },
  { name: "BusinessOS", desc: "Animated landing page", hasLink: true, url: "https://businessos.com" },
  { name: "Apfol", desc: "Portfolio landing page", hasLink: false },
];

// Bonuses data
const bonuses = [
  { title: ".cursorrules File & Folder", desc: "My complete production configuration-rules, worktrees, sub-agents, everything", value: 197 },
  { title: "One-Shot Prompt Library", desc: "Battle-tested prompts for building applications from scratch", value: 97 },
  { title: "5 Slack Questions", desc: "Direct access to me. Attach screen recordings for better answers. 48hr response.", value: 250 },
  { title: "$100 Towards 10x Engineer Course", desc: "Leave a review and get $100 credit towards my upcoming advanced course", value: 100 },
];

// FAQ data
const faqData = [
  {
    q: "Do I need to be an expert developer?",
    a: "No, but you should be comfortable with Git and at least one programming language. This course is for intermediate users who already use AI tools but want to level up.",
  },
  {
    q: "What if I've never used Cursor?",
    a: "You'll want basic familiarity. Download Cursor, play with it for a few hours first. The course assumes you know what Cursor is.",
  },
  {
    q: "Is this for a specific language or framework?",
    a: "No. The principles work regardless of your stack. I demonstrate with TypeScript/React, but the workflow is language-agnostic.",
  },
  {
    q: "Can my employer pay for this?",
    a: "Yes. I provide an invoice and a template email for requesting reimbursement. Most companies approve professional development under $500 instantly.",
  },
  {
    q: "How do the 5 Slack questions work?",
    a: "You get 5 questions with 48-hour response time. You can attach screen recordings to help me understand your situation better and give you a more useful answer.",
  },
  {
    q: "What's your refund policy?",
    a: "All sales are final. This course contains proprietary workflows and configurations that I use professionally.",
  },
  {
    q: "How do I get the $100 credit for the 10x Engineer Course?",
    a: "Leave a genuine review of this course within 30 days of purchase, and I'll send you a $100 credit code for my upcoming 10x Engineer Course.",
  },
];

export default function LandingPage() {
  // Hero scroll animation
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.9]);

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
  const aboutLeftX = useTransform(aboutProgress, [0, 0.4], [-100, 0]);
  const aboutRightX = useTransform(aboutProgress, [0, 0.4], [100, 0]);
  const aboutOpacity = useTransform(aboutProgress, [0, 0.3], [0, 1]);

  // Products section scroll animation
  const productsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: productsProgress } = useScroll({
    target: productsRef,
    offset: ["start end", "end start"],
  });
  const productsScale = useTransform(productsProgress, [0, 0.3], [0.8, 1]);
  const productsOpacity = useTransform(productsProgress, [0, 0.3], [0, 1]);
  const productsRotate = useTransform(productsProgress, [0, 0.4], [-2, 0]);

  // Curriculum section scroll animation
  const curriculumRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: curriculumProgress } = useScroll({
    target: curriculumRef,
    offset: ["start end", "end start"],
  });
  const curriculumY = useTransform(curriculumProgress, [0, 0.4], [80, 0]);
  const curriculumOpacity = useTransform(curriculumProgress, [0, 0.25], [0, 1]);

  // Bonuses section scroll animation
  const bonusesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: bonusesProgress } = useScroll({
    target: bonusesRef,
    offset: ["start end", "end start"],
  });
  const bonusesY = useTransform(bonusesProgress, [0, 0.35], [100, 0]);
  const bonusesOpacity = useTransform(bonusesProgress, [0, 0.25], [0, 1]);

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
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

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
          <span className="text-sm font-medium tracking-wide">200x</span>
          <a
            href="#pricing"
            className="text-sm px-5 py-2.5 bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            Get Access
          </a>
        </div>
      </motion.nav>

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
              <span className="font-sans">Be the replacer </span>
              <span className="font-serif italic text-accent">not the replaced</span>
            </motion.h1>
          </motion.div>

            <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground mb-6"
          >
            The Advanced Cursor Course
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
                  <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" fill="currentColor" />
            </motion.div>
              </div>
              
              {/* Duration badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
                12:34
              </div>
            </div>
            
            {/* Course label */}
            <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-xs tracking-[0.3em] text-muted-foreground uppercase mt-4"
          >
              Avoid the AI Job Drought
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
              From Mid-Level Vibe Coder to
              <br />
              <span className="font-serif italic text-accent">Elite AI Architect</span>
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
            
            <div className="space-y-0">
              {[
                {
                  title: "Your AI-generated code works, but it's not production-grade",
                  desc: "You're constantly fixing, refactoring, debugging things that shouldn't have broken.",
                },
                {
                  title: "You expected 10x speed. You got maybe 1.5x.",
                  desc: "The promise of AI-assisted development feels just out of reach.",
                },
                {
                  title: "You're using AI as a helper, not as the main engineer",
                  desc: "You can see the potential, but you're not using it to its full extent.",
                },
              ].map((problem, i) => (
              <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  className="group py-8 border-t border-border first:border-t-0 hover:bg-muted/30 transition-colors -mx-6 px-6"
                >
                  <div>
                    <h3 className="text-xl md:text-2xl font-medium mb-2 font-sans">{problem.title}</h3>
                    <p className="text-muted-foreground">{problem.desc}</p>
                </div>
              </motion.div>
            ))}
            </div>
          </motion.div>

          {/* Solution */}
          <ParallaxSection className="mb-24 py-16 border-y border-border" yOffset={60}>
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
              My Solution
            </p>
            <p className="text-2xl md:text-3xl font-medium leading-relaxed max-w-4xl font-sans">
              A complete workflow for directing AI like a team of engineers-with parallel agents, deterministic quality gates, and instant recovery when things go wrong.
            </p>
          </ParallaxSection>

          {/* For/Not For Grid */}
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            >
              <p className="text-sm font-medium text-accent mb-8">This is for you if:</p>
              <ul className="space-y-4">
                {[
                  "You already use AI tools in your workflow",
                  "You can build features end-to-end with AI assistance",
                  "You want production-quality output, not just \"it works\"",
                  "You're ready to change how you work",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

                <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
            >
              <p className="text-sm font-medium text-muted-foreground mb-8">This is not for you if:</p>
              <ul className="space-y-4">
                {[
                  "You're brand new to programming",
                  "You've never used AI coding tools",
                  "You just want prompt templates to copy-paste",
                  "You're not willing to learn a new workflow",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                    transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4"
                >
                    <X className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                  </motion.li>
              ))}
              </ul>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Stakes Section - Consequence Framing */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">
              The Stakes
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-sans mb-6">
              Two paths. <span className="font-serif italic text-accent">One choice.</span>
            </h2>
            </motion.div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {/* Without - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-medium text-destructive mb-8 tracking-wide">Without this system:</p>
              
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-medium font-sans mb-2">You keep falling behind</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every week, engineers half your age ship twice as much. The gap compounds. Your experience becomes a liability, not an asset.
                  </p>
          </motion.div>

          <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-medium font-sans mb-2">You miss the window</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The companies hiring AI-native engineers right now are offering $300-500K packages. These roles won&apos;t exist in 2 years - they&apos;ll be table stakes, not differentiators.
                  </p>
          </motion.div>

          <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-medium font-sans mb-2">You waste months figuring it out alone</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every trick you discover through trial and error? Someone else learned it in an afternoon. Your learning curve is their shipping speed.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-medium font-sans mb-2">You stay replaceable</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Junior devs + AI can now do what senior devs do manually. If your only value is knowing the codebase, you&apos;re one reorg away from a job search.
                  </p>
                </motion.div>
            </div>
          </motion.div>

            {/* With - Right Column */}
          <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="text-sm font-medium text-accent mb-8 tracking-wide">With this system:</p>
              
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-medium font-sans mb-2">You become the multiplier</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    One senior engineer orchestrating 5 AI agents beats a team of 10. You&apos;re not competing with AI - you&apos;re commanding it.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-medium font-sans mb-2">You ship products, not features</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Complete applications in days. Side projects that actually launch. The backlog of ideas you&apos;ve been meaning to build finally gets built.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-lg font-medium font-sans mb-2">You skip years of trial and error</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The exact prompts, rules, and workflows that took 40+ OpenAI engineers months to refine. Downloaded into your brain in hours.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-lg font-medium font-sans mb-2">You become irreplaceable</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    When layoffs come, they don&apos;t cut the person shipping 10x. They cut everyone else. Your output is your job security.
                  </p>
                </motion.div>
              </div>
            </motion.div>
              </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 text-center"
          >
            <p className="text-xl md:text-2xl font-medium font-sans mb-8">
              The question isn&apos;t whether you can afford $497.
                  <br />
              <span className="text-muted-foreground">It's whether you'll be able to afford anything, once the AI job drought hits.</span>
            </p>
            <a
              href="#pricing"
              className="group inline-flex items-center justify-center gap-3 px-12 py-4 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition-all"
            >
              <span>Choose your path</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Who I Am Section */}
      <section ref={aboutRef} className="py-32 px-6 border-t border-border overflow-hidden">
        <div className="max-w-6xl mx-auto">
            <motion.p
            style={{ opacity: aboutOpacity }}
            className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-16"
            >
            Who I Am
            </motion.p>

          <div className="grid md:grid-cols-12 gap-12 md:gap-8">
          <motion.div
              style={{ x: aboutLeftX, opacity: aboutOpacity }}
              className="md:col-span-5"
            >
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 font-sans">
                Built by Someone Who <span className="font-serif italic text-accent">Ships</span>
              </h2>
              
              <div className="flex items-center gap-4 mb-8">
              <motion.div
                  className="w-16 h-16 bg-accent text-accent-foreground flex items-center justify-center text-2xl font-serif"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  J
                </motion.div>
                <div>
                  <p className="font-medium text-lg">Jaro</p>
                  <p className="text-muted-foreground text-sm">Founder of Jaro.dev</p>
                  </div>
                </div>
          </motion.div>

          <motion.div
              style={{ x: aboutRightX, opacity: aboutOpacity }}
              className="md:col-span-7 md:pt-4"
            >
              <ul className="space-y-6">
                {[
                  { text: "Leading a team of 40+ senior software engineers at OpenAI" },
                  { text: "Previously at JPMorgan & Deutsche Bank (Fortune 500)" },
                  { text: "Top 0.1% on GitHub" },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    className="flex items-center gap-4 text-lg"
                  >
                    <motion.span 
                      className="w-2 h-2 bg-accent shrink-0"
                      whileInView={{ scale: [0, 1.5, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                    />
                    <span className="text-foreground/80">{item.text}</span>
                  </motion.li>
                    ))}
                  </ul>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Proof It Works Section */}
      <section ref={productsRef} className="py-32 px-6 border-t border-border overflow-hidden">
          <motion.div
          style={{ scale: productsScale, opacity: productsOpacity, rotate: productsRotate }}
          className="max-w-6xl mx-auto"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
            Proof It Works
          </p>
          
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-16 font-sans">
            Products I Built Using <span className="font-serif italic">This System</span>
              </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {products.map((product, i) => (
          <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                whileHover={{ scale: 1.02 }}
                onClick={() => product.hasLink && product.url && window.open(product.url, '_blank')}
                className={`bg-background p-8 group hover:bg-muted/30 transition-colors ${product.hasLink ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium font-sans">{product.name}</h3>
                  {product.hasLink && (
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  )}
                  </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.desc}</p>
              </motion.div>
            ))}
        </div>
        </motion.div>
      </section>

      {/* Course Curriculum Section */}
      <section ref={curriculumRef} className="py-32 px-6 border-t border-border">
            <motion.div
          style={{ y: curriculumY, opacity: curriculumOpacity }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
            Course Curriculum
          </p>
          
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 font-sans">
            What You&apos;ll Learn
          </h2>
          
          <p className="text-muted-foreground text-lg mb-16">
            8 modules designed for transformation, not just information
          </p>

          <div className="space-y-0">
            {courseModules.map((module, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                className="border-t border-border"
              >
                <button
                  onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                  className="w-full py-8 flex items-start gap-6 text-left group cursor-pointer"
                >
                  <motion.span 
                    className="text-3xl font-light text-muted-foreground/30 group-hover:text-accent transition-colors"
                    whileHover={{ scale: 1.2 }}
                  >
                      {module.number}
                  </motion.span>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium mb-2 font-sans">{module.title}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <span className="text-muted-foreground">
                        <span className="text-muted-foreground/50">Before:</span> {module.before}
                    </span>
                      <span className="text-accent">
                        <span className="text-accent/50">After:</span> {module.after}
                      </span>
                </div>
                  </div>
                  <motion.span
                    animate={{ rotate: expandedModule === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                    className="mt-2"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </motion.span>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedModule === i ? "auto" : 0,
                    opacity: expandedModule === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="pb-8 pl-16 space-y-3">
                    {module.lessons.map((lesson, j) => (
                      <motion.li 
                        key={j} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: expandedModule === i ? 1 : 0, x: expandedModule === i ? 0 : -20 }}
                        transition={{ delay: j * 0.1, duration: 0.3 }}
                        className="flex items-center gap-3 text-muted-foreground"
                      >
                        <span className="w-1 h-1 bg-muted-foreground/50" />
                        {lesson}
                      </motion.li>
                    ))}
                  </ul>
            </motion.div>
          </motion.div>
            ))}
        </div>
        </motion.div>
      </section>

      {/* Bonuses Section */}
      <section ref={bonusesRef} className="py-32 px-6 border-t border-border">
          <motion.div
          style={{ y: bonusesY, opacity: bonusesOpacity }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
            Bonuses Included
          </p>
          
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-16 font-sans">
            Everything You Need to <span className="font-serif italic">Succeed</span>
          </h2>

          <div className="space-y-6">
            {bonuses.map((bonus, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, rotate: i % 2 === 0 ? -2 : 2 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                whileHover={{ x: 10, transition: { duration: 0.2 } }}
                className="flex items-start justify-between py-6 border-b border-border cursor-default"
              >
                <div className="flex-1 pr-8">
                  <h3 className="text-lg font-medium mb-1 font-sans">{bonus.title}</h3>
                  <p className="text-sm text-muted-foreground">{bonus.desc}</p>
                </div>
                <motion.div
                  className="text-right shrink-0"
                  whileInView={{ scale: [0.5, 1.1, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                >
                  <span className="text-sm text-muted-foreground">${bonus.value} value</span>
                </motion.div>
                </motion.div>
              ))}
          </div>
            </motion.div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="py-32 px-6 border-t border-border">
            <motion.div
          style={{ scale: pricingScale, opacity: pricingOpacity, y: pricingY }}
          className="max-w-5xl mx-auto"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8 text-center">
            Pricing
          </p>
          
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-20 text-center font-sans">
            Get Started Today
          </h2>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Individual */}
          <motion.div
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="p-10 border border-foreground"
            >
              <h3 className="text-2xl font-medium mb-2 font-sans">Individual</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <motion.span 
                  className="text-5xl font-medium font-sans"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                >
                  $497
                </motion.span>
        </div>

              <ul className="space-y-4 mb-10">
                {[
                  "Complete video course (8+ hours)",
                  ".cursorrules file & folder",
                  "One-shot prompt library",
                  "5 Slack questions (48hr response)",
                  "$100 towards 10x Engineer Course",
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  >
                    <Check className="w-4 h-4 mt-1 text-accent shrink-0" />
                    <span className="text-foreground/80 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-center gap-3 w-full py-4 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors"
              >
                <span>Get Instant Access</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </motion.div>

            {/* Team */}
          <motion.div
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="p-10 border border-border"
            >
              <h3 className="text-2xl font-medium mb-2 font-sans">Team</h3>
              <p className="text-muted-foreground text-sm mb-4">For teams of 5 or more</p>
              <p className="text-lg font-medium text-accent mb-8">Up to 40% discount</p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Everything in Individual",
                  "Team onboarding call",
                  "Shared Slack channel",
                  "Employer invoice provided",
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                    transition={{ delay: 0.55 + i * 0.1, duration: 0.4 }}
                  >
                    <Check className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 w-full py-4 border border-border text-sm font-medium tracking-wide hover:border-muted-foreground transition-colors"
              >
                <span>Book a Call</span>
              </motion.a>
            </motion.div>
          </div>

            <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center text-muted-foreground text-sm mt-12"
          >
            If you bill $60/hr and this saves you 1 hour per day, it pays for itself in 9 days.
            </motion.p>
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
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
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
          <span className="text-sm font-medium tracking-wide">200x</span>
          
          <div className="flex items-center gap-6">
              <motion.a
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Twitter className="w-5 h-5" />
              </motion.a>
            <motion.a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.2, rotate: -5 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            2025 Cursor Mastery. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </main>
  );
}
