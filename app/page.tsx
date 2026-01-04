"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Zap,
  Brain,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Code2,
  Terminal,
  Sparkles,
  ArrowRight,
  Play,
  ChevronDown,
} from "lucide-react";

import type { Variants } from "framer-motion";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};


// Value Stack Items
const valueStackItems = [
  {
    title: "Complete Agentic Development System",
    value: 2997,
    description: "The full methodology used by OpenAI engineers daily",
  },
  {
    title: "Multi-Agent Orchestration Mastery",
    value: 1997,
    description: "Run multiple AI agents on the same codebase without conflicts",
  },
  {
    title: "Token Optimization Strategies",
    value: 997,
    description: "Save thousands in API costs with Claude 4.5 Opus techniques",
  },
  {
    title: "Production-Ready Cursor Rules Library",
    value: 497,
    description: "Pre-built rules files used in enterprise environments",
  },
  {
    title: "Voice-to-Code Development Module",
    value: 797,
    description: "Build features by speaking - the ultimate leverage",
  },
  {
    title: "Real-World Project Build-Along",
    value: 1497,
    description: "Complete app from idea to deployed in hours, not weeks",
  },
  {
    title: "Lifetime Updates + 2026 Cursor 2.0 Content",
    value: 997,
    description: "Stay current as Cursor evolves - never fall behind",
  },
];

const totalValue = valueStackItems.reduce((acc, item) => acc + item.value, 0);
const coursePrice = 999;

// Pain Points
const painPoints = [
  {
    icon: AlertTriangle,
    title: "Your Job Is At Risk",
    description: "Millions of engineering jobs will be eliminated in the AI economy. Companies are already replacing entire teams with engineers who use AI effectively.",
  },
  {
    icon: TrendingUp,
    title: "You're Being Outpaced",
    description: "Junior developers with AI skills are shipping faster than senior engineers without them. The hierarchy is being rewritten.",
  },
  {
    icon: Clock,
    title: "Wasting 80% of Your Time",
    description: "Every hour you spend manually coding is an hour someone else is using to build 10x more. The gap widens daily.",
  },
  {
    icon: DollarSign,
    title: "Missing Out on $100K+ Opportunities",
    description: "Top AI-native engineers at companies like OpenAI earn $300-500K+. The skill gap is the only thing between you and those roles.",
  },
];

// Gains
const gains = [
  {
    icon: Rocket,
    title: "10x Your Output Immediately",
    description: "Ship in hours what used to take weeks. Build complete applications in a single sitting.",
  },
  {
    icon: Shield,
    title: "Future-Proof Your Career",
    description: "Become one of the engineers who thrives in the AI economy instead of being replaced by it.",
  },
  {
    icon: Brain,
    title: "Think It, Build It",
    description: "Any software idea you can imagine can be reality in minutes. The highest leverage a human has ever had.",
  },
  {
    icon: Target,
    title: "Join the Top 1%",
    description: "Get the exact skills that OpenAI, Google, and top startups are desperately hiring for.",
  },
];

// Course Modules
const courseModules = [
  {
    number: "01",
    title: "Cursor 2.0 Foundations",
    topics: ["Initial Settings & Security", "Blocking External File Access", "Model Selection Strategy"],
  },
  {
    number: "02",
    title: "Multi-Agent Orchestration",
    topics: ["Running Parallel Agents", "Conflict Prevention", "Context Isolation"],
  },
  {
    number: "03",
    title: "Cursor Rules Mastery",
    topics: ["User Rules vs Project Rules", "Summative Rule Systems", "Enterprise Rule Libraries"],
  },
  {
    number: "04",
    title: "Token Optimization",
    topics: ["MaxMode for Planning Only", "Context Management", "Claude 4.5 Opus Workflows"],
  },
  {
    number: "05",
    title: "Advanced Techniques",
    topics: ["Image Feedback for UI", "Command Automation", "Keyboard Shortcuts"],
  },
  {
    number: "06",
    title: "Production Workflows",
    topics: ["Checkpoints & Staging", "Safe Reverts", "Chaining Commands"],
  },
];

