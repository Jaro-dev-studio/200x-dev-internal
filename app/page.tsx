"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  Check,
  X,
  Github,
  Twitter,
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

// Course curriculum data
const courseSections = [
  {
    number: "01",
    title: "Course Intro & Agentic Mindset",
    lessons: [
      { title: "Welcome & What You'll Achieve", points: ["This is not about 'AI helping you code'", "This is about delegating outcomes", "You stop typing - you start directing"] },
      { title: "The Prime Directive: Make It Do Everything", points: ["If you can describe it, you should not be doing it", "You are: Spec writer, Reviewer, Architect", "Discomfort = leverage"] },
      { title: "It Can Do Far More Than You Think", points: ["Testing API connections", "One-off API calls", "Backfills and migrations", "Debugging production issues", "Generating tooling"] },
      { title: "Errors Are Inputs", points: ["Copy entire errors", "Paste into agent", "Ask for: Root cause, Fix, Prevention"] },
      { title: "Logging for AI Debugging", points: ["Logs are for future agents", "Add context-rich, structured logging", "Always ask agents to add logs"] },
      { title: "When AI Is Bad", points: ["Large-scale refactors", "Find-and-replace across complex systems", "Better approach: Extract requirements, Rebuild clean from scratch"] },
    ],
  },
  {
    number: "02",
    title: "Core Concepts of Agentic Development",
    lessons: [
      { title: "You Are the Orchestrator", points: ["Review code like an editor", "You don't micromanage - you verify"] },
      { title: "Context Is King", points: ["One-shot prompts are faster than iteration", "Give full constraints upfront"] },
      { title: "Parallelization Strategy", points: ["One Plan Mode tab", "One Execution Agent", "Multiple execution agents for non-conflicting tasks"] },
      { title: "Agent Isolation (Critical)", points: ["Agents do not share context", "They operate on the same codebase", "Danger: Overwriting files, Conflicting assumptions", "Rule: Avoid overlapping files"] },
    ],
  },
  {
    number: "03",
    title: "Cursor Settings & Setup (Cursor 2.0)",
    lessons: [
      { title: "Layout Setup", points: ["Optional VSCode-style layout", "Import VSCode settings"] },
      { title: "Privacy & Security", points: ["Enable privacy mode", "Block access outside repository", "Keep agents scoped"] },
      { title: "Messaging & Automation", points: ["Queue messages (send after current)", "Browser automation off", "Web search on"] },
    ],
  },
  {
    number: "04",
    title: "Codebase Context",
    lessons: [
      { title: "Codebase Indexing", points: ["Index entire repository", "Why this massively improves output"] },
      { title: "Ignore Files", points: ["Exclude irrelevant folders", "Keep context clean"] },
      { title: "Adding Custom Docs", points: ["Add internal documentation", "Teach the agent your system"] },
    ],
  },
  {
    number: "05",
    title: "User Rules & Project Rules",
    lessons: [
      { title: "CursorRules Explained", points: ["User rules vs project rules", "Rules are additive, not overriding"] },
      { title: "Real Rules I Use", points: ["Full walkthrough", "Exact rules used in studio.jaro.dev"] },
      { title: "Modes Policy", points: ["Max Mode for planning", "Normal Mode for execution"] },
    ],
  },
  {
    number: "06",
    title: "Cursor Modes",
    lessons: [
      { title: "Mode Overview", points: ["Agent Mode - execution", "Plan Mode - architecture", "Ask Mode - questions", "Debug Mode - fixing issues", "Practical examples for each"] },
    ],
  },
  {
    number: "07",
    title: "Token Optimization (Important)",
    lessons: [
      { title: "Context Is Expensive", points: ["Context is sent with every prompt", "Long chats = wasted tokens"] },
      { title: "Golden Rule", points: ["New task = new agent tab", "Prevents summarization", "Preserves accuracy", "Saves tokens"] },
      { title: "Models & Recommendation", points: ["Explanation of modes and models", "Recommended: Claude 4.5 Opus", "Max Mode only for planning"] },
    ],
  },
  {
    number: "08",
    title: "Planning as a First-Class Artifact",
    lessons: [
      { title: "Planning Strategy", points: ["Planning before execution", "Add plans directly to repo", "Jacob Evans-style planning", "Agents execute against plans"] },
    ],
  },
  {
    number: "09",
    title: "Staging & Checkpoints",
    lessons: [
      { title: "Clean Git History", points: ["Move to staging once stable", "Avoid messy commits"] },
      { title: "Critical Warning", points: ["Do not manually edit files agents are editing", "Do not use undo (Ctrl/Cmd + Z)"] },
      { title: "Proper Workflow", points: ["Queue commands", "Chain instructions", "Let agents finish fully"] },
    ],
  },
  {
    number: "10",
    title: "Execution Modes",
    lessons: [
      { title: "Execution Options", points: ["Run everything", "Ask every time", "Sandbox execution"] },
    ],
  },
  {
    number: "11",
    title: "Sandbox Configuration",
    lessons: [
      { title: "Sandbox Setup", points: ["Enable 'Run in Sandbox'", "Configure allowlist", "Control network access"] },
    ],
  },
  {
    number: "12",
    title: "Worktrees",
    lessons: [
      { title: "Branch Management", points: ["Multiple branches simultaneously", "Feature isolation", "Zero context switching"] },
    ],
  },
  {
    number: "13",
    title: "Keyboard Shortcuts",
    lessons: [
      { title: "Essential Shortcuts", points: ["Open chat", "Inject code / terminal", "Cursor settings", "Voice mode"] },
      { title: "Terminal: Cmd + K", points: ["Generate terminal commands", "Kill ports", "Curl requests"] },
    ],
  },
  {
    number: "14",
    title: "Prompting & Communication Mastery",
    lessons: [
      { title: "Research First", points: ["Always inspect codebase before prompting"] },
      { title: "Communication Principles", points: ["Inverse pyramid", "Purpose-driven prompts", "Conciseness", "Right level of technical detail", "Be specific only when required"] },
      { title: "Prompting as Specification", points: ["Constraints first", "Clear end goals"] },
    ],
  },
  {
    number: "15",
    title: "Agentic Test-Driven Development",
    lessons: [
      { title: "Testing Strategy", points: ["Backend-focused tests", "Unit & integration tests", "Agents write tests alongside code"] },
    ],
  },
  {
    number: "16",
    title: "MCP Servers",
    lessons: [
      { title: "MCP Overview", points: ["What MCP is", "Why it matters", "Build MCP for studio.jaro.dev"] },
    ],
  },
  {
    number: "17",
    title: "UI Feedback with Images",
    lessons: [
      { title: "Visual Iteration", points: ["Upload UI screenshots into Cursor", "Get AI feedback on UX & layout", "Iterate visually, not just in code"] },
    ],
  },
  {
    number: "18",
    title: "Commands & Automation Demos",
    lessons: [
      { title: "Automation", points: ["Cursor command deep links", "Demo: cleanup command", "Delete empty folders", "Remove unused files", "Fully automated hygiene"] },
    ],
  },
  {
    number: "19",
    title: "Complete Application Build (Bonus)",
    lessons: [
      { title: "Build from Scratch", points: ["Analytics tool", "Pixel", "Dashboard", "Landing page", "MCP server", "Full source code included"] },
    ],
  },
];

