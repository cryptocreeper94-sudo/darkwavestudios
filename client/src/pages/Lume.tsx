import { Link } from "wouter";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import {
  Code2,
  Terminal,
  Cpu,
  Shield,
  Zap,
  Layers,
  Globe,
  ArrowRight,
  ExternalLink,
  Play,
  FileCode,
  CheckCircle2,
  Activity,
  Brain,
  Sparkles,
  Eye,
  Wrench,
  TestTube,
  GitBranch,
  BookOpen,
  Gamepad2,
  Lock,
  Coins,
  MessageSquare,
  ChevronRight,
  RefreshCw,
  Search,
  Palette,
  Bug,
  Timer,
  Cog,
  Boxes,
  Award,
  Mic,
  Languages,
  Monitor,
  RotateCcw,
  Rocket,
  CircleDot,
  Clock
} from "lucide-react";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const lumeCode = `fn analyze_sentiment(text) {
  let result = ask("Analyze sentiment: {text}")
  let score = think("Rate 1-10: {result}")
  return { sentiment: result, score }
}`;

const pythonCode = `import openai
import json

def analyze_sentiment(text):
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Analyze sentiment"},
            {"role": "user", "content": f"Analyze: {text}"}
        ]
    )
    result = response.choices[0].message.content
    response2 = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": f"Rate 1-10: {result}"}
        ]
    )
    score = response2.choices[0].message.content
    return {"sentiment": result, "score": score}`;

const pipelineSteps = [
  { label: ".lume source", icon: FileCode, desc: "Your Lume source code" },
  { label: "Lexer", icon: Search, desc: "Tokenizes source into lexemes" },
  { label: "Token Stream", icon: Activity, desc: "Structured token sequence" },
  { label: "Parser", icon: Layers, desc: "Builds syntax tree from tokens" },
  { label: "AST", icon: GitBranch, desc: "Abstract Syntax Tree representation" },
  { label: "Transpiler", icon: Cog, desc: "Generates target output code" },
  { label: ".js", icon: Code2, desc: "Executable JavaScript output" },
];

const runtimeLayers = [
  { name: "Self-Monitoring", icon: Eye, color: "from-cyan-400 to-cyan-600", desc: "Continuously tracks performance metrics, memory usage, and execution patterns in real-time" },
  { name: "Self-Healing", icon: RefreshCw, color: "from-teal-400 to-teal-600", desc: "Detects runtime failures and automatically applies recovery strategies without manual intervention" },
  { name: "Self-Optimizing", icon: Zap, color: "from-sky-400 to-sky-600", desc: "Profiles hot paths and dynamically restructures code execution for optimal throughput" },
  { name: "Self-Evolving", icon: Brain, color: "from-blue-400 to-blue-600", desc: "Learns from past executions to improve future performance and adapt behavior patterns" },
];

const toolchainCommands = [
  { cmd: "run", icon: Play, desc: "Execute Lume programs with the self-sustaining runtime" },
  { cmd: "build", icon: Boxes, desc: "Compile and bundle Lume source to optimized JavaScript" },
  { cmd: "test", icon: TestTube, desc: "Run the full test suite with coverage reporting" },
  { cmd: "fmt", icon: Palette, desc: "Auto-format source code to canonical Lume style" },
  { cmd: "lint", icon: Bug, desc: "Static analysis for errors, warnings, and best practices" },
  { cmd: "repl", icon: Terminal, desc: "Interactive REPL with multi-line support and history" },
  { cmd: "watch", icon: Eye, desc: "Hot-reload on file changes with instant feedback" },
  { cmd: "ast", icon: GitBranch, desc: "Visualize the Abstract Syntax Tree of any program" },
  { cmd: "tokens", icon: Search, desc: "Display the token stream from the lexer stage" },
];

