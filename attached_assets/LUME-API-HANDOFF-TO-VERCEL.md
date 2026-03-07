# Lume API Connection Handoff
### DarkWave Studios → Lume Language (lume-lang.org / lume-lang.com)
**Date:** March 7, 2026
**From:** Jason (DarkWave Studios / darkwavestudios.io)
**To:** Lume Agent (lume-lang.org / lume-lang.com — Vercel deployment)

---

## PURPOSE

DarkWave Studios (darkwavestudios.io) hosts an interactive **Lume Playground** at `/lume/playground` and a showcase page at `/lume`. The playground needs to connect to the real Lume compiler running on lume-lang.org so that users can write, execute, transpile, tokenize, and analyze Lume code — including English Mode and Natural Mode — through the actual Lume build, not a local copy.

DarkWave Studios already has a complete client-side integration built. The playground has a mode selector (Standard / English Mode / Natural Mode), an output panel with tabs for Output, Resolved Lume, Transpiled JS, Tokens, and AST, plus 12 loadable examples. All of this is wired to call API endpoints. **We just need those endpoints to exist on lume-lang.org.**

Currently, DarkWave Studios runs a local interpreter as a fallback. Once the API is live on lume-lang.org, we will switch to proxying requests to lume-lang.org instead.

---

## WHAT WE NEED

The Lume site (lume-lang.org) needs to expose the following **9 API endpoints**. These can be Vercel serverless functions (e.g., `/api/lume/execute` → `api/lume/execute.ts` or similar).

---

### 1. `GET /api/lume/handshake`

**Purpose:** Verify the connection between DarkWave Studios and the Lume compiler. Called on page load.

**Expected Response:**
```json
{
  "success": true,
  "handshake": {
    "platform": "lume-lang",
    "version": "1.0.0",
    "capabilities": ["execute", "transpile", "ast", "repl", "format", "lint", "english-mode", "natural-mode"],
    "timestamp": 1709856000000,
    "status": "connected"
  },
  "endpoints": {
    "execute": "/api/lume/execute",
    "transpile": "/api/lume/transpile",
    "tokenize": "/api/lume/tokenize",
    "ast": "/api/lume/ast",
    "format": "/api/lume/format",
    "health": "/api/lume/health",
    "examples": "/api/lume/examples",
    "docs": "/api/lume/docs",
    "intentInfo": "/api/lume/intent-info"
  }
}
```

---

### 2. `GET /api/lume/health`

**Purpose:** Health check for connection status indicator in the playground header.

**Expected Response:**
```json
{
  "status": "operational",
  "runtime": "lume-compiler-v0.7.0",
  "capabilities": ["execute", "transpile", "ast", "english-mode", "natural-mode"],
  "milestones": {
    "completed": [1, 2, 3, 4, 5, 6, 7],
    "active": [8],
    "planned": [9, 10, 11, 12, 13]
  }
}
```

---

### 3. `POST /api/lume/execute`

**Purpose:** Execute Lume code and return the output. This is the primary endpoint.

**Request Body:**
```json
{
  "code": "print(\"Hello from Lume!\")",
  "timeout": 5000
}
```

The code may include `mode: english` or `mode: natural` as the first line. The compiler should detect the mode and route through the Intent Resolver for English/Natural modes, or through the standard Lexer→Parser→AST→Transpiler pipeline for standard Lume.

**Expected Response:**
```json
{
  "success": true,
  "output": "Hello from Lume!",
  "result": null,
  "variables": { "name": "World" },
  "executionTime": 12,
  "mode": "standard",
  "resolvedLume": null,
  "errors": []
}
```

**For English/Natural mode, include `resolvedLume`:**
```json
{
  "success": true,
  "output": "Hello from English Mode!",
  "result": null,
  "variables": { "greeting": "Hello from English Mode!" },
  "executionTime": 8,
  "mode": "english",
  "resolvedLume": "let greeting = \"Hello from English Mode!\"\nprint(greeting)",
  "errors": []
}
```

The `resolvedLume` field shows the intermediate Lume code that the English/Natural input was resolved into, before transpilation. DarkWave Studios displays this in a "Resolved" tab in the playground.

**On error:**
```json
{
  "success": false,
  "output": "",
  "executionTime": 3,
  "mode": "english",
  "errors": ["Could not resolve: 'do something weird'. Did you mean: 'show something', 'set something to ...'?"]
}
```

---

### 4. `POST /api/lume/transpile`

**Purpose:** Convert Lume code to JavaScript without executing it.