// Value stack items
const valueStack = [
  // Emotional/Outcome items
  { title: "10x Productivity Multiplier", desc: "Ship in hours what takes others weeks. Your output becomes your unfair advantage.", value: 50000, isOutcome: true },
  { title: "Career Security in the AI Economy", desc: "Never worry about being replaced. Become the engineer companies fight to keep.", value: 50000, isOutcome: true },
  { title: "First-Year Salary Increase Potential", desc: "Top AI-native engineers command $100-200K more. This is your leverage.", value: 30000, isOutcome: true },
  { title: "Side Project Freedom", desc: "Finally ship those ideas gathering dust. Build your SaaS, app, or startup in a weekend.", value: 25000, isOutcome: true },
  // Course components
  { title: "Complete Agentic Development System", desc: "The full methodology used by OpenAI engineers daily", value: 2997, isOutcome: true },
  { title: "Production-Ready Cursor Rules Library", desc: "Pre-built rules files used in enterprise environments", value: 3000, isOutcome: true },
  { title: "Lifetime Updates + All Future Content", desc: "Stay current as Cursor evolves - never fall behind again", value: 997, isOutcome: true },
];

// Prerequisites
const prerequisites = [
  "Built or contributed to production applications",
  "Mid-to-senior level engineering experience",
  "Used AI tools like ChatGPT, Claude, or Copilot",
  "Understand prompting and context basics",
];

