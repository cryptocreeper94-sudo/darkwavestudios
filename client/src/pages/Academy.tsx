import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import {
  GraduationCap,
  Code2,
  Globe,
  Shield,
  Cpu,
  Smartphone,
  Layers,
  BookOpen,
  Award,
  Users,
  MessageSquare,
  Trophy,
  Zap,
  Terminal,
  Brain,
  Lock,
  Rocket,
  Star,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Clock,
  BarChart3,
  Blocks,
  FileCode2,
  Sparkles,
  Target,
  BadgeCheck,
  Languages
} from "lucide-react";

const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const staggerItem = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const learningPaths = [
  {
    id: "lume",
    title: "Lume Programming",
    description: "Master the AI-native programming language from syntax basics to self-sustaining runtime architecture.",
    icon: Terminal,
    color: "from-cyan-500 to-teal-500",
    courses: 8,
    hours: 40,
    level: "All Levels"
  },
  {
    id: "web-dev",
    title: "Web Development",
    description: "Full-stack web development with React, Node.js, and the DarkWave ecosystem toolchain.",
    icon: Globe,
    color: "from-blue-500 to-indigo-500",
    courses: 12,
    hours: 60,
    level: "All Levels"
  },
  {
    id: "blockchain",
    title: "Blockchain & Trust Layer",
    description: "Build on the DWSC chain — smart contracts, DeFi protocols, and Trust Layer architecture.",
    icon: Blocks,
    color: "from-sky-500 to-blue-500",
    courses: 10,
    hours: 50,
    level: "Intermediate"
  },
  {
    id: "ai",
    title: "AI Integration",
    description: "Integrate GPT, vision models, voice synthesis, and autonomous agents into production apps.",
    icon: Brain,
    color: "from-teal-500 to-cyan-500",
    courses: 9,
    hours: 45,
    level: "Intermediate"
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description: "Cross-platform mobile apps with React Native, Expo SDK 54, and PWA deployment.",
    icon: Smartphone,
    color: "from-sky-500 to-blue-500",
    courses: 7,
    hours: 35,
    level: "Intermediate"
  },
  {
    id: "security",
    title: "Security & Guardian AI",
    description: "AI agent certification, security scanning, and the Guardian Certification Program.",
    icon: Shield,
    color: "from-emerald-500 to-teal-500",
    courses: 6,
    hours: 30,
    level: "Advanced"
  },
  {
    id: "natural-language",
    title: "Natural Language Programming",
    description: "Write code in plain English or any human language. Master intent resolution, voice-to-code, and multilingual compilation.",
    icon: Languages,
    color: "from-violet-500 to-cyan-500",
    courses: 8,
    hours: 36,
    level: "All Levels"
  }
];

const featuredCourses = [
  {
    id: "lume-fundamentals",
    title: "Lume Fundamentals",
    description: "Learn the basics of Lume — variables, types, functions, and your first AI-native program.",
    level: "Beginner",
    duration: "6 hours",
    lessons: 24,
    path: "Lume Programming",
    icon: FileCode2
  },
  {
    id: "self-sustaining-apps",
    title: "Building Self-Sustaining Apps",
    description: "Harness the 4-layer runtime to create apps that monitor, heal, optimize, and evolve themselves.",
    level: "Advanced",
    duration: "8 hours",
    lessons: 32,
    path: "Lume Programming",
    icon: Cpu
  },
  {
    id: "trust-layer-sso",
    title: "Trust Layer SSO Integration",
    description: "Implement cross-app single sign-on using the Trust Layer identity protocol and TLID.",
    level: "Intermediate",
    duration: "4 hours",
    lessons: 16,
    path: "Blockchain & Trust Layer",
    icon: Lock
  },
  {
    id: "ai-agent-dev",
    title: "AI Agent Development",
    description: "Build autonomous AI agents with GPT-5.2, voice synthesis, and real-time decision making.",
    level: "Advanced",
    duration: "10 hours",
    lessons: 40,
    path: "AI Integration",
    icon: Brain
  },
  {
    id: "guardian-certification",
    title: "Guardian AI Certification",
    description: "Prepare for and earn the Guardian AI certification — scan, certify, and protect AI agents.",
    level: "Advanced",
    duration: "6 hours",
    lessons: 24,
    path: "Security & Guardian AI",
    icon: BadgeCheck
  },
  {
    id: "widget-dev",
    title: "Widget Development for Trust Hub",
    description: "Create embeddable Trust Layer widgets — from design to deployment on the Widget Marketplace.",
    level: "Intermediate",
    duration: "5 hours",
    lessons: 20,
    path: "Web Development",
    icon: Layers
  },
  {
    id: "english-mode",
    title: "English Mode Programming",
    description: "Write full programs in plain English sentences. Learn pattern matching, intent resolution, and voice-to-code workflows.",
    level: "Beginner",
    duration: "7 hours",
    lessons: 28,
    path: "Natural Language Programming",
    icon: Languages
  }
];