const milestones = [
  { name: "M1: Lexer", tests: 28, total: 28 },
  { name: "M2: Parser", tests: 41, total: 41 },
  { name: "M3: Transpiler", tests: 38, total: 38 },
  { name: "M4: Runtime", tests: 44, total: 44 },
  { name: "M5: Toolchain", tests: 35, total: 35 },
  { name: "M6: Self-Sustaining", tests: 33, total: 33 },
];

const ecosystemIntegrations = [
  { name: "Trust Layer SSO", icon: Lock, desc: "Single sign-on authentication across the entire Trust Layer ecosystem" },
  { name: "Signal Chat", icon: MessageSquare, desc: "Real-time developer community chat with #lume-dev channel" },
  { name: "Blockchain Hallmarks", icon: Award, desc: "Immutable provenance records for Lume packages and deployments" },
  { name: "Signal Rewards", icon: Coins, desc: "Earn SIG tokens for contributions to the Lume ecosystem" },
];

const connectedApps = [
  { name: "TrustGen", desc: "AI-powered 3D creation studio with Lume scripting support", url: "https://trustgen.tlid.io" },
  { name: "Bomber", desc: "Arcade game built with Lume's self-sustaining runtime", url: "https://bomber.tlid.io" },
  { name: "DarkWave Studio", desc: "Browser IDE with Lume syntax highlighting and compilation", url: "https://studio.tlid.io" },
  { name: "Trust Hub", desc: "Lume-powered widgets and embeddable components", url: "https://trusthub.tlid.io" },
  { name: "DarkWave Academy", desc: "Complete Lume learning curriculum from beginner to expert", url: "https://academy.tlid.io" },
];

const nlRoadmap = [
  {
    id: "M7",
    name: "English Mode",
    status: "active" as const,
    icon: MessageSquare,
    desc: "Plain English as compiler input. Intent Resolver converts sentences into Lume AST nodes. Pattern library with 50+ common phrases plus AI-powered resolution for complex inputs.",
    capabilities: ["Pattern matching (Layer A)", "AI resolution (Layer B)", "Context Engine", "Pronoun resolution"],
  },
  {
    id: "M8",
    name: "Multilingual Mode",
    status: "planned" as const,
    icon: Languages,
    desc: "Accept input in any human language. Auto-detect language per line. Same AST and JavaScript output regardless of input language. Mixed-language files supported.",
    capabilities: ["10 languages supported", "Auto language detection", "Mixed-language files", "Localized errors"],
  },
  {
    id: "M9",
    name: "Voice-to-Code",
    status: "planned" as const,
    icon: Mic,
    desc: "Spoken language as compiler input. Speech transcription feeds directly into the Intent Resolver. Browser microphone and CLI support.",
    capabilities: ["Browser Speech API", "CLI lume listen", "Verbal structure cues", "Pause detection"],
  },
  {
    id: "M10",
    name: "Visual Context Awareness",
    status: "planned" as const,
    icon: Monitor,
    desc: "Compiler understands visual layout and UI state. Resolve spatial references like 'put the form in the center' or 'add a sidebar on the left.'",
    capabilities: ["UI Element Registry", "Spatial resolution", "Style modification", "Component generation"],
  },
  {
    id: "M11",
    name: "Reverse Mode",
    status: "planned" as const,
    icon: RotateCcw,
    desc: "Flip the pipeline — take existing code and explain it in plain language. Any JavaScript, TypeScript, or Lume file translated to natural language.",
    capabilities: ["Line-by-line annotation", "Summary explanation", "Multilingual output", "Code review assist"],
  },
  {
    id: "M12",
    name: "Collaborative Intent",
    status: "planned" as const,
    icon: Brain,
    desc: "Multiple developers describe a system in natural language simultaneously. The compiler merges intents, detects conflicts, and generates a unified codebase.",
    capabilities: ["Multi-user sessions", "Intent merging", "Conflict detection", "Unified output"],
  },
  {
    id: "M13",
    name: "Autonomous Agent Mode",
    status: "planned" as const,
    icon: Rocket,
    desc: "Lume programs that write themselves. Given a high-level goal, the compiler generates, tests, deploys, and maintains an entire application autonomously.",
    capabilities: ["Goal decomposition", "Self-testing", "Auto-deployment", "Continuous maintenance"],
  },
];