// Products data
const products = [
  { name: "This Landing Page", desc: "You're looking at it. Built entirely with Cursor 2.0 and the techniques taught in this course.", isHighlighted: true, gif: "/previews/landing-page.gif" },
  { name: "RealGreatDevs", desc: "Platform with 2M+ software engineers", gif: "/previews/realgreatdevs.gif" },
  { name: "Studio.jaro.dev", desc: "Our internal platform at Jaro.dev, used to manage $1M/yr worth of projects", gif: "/previews/studio.gif" },
  { name: "BusinessOS", desc: "A platform to run your business on autopilot, beautiful GSAP powered landing page", gif: "/previews/businessos.gif" },
  { name: "Pivotal", desc: "Google ads automation platform for clinics", gif: "/previews/pivotal.gif" },
  { name: "Raise", desc: "Investment platform of the future, integrating with government portals", gif: "/previews/raise.gif" },
  { name: "ReviveDeadLinks", desc: "Bootstrapped SaaS profitable within 7 days", gif: "/previews/revivedeadlinks.gif" },
  { name: "Devthusiast", desc: "AI Newsletter read by thousands of software engineers", gif: "/previews/devthusiast.gif" },
  { name: "QwikLocker", desc: "Amazon Locker but for any ecommerce brand", gif: "/previews/qwiklocker.gif" },
];