**Request Body:**
```json
{
  "code": "let x = 42\nprint(x)"
}
```

**Expected Response:**
```json
{
  "success": true,
  "transpiled": "(async () => {\nlet x = 42;\nconsole.log(x);\n})();",
  "sourceLanguage": "lume",
  "targetLanguage": "javascript",
  "mode": "standard",
  "resolvedLume": null
}
```

If the code starts with `mode: english` or `mode: natural`, resolve it through the Intent Resolver first, then transpile the resolved Lume. Include `resolvedLume` in the response.

---

### 5. `POST /api/lume/tokenize`

**Purpose:** Return the token stream from the Lume lexer.

**Request Body:**
```json
{
  "code": "let x = 42"
}
```

**Expected Response:**
```json
{
  "success": true,
  "tokens": [
    { "type": "KEYWORD", "value": "let", "line": 1 },
    { "type": "IDENTIFIER", "value": "x", "line": 1 },
    { "type": "OPERATOR", "value": "=", "line": 1 },
    { "type": "NUMBER", "value": "42", "line": 1 }
  ],
  "count": 4,
  "mode": "standard",
  "resolvedLume": null
}
```

For English/Natural modes, resolve first, then tokenize the resolved Lume code.

---

### 6. `POST /api/lume/ast`

**Purpose:** Return the Abstract Syntax Tree.

**Request Body:**
```json
{
  "code": "let x = 42\nprint(x)"
}
```

**Expected Response:**
```json
{
  "success": true,
  "ast": {
    "type": "Program",
    "body": [
      { "type": "VariableDeclaration", "name": "x", "value": { "type": "NumberLiteral", "value": 42 } },
      { "type": "ShowStatement", "value": { "type": "Identifier", "name": "x" } }
    ]
  },
  "mode": "standard",
  "resolvedLume": null
}
```

---

### 7. `POST /api/lume/format`

**Purpose:** Auto-format Lume source code.

**Request Body:**
```json
{
  "code": "let x=42\nif x>10{print(x)}"
}
```

**Expected Response:**
```json
{
  "success": true,
  "formatted": "let x = 42\nif x > 10 {\n  print(x)\n}"
}
```

---

### 8. `GET /api/lume/examples`

**Purpose:** Return loadable code examples for the playground.

**Expected Response:**
```json
{
  "success": true,
  "examples": [
    {
      "id": "hello-world",
      "title": "Hello World",
      "description": "Your first Lume program",
      "code": "print(\"Hello from Lume!\")\n\nlet name = \"World\"\nprint(\"Hello, {name}!\")",
      "category": "basics"
    },
    {
      "id": "english-hello",
      "title": "English Mode: Hello World",
      "description": "Write code in plain English",
      "code": "mode: english\n\nset greeting to \"Hello!\"\nshow greeting",
      "category": "english-mode"
    }
  ]
}
```

Include examples across all categories: `basics`, `ai`, `data`, `algorithms`, `advanced`, `english-mode`, `natural-mode`. The more the better — our playground dynamically loads all of them.

---

### 9. `GET /api/lume/docs`

**Purpose:** Return language reference data (keywords, types, builtins).

**Expected Response:**
```json
{
  "success": true,
  "language": "Lume",
  "version": "0.7.0",
  "website": "https://lume-lang.org",
  "sections": {
    "keywords": {
      "ai": ["ask", "think", "generate"],
      "control": ["if", "else", "for", "while", "in", "match", "break", "continue"],
      "declarations": ["fn", "let", "return", "struct", "import", "export"],
      "literals": ["true", "false", "null"],
      "io": ["print"],
      "selfsustaining": ["monitor", "heal", "optimize", "evolve", "mutate"]
    },
    "types": ["string", "number", "boolean", "array", "object", "null"],
    "builtins": ["print", "len", "type", "str", "num", "keys", "values", "push", "join", "map", "filter"],
    "modes": {
      "standard": "Default Lume syntax",
      "english": "Plain English input (mode: english header)",
      "natural": "Any human language input (mode: natural header)"
    }
  }
}
```

---

### 10. `GET /api/lume/intent-info`

**Purpose:** Return information about the Intent Resolver (English/Natural mode capabilities).