const stats = [
  { label: "Lines of Code", value: "12,215" },
  { label: "Files", value: "41" },
  { label: "Tests", value: "219" },
  { label: "Milestones", value: "6" },
  { label: "Version", value: "v0.6.0" },
];

export default function Lume() {
  return (
    <div className="min-h-screen bg-[#06060a] text-white overflow-x-hidden">
      <SEOHead
        title="Lume - The AI-Native Programming Language"
        description="The first programming language where AI is a syntax primitive. Write ask, think, and generate as keywords. Self-sustaining runtime with 219 passing tests. Built by DarkWave Studios."
        keywords="Lume, programming language, AI-native, self-sustaining runtime, DarkWave Studios, transpiler, AST"
        url="https://darkwavestudios.io/lume"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Ecosystem", url: "https://darkwavestudios.io/ecosystem" },
          { name: "Lume", url: "https://darkwavestudios.io/lume" },
        ]}
      />

      <div className="fixed inset-0 bg-[#06060a] -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.06),transparent_50%)] -z-10" />

      <motion.div
        className="fixed top-20 left-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px] -z-10"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-20 right-10 w-96 h-96 rounded-full bg-teal-500/8 blur-[120px] -z-10"
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sky-500/5 blur-[150px] -z-10"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="sticky top-0 z-50 bg-[#06060a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-cyan-400 transition-colors" data-testid="link-home">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "Inter, sans-serif" }}>Lume</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold">v0.6.0</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://lume-lang.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white"
              data-testid="link-lume-lang"
            >
              <Globe className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Website</span>
            </a>
            <a
              href="https://github.com/darkwavestudios/lume"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              data-testid="link-github"
            >
              <Code2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative py-20 lg:py-32 overflow-hidden" data-testid="section-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6" data-testid="badge-ecosystem">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                DarkWave Ecosystem — Developer Tools
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-hero">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
                  The AI-Native
                </span>
                <br />
                <span className="text-white">Programming Language</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed px-2" data-testid="text-hero-tagline">
                The first language where artificial intelligence is a <span className="text-cyan-400 font-semibold">syntax primitive</span> — not a library import.
                Write <code className="bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-cyan-300 text-sm sm:text-base" style={{ fontFamily: "JetBrains Mono, monospace" }}>ask</code>,{" "}
                <code className="bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-teal-300 text-sm sm:text-base" style={{ fontFamily: "JetBrains Mono, monospace" }}>think</code>, and{" "}
                <code className="bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-sky-300 text-sm sm:text-base" style={{ fontFamily: "JetBrains Mono, monospace" }}>generate</code>{" "}
                as keywords the same way you write <code className="bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-gray-300 text-sm sm:text-base" style={{ fontFamily: "JetBrains Mono, monospace" }}>if</code> or{" "}
                <code className="bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-gray-300 text-sm sm:text-base" style={{ fontFamily: "JetBrains Mono, monospace" }}>for</code>.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/lume/playground"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25"
                  data-testid="cta-playground"
                >
                  <Terminal className="w-5 h-5" /> Open Playground
                </Link>
                <a
                  href="https://lume-lang.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-colors"
                  data-testid="cta-visit-lume"
                >
                  Visit lume-lang.org <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/darkwavestudios/lume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-colors"
                  data-testid="cta-github"
                >
                  <Code2 className="w-5 h-5" /> View on GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI as Syntax */}
        <section className="py-16 lg:py-24" data-testid="section-ai-syntax">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-ai-syntax">
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">AI as Syntax</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                90% less code than Python for equivalent AI operations. No SDKs, no API wrappers — just language keywords.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard glow className="p-6 rounded-2xl h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-cyan-400">Lume — 5 lines</span>
                  </div>
                  <pre className="text-sm leading-relaxed overflow-x-auto" style={{ fontFamily: "JetBrains Mono, monospace" }} data-testid="code-lume">
                    <code className="text-gray-300">{lumeCode}</code>
                  </pre>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="p-6 rounded-2xl h-full opacity-60">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                      <Code2 className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-500">Python — 18 lines</span>
                  </div>
                  <pre className="text-xs leading-relaxed overflow-x-auto" style={{ fontFamily: "JetBrains Mono, monospace" }} data-testid="code-python">
                    <code className="text-gray-500">{pythonCode}</code>
                  </pre>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Language Pipeline */}
        <section className="py-16 lg:py-24" data-testid="section-pipeline">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-pipeline">
                <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">Language Pipeline</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                From source to execution — every stage of Lume's compilation pipeline.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {pipelineSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative"
                >
                  <GlassCard glow className="p-3 sm:p-4 rounded-xl text-center h-full" data-testid={`pipeline-step-${i}`}>
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mx-auto mb-1.5 sm:mb-2" />
                    <div className="text-xs sm:text-sm font-semibold text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>{step.label}</div>
                    <div className="text-[10px] sm:text-[11px] text-gray-500 mt-1 hidden sm:block">{step.desc}</div>
                  </GlassCard>
                  {i < pipelineSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                      <ArrowRight className="w-4 h-4 text-cyan-500/50" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Self-Sustaining Runtime */}
        <section className="py-16 lg:py-24" data-testid="section-runtime">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-runtime">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">Self-Sustaining Runtime</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Lume programs are alive — they monitor, heal, optimize, and evolve themselves automatically.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {runtimeLayers.map((layer, i) => (
                <motion.div key={layer.name} variants={staggerItem}>
                  <GlassCard glow className="p-6 rounded-2xl h-full" data-testid={`runtime-layer-${i}`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center mb-4`}>
                      <layer.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "Inter, sans-serif" }}>{layer.name}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{layer.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Toolchain */}
        <section className="py-16 lg:py-24" data-testid="section-toolchain">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-toolchain">
                <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Toolchain</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                9 built-in commands for a complete development workflow.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {toolchainCommands.map((tool) => (
                <motion.div key={tool.cmd} variants={staggerItem}>
                  <GlassCard className="p-5 rounded-xl group hover:border-cyan-500/30 transition-all" data-testid={`tool-${tool.cmd}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                        <tool.icon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <code className="text-base font-semibold text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        lume {tool.cmd}
                      </code>
                    </div>
                    <p className="text-sm text-gray-400 pl-12">{tool.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Test Coverage */}
        <section className="py-16 lg:py-24" data-testid="section-tests">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-tests">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Test Coverage</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                219 passing tests across 6 milestones — 100% pass rate.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
            >
              {milestones.map((m, i) => (
                <motion.div key={m.name} variants={staggerItem}>
                  <GlassCard className="p-5 rounded-xl" data-testid={`milestone-${i}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-white">{m.name}</span>
                      <span className="text-xs text-cyan-400 font-semibold" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        {m.tests}/{m.total}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-green-400">All passing</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center mt-8"
            >
              <GlassCard variant="elevated" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl" data-testid="total-tests">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-lg font-bold text-white">219/219 Tests Passing</span>
                <span className="text-sm text-green-400 font-semibold">100%</span>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Ecosystem Integration */}
        <section className="py-16 lg:py-24" data-testid="section-ecosystem">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-ecosystem">
                <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">Ecosystem Integration</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Deeply integrated with the Trust Layer ecosystem infrastructure.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {ecosystemIntegrations.map((item) => (
                <motion.div key={item.name} variants={staggerItem}>
                  <GlassCard glow className="p-5 rounded-xl h-full" data-testid={`integration-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/20 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{item.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Connected Apps */}
        <section className="py-16 lg:py-24" data-testid="section-connected-apps">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-connected-apps">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Connected Apps</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Apps across the ecosystem that integrate with or are built on Lume.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
            >
              {connectedApps.map((app) => (
                <motion.div key={app.name} variants={staggerItem}>
                  <a href={app.url} target="_blank" rel="noopener noreferrer">
                    <GlassCard className="p-5 rounded-xl group hover:border-cyan-500/30 transition-all cursor-pointer h-full" data-testid={`app-${app.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{app.name}</h3>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{app.desc}</p>
                    </GlassCard>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12" data-testid="section-stats">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GlassCard variant="elevated" className="p-6 rounded-2xl">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                    data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Natural Language Evolution Roadmap */}
        <section className="py-16 lg:py-24" data-testid="section-nl-roadmap">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6" data-testid="badge-nl-evolution">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Milestones 7-13
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-nl-roadmap">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">Natural Language Evolution</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                The next chapter of Lume — from English Mode to autonomous programming. Write code in plain language, any human language, or even by voice. The compiler understands your intent.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <GlassCard variant="elevated" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl" data-testid="nl-vision-statement">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-sm sm:text-base text-gray-300">
                  <span className="text-white font-semibold">Vision:</span> Programming should be as natural as describing what you want in conversation.
                </span>
              </GlassCard>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {nlRoadmap.map((milestone, i) => (
                <motion.div key={milestone.id} variants={staggerItem}>
                  <GlassCard
                    glow={milestone.status === "active"}
                    className={`p-5 sm:p-6 rounded-2xl ${milestone.status === "active" ? "border-cyan-500/30" : ""}`}
                    data-testid={`nl-milestone-${milestone.id.toLowerCase()}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex items-center gap-3 sm:min-w-[200px]">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          milestone.status === "active"
                            ? "bg-gradient-to-br from-cyan-500 to-teal-500"
                            : "bg-white/5 border border-white/10"
                        }`}>
                          <milestone.icon className={`w-5 h-5 ${milestone.status === "active" ? "text-white" : "text-gray-500"}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-cyan-400" style={{ fontFamily: "JetBrains Mono, monospace" }}>{milestone.id}</span>
                            {milestone.status === "active" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400" data-testid={`status-${milestone.id.toLowerCase()}`}>
                                <CircleDot className="w-2.5 h-2.5" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-gray-500" data-testid={`status-${milestone.id.toLowerCase()}`}>
                                <Clock className="w-2.5 h-2.5" /> Planned
                              </span>
                            )}
                          </div>
                          <h3 className={`text-sm sm:text-base font-bold mt-0.5 ${milestone.status === "active" ? "text-white" : "text-gray-400"}`} style={{ fontFamily: "Inter, sans-serif" }}>
                            {milestone.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm leading-relaxed mb-3 ${milestone.status === "active" ? "text-gray-300" : "text-gray-500"}`}>
                          {milestone.desc}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.capabilities.map((cap) => (
                            <span
                              key={cap}
                              className={`text-[10px] sm:text-xs px-2 py-1 rounded-md font-medium ${
                                milestone.status === "active"
                                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                  : "bg-white/5 text-gray-500 border border-white/5"
                              }`}
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="py-16 lg:py-24" data-testid="section-cta">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }} data-testid="heading-cta">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
                  Start Building with Lume
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Explore the language, read the docs, or dive into the Academy curriculum.
              </p>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-4">
                <a
                  href="https://lume-lang.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25 col-span-2"
                  data-testid="cta-bottom-lume"
                >
                  lume-lang.org <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/darkwavestudios/lume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors"
                  data-testid="cta-bottom-github"
                >
                  <Code2 className="w-4 h-4" /> GitHub
                </a>
                <Link
                  href="/academy"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors"
                  data-testid="cta-bottom-academy"
                >
                  <BookOpen className="w-4 h-4" /> Academy
                </Link>
                <a
                  href="https://lume-lang.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors col-span-2 sm:col-span-1"
                  data-testid="cta-bottom-docs"
                >
                  <FileCode className="w-4 h-4" /> Docs
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}