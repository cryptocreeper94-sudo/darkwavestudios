import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Code2,
  Play,
  FileCode,
  Terminal,
  ChevronRight,
  Layers,
  GitBranch,
  Zap,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ExternalLink,
  ChevronDown,
  Eye,
  Search,
  Globe,
  Wifi,
  WifiOff,
} from "lucide-react";

type OutputTab = "output" | "transpiled" | "tokens" | "ast";

interface ExecutionResult {
  success: boolean;
  output: string;
  result?: string;
  variables?: Record<string, any>;
  executionTime: number;
  errors: string[];
}

interface Example {
  id: string;
  title: string;
  description: string;
  code: string;
  category: string;
}

const DEFAULT_CODE = `// Welcome to the Lume Playground
// The AI-native programming language

print("Hello from Lume!")

let name = "World"
print("Hello, {name}!")

// Try the AI keywords:
let response = ask("What makes Lume unique?")
print(response)
`;

export default function LumePlayground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [activeTab, setActiveTab] = useState<OutputTab>("output");
  const [output, setOutput] = useState<string>("");
  const [transpiled, setTranspiled] = useState<string>("");
  const [tokens, setTokens] = useState<string>("");
  const [ast, setAst] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);

  const { data: healthData } = useQuery({
    queryKey: ["/api/lume/health"],
    refetchInterval: 30000,
  });

  const { data: examplesData } = useQuery<{ success: boolean; examples: Example[] }>({
    queryKey: ["/api/lume/examples"],
  });

  const executeMutation = useMutation({
    mutationFn: async (sourceCode: string) => {
      const res = await apiRequest("POST", "/api/lume/execute", { code: sourceCode });
      return res.json();
    },
    onSuccess: (data: ExecutionResult) => {
      const lines: string[] = [];
      if (data.output) lines.push(data.output);
      if (data.result && data.result !== "undefined") lines.push(`\n→ ${data.result}`);
      if (data.errors?.length) lines.push(`\n❌ ${data.errors.join("\n")}`);
      setOutput(lines.join("\n") || "Program executed successfully (no output)");
      setExecutionTime(data.executionTime);
      setActiveTab("output");
    },
    onError: (err: Error) => {
      setOutput(`Error: ${err.message}`);
      setActiveTab("output");
    },
  });

  const transpileMutation = useMutation({
    mutationFn: async (sourceCode: string) => {
      const res = await apiRequest("POST", "/api/lume/transpile", { code: sourceCode });
      return res.json();
    },
    onSuccess: (data: any) => {
      setTranspiled(data.transpiled || "Transpilation failed");
      setActiveTab("transpiled");
    },
  });

  const tokenizeMutation = useMutation({
    mutationFn: async (sourceCode: string) => {
      const res = await apiRequest("POST", "/api/lume/tokenize", { code: sourceCode });
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data.tokens) {
        const formatted = data.tokens.map((t: any) =>
          `[${t.type}] ${t.value} (line ${t.line})`
        ).join("\n");
        setTokens(`${data.count} tokens:\n\n${formatted}`);
      }
      setActiveTab("tokens");
    },
  });

  const astMutation = useMutation({
    mutationFn: async (sourceCode: string) => {
      const res = await apiRequest("POST", "/api/lume/ast", { code: sourceCode });
      return res.json();
    },
    onSuccess: (data: any) => {
      setAst(JSON.stringify(data.ast, null, 2));
      setActiveTab("ast");
    },
  });

  const handleRun = useCallback(() => {
    executeMutation.mutate(code);
  }, [code]);

  const handleTranspile = useCallback(() => {
    transpileMutation.mutate(code);
  }, [code]);

  const handleTokenize = useCallback(() => {
    tokenizeMutation.mutate(code);
  }, [code]);

  const handleAST = useCallback(() => {
    astMutation.mutate(code);
  }, [code]);

  const handleCopy = useCallback(() => {
    const content = activeTab === "output" ? output : activeTab === "transpiled" ? transpiled : activeTab === "tokens" ? tokens : ast;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeTab, output, transpiled, tokens, ast]);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE);
    setOutput("");
    setTranspiled("");
    setTokens("");
    setAst("");
    setExecutionTime(null);
  }, []);

  const loadExample = useCallback((example: Example) => {
    setCode(example.code);
    setShowExamples(false);
    setOutput("");
    setTranspiled("");
    setTokens("");
    setAst("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleTranspile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRun, handleTranspile]);

  const handleTextareaScroll = () => {
    if (textareaRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineCount = code.split("\n").length;
  const isRunning = executeMutation.isPending || transpileMutation.isPending || tokenizeMutation.isPending || astMutation.isPending;
  const isConnected = healthData && (healthData as any).status === "operational";

  const examples = examplesData?.examples || [];
  const categories = [...new Set(examples.map(e => e.category))];

  const outputContent = activeTab === "output" ? output : activeTab === "transpiled" ? transpiled : activeTab === "tokens" ? tokens : ast;

  return (
    <div className="min-h-screen bg-[#06060a] text-white overflow-x-hidden">
      <SEOHead
        title="Lume Playground - Write & Run Lume Code"
        description="Interactive Lume programming playground. Write, execute, and transpile Lume code in your browser. AI-native programming with ask, think, and generate keywords."
        keywords="Lume playground, code editor, AI programming, Lume REPL, interactive coding"
        url="https://darkwavestudios.io/lume/playground"
      />

      <header className="sticky top-0 z-50 bg-[#06060a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/lume" className="text-gray-400 hover:text-cyan-400 transition-colors" data-testid="link-back-lume">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm sm:text-base" style={{ fontFamily: "Inter, sans-serif" }}>Lume Playground</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold hidden sm:inline">v0.6.0</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-xs" data-testid="connection-status">
              {isConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 hidden sm:inline">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500 hidden sm:inline">Connecting...</span>
                </>
              )}
            </div>
            <a
              href="https://lume-lang.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white"
              data-testid="link-lume-site"
            >
              <Globe className="w-3.5 h-3.5" /> <span className="hidden sm:inline">lume-lang.org</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              data-testid="button-run"
            >
              {executeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run
            </button>
            <button
              onClick={handleTranspile}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors disabled:opacity-50"
              data-testid="button-transpile"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Transpile</span>
              <span className="sm:hidden">JS</span>
            </button>
            <button
              onClick={handleTokenize}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors disabled:opacity-50"
              data-testid="button-tokenize"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tokens</span>
            </button>
            <button
              onClick={handleAST}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors disabled:opacity-50"
              data-testid="button-ast"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AST</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors"
                data-testid="button-examples"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Examples
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExamples ? "rotate-180" : ""}`} />
              </button>
              {showExamples && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto z-50 rounded-xl bg-[#0c0c14] border border-white/10 shadow-2xl"
                  data-testid="examples-dropdown"
                >
                  {categories.map(cat => (
                    <div key={cat}>
                      <div className="px-4 py-2 text-[10px] text-cyan-400 uppercase tracking-wider font-bold border-b border-white/5">
                        {cat}
                      </div>
                      {examples.filter(e => e.category === cat).map(example => (
                        <button
                          key={example.id}
                          onClick={() => loadExample(example)}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                          data-testid={`example-${example.id}`}
                        >
                          <div className="text-sm font-medium text-white">{example.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{example.description}</div>
                        </button>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors"
              data-testid="button-reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4" style={{ minHeight: "calc(100vh - 200px)" }}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-t-xl border border-white/10 border-b-0">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-gray-400" style={{ fontFamily: "JetBrains Mono, monospace" }}>main.lume</span>
              </div>
              <span className="text-[10px] text-gray-600">{lineCount} lines</span>
            </div>
            <div className="relative flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-0 border border-white/10 rounded-b-xl overflow-hidden bg-[#0a0a12]">
              <div className="absolute inset-0 flex">
                <div
                  ref={lineNumberRef}
                  className="w-10 sm:w-12 flex-shrink-0 bg-white/[0.02] border-r border-white/5 overflow-hidden select-none pt-3 px-1"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} className="text-[10px] sm:text-xs text-gray-600 text-right pr-1 sm:pr-2 leading-[1.65rem]">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onScroll={handleTextareaScroll}
                  spellCheck={false}
                  className="flex-1 bg-transparent text-gray-200 resize-none outline-none p-3 leading-[1.65rem] text-xs sm:text-sm"
                  style={{ fontFamily: "JetBrains Mono, monospace", tabSize: 2 }}
                  data-testid="code-editor"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] text-gray-600">
              <span>Ctrl+Enter: Run</span>
              <span>Ctrl+S: Transpile</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between px-1 py-1 bg-white/5 rounded-t-xl border border-white/10 border-b-0">
              <div className="flex">
                {(["output", "transpiled", "tokens", "ast"] as OutputTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeTab === tab
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    data-testid={`tab-${tab}`}
                  >
                    {tab === "output" && <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Output</span>}
                    {tab === "transpiled" && <span className="flex items-center gap-1"><FileCode className="w-3 h-3" /> <span className="hidden sm:inline">Transpiled</span><span className="sm:hidden">JS</span></span>}
                    {tab === "tokens" && <span className="flex items-center gap-1"><Search className="w-3 h-3" /> Tokens</span>}
                    {tab === "ast" && <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> AST</span>}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 pr-2">
                {executionTime !== null && activeTab === "output" && (
                  <span className="text-[10px] text-gray-600 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {executionTime}ms
                  </span>
                )}
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-500 hover:text-white"
                  data-testid="button-copy"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="relative flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-0 border border-white/10 rounded-b-xl overflow-hidden bg-[#0a0a12]">
              {isRunning ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Running...</span>
                  </div>
                </div>
              ) : outputContent ? (
                <pre
                  className="p-3 text-xs sm:text-sm text-gray-300 overflow-auto h-full leading-relaxed whitespace-pre-wrap"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                  data-testid="output-content"
                >
                  {outputContent}
                </pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                  <Play className="w-8 h-8 mb-3 opacity-30" />
                  <span className="text-sm">Click Run or press Ctrl+Enter</span>
                  <span className="text-xs mt-1 text-gray-700">Output will appear here</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 mb-8">
          <GlassCard className="p-4 sm:p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Lume Language Reference</h3>
                <p className="text-xs text-gray-500">
                  AI keywords: <code className="text-cyan-400 bg-white/5 px-1 rounded" style={{ fontFamily: "JetBrains Mono, monospace" }}>ask</code>{" "}
                  <code className="text-teal-400 bg-white/5 px-1 rounded" style={{ fontFamily: "JetBrains Mono, monospace" }}>think</code>{" "}
                  <code className="text-sky-400 bg-white/5 px-1 rounded" style={{ fontFamily: "JetBrains Mono, monospace" }}>generate</code>{" "}
                  | Control: <code className="text-gray-400 bg-white/5 px-1 rounded" style={{ fontFamily: "JetBrains Mono, monospace" }}>fn</code>{" "}
                  <code className="text-gray-400 bg-white/5 px-1 rounded" style={{ fontFamily: "JetBrains Mono, monospace" }}>let</code>{" "}
                  <code className="text-gray-400 bg-white/5 px-1 rounded" style={{ fontFamily: "JetBrains Mono, monospace" }}>if</code>{" "}
                  <code className="text-gray-400 bg-white/5 px-1 rounded" style={{ fontFamily: "JetBrains Mono, monospace" }}>for</code>{" "}
                  <code className="text-gray-400 bg-white/5 px-1 rounded" style={{ fontFamily: "JetBrains Mono, monospace" }}>print</code>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/lume"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors"
                  data-testid="link-lume-page"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Lume Overview
                </Link>
                <Link
                  href="/academy"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors"
                  data-testid="link-academy"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" /> Academy
                </Link>
                <a
                  href="https://lume-lang.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400 hover:text-white transition-colors"
                  data-testid="link-lume-org"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> lume-lang.org
                </a>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}