**Expected Response:**
```json
{
  "success": true,
  "intentResolver": {
    "patternCount": 87,
    "categories": ["output", "variable", "math", "conditional", "loop", "function", "list", "object", "ai", "data", "time", "string", "comparison", "monitor", "heal", "optimize", "evolve", "debug"],
    "supportedModes": ["standard", "english", "natural"],
    "layerA": { "name": "Pattern Library", "status": "active" },
    "layerB": { "name": "AI-Powered Resolution", "status": "active" },
    "contextEngine": { "name": "Context Engine", "status": "active" }
  },
  "roadmap": {
    "m7": { "name": "English Mode", "status": "active" },
    "m8": { "name": "Multilingual Mode", "status": "active" },
    "m9": { "name": "Voice-to-Code", "status": "planned" },
    "m10": { "name": "Visual Context Awareness", "status": "planned" },
    "m11": { "name": "Reverse Mode", "status": "planned" },
    "m12": { "name": "Collaborative Intent", "status": "planned" },
    "m13": { "name": "Zero-Dependency Runtime", "status": "planned" }
  }
}
```

---

## CORS CONFIGURATION

All endpoints must allow cross-origin requests from these domains:

```
https://darkwavestudios.io
https://www.darkwavestudios.io
https://academy.tlid.io
https://lume-lang.org
https://lume-lang.com
```

**Required headers:**
```
Access-Control-Allow-Origin: <requesting origin>
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Lume-Platform
```

All endpoints must handle `OPTIONS` preflight requests with a `204` response.

**For Vercel**, this can be configured in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://darkwavestudios.io" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization, X-Lume-Platform" }
      ]
    }
  ]
}
```

Or handle it dynamically in each endpoint by checking the `Origin` header against the allowed list.

---

## HOW DARKWAVE STUDIOS WILL CONNECT

Once the API is live, DarkWave Studios will:

1. **Proxy mode (recommended):** Our Express backend at `/api/lume/*` will forward requests to `https://lume-lang.org/api/lume/*`. This avoids CORS issues entirely — our frontend calls our own backend, which calls lume-lang.org.

2. **Direct mode (alternative):** Our frontend calls lume-lang.org directly. This requires CORS headers on every endpoint.

We prefer **proxy mode** because it's more reliable and lets us add our own fallback logic (if lume-lang.org is down, fall back to the local interpreter).

---

## WHAT'S ALREADY BUILT ON OUR SIDE

DarkWave Studios has the following ready and waiting for this connection:

- **Playground UI** (`/lume/playground`) with mode selector (Standard / English / Natural), code editor with line numbers, 5-tab output panel (Output, Resolved, Transpiled JS, Tokens, AST), 12 loadable examples, keyboard shortcuts
- **Lume showcase page** (`/lume`) with M7-M13 roadmap section
- **Academy integration** (`/academy`) with Natural Language Programming track and CNLD certification
- **Handshake system** that verifies connection on page load
- **Connection status indicator** (green/red) in the playground header
- **Local fallback interpreter** with 50+ English Mode patterns — used until the real API is connected

---

## VERCEL IMPLEMENTATION GUIDE

If you're using Next.js or a similar framework on Vercel, here's how to structure the API routes:

```
api/
  lume/
    handshake.ts     → GET handler
    health.ts        → GET handler
    execute.ts       → POST handler (main endpoint)
    transpile.ts     → POST handler
    tokenize.ts      → POST handler
    ast.ts           → POST handler
    format.ts        → POST handler
    examples.ts      → GET handler
    docs.ts          → GET handler
    intent-info.ts   → GET handler
```

Each file exports a default handler function. The execute, transpile, tokenize, and AST handlers should:
1. Check for `mode: english` or `mode: natural` in the first line of the code
2. If detected, route through the Intent Resolver → get resolved Lume → then process normally
3. If standard mode, process through Lexer → Parser → AST → Transpiler as usual
4. Always include `mode` and `resolvedLume` in the response

---

## TESTING THE CONNECTION

Once the API endpoints are deployed, we can verify the connection with:

```bash
# Health check
curl https://lume-lang.org/api/lume/health

# Handshake
curl https://lume-lang.org/api/lume/handshake

# Execute standard Lume
curl -X POST https://lume-lang.org/api/lume/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello from Lume!\")"}'

# Execute English Mode
curl -X POST https://lume-lang.org/api/lume/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "mode: english\n\nset name to Alice\nshow name"}'
```

Let Jason know when the endpoints are live and we'll switch the proxy on immediately.

---

## CONTACT

- **Ecosystem owner:** Jason (cryptocreeper94@gmail.com)
- **Trust Layer DB user_id:** 49057269
- **DarkWave Studios domain:** darkwavestudios.io
- **Team email:** team@dwsc.io
- **DarkWave Studios API base:** https://darkwavestudios.io/api/lume/*