// Bonuses data

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
    a: "Yes. I provide an invoice and a template email for requesting reimbursement.",
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
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

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

          {/* What You'll Learn */}
          <ParallaxSection className="mb-24 py-16 border-y border-border" yOffset={60}>
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
              This course will teach you
            </p>
            <p className="text-2xl md:text-3xl font-medium leading-relaxed max-w-4xl font-sans">
              How to orchestrate AI agents like a team of engineers-running them in parallel, enforcing quality gates, and recovering instantly when things break.
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

      {/* Risk Section - If You Don't Learn This */}
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
              The Warning
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-sans mb-6">
              If You Don&apos;t Learn This, <br />
              <span className="font-serif italic text-destructive">You Will Be Left Behind</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The AI economy is coming. Millions of jobs will be eliminated. This is not fear-mongering, it's a fact.
            </p>
            </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 border border-destructive/20 bg-background"
            >
              <h3 className="text-lg font-medium font-sans mb-3">Your Job Is At Risk</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Millions of engineering jobs will be eliminated in the AI economy. Companies are already replacing entire teams with engineers who use AI effectively.
              </p>
            </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="p-8 border border-destructive/20 bg-background"
                >
              <h3 className="text-lg font-medium font-sans mb-3">You&apos;re Being Outpaced</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                Junior developers with AI skills are shipping faster than senior engineers without them. The hierarchy is being rewritten. Your experience becomes a liability, not an asset.
                  </p>
          </motion.div>

          <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
              className="p-8 border border-destructive/20 bg-background"
                >
              <h3 className="text-lg font-medium font-sans mb-3">Wasting 80% of Your Time</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                Every hour you spend manually coding is an hour someone else is using to build 10x more. The gap widens daily. Your learning curve is their shipping speed.
                  </p>
          </motion.div>

          <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="p-8 border border-destructive/20 bg-background"
                >
              <h3 className="text-lg font-medium font-sans mb-3">Missing $200K+ Opportunities</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                Top AI-native engineers at companies like OpenAI earn $200-500K+. These roles won&apos;t exist in 2 years, everyone will be using agentic development by default.
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
            <h3 className="text-lg font-medium font-sans mb-6 text-destructive">What Happens If You Do Nothing:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Watch junior developers get promoted over you",
                "Lose your job to someone with AI skills",
                "Miss out on $100K+ salary increases",
                "Spend years doing what others do in days",
                "Become obsolete in your own field",
                "Struggle to find work in 1-2 years"
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
              Imagine What You Could Build <br />
              <span className="font-serif italic text-accent">With Superpowers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              For the first time in history, one person can build what used to require entire teams. Any idea. Any scale. In hours, not months.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 border border-accent/20 bg-accent/5"
                >
              <h3 className="text-lg font-medium font-sans mb-3">10x Your Output Immediately</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                Ship in hours what used to take weeks. Build complete applications in a single sitting. The backlog of ideas you&apos;ve been meaning to build finally gets built.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="p-8 border border-accent/20 bg-accent/5"
                >
              <h3 className="text-lg font-medium font-sans mb-3">Future-Proof Your Career</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                Become one of the engineers who thrives in the AI economy instead of being replaced by it. When layoffs come, they don&apos;t cut the person shipping 10x.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 border border-accent/20 bg-accent/5"
                >
              <h3 className="text-lg font-medium font-sans mb-3">Think It, Build It</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                Any software idea you can imagine can be reality in minutes. The highest leverage a human has ever had. You&apos;re not competing with AI - you&apos;re commanding it.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="p-8 border border-accent/20 bg-accent/5"
                >
              <h3 className="text-lg font-medium font-sans mb-3">Join the Top 1%</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                Get the exact skills that OpenAI, Google, and top startups are desperately hiring for. The exact prompts and workflows that took 40+ engineers months to refine.
                  </p>
                </motion.div>
              </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="border border-accent/30 bg-accent/5 p-8 md:p-12"
          >
            <h3 className="text-lg font-medium font-sans mb-6 text-accent">What You Get With These Skills:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Build any software idea you can imagine",
                "Command top 1% engineering salaries",
                "Ship complete products in hours, not weeks",
                "Become indispensable to any company",
                "Start and scale your own products",
                "Join the AI-native engineering elite"
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

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-xl md:text-2xl font-medium font-sans mb-8">
              The question isn&apos;t whether you can afford $999.
                  <br />
              <span className="text-muted-foreground">It&apos;s whether you can afford to be left behind.</span>
            </p>
            <a
              href="#pricing"
              className="group inline-flex items-center justify-center gap-3 px-12 py-4 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition-all"
            >
              <span>Transform Your Career</span>
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
            Why Should You Listen to Me?
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
                    <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">OpenAI</a>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Founder of{" "}
                    <a href="https://jaro.dev" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Jaro.dev</a>
                  </p>
                  </div>
                </div>

              <p className="text-muted-foreground leading-relaxed">
                I manage a team of 40+ engineers at OpenAI, the largest AI company in the world. We spend hundreds of thousands of dollars on these engineers, and this course is required viewing for all of them.
              </p>
          </motion.div>

          <motion.div
              style={{ x: aboutRightX, opacity: aboutOpacity }}
              className="md:col-span-7 md:pt-4"
            >
              <ul className="space-y-6 mb-10">
                {[
                  { content: <>Leading a team of 40+ senior software engineers at OpenAI</> },
                  { content: <>Founded <a href="https://jaro.dev" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Jaro.dev</a>, a 7-figure software agency</> },
                  { content: <>Previously at JPMorgan & Deutsche Bank (Fortune 500)</> },
                  { content: <>Top 0.1% on GitHub</> },
                  { content: <>Engineers using these techniques earn $300-500K+ per year</> },
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
                If that&apos;s not enough to convince you this is the most valuable skill you can learn in 2026, I don&apos;t know what else would be.
              </motion.p>
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
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                onMouseEnter={() => setHoveredProduct(i)}
                onMouseLeave={() => setHoveredProduct(null)}
                className={`relative p-8 group hover:bg-muted/30 transition-colors ${product.isHighlighted ? 'bg-accent/10 border-l-2 border-accent' : 'bg-background'}`}
              >
                <div className="mb-4">
                  <h3 className={`text-lg font-medium font-sans ${product.isHighlighted ? 'text-accent' : ''}`}>{product.name}</h3>
                  </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.desc}</p>
                
                {/* GIF Preview on Hover */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ 
                    opacity: hoveredProduct === i ? 1 : 0,
                    y: hoveredProduct === i ? 0 : 10,
                    scale: hoveredProduct === i ? 1 : 0.95,
                  }}
                  transition={{ 
                    duration: 0.2, 
                    ease: "easeOut",
                    delay: hoveredProduct === i ? 0.15 : 0,
                  }}
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-4 z-50 ${hoveredProduct === i ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent rounded-lg" />
                    <div className="w-80 h-48 bg-muted rounded-lg overflow-hidden border border-border shadow-2xl flex items-center justify-center">
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
                        <span className="text-muted-foreground text-sm">Preview coming soon</span>
                      )}
                    </div>
                    {/* Arrow pointing down */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-muted border-r border-b border-border rotate-45" />
                  </div>
                </motion.div>
              </motion.div>
            ))}
        </div>
        </motion.div>
      </section>

      {/* Course Curriculum Section */}
      <section ref={curriculumRef} className="py-32 px-6 border-t border-border">
            <motion.div
          style={{ y: curriculumY, opacity: curriculumOpacity }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-8">
            Course Curriculum
          </p>
          
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 font-sans">
            What You&apos;ll <span className="font-serif italic text-accent">Master</span>
          </h2>
          
          <p className="text-muted-foreground text-lg mb-16">
            19 sections. 50+ lessons. A complete system for AI-native development.
          </p>

          <div className="space-y-8">
            {courseSections.map((section, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="border-l-2 border-accent/30 pl-6"
              >
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-xs tracking-[0.2em] text-accent uppercase font-medium">
                    Section {section.number}
                    </span>
                  <span className="text-muted-foreground/30">-</span>
                  <h3 className="text-xl font-medium font-sans">{section.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {section.lessons.map((lesson, j) => (
                    <div key={j} className="pl-4">
                      <p className="text-sm font-medium text-foreground mb-2">
                        {section.number}.{j + 1} {lesson.title}
                      </p>
                      <ul className="space-y-1 pl-4">
                        {lesson.points.map((point, k) => (
                          <li 
                            key={k} 
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="w-1 h-1 bg-muted-foreground/50 mt-2 shrink-0" />
                            {point}
                          </li>
                    ))}
                  </ul>
                    </div>
                  ))}
                </div>
          </motion.div>
            ))}
        </div>
        </motion.div>
      </section>

      {/* Course Promise Section */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-6">
              Course Promise
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-sans mb-6">
              By the End of This Course, <br />
              <span className="font-serif italic text-accent">You Will Be Able To:</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              "Build entire production applications with AI agents",
              "Delegate nearly all execution to Cursor agents",
              "Parallelize development like a team - as a solo engineer",
              "Debug faster than you ever thought possible",
              "Turn any software idea into a live product",
              "Stay relevant, employable, and dominant in the AI economy",
            ].map((promise, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-6 border border-border hover:border-accent/30 transition-colors"
              >
                <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-foreground">{promise}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center text-xl font-medium font-sans"
          >
            This is <span className="text-accent">top-echelon AI engineering</span>, not prompt hacking.
          </motion.p>
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
            The Complete <span className="font-serif italic text-accent">Value Stack</span>
          </h2>

          <div className="space-y-0">
            {valueStack.map((item, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                className={`flex items-start justify-between py-6 border-b border-border ${item.isOutcome ? 'bg-accent/5 -mx-4 px-4' : ''}`}
              >
                <div className="flex items-start gap-4 flex-1 pr-8">
                  <Check className={`w-5 h-5 mt-0.5 shrink-0 ${item.isOutcome ? 'text-accent' : 'text-muted-foreground'}`} />
                  <div>
                    <h3 className={`text-lg font-medium mb-1 font-sans ${item.isOutcome ? 'text-foreground' : ''}`}>{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`font-medium ${item.isOutcome ? 'text-xl text-accent' : 'text-lg text-muted-foreground'}`}>
                    ${item.value.toLocaleString()} <span className="text-sm font-normal">value</span>
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
              <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">Total Value:</p>
              <motion.div 
                className="relative inline-block mb-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <span className="text-4xl md:text-5xl font-medium font-sans text-muted-foreground/60">$161,994</span>
                <motion.div 
                  className="absolute left-0 top-1/2 h-[3px] bg-destructive"
                  variants={{
                    hidden: { width: "0%", x: "-10%" },
                    visible: { width: "120%", x: "-10%" }
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3,
                    ease: [0.33, 1, 0.68, 1]
                  }}
                />
              </motion.div>
              <div className="w-16 h-px bg-accent/30 mx-auto mb-6" />
              <p className="text-xs tracking-[0.2em] text-accent uppercase mb-2">Your Price Today:</p>
              <motion.p 
                className="text-6xl md:text-7xl font-medium font-sans text-accent"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 200 }}
              >
                $999
              </motion.p>
              <motion.p 
                className="inline-block mt-4 px-4 py-1.5 bg-accent/20 text-accent text-sm font-medium"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                Save 99% Today
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
              Is This Course <span className="font-serif italic text-accent">For You?</span>
          </h2>
            <p className="text-lg text-muted-foreground">
              This is an advanced course. You should have:
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
            If you check all these boxes, you&apos;re ready to become a <span className="text-accent">200x developer</span>.
          </motion.p>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="py-32 px-6 border-t border-border bg-accent/5">
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
            The Question Isn&apos;t Whether You Can Afford This.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-medium text-accent mb-8 font-serif italic"
          >
            It&apos;s Whether You Can Afford Not To.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto"
          >
            By not learning this, you&apos;re missing out on hundreds of thousands of dollars in the next 12 months. This is the most valuable skill for software engineers in 2026.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="p-12 border-2 border-accent bg-background max-w-lg mx-auto"
          >
            <h3 className="text-2xl font-medium mb-6 font-sans">Join 200x Dev Now</h3>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-6xl font-medium font-sans">$999</span>
            </div>
            <p className="text-muted-foreground mb-8">One-time payment. Lifetime access. All future updates.</p>
              
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-3 w-full py-5 bg-accent text-accent-foreground text-base font-medium tracking-wide hover:bg-accent/90 transition-colors mb-4"
              >
              <span>Get Instant Access Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            
            <p className="text-sm text-muted-foreground">
              Secure checkout. Start learning in minutes.
            </p>
            </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <span>Lifetime Access</span>
            <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
            <span>All Future Updates</span>
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
