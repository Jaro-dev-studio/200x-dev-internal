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
  Rocket,
  Bot,
  Users,
  Zap,
  Lightbulb,
  Shield,
  ExternalLink,
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

// Scroll-dependent Racing Section Component
function RacingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"], // Animation completes when section is centered
  });
  
  // Lambo moves fast: 10% to finish line - completes at 60% scroll (before center)
  const lamboLeft = useTransform(scrollYProgress, [0.1, 0.6], ["10%", "calc(100% - 140px)"]);
  
  // Prius moves slowly: 10% to 40% - still going when animation ends
  const priusLeft = useTransform(scrollYProgress, [0.1, 1], ["10%", "40%"]);
  
  // Winner badge appears after lambo finishes
  const badgeOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const badgeScale = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  
  // "Still typing..." appears when prius is lagging behind
  const typingOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  
  // Text appears at the end (when centered)
  const textOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const text2Opacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative py-8"
    >
      <h3 className="text-2xl md:text-3xl font-medium font-sans mb-8 text-center">
        You&apos;re Being Outpaced
      </h3>
      
      {/* Racing lanes */}
      <div className="relative h-40 md:h-48 bg-muted/30 border-y border-border overflow-hidden">
        {/* Lane divider */}
        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-border" />
        
        {/* Lane labels */}
        <div className="absolute left-4 top-3 text-xs text-muted-foreground uppercase tracking-wider">Senior Dev (You)</div>
        <div className="absolute left-4 bottom-3 text-xs text-accent uppercase tracking-wider">Junior + AI</div>
        
        {/* Start line */}
        <div className="absolute left-16 top-0 bottom-0 w-1 bg-foreground/20" />
        <div className="absolute left-12 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground uppercase tracking-wider -rotate-90 origin-center">Start</div>
        
        {/* Finish line */}
        <div className="absolute right-8 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(0deg,transparent,transparent_8px,currentColor_8px,currentColor_16px)] opacity-30" />
        <div className="absolute right-14 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground uppercase tracking-wider -rotate-90 origin-center">Finish</div>
        
        {/* You - slow racer (top lane) - Prius */}
        <motion.div
          className="absolute top-1/4 -translate-y-1/2 flex items-center gap-3"
          style={{ left: priusLeft }}
        >
          <Image 
            src="/prius.png" 
            alt="Prius - Senior Dev" 
            width={80} 
            height={40} 
            className="h-10 w-auto object-contain"
          />
          <motion.span 
            className="hidden md:inline text-xs text-muted-foreground whitespace-nowrap bg-background/80 px-2 py-0.5 rounded"
            style={{ opacity: typingOpacity }}
          >
            Still typing...
          </motion.span>
        </motion.div>
        
        {/* Junior + AI - fast racer (bottom lane) - Lambo */}
        <motion.div
          className="absolute bottom-1/4 translate-y-1/2 flex items-center gap-2"
          style={{ left: lamboLeft }}
        >
          <Image 
            src="/lambo.png" 
            alt="Lamborghini - Junior + AI" 
            width={100} 
            height={40} 
            className="h-10 w-auto object-contain"
          />
        </motion.div>
        
        {/* Winner badge - appears when AI car finishes */}
        <motion.div
          className="absolute right-20 bottom-1/4 translate-y-1/2 flex items-center"
          style={{ opacity: badgeOpacity, scale: badgeScale }}
        >
          <div className="bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
            Done!
          </div>
        </motion.div>
        
        {/* Progress indicators - hidden on mobile for less clutter */}
        <div className="hidden md:flex absolute bottom-1 left-1/2 -translate-x-1/2 items-center gap-4 text-[10px] text-muted-foreground">
          <motion.span style={{ opacity: textOpacity }}>
            Same task. Same starting point.
          </motion.span>
          <motion.span
            className="text-accent font-medium"
            style={{ opacity: text2Opacity }}
          >
            Different results.
          </motion.span>
        </div>
      </div>
      
      <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center mt-8 text-lg">
        Junior developers with AI skills are shipping faster than senior engineers without them. The hierarchy is being rewritten. Your experience becomes a liability, not an asset.
      </p>
    </motion.div>
  );
}