const lumeCurriculum = [
  {
    tier: "Beginner",
    color: "from-cyan-500 to-sky-500",
    topics: ["Syntax & Keywords", "Types & Variables", "Functions & Closures", "Control Flow", "Module System", "Standard Library Basics"],
    description: "Start from zero. Learn Lume syntax, types, functions, and write your first AI-native programs."
  },
  {
    tier: "Intermediate",
    color: "from-teal-500 to-cyan-500",
    topics: ["ask / think / generate Keywords", "Module & Package System", "Standard Library Deep Dive", "Error Handling Patterns", "Testing with lume test", "Interop with JavaScript"],
    description: "Master the AI keywords, build reusable modules, and integrate Lume with existing JS ecosystems."
  },
  {
    tier: "Advanced",
    color: "from-emerald-500 to-teal-500",
    topics: ["Self-Sustaining Runtime", "Performance Optimization", "Self-Evolving Behaviors", "Compiler Internals", "Custom Toolchain Extensions", "Production Deployment"],
    description: "Unlock the full power of the 4-layer runtime — build apps that evolve and optimize autonomously."
  }
];

const ecosystemSkills = [
  { skill: "Trust Layer SSO", apps: ["Trust Hub", "TrustVault", "GarageBot", "Chronicles", "TrustHome"], icon: Lock },
  { skill: "Signal Chat Integration", apps: ["All Ecosystem Apps", "Custom Widgets", "Community Bots"], icon: MessageSquare },
  { skill: "Blockchain Hallmarks", apps: ["Trust Layer", "Guardian Shield", "DarkWave Studio", "TrustGen"], icon: Blocks },
  { skill: "Widget Development", apps: ["Trust Layer Hub", "PaintPros", "TradeWorks AI", "GarageBot"], icon: Layers },
  { skill: "AI Agent Building", apps: ["Guardian Scanner", "StrikeAgent", "Pulse", "TrustVault"], icon: Brain },
  { skill: "Lume Programming", apps: ["Lume Runtime", "TrustGen", "Bomber", "DarkWave Studio", "Academy"], icon: Terminal }
];

const certifications = [
  {
    title: "Lume Developer",
    description: "Certified proficiency in the Lume programming language and self-sustaining runtime.",
    icon: Terminal,
    tier: "Silver",
    color: "from-slate-300 to-slate-400"
  },
  {
    title: "Trust Layer Architect",
    description: "Advanced certification in blockchain architecture, DeFi protocols, and ecosystem integration.",
    icon: Blocks,
    tier: "Gold",
    color: "from-sky-400 to-cyan-500"
  },
  {
    title: "Guardian AI Specialist",
    description: "Elite certification for AI agent security, scanning, and the Guardian Certification Program.",
    icon: Shield,
    tier: "Platinum",
    color: "from-cyan-400 to-teal-500"
  },
  {
    title: "Full-Stack Ecosystem",
    description: "Master certification covering all tracks — the highest achievement in DarkWave Academy.",
    icon: Trophy,
    tier: "Diamond",
    color: "from-blue-400 to-cyan-500"
  },
  {
    title: "Natural Language Developer",
    description: "Certified in English Mode, multilingual compilation, voice-to-code, and intent resolution across all human languages.",
    icon: Languages,
    tier: "CNLD",
    color: "from-violet-400 to-cyan-500"
  }
];

const stats = [
  { label: "Courses", value: "60+", icon: BookOpen },
  { label: "Learning Hours", value: "296+", icon: Clock },
  { label: "Certification Tracks", value: "5", icon: Award },
  { label: "Ecosystem Apps Covered", value: "35+", icon: Rocket }
];

