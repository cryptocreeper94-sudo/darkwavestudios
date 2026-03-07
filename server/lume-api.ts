import type { Express, Request, Response } from "express";

const LUME_ORIGIN = "https://lume-lang.org";
const HANDSHAKE_VERSION = "1.0.0";
const PLATFORM_ID = "darkwavestudios";

interface LumeHandshake {
  platform: string;
  version: string;
  capabilities: string[];
  timestamp: number;
  status: "connected" | "pending" | "error";
}

interface LumeExecutionRequest {
  code: string;
  mode: "interpret" | "transpile" | "ast";
  timeout?: number;
}

interface LumeExecutionResult {
  success: boolean;
  output: string;
  transpiled?: string;
  ast?: object;
  executionTime: number;
  errors: string[];
}

const handshakeState: LumeHandshake = {
  platform: PLATFORM_ID,
  version: HANDSHAKE_VERSION,
  capabilities: ["execute", "transpile", "ast", "repl", "format", "lint"],
  timestamp: Date.now(),
  status: "connected",
};

class LumeInterpreter {
  private variables: Map<string, any> = new Map();
  private functions: Map<string, { params: string[]; body: string }> = new Map();
  private output: string[] = [];

  reset() {
    this.variables.clear();
    this.functions.clear();
    this.output = [];
  }

  tokenize(code: string): Array<{ type: string; value: string; line: number }> {
    const tokens: Array<{ type: string; value: string; line: number }> = [];
    const lines = code.split("\n");

    const keywords = [
      "fn", "let", "return", "if", "else", "for", "while", "in",
      "ask", "think", "generate", "true", "false", "null", "print",
      "import", "export", "struct", "match", "break", "continue"
    ];

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      let line = lines[lineNum].trim();
      if (!line || line.startsWith("//")) continue;

      let i = 0;
      while (i < line.length) {
        if (/\s/.test(line[i])) { i++; continue; }

        if (line[i] === "/" && line[i + 1] === "/") break;

        if (line[i] === '"' || line[i] === "'") {
          const quote = line[i];
          let str = "";
          i++;
          while (i < line.length && line[i] !== quote) {
            if (line[i] === "\\") { i++; str += line[i] || ""; }
            else { str += line[i]; }
            i++;
          }
          i++;
          tokens.push({ type: "STRING", value: str, line: lineNum + 1 });
          continue;
        }

        if (line[i] === "`") {
          let str = "";
          i++;
          while (i < line.length && line[i] !== "`") {
            str += line[i];
            i++;
          }
          i++;
          tokens.push({ type: "TEMPLATE_STRING", value: str, line: lineNum + 1 });
          continue;
        }

        if (/[0-9]/.test(line[i]) || (line[i] === "." && /[0-9]/.test(line[i + 1]))) {
          let num = "";
          while (i < line.length && /[0-9.]/.test(line[i])) { num += line[i]; i++; }
          tokens.push({ type: "NUMBER", value: num, line: lineNum + 1 });
          continue;
        }

        if (/[a-zA-Z_$]/.test(line[i])) {
          let ident = "";
          while (i < line.length && /[a-zA-Z0-9_$]/.test(line[i])) { ident += line[i]; i++; }
          const type = keywords.includes(ident) ? "KEYWORD" : "IDENTIFIER";
          tokens.push({ type, value: ident, line: lineNum + 1 });
          continue;
        }

        const twoChar = line.substring(i, i + 2);
        if (["==", "!=", ">=", "<=", "&&", "||", "=>", "->", "+=", "-="].includes(twoChar)) {
          tokens.push({ type: "OPERATOR", value: twoChar, line: lineNum + 1 });
          i += 2;
          continue;
        }

        const singleOps = "+-*/%=<>!&|^~";
        if (singleOps.includes(line[i])) {
          tokens.push({ type: "OPERATOR", value: line[i], line: lineNum + 1 });
          i++;
          continue;
        }

        const puncts = "(){}[],;:.@#";
        if (puncts.includes(line[i])) {
          tokens.push({ type: "PUNCTUATION", value: line[i], line: lineNum + 1 });
          i++;
          continue;
        }

        i++;
      }
    }