// Course curriculum data - 8 modules with before/after transformation
const courseModules = [
  {
    number: "01",
    title: "The Mental Model Shift",
    before: "Treating AI like autocomplete",
    after: "Directing AI like a team of engineers",
    lessons: [
      "The Prime Directive: Make it do everything",
      "Errors are inputs, not failures",
      "When AI is actually bad (and what to do instead)",
      "Logging for AI debugging",
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
      "Agent Mode for execution",
      "Plan Mode for architecture",
      "Ask Mode for research",
      "When to use each mode",
    ],
  },
  {
    number: "04",
    title: "Context Engineering",
    before: "Hoping AI understands your codebase",
    after: "Systematically providing perfect context every time",
    lessons: [
      "Codebase indexing strategies",
      "The ignore file system",
      "Custom documentation injection",
      "Token optimization techniques",
    ],
  },
  {
    number: "05",
    title: "Parallel Execution",
    before: "One task at a time, sequential work",
    after: "Multiple agents working simultaneously",
    lessons: [
      "Agent isolation principles",
      "Non-conflicting task identification",
      "Worktree-based parallelization",
      "Managing multiple agent contexts",
    ],
  },
  {
    number: "06",
    title: "Prompting Mastery",
    before: "Vague prompts, constant iteration",
    after: "One-shot prompts that work first time",
    lessons: [
      "The inverse pyramid structure",
      "Constraints-first prompting",
      "Research before execution",
      "Prompts as specifications",
    ],
  },
  {
    number: "07",
    title: "Production Workflows",
    before: "Messy git history, manual testing",
    after: "Clean commits, automated quality gates",
    lessons: [
      "Staging and checkpoints",
      "Agentic test-driven development",
      "Sandbox configuration",
      "Keyboard shortcuts for speed",
    ],
  },
  {
    number: "08",
    title: "Complete Build Demo",
    before: "Theory without practice",
    after: "Full application built live with these techniques",
    lessons: [
      "Analytics platform from scratch",
      "Dashboard and landing page",
      "MCP server integration",
      "Full source code included",
    ],
  },
];

// Value stack items
const valueStack = [
  // Emotional/Outcome items
  { title: "10x Productivity Multiplier", desc: "Ship in hours what takes others weeks. Your output becomes your unfair advantage.", value: 50000, isOutcome: true },
  { title: "Career Security in the AI Economy", desc: "Never worry about being replaced. Become the engineer companies fight to keep.", value: 50000, isOutcome: true },
  { title: "First-Year Salary Increase Potential", desc: "Top AI-native engineers command $200-500K. This is your leverage.", value: 30000, isOutcome: true },
  { title: "Side Project Freedom", desc: "Finally ship those ideas gathering dust. Build your SaaS, app, or startup in a weekend.", value: 25000, isOutcome: true },
  // Course components
  { title: "Complete Agentic Development System", desc: "The full methodology to build anything you can imagine", value: 6997, isOutcome: true },
  { title: "Full Production SaaS Source Code", desc: "Next.js 16 Website analytics SaaS with Stripe, admin panel, and MCP server - built live on the course using Cursor alone", value: 4997, isOutcome: true },
  { title: "Production-Ready Cursor Rules Library", desc: "Pre-built rules files used in enterprise environments", value: 3000, isOutcome: true },
  { title: "Lifetime Updates + All Future Content", desc: "Stay current as Cursor evolves - never fall behind again", value: 2999, isOutcome: true },
];

// Prerequisites
const prerequisites = [
  "Built or contributed to production applications",
  "Mid-to-senior level engineering experience",
  "Familiarity with AI tools like ChatGPT, Claude, or Copilot",
  "Understanding of prompting and context",
];