function getLevelColor(level: string) {
  switch (level) {
    case "Beginner": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "Intermediate": return "text-sky-400 bg-sky-500/10 border-sky-500/20";
    case "Advanced": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    default: return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
  }
}

export default function Academy() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#06060a] text-white overflow-x-hidden">
      <SEOHead
        title="DarkWave Academy"
        description="The Learning & Building Nexus of the Trust Layer ecosystem. Master Lume programming, blockchain development, AI integration, and earn verified certifications."
        keywords="DarkWave Academy, Lume programming, blockchain courses, AI development, Trust Layer certification, coding bootcamp"
        url="https://darkwavestudios.com/academy"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://darkwavestudios.com" },
        { name: "Academy", url: "https://darkwavestudios.com/academy" }
      ]} />

      <header className="sticky top-0 z-50 bg-[#06060a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-cyan-400 transition-colors" data-testid="link-home">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "Inter, sans-serif" }}>Academy</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/lume"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white"
              data-testid="link-lume"
            >
              <Terminal className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Lume</span>
            </Link>
            <a
              href="https://academy.tlid.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              data-testid="link-academy-ext"
            >
              <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Visit</span>
            </a>
          </div>
        </div>
      </header>

      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center px-4 pt-12 sm:pt-20 pb-16 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
            animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)" }}
            animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-[350px] h-[350px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)" }}
            animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8" data-testid="badge-academy">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300/80 font-medium">academy.tlid.io</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            data-testid="text-hero-title"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              DarkWave
            </span>
            <br />
            <span className="text-white">Academy</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-cyan-200/60 font-light mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            data-testid="text-hero-tagline"
          >
            The Learning & Building Nexus
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-white/40 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            data-testid="text-hero-description"
          >
            Master Lume programming, blockchain architecture, AI integration, and full-stack development.
            Earn Trust Layer verified certifications with blockchain-hallmarked completion badges.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="https://academy.tlid.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold hover:from-cyan-400 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-cyan-500/20"
              data-testid="button-visit-academy"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Academy
            </a>
            <a
              href="#courses"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              data-testid="button-browse-courses"
            >
              <BookOpen className="w-4 h-4" />
              Browse Courses
            </a>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-20" data-testid="section-learning-paths">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-paths-title">
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Learning Paths</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Choose your track and progress from fundamentals to mastery. Each path is designed to unlock real capabilities across the ecosystem.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {learningPaths.map((path) => (
              <motion.div key={path.id} variants={staggerItem}>
                <GlassCard
                  glow
                  className="p-6 h-full cursor-pointer"
                  onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                  data-testid={`card-path-${path.id}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4`}>
                    <path.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" data-testid={`text-path-title-${path.id}`}>{path.title}</h3>
                  <p className="text-white/40 text-sm mb-4">{path.description}</p>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> {path.courses} courses
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {path.hours}h
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getLevelColor(path.level)}`}>
                      {path.level}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="courses" className="relative px-4 py-20" data-testid="section-featured-courses">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-courses-title">
              <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">Featured Courses</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Hands-on, project-based courses designed by ecosystem builders. Learn by building real features for real apps.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {featuredCourses.map((course) => (
              <motion.div key={course.id} variants={staggerItem}>
                <GlassCard className="p-6 h-full" data-testid={`card-course-${course.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <course.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-2" data-testid={`text-course-title-${course.id}`}>{course.title}</h3>
                  <p className="text-white/40 text-sm mb-4 leading-relaxed">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-white/30 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> {course.lessons} lessons
                    </span>
                  </div>
                  <div className="text-[10px] text-cyan-400/60 font-medium uppercase tracking-wider">
                    {course.path}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-20" data-testid="section-lume-curriculum">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">Ecosystem Language</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-lume-title">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Lume Learning Path</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Lume is the native programming language of the DarkWave ecosystem. This dedicated curriculum takes you from first line to production deployment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {lumeCurriculum.map((tier, index) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <GlassCard glow className="p-6 h-full" data-testid={`card-lume-tier-${tier.tier.toLowerCase()}`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${tier.color} mb-4`}>
                    <span className="text-sm font-bold text-black">{tier.tier}</span>
                  </div>
                  <p className="text-white/50 text-sm mb-6">{tier.description}</p>
                  <ul className="space-y-3">
                    {tier.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-3 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="font-mono text-cyan-400">219</span>
                <span className="text-white/40">tests</span>
              </div>
              <div className="w-px h-4 bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="font-mono text-teal-400">12,215</span>
                <span className="text-white/40">LOC</span>
              </div>
              <div className="w-px h-4 bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="font-mono text-sky-400">90%</span>
                <span className="text-white/40">less code</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-20" data-testid="section-ecosystem-skills">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-skills-title">
              <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Ecosystem Skills</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Every course unlocks real capabilities across the ecosystem. See which skills power which apps.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {ecosystemSkills.map((skill) => (
              <motion.div key={skill.skill} variants={staggerItem}>
                <GlassCard className="p-5 h-full" data-testid={`card-skill-${skill.skill.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <skill.icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h3 className="text-sm font-semibold">{skill.skill}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.apps.map((app) => (
                      <span
                        key={app}
                        className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/50 font-medium"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-20" data-testid="section-certifications">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-certs-title">
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Certification & Badges</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Earn Trust Layer verified certifications with blockchain-hallmarked completion badges. Every credential is permanently recorded on-chain.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {certifications.map((cert) => (
              <motion.div key={cert.title} variants={staggerItem}>
                <GlassCard glow className="p-6 text-center h-full" data-testid={`card-cert-${cert.tier.toLowerCase()}`}>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <cert.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${cert.color} mb-3`}>
                    <span className="text-[10px] font-bold text-black uppercase tracking-wider">{cert.tier}</span>
                  </div>
                  <h3 className="text-sm font-semibold mb-2" data-testid={`text-cert-title-${cert.tier.toLowerCase()}`}>{cert.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{cert.description}</p>
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-cyan-400/60">
                    <Blocks className="w-3 h-3" />
                    <span>Blockchain Verified</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-20" data-testid="section-community">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-community-title">
              <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">Community</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Learning is better together. Join study groups, connect with mentors, and get real-time help in the #academy-support channel.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <GlassCard className="p-6 h-full" data-testid="card-community-signal">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Signal Chat</h3>
                <p className="text-white/40 text-sm mb-3">
                  Real-time support in the <span className="text-cyan-400 font-mono text-xs">#academy-support</span> channel. Ask questions, share progress, get instant feedback from mentors and peers.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <Users className="w-3.5 h-3.5" />
                  <span>Active community</span>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6 h-full" data-testid="card-community-groups">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Study Groups</h3>
                <p className="text-white/40 text-sm mb-3">
                  Join cohort-based study groups organized by learning path. Weekly meetups, pair programming sessions, and collaborative projects.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cohort-based learning</span>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6 h-full" data-testid="card-community-mentors">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-sky-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mentorship</h3>
                <p className="text-white/40 text-sm mb-3">
                  Connect with experienced ecosystem developers for 1-on-1 guidance. Code reviews, career advice, and project mentoring.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <Target className="w-3.5 h-3.5" />
                  <span>1-on-1 mentoring</span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16" data-testid="section-stats">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={staggerItem}>
                <GlassCard className="p-5 text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-20" data-testid="section-cta">
        <div className="max-w-4xl mx-auto">
          <GlassCard glow className="p-6 sm:p-10 md:p-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GraduationCap className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-cta-title">
                Start Your{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Learning Journey
                </span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto mb-8">
                Join DarkWave Academy and gain the skills to build, deploy, and scale across the entire Trust Layer ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://academy.tlid.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold hover:from-cyan-400 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-cyan-500/20"
                  data-testid="button-cta-enroll"
                >
                  <Rocket className="w-4 h-4" />
                  Enroll Now
                </a>
                <Link
                  href="/lume"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  data-testid="button-cta-lume"
                >
                  <Terminal className="w-4 h-4" />
                  Explore Lume
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/30">
                <a href="https://academy.tlid.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-cyan-400 transition-colors" data-testid="link-cta-academy">
                  <ExternalLink className="w-3 h-3" /> academy.tlid.io
                </a>
                <Link href="/explore" className="flex items-center gap-1 hover:text-cyan-400 transition-colors" data-testid="link-cta-explore">
                  <ArrowRight className="w-3 h-3" /> Browse Ecosystem
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