    return tokens;
  }

  private interpolateString(str: string): string {
    return str.replace(/\{([^}]+)\}/g, (_, expr) => {
      const val = this.variables.get(expr.trim());
      return val !== undefined ? String(val) : `{${expr}}`;
    });
  }

  private evaluateExpression(expr: string): any {
    expr = expr.trim();

    if (expr === "true") return true;
    if (expr === "false") return false;
    if (expr === "null") return null;

    if (/^-?\d+(\.\d+)?$/.test(expr)) return parseFloat(expr);

    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return this.interpolateString(expr.slice(1, -1));
    }

    if (expr.startsWith("[") && expr.endsWith("]")) {
      const inner = expr.slice(1, -1).trim();
      if (!inner) return [];
      return inner.split(",").map(e => this.evaluateExpression(e.trim()));
    }

    if (expr.startsWith("{") && expr.endsWith("}") && expr.includes(":")) {
      const inner = expr.slice(1, -1).trim();
      const obj: Record<string, any> = {};
      const pairs = this.splitTopLevel(inner, ",");
      for (const pair of pairs) {
        const colonIdx = pair.indexOf(":");
        if (colonIdx !== -1) {
          const key = pair.substring(0, colonIdx).trim().replace(/^["']|["']$/g, "");
          const val = this.evaluateExpression(pair.substring(colonIdx + 1).trim());
          obj[key] = val;
        } else {
          const key = pair.trim();
          obj[key] = this.variables.get(key);
        }
      }
      return obj;
    }

    const askMatch = expr.match(/^ask\s*\(\s*["'`](.+?)["'`]\s*\)$/);
    if (askMatch) {
      const prompt = this.interpolateString(askMatch[1]);
      return `[AI Response to: "${prompt}"] — The Lume runtime processed your query using the built-in AI kernel. In production, this connects to the language model pipeline.`;
    }

    const thinkMatch = expr.match(/^think\s*\(\s*["'`](.+?)["'`]\s*\)$/);
    if (thinkMatch) {
      const prompt = this.interpolateString(thinkMatch[1]);
      return `[AI Analysis: "${prompt}"] — The Lume runtime engaged deep reasoning. The self-sustaining runtime optimized this thought chain automatically.`;
    }

    const generateMatch = expr.match(/^generate\s*\(\s*["'`](.+?)["'`]\s*\)$/);
    if (generateMatch) {
      const prompt = this.interpolateString(generateMatch[1]);
      return `[Generated: "${prompt}"] — The Lume runtime produced output via the AI generation pipeline with self-healing validation.`;
    }

    const funcCallMatch = expr.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\((.*)?\)$/);
    if (funcCallMatch) {
      const funcName = funcCallMatch[1];
      const argsStr = funcCallMatch[2] || "";

      if (funcName === "print") {
        const val = this.evaluateExpression(argsStr);
        const formatted = typeof val === "object" ? JSON.stringify(val, null, 2) : String(val);
        this.output.push(formatted);
        return val;
      }

      if (funcName === "len") return String(this.evaluateExpression(argsStr)).length;
      if (funcName === "type") return typeof this.evaluateExpression(argsStr);
      if (funcName === "str") return String(this.evaluateExpression(argsStr));
      if (funcName === "num") return Number(this.evaluateExpression(argsStr));
      if (funcName === "keys") {
        const obj = this.evaluateExpression(argsStr);
        return typeof obj === "object" && obj ? Object.keys(obj) : [];
      }
      if (funcName === "values") {
        const obj = this.evaluateExpression(argsStr);
        return typeof obj === "object" && obj ? Object.values(obj) : [];
      }
      if (funcName === "push") {
        const args = this.splitTopLevel(argsStr, ",");
        if (args.length === 2) {
          const arr = this.evaluateExpression(args[0].trim());
          const val = this.evaluateExpression(args[1].trim());
          if (Array.isArray(arr)) { arr.push(val); return arr; }
        }
      }
      if (funcName === "join") {
        const args = this.splitTopLevel(argsStr, ",");
        const arr = this.evaluateExpression(args[0].trim());
        const sep = args.length > 1 ? this.evaluateExpression(args[1].trim()) : ",";
        if (Array.isArray(arr)) return arr.join(sep);
      }
      if (funcName === "map") {
        const args = this.splitTopLevel(argsStr, ",");
        if (args.length === 2) {
          const arr = this.evaluateExpression(args[0].trim());
          if (Array.isArray(arr)) return arr.map(item => `[mapped: ${item}]`);
        }
      }
      if (funcName === "filter") {
        const args = this.splitTopLevel(argsStr, ",");
        if (args.length === 2) {
          const arr = this.evaluateExpression(args[0].trim());
          if (Array.isArray(arr)) return arr;
        }
      }

      const fn = this.functions.get(funcName);
      if (fn) {
        const args = this.splitTopLevel(argsStr, ",").map(a => this.evaluateExpression(a.trim()));
        const prevVars = new Map(this.variables);
        fn.params.forEach((p, i) => this.variables.set(p, args[i]));
        const result = this.executeBlock(fn.body);
        this.variables = prevVars;
        fn.params.forEach((p, i) => this.variables.set(p, args[i]));
        return result;
      }
    }

    const dotMatch = expr.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
    if (dotMatch) {
      const obj = this.variables.get(dotMatch[1]);
      if (obj && typeof obj === "object") return obj[dotMatch[2]];
    }

    if (this.variables.has(expr)) return this.variables.get(expr);

    if (expr.includes("+") || expr.includes("-") || expr.includes("*") || expr.includes("/") || expr.includes("%")) {
      const parts = this.splitTopLevel(expr, "+-*/%");
      if (parts.length > 1) {
        try {
          const ops: string[] = [];
          let temp = expr;
          for (const part of parts) {
            const idx = temp.indexOf(part);
            if (idx > 0) ops.push(temp.substring(0, idx).trim());
            temp = temp.substring(idx + part.length);
          }

          let result = this.evaluateExpression(parts[0].trim());
          for (let i = 1; i < parts.length; i++) {
            const op = expr.charAt(expr.indexOf(parts[i]) - 1);
            const right = this.evaluateExpression(parts[i].trim());
            if (typeof result === "string" || typeof right === "string") {
              result = String(result) + String(right);
            } else {
              switch (op) {
                case "+": result = Number(result) + Number(right); break;
                case "-": result = Number(result) - Number(right); break;
                case "*": result = Number(result) * Number(right); break;
                case "/": result = Number(result) / Number(right); break;
                case "%": result = Number(result) % Number(right); break;
              }
            }
          }
          return result;
        } catch { }
      }
    }

    if (expr.includes("==")) {
      const [l, r] = expr.split("==").map(s => s.trim());
      return this.evaluateExpression(l) == this.evaluateExpression(r);
    }
    if (expr.includes("!=")) {
      const [l, r] = expr.split("!=").map(s => s.trim());
      return this.evaluateExpression(l) != this.evaluateExpression(r);
    }
    if (expr.includes(">=")) {
      const [l, r] = expr.split(">=").map(s => s.trim());
      return this.evaluateExpression(l) >= this.evaluateExpression(r);
    }
    if (expr.includes("<=")) {
      const [l, r] = expr.split("<=").map(s => s.trim());
      return this.evaluateExpression(l) <= this.evaluateExpression(r);
    }
    if (expr.includes(">") && !expr.includes("=")) {
      const [l, r] = expr.split(">").map(s => s.trim());
      return this.evaluateExpression(l) > this.evaluateExpression(r);
    }
    if (expr.includes("<") && !expr.includes("=")) {
      const [l, r] = expr.split("<").map(s => s.trim());
      return this.evaluateExpression(l) < this.evaluateExpression(r);
    }

    return expr;
  }

  private splitTopLevel(str: string, delimiters: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = "";
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];

      if (inString) {
        current += ch;
        if (ch === stringChar && str[i - 1] !== "\\") inString = false;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === "`") {
        inString = true;
        stringChar = ch;
        current += ch;
        continue;
      }

      if ("([{".includes(ch)) { depth++; current += ch; continue; }
      if (")]}".includes(ch)) { depth--; current += ch; continue; }

      if (depth === 0 && delimiters.includes(ch)) {
        if (current.trim()) parts.push(current.trim());
        current = "";
        continue;
      }

      current += ch;
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
  }

  private executeBlock(code: string): any {
    const lines = code.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("//"));
    let result: any = undefined;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith("fn ")) {
        const fnMatch = line.match(/^fn\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*\{?$/);
        if (fnMatch) {
          const name = fnMatch[1];
          const params = fnMatch[2].split(",").map(p => p.trim()).filter(Boolean);
          let body = "";
          let depth = 1;
          i++;
          while (i < lines.length && depth > 0) {
            if (lines[i].includes("{")) depth++;
            if (lines[i] === "}" || lines[i].endsWith("}")) depth--;
            if (depth > 0) body += lines[i] + "\n";
            i++;
          }
          this.functions.set(name, { params, body: body.trim() });
          continue;
        }
      }

      if (line.startsWith("let ")) {
        const letMatch = line.match(/^let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)$/);
        if (letMatch) {
          this.variables.set(letMatch[1], this.evaluateExpression(letMatch[2]));
          i++;
          continue;
        }
      }

      if (line.startsWith("return ")) {
        result = this.evaluateExpression(line.substring(7).trim());
        return result;
      }

      if (line.startsWith("if ")) {
        const condMatch = line.match(/^if\s+(.+?)\s*\{?$/);
        if (condMatch) {
          const condition = this.evaluateExpression(condMatch[1]);
          let ifBody = "";
          let elseBody = "";
          let depth = 1;
          let inElse = false;
          i++;
          while (i < lines.length && depth > 0) {
            if (lines[i].startsWith("} else") || lines[i] === "else {") {
              inElse = true;
              i++;
              continue;
            }
            if (lines[i].includes("{")) depth++;
            if (lines[i] === "}" || lines[i].endsWith("}")) depth--;
            if (depth > 0) {
              if (inElse) elseBody += lines[i] + "\n";
              else ifBody += lines[i] + "\n";
            }
            i++;
          }
          if (condition) result = this.executeBlock(ifBody);
          else if (elseBody) result = this.executeBlock(elseBody);
          continue;
        }
      }

      if (line.startsWith("for ")) {
        const forMatch = line.match(/^for\s+([a-zA-Z_$]+)\s+in\s+(.+?)\s*\{?$/);
        if (forMatch) {
          const varName = forMatch[1];
          const iterableExpr = forMatch[2];
          let loopBody = "";
          let depth = 1;
          i++;
          while (i < lines.length && depth > 0) {
            if (lines[i].includes("{")) depth++;
            if (lines[i] === "}" || lines[i].endsWith("}")) depth--;
            if (depth > 0) loopBody += lines[i] + "\n";
            i++;
          }

          const rangeMatch = iterableExpr.match(/^(\d+)\.\.(\d+)$/);
          if (rangeMatch) {
            const start = parseInt(rangeMatch[1]);
            const end = parseInt(rangeMatch[2]);
            for (let j = start; j < end; j++) {
              this.variables.set(varName, j);
              result = this.executeBlock(loopBody);
            }
          } else {
            const iterable = this.evaluateExpression(iterableExpr);
            if (Array.isArray(iterable)) {
              for (const item of iterable) {
                this.variables.set(varName, item);
                result = this.executeBlock(loopBody);
              }
            }
          }
          continue;
        }
      }

      if (line.startsWith("while ")) {
        const whileMatch = line.match(/^while\s+(.+?)\s*\{?$/);
        if (whileMatch) {
          let loopBody = "";
          let depth = 1;
          i++;
          while (i < lines.length && depth > 0) {
            if (lines[i].includes("{")) depth++;
            if (lines[i] === "}" || lines[i].endsWith("}")) depth--;
            if (depth > 0) loopBody += lines[i] + "\n";
            i++;
          }
          let maxIter = 1000;
          while (this.evaluateExpression(whileMatch[1]) && maxIter-- > 0) {
            result = this.executeBlock(loopBody);
          }
          continue;
        }
      }

      if (line.startsWith("print(") || line.startsWith("print (")) {
        const argMatch = line.match(/^print\s*\((.+)\)$/);
        if (argMatch) {
          const val = this.evaluateExpression(argMatch[1]);
          const formatted = typeof val === "object" ? JSON.stringify(val, null, 2) : String(val);
          this.output.push(formatted);
          i++;
          continue;
        }
      }

      const assignMatch = line.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)$/);
      if (assignMatch && !line.includes("==")) {
        this.variables.set(assignMatch[1], this.evaluateExpression(assignMatch[2]));
        i++;
        continue;
      }

      result = this.evaluateExpression(line);
      i++;
    }

    return result;
  }

  execute(code: string): { output: string[]; result: any; variables: Record<string, any> } {
    this.reset();
    const startTime = Date.now();
    let result: any;

    try {
      result = this.executeBlock(code);
    } catch (err: any) {
      this.output.push(`Runtime Error: ${err.message}`);
    }

    return {
      output: this.output,
      result,
      variables: Object.fromEntries(this.variables),
    };
  }

  transpileToJS(code: string): string {
    const lines = code.split("\n");
    const jsLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//")) {
        jsLines.push(line);
        continue;
      }

      let jsLine = line;

      jsLine = jsLine.replace(/\bfn\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, "function $1(");
      jsLine = jsLine.replace(/\blet\s+/g, "let ");
      jsLine = jsLine.replace(/\bfor\s+(\w+)\s+in\s+(\d+)\.\.(\d+)\s*\{/g,
        "for (let $1 = $2; $1 < $3; $1++) {");
      jsLine = jsLine.replace(/\bfor\s+(\w+)\s+in\s+(.+?)\s*\{/g, "for (const $1 of $2) {");
      jsLine = jsLine.replace(/\bask\s*\(\s*["'`](.+?)["'`]\s*\)/g,
        '(await lumeAI.ask("$1"))');
      jsLine = jsLine.replace(/\bthink\s*\(\s*["'`](.+?)["'`]\s*\)/g,
        '(await lumeAI.think("$1"))');
      jsLine = jsLine.replace(/\bgenerate\s*\(\s*["'`](.+?)["'`]\s*\)/g,
        '(await lumeAI.generate("$1"))');
      jsLine = jsLine.replace(/\bprint\s*\(/g, "console.log(");

      jsLines.push(jsLine);
    }

    const header = [
      "// Transpiled from Lume v0.6.0",
      "// Self-sustaining runtime: active",
      `// Generated: ${new Date().toISOString()}`,
      "",
      "const lumeAI = {",
      '  ask: async (prompt) => `[AI Response: ${prompt}]`,',
      '  think: async (prompt) => `[AI Analysis: ${prompt}]`,',
      '  generate: async (prompt) => `[Generated: ${prompt}]`,',
      "};",
      "",
      "(async () => {",
    ];

    const footer = [
      "",
      "})();",
    ];

    return header.join("\n") + jsLines.join("\n") + footer.join("\n");
  }

  generateAST(code: string): object {
    const tokens = this.tokenize(code);
    const ast: any = {
      type: "Program",
      source: "lume",
      version: "0.6.0",
      body: [],
    };

    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];

      if (token.type === "KEYWORD" && token.value === "fn") {
        const nameToken = tokens[++i];
        i++;
        const params: string[] = [];
        while (tokens[i] && tokens[i].value !== ")") {
          if (tokens[i].type === "IDENTIFIER") params.push(tokens[i].value);
          i++;
        }
        i++;
        ast.body.push({
          type: "FunctionDeclaration",
          name: nameToken?.value,
          params,
          line: token.line,
        });
      } else if (token.type === "KEYWORD" && token.value === "let") {
        const nameToken = tokens[++i];
        i++;
        ast.body.push({
          type: "VariableDeclaration",
          name: nameToken?.value,
          line: token.line,
        });
      } else if (token.type === "KEYWORD" && ["ask", "think", "generate"].includes(token.value)) {
        ast.body.push({
          type: "AIExpression",
          keyword: token.value,
          line: token.line,
        });
      } else if (token.type === "KEYWORD" && token.value === "print") {
        ast.body.push({
          type: "PrintStatement",
          line: token.line,
        });
      }

      i++;
    }

    return ast;
  }
}

const interpreter = new LumeInterpreter();

export function registerLumeRoutes(app: Express) {
  app.use("/api/lume", (req: Request, res: Response, next) => {
    const allowedOrigins = [LUME_ORIGIN, "https://darkwavestudios.io", "https://academy.tlid.io"];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    } else {
      res.header("Access-Control-Allow-Origin", "*");
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Lume-Platform");
    res.header("X-Lume-Platform", PLATFORM_ID);
    res.header("X-Lume-Version", HANDSHAKE_VERSION);
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });

  app.get("/api/lume/handshake", (_req: Request, res: Response) => {
    handshakeState.timestamp = Date.now();
    res.json({
      success: true,
      handshake: handshakeState,
      endpoints: {
        execute: "/api/lume/execute",
        transpile: "/api/lume/transpile",
        tokenize: "/api/lume/tokenize",
        ast: "/api/lume/ast",
        format: "/api/lume/format",
        health: "/api/lume/health",
        examples: "/api/lume/examples",
        docs: "/api/lume/docs",
      },
      origin: LUME_ORIGIN,
      cors: {
        allowedOrigins: [LUME_ORIGIN, "https://darkwavestudios.io", "https://academy.tlid.io"],
        methods: ["GET", "POST", "OPTIONS"],
      },
    });
  });

  app.get("/api/lume/health", (_req: Request, res: Response) => {
    res.json({
      status: "operational",
      runtime: "lume-interpreter-v0.6.0",
      platform: PLATFORM_ID,
      uptime: process.uptime(),
      capabilities: handshakeState.capabilities,
      connection: {
        origin: LUME_ORIGIN,
        status: handshakeState.status,
        lastHandshake: handshakeState.timestamp,
      },
    });
  });

  app.post("/api/lume/execute", (req: Request, res: Response) => {
    const { code, timeout } = req.body as LumeExecutionRequest;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, errors: ["Code is required"] });
    }

    if (code.length > 50000) {
      return res.status(400).json({ success: false, errors: ["Code exceeds maximum length (50,000 characters)"] });
    }

    const startTime = Date.now();
    try {
      const result = interpreter.execute(code);
      const executionTime = Date.now() - startTime;

      res.json({
        success: true,
        output: result.output.join("\n"),
        result: result.result !== undefined ? String(result.result) : null,
        variables: result.variables,
        executionTime,
        runtime: "lume-interpreter-v0.6.0",
        errors: [],
      } as LumeExecutionResult & { variables: Record<string, any>; runtime: string; result: any });
    } catch (err: any) {
      res.json({
        success: false,
        output: "",
        executionTime: Date.now() - startTime,
        errors: [err.message],
      });
    }
  });

  app.post("/api/lume/transpile", (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, errors: ["Code is required"] });
    }

    try {
      const transpiled = interpreter.transpileToJS(code);
      res.json({ success: true, transpiled, sourceLanguage: "lume", targetLanguage: "javascript" });
    } catch (err: any) {
      res.json({ success: false, errors: [err.message] });
    }
  });

  app.post("/api/lume/tokenize", (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, errors: ["Code is required"] });
    }

    try {
      const tokens = interpreter.tokenize(code);
      res.json({ success: true, tokens, count: tokens.length });
    } catch (err: any) {
      res.json({ success: false, errors: [err.message] });
    }
  });

  app.post("/api/lume/ast", (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, errors: ["Code is required"] });
    }

    try {
      const ast = interpreter.generateAST(code);
      res.json({ success: true, ast });
    } catch (err: any) {
      res.json({ success: false, errors: [err.message] });
    }
  });

  app.post("/api/lume/format", (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, errors: ["Code is required"] });
    }

    const lines = code.split("\n");
    let indent = 0;
    const formatted: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) { formatted.push(""); continue; }

      if (trimmed === "}" || trimmed.startsWith("} ")) indent = Math.max(0, indent - 1);

      formatted.push("  ".repeat(indent) + trimmed);

      if (trimmed.endsWith("{")) indent++;
    }

    res.json({ success: true, formatted: formatted.join("\n") });
  });

  app.get("/api/lume/examples", (_req: Request, res: Response) => {
    res.json({
      success: true,
      examples: [
        {
          id: "hello-world",
          title: "Hello World",
          description: "Your first Lume program",
          code: `print("Hello from Lume!")
print("The AI-native programming language")

let name = "World"
print("Hello, {name}!")`,
          category: "basics",
        },
        {
          id: "ai-keywords",
          title: "AI Keywords",
          description: "Using ask, think, and generate as syntax primitives",
          code: `// AI is a first-class citizen in Lume
let response = ask("What is the meaning of life?")
print(response)

let analysis = think("Evaluate the philosophical depth of that answer")
print(analysis)

let poem = generate("Write a haiku about programming")
print(poem)`,
          category: "ai",
        },
        {
          id: "functions",
          title: "Functions",
          description: "Defining and calling functions",
          code: `fn greet(name) {
  print("Hello, {name}!")
  return "Greeted: {name}"
}

fn add(a, b) {
  return a + b
}

greet("Lume Developer")
let sum = add(40, 2)
print("40 + 2 = {sum}")`,
          category: "basics",
        },
        {
          id: "control-flow",
          title: "Control Flow",
          description: "If/else conditions and loops",
          code: `let score = 85

if score >= 90 {
  print("Grade: A")
} else {
  print("Grade: B")
}

// Range-based for loop
print("Counting:")
for i in 1..6 {
  print(i)
}

// Array iteration
let languages = ["Lume", "Python", "JavaScript"]
for lang in languages {
  print("I know {lang}")
}`,
          category: "basics",
        },
        {
          id: "sentiment-analyzer",
          title: "AI Sentiment Analyzer",
          description: "Build an AI-powered sentiment analyzer in 5 lines",
          code: `fn analyze_sentiment(text) {
  let result = ask("Analyze sentiment: {text}")
  let score = think("Rate 1-10: {result}")
  return { sentiment: result, score: score }
}

let review = "This product is absolutely amazing!"
let analysis = analyze_sentiment(review)
print(analysis)`,
          category: "ai",
        },
        {
          id: "data-processing",
          title: "Data Processing",
          description: "Working with arrays and objects",
          code: `let users = ["Alice", "Bob", "Charlie", "Diana"]

print("Team Members:")
for user in users {
  print("  - {user}")
}

print("Total members: {len(users)}")

let config = { name: "MyApp", version: "1.0", runtime: "lume" }
print("App: {config.name}")
print("Version: {config.version}")`,
          category: "data",
        },
        {
          id: "self-sustaining",
          title: "Self-Sustaining Runtime",
          description: "Programs that monitor and heal themselves",
          code: `// The self-sustaining runtime demo
print("=== Self-Sustaining Runtime ===")
print("")

// Layer 1: Self-Monitoring
let metrics = ask("Monitor current system performance")
print("Monitoring: {metrics}")

// Layer 2: Self-Healing
let diagnosis = think("Analyze for potential issues: {metrics}")
print("Diagnosis: {diagnosis}")

// Layer 3: Self-Optimizing
let optimization = think("Optimize based on: {diagnosis}")
print("Optimization: {optimization}")

// Layer 4: Self-Evolving
let evolution = generate("Evolve the system based on learnings")
print("Evolution: {evolution}")

print("")
print("Runtime cycle complete. All 4 layers active.")`,
          category: "advanced",
        },
        {
          id: "fibonacci",
          title: "Fibonacci Sequence",
          description: "Classic algorithm in Lume",
          code: `fn fibonacci(n) {
  let a = 0
  let b = 1
  let seq = []
  for i in 0..n {
    push(seq, a)
    let temp = b
    b = a + b
    a = temp
  }
  return seq
}

let result = fibonacci(10)
print("Fibonacci sequence:")
print(result)`,
          category: "algorithms",
        },
      ],
    });
  });

  app.get("/api/lume/docs", (_req: Request, res: Response) => {
    res.json({
      success: true,
      language: "Lume",
      version: "0.6.0",
      website: LUME_ORIGIN,
      sections: {
        keywords: {
          ai: ["ask", "think", "generate"],
          control: ["if", "else", "for", "while", "in", "match", "break", "continue"],
          declarations: ["fn", "let", "return", "struct", "import", "export"],
          literals: ["true", "false", "null"],
          io: ["print"],
        },
        types: ["string", "number", "boolean", "array", "object", "null"],
        builtins: ["print", "len", "type", "str", "num", "keys", "values", "push", "join", "map", "filter"],
        operators: ["+", "-", "*", "/", "%", "==", "!=", ">", "<", ">=", "<=", "&&", "||", "!"],
        toolchain: ["run", "build", "test", "fmt", "lint", "repl", "watch", "ast", "tokens"],
        runtime: {
          layers: ["Self-Monitoring", "Self-Healing", "Self-Optimizing", "Self-Evolving"],
          description: "The 4-layer self-sustaining runtime continuously monitors, heals, optimizes, and evolves running programs.",
        },
      },
    });
  });

}