// Products data
const products = [
  { name: "This Landing Page", desc: "You're looking at it. Built entirely with Cursor 2.0 and the techniques taught in this course.", isHighlighted: true, gif: "/previews/landing-page.gif", url: "#" },
  { name: "RealGreatDevs", desc: "Platform with 2M+ software engineers", gif: "/previews/realgreatdevs.gif", url: "https://realgreatdevs.com" },
  { name: "Studio.jaro.dev", desc: "Our internal platform at Jaro.dev, used to manage $1M/yr worth of projects", gif: "/previews/studio.gif", url: "https://studio.jaro.dev" },
  { name: "BusinessOS", desc: "A platform to run your business on autopilot, beautiful GSAP powered landing page", gif: "/previews/businessos.gif", url: "https://businessos.io" },
  { name: "Pivotal", desc: "Google ads automation platform for clinics", gif: "/previews/pivotal.gif", url: "https://pivotalos.com" },
  { name: "Raise", desc: "Investment platform of the future, integrating with government portals", gif: "/previews/raise.gif", url: "https://raisefinancial.co" },
  { name: "ReviveDeadLinks", desc: "Bootstrapped SaaS profitable within 7 days", gif: "/previews/revivedeadlinks.gif", url: "https://revivedeadlinks.com" },
  { name: "Devthusiast", desc: "AI Newsletter read by thousands of software engineers", gif: "/previews/devthusiast.gif", url: "https://devthusiast.com" },
  { name: "QwikLocker", desc: "Amazon Locker but for any ecommerce brand", gif: "/previews/qwiklocker.gif", url: "https://qwiklocker.com" },
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
    q: "What's your refund policy?",
    a: "All sales are final. This course contains proprietary workflows and configurations that I use professionally. They cannot be un-seen or un-learned.",
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

  // Curriculum section scroll animation
  const curriculumRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: curriculumProgress } = useScroll({
    target: curriculumRef,
    offset: ["start end", "end start"],
  });
  const curriculumY = useTransform(curriculumProgress, [0, 0.15], [80, 0]);
  const curriculumOpacity = useTransform(curriculumProgress, [0, 0.1], [0, 1]);

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
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [mousePositions, setMousePositions] = useState<Record<number, { x: number; y: number }>>({});

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

      {/* Bottom Bar CTA - Full width on mobile, floating button on desktop */}
      <motion.div
        style={{ opacity: bottomBarOpacity }}
        className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-5 md:left-auto md:right-6 z-50 p-4 md:p-0 bg-background/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-t border-border md:border-0"
      >
          <a
            href="#pricing"
          className="flex items-center justify-center gap-2 w-full md:w-auto py-3.5 md:py-3 md:px-8 bg-accent text-accent-foreground text-sm font-medium tracking-wide hover:brightness-110 transition-all md:shadow-lg md:shadow-accent/25 hover:md:shadow-xl hover:md:shadow-accent/30 hover:md:scale-105"
          >
          <span>Get Access</span>
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
              Don&apos;t be a victim of the AI Job Drought
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
              From Mid-Level Engineer to
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
            
            <div className="space-y-6">
              {[
                {
                  num: "01",
                  title: "Your AI-generated code works, but it's not production-grade",
                  desc: "You're constantly fixing, refactoring, debugging things that shouldn't have broken.",
                },
                {
                  num: "02",
                  title: "You expected 10x speed. You got maybe 1.5x.",
                  desc: "The promise of AI-assisted development feels just out of reach.",
                },
                {
                  num: "03",
                  title: "You're using AI as a helper, not as the main engineer",
                  desc: "You can see the potential, but you're not using it to its full extent.",
                },
              ].map((problem, i) => (
              <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  className="group relative"
                >
                  <div className="flex gap-6 p-6 md:p-8 border border-border bg-background hover:border-destructive/40 hover:bg-destructive/5 transition-all duration-300">
                    {/* Number */}
                    <motion.span 
                      className="text-4xl md:text-5xl font-light text-destructive/40 font-mono shrink-0"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.15, duration: 0.4, type: "spring" }}
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
              The AI economy is coming. Thousands of jobs will be eliminated. This is not fear-mongering, it&apos;s already happening. Amazon laid off 15,000 employees in 2025, Microsoft laid off 10,000
            </p>
            </motion.div>

          <div className="max-w-4xl mx-auto space-y-16 mb-16">
            
            {/* 1. YOUR JOB IS AT RISK - Termination Notice Visual */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Fake document/notice */}
              <div className="relative bg-background border-2 border-destructive/30 p-8 md:p-12 transform rotate-[-0.5deg]">
                {/* Red stamp overlay */}
                <motion.div
                  initial={{ scale: 0, rotate: -30, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: -12, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.4, type: "spring", stiffness: 200 }}
                  className="absolute top-6 right-6 md:top-8 md:right-8 border-4 border-destructive px-4 py-2 text-destructive font-bold text-sm md:text-lg uppercase tracking-wider transform"
                >
                  Terminated
            </motion.div>

                {/* Document header */}
                <div className="flex items-center gap-3 mb-6 opacity-40">
                  <div className="w-8 h-8 border border-current" />
                  <div className="h-2 w-32 bg-current rounded" />
                </div>
                
                {/* Title with strikethrough animation */}
                <h3 className="text-2xl md:text-3xl font-medium font-sans mb-4 relative inline-block">
                  Your Job Is At Risk
                <motion.div
                    className="absolute left-0 top-1/2 h-0.5 bg-destructive"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  />
                </h3>
                
                <p className="text-muted-foreground leading-relaxed max-w-2xl text-lg">
                Millions of engineering jobs will be eliminated in the AI economy. Companies are already replacing entire teams with engineers who use AI effectively.
              </p>
                
                {/* Fake signature lines */}
                <div className="mt-8 flex gap-8 opacity-20">
                  <div className="w-32 border-t border-current" />
                  <div className="w-24 border-t border-current" />
                </div>
              </div>
              
              {/* Shadow paper layers */}
              <div className="absolute inset-0 bg-muted/50 border border-border -z-10 transform translate-x-2 translate-y-2 rotate-[0.5deg]" />
              <div className="absolute inset-0 bg-muted/30 border border-border -z-20 transform translate-x-4 translate-y-4 rotate-1" />
          </motion.div>

            {/* 2. YOU'RE BEING OUTPACED - Racing Track Visual */}
            <RacingSection />

            {/* 3. WASTING 80% OF YOUR TIME - Giant Pie Chart */}
          <motion.div
              initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                {/* Giant pie chart */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-accent/20" />
                    {/* Wasted portion - 80% */}
                    <motion.circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="text-destructive"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      whileInView={{ strokeDashoffset: 283 * 0.2 }}
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
                      80%
                    </motion.span>
                    <span className="text-sm text-muted-foreground">wasted</span>
                  </div>
                </div>
                
                {/* Text content */}
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-medium font-sans mb-4">
                    Wasting 80% of Your Time
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Every hour you spend manually coding is an hour someone else is using to build 10x more. The gap widens daily.
                  </p>
                  
                  {/* Time comparison */}
                  <div className="mt-6 flex items-center justify-center md:justify-start gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-destructive rounded-full" />
                      <span className="text-muted-foreground">Manual coding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent rounded-full" />
                      <span className="text-muted-foreground">Actually shipping</span>
                    </div>
                  </div>
                </div>
              </div>
          </motion.div>

            {/* 4. MISSING $200K+ OPPORTUNITIES - Salary Counter */}
          <motion.div
              initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-muted/20 border border-border p-8 md:p-12"
            >
              <h3 className="text-2xl md:text-3xl font-medium font-sans mb-8 text-center">
                Missing $200K+ Opportunities
              </h3>
              
              {/* Salary ticker display */}
              <div className="flex justify-center mb-8">
                <div className="bg-background border-2 border-destructive/30 px-6 py-4 font-mono">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Money You&apos;re Leaving on the Table</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-destructive text-2xl">$</span>
                    <motion.span
                      className="text-4xl md:text-5xl font-bold text-destructive tabular-nums"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      {/* Animated counter effect using CSS */}
                      <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                      >
                        200,000
                      </motion.span>
                    </motion.span>
                    <motion.span
                      className="text-lg text-muted-foreground"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 }}
                    >
                      +/year
                    </motion.span>
                  </div>
                </div>
              </div>
              
              {/* Salary comparison bars */}
              <div className="max-w-xl mx-auto space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-32 shrink-0 text-right">Average Dev</span>
                  <div className="flex-1 h-6 bg-muted/50 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-muted-foreground/40"
                      initial={{ width: 0 }}
                      whileInView={{ width: "40%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-20">$120K</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-accent w-32 shrink-0 text-right font-medium">AI-Native Dev</span>
                  <div className="flex-1 h-6 bg-muted/50 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-accent"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                    />
                  </div>
                  <span className="text-sm text-accent w-20 font-medium">$300K+</span>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center mt-8 text-lg">
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

          <div className="max-w-4xl mx-auto space-y-20 mb-16">
            
            {/* 1. 10X YOUR OUTPUT - Stacking Blocks Multiplier */}
                <motion.div
              initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                {/* Stacking blocks visualization */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
                  {/* Base single block (1x) */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 border-2 border-muted-foreground/30 bg-muted/30 flex items-center justify-center"
                    initial={{ opacity: 0.3 }}
                    whileInView={{ opacity: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-xs text-muted-foreground font-mono">1x</span>
                  </motion.div>
                  
                  {/* Stacked blocks (10x) */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-12 h-12 border-2 border-accent bg-accent/20 flex items-center justify-center"
                      style={{
                        bottom: 48 + (i * 14),
                        left: `calc(50% + ${(i % 2 === 0 ? -1 : 1) * 20}px)`,
                        transform: "translateX(-50%)",
                      }}
                      initial={{ opacity: 0, y: 50, scale: 0.5 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4, type: "spring" }}
                    />
                  ))}
                  
                  {/* 10x label */}
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-2 font-bold text-2xl font-mono"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
                  >
                    10x
                  </motion.div>
                </div>
                
                {/* Text content */}
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl md:text-3xl font-medium font-sans mb-4">
                    10x Your Output Immediately
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Ship in hours what used to take weeks. Build complete applications in a single sitting. The backlog of ideas you&apos;ve been meaning to build finally gets built.
                  </p>
                  
                  {/* Before/After comparison */}
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-2 bg-muted-foreground/30 rounded" />
                      <span className="text-muted-foreground">Before</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-accent" />
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(10)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-accent rounded-sm"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.5 + i * 0.05 }}
                          />
                        ))}
                      </div>
                      <span className="text-accent font-medium">After</span>
                    </div>
                  </div>
                </div>
              </div>
                </motion.div>

            {/* 2. FUTURE-PROOF YOUR CAREER - Before/After Comparison */}
                <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <h3 className="text-2xl md:text-3xl font-medium font-sans mb-12 text-center">
                Future-Proof Your Career
              </h3>
              
              {/* Before/After comparison */}
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                
                {/* WITHOUT - Engineers getting laid off */}
                <motion.div
                  className="relative border border-destructive/30 bg-destructive/5 p-8"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-xs text-destructive uppercase tracking-wider mb-6 font-medium">Without AI Skills</div>
                  
                  {/* Engineers falling/getting cut */}
                  <div className="flex justify-center gap-4 mb-6 h-24 items-end">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="relative"
                        initial={{ opacity: 1, y: 0 }}
                        whileInView={{ 
                          opacity: i < 3 ? 0.2 : 1,
                          y: i < 3 ? 20 : 0,
                        }}
                        viewport={{ once: true }}
                        transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
                      >
                        {/* Person icon */}
                        <div className={`flex flex-col items-center ${i < 3 ? 'text-destructive/40' : 'text-muted-foreground'}`}>
                          <div className="w-6 h-6 rounded-full border-2 border-current" />
                          <div className="w-4 h-8 border-2 border-current rounded-sm mt-1" />
                        </div>
                        {/* X mark for laid off */}
                        {i < 3 && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.3 + i * 0.15, type: "spring" }}
                          >
                            <X className="w-10 h-10 text-destructive" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="text-center">
                    <motion.div
                      className="text-3xl font-bold text-destructive font-mono mb-1"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.8 }}
                    >
                      60%+
                    </motion.div>
                    <div className="text-sm text-muted-foreground">will be replaced</div>
                  </div>
                </motion.div>
                
                {/* WITH - Engineer protected and thriving */}
                <motion.div
                  className="relative border border-accent/30 bg-accent/5 p-8"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-xs text-accent uppercase tracking-wider mb-6 font-medium">With Agentic Development</div>
                  
                  {/* Protected engineer with shield */}
                  <div className="flex justify-center mb-6 h-24 items-center">
                    <motion.div
                      className="relative"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      {/* Shield background */}
                      <motion.div
                        className="absolute -inset-4 bg-accent/20 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      {/* Person icon - larger and prominent */}
                      <div className="relative flex flex-col items-center text-accent z-10">
                        <div className="w-8 h-8 rounded-full border-3 border-current bg-accent/20" />
                        <div className="w-6 h-12 border-3 border-current rounded-sm mt-1 bg-accent/10" />
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Stats */}
                  <div className="text-center">
                    <motion.div
                      className="text-3xl font-bold text-accent font-mono mb-1"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.6 }}
                    >
                      Top 1%
                    </motion.div>
                    <div className="text-sm text-muted-foreground"> are indispensable</div>
                  </div>
                </motion.div>
              </div>
              
              {/* Connecting message */}
              <motion.div
                className="text-center mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                transition={{ delay: 2 }}
                >
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  When layoffs come, they don&apos;t cut the person shipping <span className="text-accent font-medium">10x</span>. They cut everyone else.
                  </p>
              </motion.div>
                </motion.div>

            {/* 3. THINK IT, BUILD IT - Journey Timeline */}
                <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <h3 className="text-2xl md:text-3xl font-medium font-sans mb-12 text-center">
                Think It, Build It
              </h3>
              
              {/* Journey timeline */}
              <div className="relative max-w-3xl mx-auto">
                {/* Connecting line */}
                <motion.div
                  className="absolute top-8 left-0 right-0 h-0.5 bg-border"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
                <motion.div
                  className="absolute top-8 left-0 h-0.5 bg-accent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                
                {/* Timeline steps */}
                <div className="flex justify-between relative">
                  {[
                    { icon: Lightbulb, label: "Idea", time: "0 min" },
                    { icon: Bot, label: "Prompt", time: "5 min" },
                    { icon: Zap, label: "Build", time: "30 min" },
                    { icon: Rocket, label: "Ship", time: "1 hour" },
                  ].map((step, i) => (
                    <motion.div
                      key={step.label}
                      className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.3, duration: 0.5 }}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full bg-background border-2 border-accent flex items-center justify-center relative z-10"
                        whileInView={{ scale: [0.8, 1.1, 1] }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.3, duration: 0.4 }}
                      >
                        <step.icon className="w-6 h-6 text-accent" />
                      </motion.div>
                      <span className="mt-3 text-sm font-medium">{step.label}</span>
                      <span className="text-xs text-muted-foreground">{step.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center mt-12 text-lg">
                Any software idea you can imagine can be reality in minutes. The highest leverage a human has ever had. You&apos;re not competing with AI - you&apos;re commanding it.
                  </p>
                </motion.div>

            {/* 4. JOIN THE TOP 1% - Pyramid/Podium Visual */}
                <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <h3 className="text-2xl md:text-3xl font-medium font-sans mb-8 text-center">
                Join the Top 1%
              </h3>
              
              {/* Pyramid visualization */}
              <div className="relative w-full">
                {/* Pyramid layers - stacked from bottom to top */}
                <div className="flex flex-col items-center">
                  {/* Bottom layer - 99% of engineers */}
                  <motion.div
                    className="w-full h-16 bg-muted/30 border border-border flex items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-sm text-muted-foreground">99% of engineers</span>
                  </motion.div>
                  
                  {/* Second layer - Side projects */}
                  <motion.div
                    className="w-[75%] h-14 bg-muted/40 border border-border -mt-px flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-xs text-muted-foreground">Engineers with side projects</span>
                  </motion.div>
                  
                  {/* Third layer - Use AI */}
                  <motion.div
                    className="w-[50%] h-14 bg-muted/50 border border-border -mt-px flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="text-xs text-muted-foreground">Engineers that use AI</span>
                  </motion.div>
                  
                  {/* Top - Cursor Masters */}
                  <motion.div
                    className="w-[20%] min-w-[160px] h-14 bg-accent border-2 border-accent -mt-px flex items-center justify-center relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, type: "spring" }}
                  >
                    <span className="text-sm font-bold text-accent-foreground">Cursor Masters</span>
                    
                    {/* "YOU" indicator - pointing to the top */}
                    <motion.div
                      className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.4 }}
                    >
                      <motion.div
                        animate={{ x: [0, -5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5 text-accent rotate-180" />
                      </motion.div>
                      <span className="text-sm font-medium text-accent whitespace-nowrap">You, after this course</span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center mt-8 text-lg">
                Get the exact skills that OpenAI and top startups are desperately hiring for.
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
                I manage a team of 40+ engineers at OpenAI, the largest AI company in the world. We spend millions of dollars a month on world-class engineers, and this course is required viewing for all of them.
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
                  { content: <>Previously at JPMorgan Chase & Deutsche Bank</> },
                  { content: <>Top 1% by contributions on <a href="https://github.com/jarostaz" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub</a></> },
                  { content: <>Engineers using these techniques earn $200-500K+ per year</> },
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
                If that doesn&apos;t convince you this is the most valuable skill you can learn in 2026, I don&apos;t know what will.
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
            Products I Built Using <span className="font-serif italic text-accent">This System</span>
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
                }
              }
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
                    }
                  }
                }}
                onMouseEnter={() => setHoveredProduct(i)}
                onMouseLeave={() => setHoveredProduct(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const mouseX = e.clientX - rect.left;
                  const mouseY = e.clientY - rect.top;
                  
                  // Check if mouse is within inner 90% of card (5% margin on each edge)
                  const marginX = rect.width * 0.05;
                  const marginY = rect.height * 0.05;
                  const isInInnerArea = 
                    mouseX > marginX && 
                    mouseX < rect.width - marginX && 
                    mouseY > marginY && 
                    mouseY < rect.height - marginY;
                  
                  if (isInInnerArea) {
                    setHoveredProduct(i);
                    // Only update position for this specific card
                    // Full tracking when moving up, damped when moving down/left/right
                    const yOffset = mouseY - centerY;
                    const yDamping = yOffset < 0 ? 1.0 : 0.2; // No damping when moving up
                    setMousePositions(prev => ({
                      ...prev,
                      [i]: {
                        x: centerX + (mouseX - centerX) * 0.2,
                        y: centerY + yOffset * yDamping,
                      }
                    }));
                  } else {
                    setHoveredProduct(null);
                  }
                }}
                className={`relative p-8 group hover:bg-muted/30 transition-colors h-full ${product.isHighlighted ? 'bg-accent/10 border-l-2 border-accent' : 'bg-background'}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className={`text-lg font-medium font-sans ${product.isHighlighted ? 'text-accent' : ''}`}>{product.name}</h3>
                  {product.url !== "#" && (
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  )}
                  </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.desc}</p>
                
                {/* GIF Preview on Hover - follows mouse with damping */}
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
                          <span className="text-muted-foreground text-sm">Preview coming soon</span>
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
          
          <p className="text-muted-foreground text-lg mb-16 font-mono">
            8 modules designed for transformation, not just information
          </p>

          <div className="border-t border-border">
            {courseModules.map((module, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border-b border-border"
              >
                <button
                  onClick={() => setOpenModule(openModule === i ? null : i)}
                  className="w-full py-6 md:py-8 flex items-start gap-3 md:gap-8 text-left group cursor-pointer"
                >
                  {/* Number */}
                  <span className="text-xl md:text-4xl font-light text-accent/60 font-mono shrink-0 w-8 md:w-12">
                    {module.number}
                    </span>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-medium font-sans mb-2 group-hover:text-accent transition-colors">
                      {module.title}
                    </h3>
                    <div className="flex flex-col gap-3 text-sm font-mono mt-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Before</span>
                        <span className="px-3 py-1.5 bg-muted/50 border border-border rounded-sm text-muted-foreground line-through decoration-muted-foreground/30">
                          {module.before}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-accent">After</span>
                        <span className="px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-sm text-accent font-medium">
                          {module.after}
                        </span>
                      </div>
                    </div>
                </div>
                
                  {/* Toggle icon */}
                  <motion.span
                    animate={{ rotate: openModule === i ? 45 : 0 }}
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
                    height: openModule === i ? "auto" : 0,
                    opacity: openModule === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 pl-11 md:pl-20">
                    <ul className="space-y-3">
                      {module.lessons.map((lesson, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: openModule === i ? 1 : 0,
                            x: openModule === i ? 0 : -10,
                          }}
                          transition={{ delay: j * 0.05, duration: 0.3 }}
                          className="flex items-center gap-3 text-muted-foreground font-mono text-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-accent/50 shrink-0" />
                          {lesson}
                        </motion.li>
                    ))}
                  </ul>
                </div>
                </motion.div>
          </motion.div>
            ))}
        </div>
        </motion.div>
      </section>

      {/* Course Promise Section */}
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
              Course Promise
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-sans mb-6">
              By the End of This Course, <br />
              <span className="font-serif italic text-accent">You Will Be Able To:</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              { 
                icon: Rocket, 
                title: "Build entire production applications with AI agents",
                desc: "Ship complete, polished products from idea to deployment using AI as your engineering team.",
              },
              { 
                icon: Bot, 
                title: "Delegate all execution to Cursor agents",
                desc: "Stop typing code manually. Direct AI agents to handle implementation while you focus on architecture.",
              },
              { 
                icon: Users, 
                title: "Parallelize development like a team - as a solo engineer",
                desc: "Run multiple AI agents simultaneously on non-conflicting tasks. One person, team-level output.",
              },
              { 
                icon: Zap, 
                title: "Debug faster than you ever thought possible",
                desc: "Copy errors, paste to agent, get root cause analysis, fix, and prevention strategy in seconds.",
              },
              { 
                icon: Lightbulb, 
                title: "Turn any software idea into a live product",
                desc: "The highest leverage a human has ever had. Think it, describe it, ship it. In hours, not months.",
              },
              { 
                icon: Shield, 
                title: "Stay relevant, employable, and dominant in the AI economy",
                desc: "Future-proof your career. Become the engineer companies fight to keep when layoffs come.",
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
                  ease: [0.33, 1, 0.68, 1]
                }}
                className="group relative"
              >
                <div className="relative flex items-start gap-6 p-8 border border-border bg-background hover:border-accent/40 transition-all duration-300">
                  {/* Gradient background on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-linear-to-r from-accent/20 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
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
                      stiffness: 200
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
            This is <span className="text-accent">top-echelon AI engineering</span>, not prompt hacking.
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
                <span className="text-4xl md:text-5xl font-medium font-sans text-muted-foreground/60">$168,496</span>
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
            className="text-2xl md:text-4xl font-medium text-accent mb-8 font-serif italic"
          >
            It&apos;s Whether You Can Afford Not To Get It.
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
            <p className="text-muted-foreground mb-8">One-time payment. Lifetime access.</p>
              
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