// Prerequisites
const prerequisites = [
  "Familiar with Git and version control",
  "Built or contributed to production applications",
  "Mid-to-senior level engineering experience",
  "Used AI tools like ChatGPT, Claude, or Copilot",
  "Understand prompting and context basics",
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-4 py-20"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e2e_1px,transparent_1px),linear-gradient(to_bottom,#1e1e2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">2026 Cursor 2.0 Course</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                Stop Coding Like It&apos;s 2023.
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
                Start Building Like It&apos;s 2026.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              The Advanced Agentic Development Course That{" "}
              <span className="text-foreground font-semibold">OpenAI Engineers</span>{" "}
              Use to Ship 10x Faster Than Everyone Else
            </motion.p>

            {/* Social Proof Line */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Required viewing for 40+ OpenAI engineers</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Built by an OpenAI Team Lead</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <motion.a
                href="#enroll"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-500 rounded-xl font-semibold text-lg text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                <span>Enroll Now - $999</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-purple-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-xl font-semibold text-lg hover:bg-muted/50 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Watch Preview</span>
              </motion.button>
            </motion.div>

            {/* Price Anchor */}
            <motion.div variants={fadeInUp} className="pt-4">
              <p className="text-muted-foreground">
                <span className="line-through text-destructive/70">$9,779 value</span>
                {" - "}
                <span className="text-accent font-semibold">Save 89%</span>
              </p>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-sm">Scroll to discover</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Warning Section - The Reality */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-background to-destructive/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-destructive/30 bg-destructive/10 mb-6">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">The Hard Truth</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              If You Don&apos;t Learn This,
              <br />
              <span className="text-destructive">You Will Be Left Behind</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              The AI economy is coming. Millions of jobs will be eliminated.
              This is not fear-mongering - this is what I see happening at OpenAI every day.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {painPoints.map((pain, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative p-6 rounded-2xl border border-destructive/20 bg-gradient-to-br from-card to-destructive/5 hover:border-destructive/40 transition-all"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                    <pain.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{pain.title}</h3>
                  <p className="text-muted-foreground">{pain.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Negative Outcomes List */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-16 p-8 rounded-2xl border border-destructive/20 bg-card"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">What Happens If You Do Nothing:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Watch junior developers get promoted over you",
                "Lose your job to someone with AI skills",
                "Miss out on $100K+ salary increases",
                "Spend years doing what others do in days",
                "Become obsolete in your own field",
                "Struggle to find work in 2-3 years",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gains Section - The Solution */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-6">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">The Transformation</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Imagine What You Could Build
              <br />
              <span className="text-accent">With Superpowers</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              For the first time in history, one person can build what used to require entire teams.
              Any idea. Any scale. In hours, not months.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {gains.map((gain, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative p-6 rounded-2xl border border-accent/20 bg-gradient-to-br from-card to-accent/5 hover:border-accent/40 transition-all"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <gain.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{gain.title}</h3>
                  <p className="text-muted-foreground">{gain.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Positive Outcomes List */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-16 p-8 rounded-2xl border border-accent/20 bg-card"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">What You Get With These Skills:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Build any software idea you can imagine",
                "Command top 1% engineering salaries",
                "Ship complete products in hours, not weeks",
                "Become indispensable to any company",
                "Start and scale your own products",
                "Join the AI-native engineering elite",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="relative p-8 md:p-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl -z-10" />

            <motion.div variants={fadeInUp} className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Your Instructor</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold">
                Why Should You Listen to Me?
              </h2>

              <div className="space-y-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                <p>
                  I manage a team of <span className="text-foreground font-semibold">40+ engineers at OpenAI</span>,
                  the largest AI company in the world.
                </p>
                <p>
                  We spend <span className="text-foreground font-semibold">hundreds of thousands of dollars</span> on
                  these engineers, and{" "}
                  <span className="text-accent font-semibold">this course is required viewing for all of them</span>.
                </p>
                <p>
                  They use these exact techniques every single day and get paid{" "}
                  <span className="text-foreground font-semibold">$300-500K+ per year</span> each.
                </p>
              </div>

              <div className="pt-6 border-t border-border mt-8">
                <p className="text-xl font-semibold">
                  If that&apos;s not enough to convince you this is the most valuable skill you can learn in 2026,
                  <br />
                  <span className="text-muted-foreground font-normal">I don&apos;t know what else would be.</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Course Content */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Course Curriculum</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              What You&apos;ll Master
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              A complete system for AI-native development with Cursor 2.0
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courseModules.map((module, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -5 }}
                className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                      {module.number}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{module.title}</h3>
                  <ul className="space-y-2">
                    {module.topics.map((topic, topicIndex) => (
                      <li
                        key={topicIndex}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Terminal className="w-3 h-3 text-primary" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Value Stack */}
      <section id="enroll" className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-6">
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">What You Get</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              The Complete Value Stack
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {valueStackItems.map((item, index) => (
              <motion.div
                key={index}
                variants={slideInLeft}
                whileHover={{ x: 10 }}
                className="group flex items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-accent/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-muted-foreground line-through">
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Total Value */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-between p-6 rounded-xl border-2 border-dashed border-muted-foreground/30"
            >
              <span className="text-xl font-bold text-muted-foreground">Total Value:</span>
              <span className="text-2xl font-bold text-muted-foreground line-through">
                ${totalValue.toLocaleString()}
              </span>
            </motion.div>

            {/* Your Price */}
            <motion.div
              variants={scaleIn}
              className="relative p-8 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-accent/20 border-2 border-primary"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 blur-xl" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Your Price Today:</h3>
                  <p className="text-muted-foreground">One-time payment. Lifetime access. All future updates.</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-foreground">
                    ${coursePrice}
                  </div>
                  <p className="text-accent font-semibold mt-2">Save 89% Today</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeInUp} className="pt-8 text-center">
              <motion.a
                href="#checkout"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-xl font-bold text-xl text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                <span>Get Instant Access Now</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-purple-500 to-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
              </motion.a>
              <p className="mt-4 text-sm text-muted-foreground">
                Secure checkout. Start learning in minutes.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Is This Course For You?</h2>
              <p className="text-muted-foreground">
                This is an advanced course. You should have:
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="grid gap-4 p-8 rounded-2xl border border-border bg-card"
            >
              {prerequisites.map((prereq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{prereq}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-center mt-8 text-muted-foreground"
            >
              If you check all these boxes, you&apos;re ready to become a 200x developer.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 via-purple-500/20 to-accent/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl lg:text-6xl font-bold"
            >
              The Question Isn&apos;t Whether You Can Afford This.
              <br />
              <span className="text-primary">It&apos;s Whether You Can Afford Not To.</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              By not learning this, you&apos;re missing out on hundreds of thousands of dollars
              in the next 12 months. This is the most valuable skill for software engineers in 2026.
            </motion.p>

            <motion.div variants={fadeInUp} className="pt-4">
              <motion.a
                href="#checkout"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-2xl font-bold text-2xl text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-shadow"
              >
                <span>Join 200x Dev Now</span>
                <Rocket className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-accent blur-2xl opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
              </motion.a>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground"
            >
              One-time payment of <span className="text-foreground font-semibold">$999</span>.
              Lifetime access. All future updates included.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">200x Dev</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2026 Agentic Development: Cursor Mastery | Advanced Cursor Course
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Copyright 2026. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
