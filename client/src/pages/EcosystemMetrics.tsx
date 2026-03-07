import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Code2, FileCode2, Database, Globe, Globe2, Layers, Terminal, 
  BarChart3, TrendingUp, Cpu, Shield, Sparkles, ChevronRight, 
  Server, Smartphone, Palette, Bot, Utensils, Truck, Heart, 
  Car, Building2, Paintbrush, Coffee, Gamepad2, Zap, Radio, Search, LayoutGrid, Trophy, BookOpen, TreePine
} from "lucide-react";
import { SEOHead, BreadcrumbSchema } from "@/components/SEOHead";
import { GlassCard } from "@/components/glass-card";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface AppMetric {
  id: string;
  name: string;
  url: string;
  totalLines: number;
  totalFiles: number;
  apiEndpoints?: number;
  stack: string[];
  breakdown: { language: string; lines: number; files?: number }[];
  highlights?: string[];
  icon: typeof Code2;
  gradient: string;
  status: string;
  version?: string;
}

const ecosystemMetrics: AppMetric[] = [
  {
    id: "trust-hub",
    name: "Trust Layer Hub",
    url: "https://trusthub.tlid.io",
    totalLines: 21026,
    totalFiles: 93,
    apiEndpoints: 66,
    stack: ["React 19", "React Native 0.81", "Expo SDK 54", "TypeScript 5.9", "Node.js 22", "Express 5", "PostgreSQL 16", "Drizzle ORM", "SHA-256", "Stripe", "Plaid", "OpenAI", "ElevenLabs", "Twilio", "Resend", "WebSocket", "PWA"],
    breakdown: [
      { language: "TypeScript/TSX (Frontend)", lines: 15372, files: 60 },
      { language: "TypeScript (Backend)", lines: 5173, files: 32 },
      { language: "HTML (Landing)", lines: 481, files: 1 },
    ],
    highlights: ["Genesis Application (TH-00000001)", "24 Screens", "13 Components", "17 Custom Hooks", "Full DeFi Wallet (5 Staking Pools)", "Liquid Staking (SIG/stSIG)", "DEX Swap Engine", "Plaid Bank Linking", "Encrypted WebSocket Chat", "AI Agent (OpenAI + ElevenLabs TTS)", "Multi-Sig Vault", "15 Database Tables", "70 npm Dependencies", "200K+ TPS / 400ms Finality", "5-Tier Affiliate Program", "3-Tier News Engine"],
    icon: Layers,
    gradient: "from-cyan-500 to-blue-500",
    status: "Production",
  },
  {
    id: "garagebot",
    name: "GarageBot",
    url: "https://garagebot.io",
    totalLines: 111000,
    totalFiles: 400,
    apiEndpoints: 436,
    stack: ["React 18", "TypeScript", "Vite", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "Solana Blockchain", "Stripe", "OpenAI GPT-4o-mini", "WebSocket", "Trust Layer SSO", "Resend", "Meta Graph API", "Google AdSense", "Amazon Associates", "RainViewer", "NOAA", "Leaflet"],
    breakdown: [
      { language: "TypeScript", lines: 48000, files: 170 },
      { language: "React/TSX", lines: 52000, files: 178 },
      { language: "JSON", lines: 5500, files: 38 },
      { language: "CSS", lines: 3500, files: 8 },
      { language: "HTML", lines: 2000, files: 6 },
    ],
    highlights: ["436+ API Endpoints", "134 Tables", "50+ Pages", "58 Components", "93+ Retailers", "Buddy AI Symptom Diagnosis", "P2P Parts Marketplace", "TORQUE Shop OS", "Signal Chat", "54 Affiliate Partnerships"],
    icon: Car,
    gradient: "from-orange-500 to-red-500",
    status: "Production",
  },
  {
    id: "torque",
    name: "TORQUE",
    url: "https://torque.tlid.io",
    totalLines: 5475,
    totalFiles: 10,
    stack: ["React 18", "TypeScript", "Vite", "Framer Motion", "Tailwind CSS", "shadcn/ui", "Solana Blockchain", "Trust Layer SSO", "PWA", "Service Worker"],
    breakdown: [
      { language: "React/TSX", lines: 5155, files: 7 },
      { language: "TypeScript/Config", lines: 200, files: 2 },
      { language: "Service Worker", lines: 120, files: 1 },
    ],
    highlights: ["Standalone PWA", "11 Dashboard Tabs", "5-Step Onboarding", "15 Business Integrations", "Work Orders", "Inventory", "Partner API", "Blockchain Verification"],
    icon: Truck,
    gradient: "from-slate-500 to-zinc-500",
    status: "Production",
  },
  {
    id: "orbit-staffing",
    name: "ORBIT Staffing OS",
    url: "https://orbitstaffing.io",
    totalLines: 316034,
    totalFiles: 6985,
    apiEndpoints: 527,
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM"],
    breakdown: [
      { language: "TypeScript", lines: 314810, files: 6583 },
      { language: "TSX", lines: 0, files: 382 },
      { language: "HTML", lines: 4344, files: 9 },
      { language: "CSS", lines: 4380, files: 11 },
    ],
    highlights: ["Payroll", "Ecosystem", "Compliance", "Franchise", "Blockchain"],
    icon: Building2,
    gradient: "from-blue-500 to-indigo-500",
    status: "Production",
  },
  {
    id: "trust-layer",
    name: "Trust Layer",
    url: "https://dwtl.io",
    totalLines: 243958,
    totalFiles: 555,
    apiEndpoints: 749,
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS v4", "Framer Motion", "Wouter", "TanStack Query", "Node.js", "Express", "Drizzle ORM", "PostgreSQL", "Firebase Auth", "WebAuthn/Passkeys", "Stripe", "Coinbase Commerce", "WebSocket", "OpenAI GPT-4o", "BFT-PoA Blockchain"],
    breakdown: [
      { language: "Frontend (233 pages, 158 components)", lines: 160671, files: 391 },
      { language: "Server (749 endpoints)", lines: 61375, files: 105 },
      { language: "Shared (schema, types, utilities)", lines: 9460, files: 11 },
      { language: "Other (CSS, config, service workers)", lines: 12452 },
    ],
    highlights: ["233 Pages", "158 Components", "749 API Endpoints", "544 Schema Exports", "12 PWA Manifests", "7 Host-Based Domains", "105 Server Files", "3 Service Workers", "5 Cross-Chain Bridges", "12 Arcade Games"],
    icon: Shield,
    gradient: "from-cyan-500 to-blue-500",
    status: "Production",
  },
  {
    id: "pulse",
    name: "Pulse Platform",
    url: "https://darkwavepulse.com",
    totalLines: 209474,
    totalFiles: 5073,
    stack: ["React 19", "Vite 7", "Mastra AI", "PostgreSQL", "Inngest", "Firebase Auth", "Stripe"],
    breakdown: [
      { language: "TypeScript", lines: 91418, files: 3365 },
      { language: "JavaScript", lines: 67968, files: 1708 },
      { language: "CSS/HTML/Shell", lines: 48864 },
    ],
    highlights: ["80,558+ StrikeAgent predictions", "135,769+ ML predictions", "54 AI Agent personas", "Multi-chain wallet (Solana + 22 EVM)"],
    icon: Zap,
    gradient: "from-purple-500 to-pink-500",
    status: "Production",
  },
  {
    id: "paintpros",
    name: "PaintPros",
    url: "https://paintpros.io",
    totalLines: 131059,
    totalFiles: 290,
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM", "Tailwind CSS", "shadcn/ui", "Stripe", "OpenAI", "Weather API"],
    breakdown: [
      { language: "TypeScript/TSX (74 Pages)", lines: 42415, files: 165 },
      { language: "Shared Backend (powers 4 apps)", lines: 87420, files: 125 },
    ],
    highlights: ["74 pages (flagship app)", "Estimating + CRM + crew management", "Marketing automation + payments", "AI tools + customer portals", "Weather system", "Shared backend powers TradeWorks, NashPaint, TLID"],
    icon: Paintbrush,
    gradient: "from-emerald-500 to-teal-500",
    status: "Production",
  },
  {
    id: "lotops-pro",
    name: "LotOps Pro",
    url: "https://lotopspro.io",
    totalLines: 109662,
    totalFiles: 319,
    stack: ["React", "TypeScript", "Express.js", "PostgreSQL", "Drizzle ORM", "Vite", "Tailwind CSS", "shadcn/ui", "Framer Motion", "OpenAI", "Solana", "Stripe", "Twilio", "Tesseract.js OCR"],
    breakdown: [
      { language: "React/TSX", lines: 85326, files: 249 },
      { language: "TypeScript", lines: 20352, files: 48 },
      { language: "Python", lines: 1408, files: 17 },
      { language: "CSS", lines: 1152, files: 1 },
      { language: "HTML", lines: 200, files: 1 },
    ],
    icon: Truck,
    gradient: "from-amber-500 to-orange-500",
    status: "Production",
  },
  {
    id: "orby-commander",
    name: "Orby Commander",
    url: "https://getorby.io",
    totalLines: 70473,
    totalFiles: 192,
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM"],
    breakdown: [
      { language: "TypeScript", lines: 18394, files: 33 },
      { language: "React/TSX", lines: 49765, files: 159 },
      { language: "CSS", lines: 562 },
      { language: "HTML", lines: 528 },
    ],
    highlights: ["Multi-tenant SaaS", "WebSocket real-time", "12+ roles", "251 DB schema exports"],
    icon: Bot,
    gradient: "from-sky-500 to-cyan-500",
    status: "Production",
    version: "v1.0.16",
  },
  {
    id: "brew-board",
    name: "Brew & Board Coffee",
    url: "https://brewandboard.coffee",
    totalLines: 66124,
    totalFiles: 160,
    stack: ["React 18", "TypeScript", "Node.js", "Express", "PostgreSQL", "Stripe", "Solana Blockchain", "Twilio", "DoorDash Drive API"],
    breakdown: [
      { language: "React/TSX", lines: 43299 },
      { language: "TypeScript", lines: 20795, files: 33 },
      { language: "CSS", lines: 740 },
      { language: "HTML", lines: 210 },
    ],
    icon: Coffee,
    gradient: "from-yellow-600 to-amber-600",
    status: "Production",
  },
  {
    id: "tl-driver-connect",
    name: "TL Driver Connect",
    url: "https://tldriverconnect.com",
    totalLines: 110745,
    totalFiles: 611,
    apiEndpoints: 212,
    stack: ["React 19", "TypeScript", "Vite 7", "Tailwind CSS v4", "shadcn/ui", "Framer Motion", "Recharts", "Wouter", "TanStack Query v5", "Express 5", "PostgreSQL", "Drizzle ORM", "2 WebSocket Servers", "Stripe (Live)", "OpenAI", "ElevenLabs TTS", "Tesseract.js", "Leaflet", "Web Push (VAPID)", "Solana", "PWA"],
    breakdown: [
      { language: "TypeScript/TSX (63 pages, 83 components)", lines: 61652, files: 146 },
      { language: "Server (Express 5)", lines: 12083, files: 35 },
      { language: "Shared Schema/Types", lines: 1119, files: 5 },
      { language: "CSS Styling", lines: 459, files: 1 },
    ],
    highlights: ["Shared Codebase with Happy Eats (110,745 LOC)", "63 Pages, 83 Components, 5 Custom Hooks", "212 API Endpoints, 48 DB Tables", "GPS Mileage Tracking + Expense OCR", "Fuel Finder (Diesel/Gas/EV) + Google Maps", "CDL Program Directory + Training Referrals", "Driver Concierge + Weather Dashboard", "Office Dashboard (Expenses, Trips, Revenue)", "Trucker Talk + Signal Chat (8 Channels)", "OrbitStaffing Integration (Payroll/HR)", "Delivery Network + Zone-Based Assignments", "Blockchain-Verified Partner Agreements"],
    icon: Car,
    gradient: "from-cyan-500 to-blue-500",
    status: "Production",
  },
  {
    id: "vedasolus",
    name: "VedaSolus",
    url: "https://vedasolus.io",
    totalLines: 20900,
    totalFiles: 129,
    apiEndpoints: 30,
    stack: ["React 18", "TypeScript", "Vite", "Wouter", "TanStack Query", "shadcn/ui", "Radix UI", "Tailwind CSS v4", "Framer Motion", "Recharts", "React Hook Form", "Zod", "Node.js", "Express", "PostgreSQL", "Drizzle ORM", "OpenAI", "ElevenLabs", "Stripe", "Resend", "Replit Auth", "PWA"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 18500, files: 129 },
      { language: "Server Modules", lines: 1800, files: 25 },
      { language: "CSS/Config", lines: 600, files: 8 },
    ],
    highlights: ["21 Pages", "67 UI Components", "30 API Endpoints", "25 DB Tables", "AI Wellness Coach + Voice", "Dosha Analysis", "Practitioner Marketplace", "Health Passport with QR"],
    icon: Heart,
    gradient: "from-green-500 to-emerald-500",
    status: "Production",
    version: "v2.1",
  },
  {
    id: "trust-shield",
    name: "Guardian Shield / TrustShield",
    url: "https://trustshield.tech",
    totalLines: 1224,
    totalFiles: 3,
    stack: ["React 18", "TypeScript", "Framer Motion", "Tailwind CSS", "Trust Layer"],
    breakdown: [
      { language: "Included in Trust Layer build", lines: 2500, files: 3 },
    ],
    highlights: ["AI Agent Certification", "Public Registry", "Security Audit Workflow", "Enterprise Compliance", "Continuous Monitoring"],
    icon: Shield,
    gradient: "from-red-500 to-orange-500",
    status: "Production",
  },
  {
    id: "strikeagent",
    name: "StrikeAgent",
    url: "https://strikeagent.io",
    totalLines: 46424,
    totalFiles: 134,
    stack: ["React 18", "TypeScript", "Vite", "Node.js", "Express", "PostgreSQL", "Solana Blockchain", "OpenAI GPT-4", "WebSocket"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 42100, files: 120 },
      { language: "JavaScript", lines: 2500, files: 10 },
      { language: "CSS", lines: 400, files: 3 },
      { language: "HTML", lines: 200, files: 1 },
    ],
    highlights: ["Autonomous asset discovery", "Multi-chain scanning", "Safety scoring engine", "Smart auto-trade", "80,558+ predictions"],
    icon: Zap,
    gradient: "from-yellow-500 to-red-500",
    status: "Production",
  },
  {
    id: "tradeworks-ai",
    name: "TradeWorks AI",
    url: "https://tradeworksai.io",
    totalLines: 12455,
    totalFiles: 32,
    stack: ["React 18", "TypeScript", "Vite", "PWA", "PaintPros Shared Backend"],
    breakdown: [
      { language: "TypeScript/TSX (Frontend)", lines: 11231, files: 32 },
    ],
    highlights: ["7 pages with dedicated PWA", "85+ professional calculators", "Voice-to-estimate", "Weather radar", "Mobile field tools", "Shared backend via PaintPros"],
    icon: Layers,
    gradient: "from-indigo-500 to-blue-500",
    status: "Production",
  },
  {
    id: "nash-paint-pros",
    name: "Nashville Painting Professionals",
    url: "https://nashpaintpros.io",
    totalLines: 5174,
    totalFiles: 18,
    stack: ["React 18", "TypeScript", "Vite", "PWA", "PaintPros Shared Backend"],
    breakdown: [
      { language: "TypeScript/TSX (Frontend)", lines: 3950, files: 18 },
    ],
    highlights: ["4 pages with dedicated PWA", "Ecosystem hub for 20+ platforms", "Affiliate tracking", "Lead generation", "Shared backend via PaintPros"],
    icon: Paintbrush,
    gradient: "from-orange-500 to-amber-500",
    status: "Production",
  },
  {
    id: "tlid-io",
    name: "TLID.io",
    url: "https://tlid.io",
    totalLines: 8357,
    totalFiles: 28,
    stack: ["React 18", "TypeScript", "Vite", "PWA", "PaintPros Shared Backend"],
    breakdown: [
      { language: "TypeScript/TSX (Frontend)", lines: 7133, files: 28 },
    ],
    highlights: ["11 pages with dedicated PWA", "5-step onboarding", "Organic posting", "Ad campaigns", "Self-service for any business type", "Shared backend via PaintPros"],
    icon: TrendingUp,
    gradient: "from-blue-500 to-purple-500",
    status: "Production",
  },
  {
    id: "chronicles",
    name: "Chronicles",
    url: "https://yourlegacy.io",
    totalLines: 36947,
    totalFiles: 40,
    stack: ["React 18", "TypeScript", "Framer Motion", "OpenAI GPT-4o", "Web Audio API", "WebSocket", "TanStack Query", "PostgreSQL", "Credits System", "Trust Layer"],
    breakdown: [
      { language: "Client Pages (27)", lines: 21586, files: 27 },
      { language: "Client Components (5)", lines: 1255, files: 5 },
      { language: "Audio Engine", lines: 676, files: 1 },
      { language: "Server Services (9)", lines: 8958, files: 9 },
    ],
    highlights: ["Procedural Ambient Audio Engine (21 soundscapes)", "Daily Life System (30+ careers, 4 shifts, 5 ranks)", "Faith & Spiritual Life System", "Geographic Travel with Era-Specific Destinations", "Season Zero: Medieval, Wild West, Modern", "Interactive Play Page with AI Scenarios", "Estate & Interior Customization", "NPC System with AI Chat", "Marketplace & In-Game Economy", "Voice System, Pets, City, World Clock"],
    icon: Gamepad2,
    gradient: "from-amber-500 to-red-500",
    status: "Production",
  },
  {
    id: "the-arcade",
    name: "The Arcade",
    url: "https://darkwavegames.io",
    totalLines: 6500,
    totalFiles: 28,
    stack: ["React 18", "TypeScript", "Framer Motion", "Canvas API", "Stripe", "Trust Layer"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 4800, files: 24 },
      { language: "CSS/Config", lines: 476, files: 4 },
    ],
    highlights: ["Orbit Crash (multiplier)", "Dragon's Fortune Slots", "Arcade Collection", "Provably Fair System", "Gold & Sweeps Coins via Stripe", "Sweepstakes Compliance", "Game Developer Portal"],
    icon: Gamepad2,
    gradient: "from-pink-500 to-rose-500",
    status: "Production",
  },
  {
    id: "dwsc-studio",
    name: "DarkWave Studio",
    url: "https://studio.tlid.io",
    totalLines: 8230,
    totalFiles: 32,
    stack: ["React 18", "TypeScript", "Framer Motion", "Monaco Editor", "Docker", "JWT", "Trust Layer"],
    breakdown: [
      { language: "TypeScript/TSX (Frontend)", lines: 5200, files: 22 },
      { language: "TypeScript (Backend)", lines: 1806, files: 10 },
    ],
    highlights: ["Browser-Based IDE", "Smart Contract Dev", "Docker Sandboxed Execution", "JWT Auth Sessions", "Resource Enforcement", "Project Management", "Developer Portal"],
    icon: Terminal,
    gradient: "from-cyan-500 to-blue-500",
    status: "Production",
  },
  {
    id: "trusthome",
    name: "TrustHome",
    url: "https://trusthome.tlid.io",
    totalLines: 27877,
    totalFiles: 109,
    apiEndpoints: 103,
    stack: ["Expo React Native", "TypeScript", "Expo Router", "Express.js", "PostgreSQL", "Drizzle ORM", "OpenAI GPT-5.2", "ElevenLabs TTS", "Socket.IO", "Resend", "React Query", "Reanimated", "Zod", "TrustLayer SSO", "PWA"],
    breakdown: [
      { language: "TypeScript/TSX (Frontend)", lines: 20717, files: 68 },
      { language: "TypeScript (Backend)", lines: 3897, files: 35 },
      { language: "Landing/Templates", lines: 2039, files: 6 },
    ],
    highlights: ["Expo React Native (iOS/Android/Web)", "Voice AI (STT/TTS/Chat via GPT-5.2)", "Blockchain doc vault", "20 screens, 21 components", "103 API endpoints, 6 DB tables", "CRM + AI lead scoring", "Business suite with OCR", "MLS integration (10+ providers)", "Founders Program pricing", "Woman-owned (WOSB)"],
    icon: Building2,
    gradient: "from-teal-500 to-emerald-500",
    status: "Production",
  },
  {
    id: "trustvault",
    name: "TrustVault",
    url: "https://trustvault.tlid.io",
    totalLines: 46697,
    totalFiles: 172,
    apiEndpoints: 156,
    stack: ["React 18", "TypeScript", "Vite", "shadcn/ui", "Framer Motion", "Wouter", "TanStack Query v5", "Express.js", "PostgreSQL", "Drizzle ORM", "Stripe", "OpenAI GPT-5.1", "GPT-4.1-mini", "ElevenLabs TTS", "Web Speech API", "Replit Object Storage", "Uppy", "TrustLayer SSO", "WebSocket", "Resend", "Zod", "FFmpeg", "JSZip", "PWA"],
    breakdown: [
      { language: "React/TSX (29 pages, 30 components)", lines: 35641, files: 130 },
      { language: "TypeScript Backend (Express)", lines: 10169, files: 38 },
      { language: "Shared (schemas, contracts)", lines: 887, files: 4 },
    ],
    highlights: ["14 AI Creative Tools + Spinny Agent", "Image/Audio/Video/Merge Editors", "17 Transition Effects (FFmpeg xfade)", "Layer Panel + Visual History (30 states)", "Watermark Tool + Eyedropper", "Voice-Commanded Editing", "Beat-Sync Video Maker", "4-Tier Stripe Subscriptions", "Signal Chat + TrustLayer SSO", "AI Blog Platform", "Multi-Tenant Family Vault", "156 API Endpoints", "PWA + Offline Ready"],
    icon: Shield,
    gradient: "from-emerald-500 to-cyan-500",
    status: "Production",
  },
  {
    id: "guardian-scanner",
    name: "Guardian Scanner",
    url: "https://guardianscanner.tlid.io",
    totalLines: 1224,
    totalFiles: 12,
    stack: ["React 18", "TypeScript", "Axios", "WebSocket", "Trust Layer", "PWA"],
    breakdown: [
      { language: "Included in Trust Layer build", lines: 7000, files: 12 },
    ],
    highlights: ["AI Agent Certification", "URL/Website Scanning", "Guardian Trust Score", "Public Registry", "Guardian Shield Monitoring", "Mobile-First PWA"],
    icon: Search,
    gradient: "from-green-500 to-emerald-500",
    status: "Production",
  },
  {
    id: "signal-chat",
    name: "Signal Chat",
    url: "https://signalchat.tlid.io",
    totalLines: 1224,
    totalFiles: 8,
    stack: ["React 18", "TypeScript", "WebSocket", "JWT", "bcryptjs", "Trust Layer SSO"],
    breakdown: [
      { language: "Included in Trust Layer build", lines: 4000, files: 8 },
    ],
    highlights: ["Real-time WebSocket", "Cross-App JWT SSO", "Channel Management", "Community Hub", "Invite System", "User Presence"],
    icon: Radio,
    gradient: "from-purple-500 to-pink-500",
    status: "Production",
  },
  {
    id: "the-void",
    name: "THE VOID",
    url: "https://intothevoid.app",
    totalLines: 23532,
    totalFiles: 107,
    apiEndpoints: 72,
    stack: ["React 18", "Vite", "Tailwind CSS", "Framer Motion", "shadcn/ui", "Wouter", "TanStack Query", "Express.js", "PostgreSQL", "Drizzle ORM", "OpenAI GPT-5.2", "gpt-4o-mini-transcribe", "TTS", "Stripe", "Resend", "WebSocket", "Replit Auth OIDC", "PWA", "Capacitor"],
    breakdown: [
      { language: "React/TSX (27 pages)", lines: 12800, files: 45 },
      { language: "TypeScript (Server)", lines: 5400, files: 18 },
      { language: "Shared Schema/Types", lines: 1200, files: 5 },
      { language: "Config/PWA/Assets", lines: 4132, files: 39 },
    ],
    highlights: ["5 AI Personalities (GPT-5.2)", "Emotional Voice Fingerprint", "Living Mood Portrait", "Void Echo Time Capsules", "Voice Journal", "Zen Zone + Sleep Sounds", "Virtual Rage Room", "72 API Endpoints", "20+ DB Tables", "Stripe Subscriptions", "Blockchain Void IDs", "Capacitor iOS/Android"],
    icon: Radio,
    gradient: "from-violet-500 to-purple-500",
    status: "Production",
  },
  {
    id: "guardian-screener",
    name: "Guardian Screener",
    url: "https://guardianscreener.tlid.io",
    totalLines: 0,
    totalFiles: 0,
    stack: ["React 18", "Vite", "Tailwind CSS 4", "Framer Motion", "PWA", "TypeScript"],
    breakdown: [],
    highlights: ["AI Pattern Detection", "Multi-Chain DEX", "Predictive Analytics", "Rug Pull Detection", "Whale Tracking", "24/7 Alerts"],
    icon: Search,
    gradient: "from-cyan-500 to-blue-500",
    status: "Under Development",
  },
  {
    id: "darkwave-academy",
    name: "DarkWave Academy",
    url: "https://academy.tlid.io",
    totalLines: 1224,
    totalFiles: 6,
    stack: ["React 18", "TypeScript", "Stripe Subscriptions", "PWA", "Trust Layer"],
    breakdown: [
      { language: "Included in Trust Layer build", lines: 5000, files: 6 },
    ],
    highlights: ["6 Course Tracks", "3 Certifications", "Stripe Subscriptions", "Installable PWA", "Education Platform"],
    icon: Sparkles,
    gradient: "from-yellow-500 to-amber-500",
    status: "Production",
  },
  {
    id: "happy-eats",
    name: "Happy Eats",
    url: "https://happyeats.app",
    totalLines: 110745,
    totalFiles: 611,
    apiEndpoints: 212,
    stack: ["React 19", "TypeScript", "Vite 7", "Tailwind CSS v4", "shadcn/ui", "Framer Motion", "Recharts", "Wouter", "TanStack Query v5", "Express 5", "PostgreSQL", "Drizzle ORM", "2 WebSocket Servers", "Stripe (Live)", "OpenAI", "ElevenLabs TTS", "Tesseract.js", "Uppy", "Web Push (VAPID)", "Solana", "PWA"],
    breakdown: [
      { language: "TypeScript/TSX (63 pages, 83 components)", lines: 61652, files: 146 },
      { language: "Server (Express 5)", lines: 12083, files: 35 },
      { language: "Shared Schema/Types", lines: 1119, files: 5 },
      { language: "CSS Styling", lines: 459, files: 1 },
    ],
    highlights: ["Shared Codebase with TL Driver Connect (110,745 LOC)", "Zone-Based Batch Ordering (11 Zones)", "Multi-Truck Cart + $3.99 Delivery", "Vendor Self-Service Portal + Menu Management", "AI Marketing Hub + Flyer Creator", "TLI d.io Automated Social Posting", "Receipt Scanner (OCR via Tesseract.js)", "Customer Rewards + Referral Program", "Trucker Talk + Signal Chat (8 Channels)", "Franchise Model + Territory Isolation", "Stripe Live Checkout + Revenue Dashboard", "Blockchain-Verified Transactions"],
    icon: Utensils,
    gradient: "from-orange-500 to-red-500",
    status: "Production",
  },
  {
    id: "trust-book",
    name: "Trust Book",
    url: "https://trustbook.tlid.io",
    totalLines: 9861,
    totalFiles: 4,
    apiEndpoints: 5,
    stack: ["React 18", "TypeScript", "Vite", "Wouter", "OpenAI TTS", "Framer Motion", "Express", "PostgreSQL", "Drizzle ORM"],
    breakdown: [
      { language: "TypeScript (Landing)", lines: 521, files: 1 },
      { language: "TypeScript (Reader)", lines: 1466, files: 1 },
      { language: "Markdown (Content)", lines: 7754, files: 1 },
      { language: "TypeScript (API)", lines: 120, files: 1 },
    ],
    highlights: ["Immersive E-Reader", "AI Narration (Nova HD)", "PDF/EPUB Downloads", "110K Word Flagship Title", "Chapter Navigation", "Blockchain Provenance", "PWA"],
    icon: BookOpen,
    gradient: "from-cyan-500 to-purple-500",
    status: "Production",
  },
  {
    id: "trust-golf",
    name: "Trust Golf",
    url: "https://trustgolf.app",
    totalLines: 14576,
    totalFiles: 61,
    apiEndpoints: 53,
    stack: ["React Native 0.81", "Expo SDK 54", "Expo Router", "TypeScript", "React Query", "Express 5", "PostgreSQL", "Drizzle ORM", "OpenAI GPT-4o", "Resend", "Leaflet", "Esri", "react-native-maps", "expo-location", "bcryptjs", "JWT", "Replit Object Storage", "esbuild", "PWA"],
    breakdown: [
      { language: "TypeScript (Server)", lines: 3352, files: 7 },
      { language: "TypeScript (Frontend)", lines: 9741, files: 49 },
      { language: "Web/PWA", lines: 808, files: 5 },
    ],
    highlights: ["17 Shipped Features", "45 Courses (World-Class + Regional)", "AI Swing Analyzer (GPT-4o Vision)", "Video Playback (0.25x/0.5x/1x)", "GPS Distance Finder (Satellite + Haversine)", "USGA Handicap Index (Auto-Calculated)", "Hole-by-Hole Scorecards", "Cinematic Explorer (3 AI Videos)", "AI-Driven SEO Blog", "Self-Hosted First-Party Analytics", "Vendor/Partner Portal + Resend Email", "TrustVault Integration"],
    icon: Trophy,
    gradient: "from-emerald-600 to-green-500",
    status: "Production",
  },
  {
    id: "verdara",
    name: "Verdara",
    url: "https://verdara.tlid.io",
    totalLines: 35500,
    totalFiles: 180,
    apiEndpoints: 85,
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Framer Motion", "Wouter", "TanStack Query", "Express", "PostgreSQL", "Drizzle ORM", "OpenAI", "Leaflet", "PWA"],
    breakdown: [
      { language: "TypeScript/TSX (41 pages)", lines: 27000, files: 140 },
      { language: "TypeScript Backend", lines: 6500, files: 30 },
      { language: "Shared/Config", lines: 2000, files: 10 },
    ],
    highlights: ["AI Species Identification", "Trail Mapping", "Trip Planner", "Campground Booking", "Marketplace", "125+ Locations", "41 States", "18 Activity Categories", "138+ Features", "Companion App: Arbora"],
    icon: Globe2,
    gradient: "from-lime-500 to-emerald-500",
    status: "Production",
  },
  {
    id: "bomber",
    name: "Bomber",
    url: "https://bomber.tlid.io",
    totalLines: 4500,
    totalFiles: 15,
    stack: ["React 18", "TypeScript", "Vite", "Canvas API", "Framer Motion", "Tailwind CSS", "Trust Layer", "PWA"],
    breakdown: [
      { language: "TypeScript/TSX", lines: 3800, files: 12 },
      { language: "Config/PWA", lines: 700, files: 3 },
    ],
    highlights: ["Action Arcade Gameplay", "Blockchain Achievements", "SIG Rewards", "Hallmark-Verified Records", "Installable PWA", "Trust Layer Ecosystem"],
    icon: Gamepad2,
    gradient: "from-red-500 to-yellow-500",
    status: "Production",
  },
  {
    id: "arbora",
    name: "Arbora",
    url: "https://arbora.tlid.io",
    totalLines: 8000,
    totalFiles: 28,
    apiEndpoints: 22,
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Express", "PostgreSQL", "Drizzle ORM", "PWA"],
    breakdown: [
      { language: "TypeScript/TSX (10 pages)", lines: 6200, files: 20 },
      { language: "TypeScript Backend", lines: 1400, files: 6 },
      { language: "Shared/Config", lines: 400, files: 2 },
    ],
    highlights: ["Full CRM", "Estimates & Invoicing", "Job Scheduling", "Crew Management", "Inventory Tracking", "Mobile Field Tools", "On-Site Assessments", "Standalone PWA", "10 Pages", "Verdara Ecosystem"],
    icon: TreePine,
    gradient: "from-green-500 to-teal-500",
    status: "Production",
  },
  {
    id: "trustgen",
    name: "TrustGen",
    url: "https://trustgen.tlid.io",
    totalLines: 18700,
    totalFiles: 62,
    apiEndpoints: 50,
    stack: ["React 18", "TypeScript", "Vite", "Three.js", "React Three Fiber", "Drei", "Meshy.ai", "OpenAI GPT-4o", "Zustand", "Monaco Editor", "React Router DOM v6", "Node.js", "Express", "PostgreSQL", "Stripe", "Twilio", "JWT", "Trust Layer", "PWA"],
    breakdown: [
      { language: "TypeScript/TSX (7 pages, 17 components)", lines: 9300, files: 41 },
      { language: "CSS (7,400+ lines hand-crafted)", lines: 7400, files: 14 },
      { language: "Backend (Express API)", lines: 2000, files: 7 },
    ],
    highlights: ["3D Creation Studio", "Studio IDE (Monaco Editor)", "AI Text-to-3D (Meshy.ai)", "Auto-Rigging Engine", "Skeletal Animation Player", "GPU Particle System", "Post-Processing (7 FX)", "Animation Timeline (Keyframes)", "AI Code Assistant (GPT-4o)", "9 Project Templates", "Command Palette", "Scene Hierarchy", "20+ Database Tables", "Blockchain Hallmarks", "Deploy to .trustgen.app", "Stripe Subscriptions", "Signal Chat", "SMS Alerts (Twilio)"],
    icon: Sparkles,
    gradient: "from-purple-500 to-cyan-500",
    status: "Production",
  },
  {
    id: "lume",
    name: "Lume",
    url: "https://lume-lang.org",
    totalLines: 12215,
    totalFiles: 41,
    apiEndpoints: 15,
    stack: ["Node.js", "JavaScript", "Vite 6", "React 19", "React Router 7", "Framer Motion", "Custom CSS", "Trust Layer SSO", "Signal Chat", "WebSocket"],
    breakdown: [
      { language: "Language Core (lexer, parser, transpiler, formatter, linter, stdlib, runtime)", lines: 5128, files: 7 },
      { language: "Self-Sustaining Runtime (monitor, healer, optimizer, evolver)", lines: 1223, files: 4 },
      { language: "Test Suite (219 tests, 6 milestones)", lines: 1998, files: 6 },
      { language: "Website (React SPA)", lines: 3519, files: 14 },
      { language: "CLI + Editor Grammar + Config", lines: 1347, files: 10 },
    ],
    highlights: ["AI as Syntax (ask/think/generate)", "4-Layer Self-Sustaining Runtime", "219 Tests (100% Pass Rate)", "6 Milestones Complete", "Full Toolchain (run/build/test/fmt/lint/repl/watch)", "15 Lint Rules with Fixes", "Interactive REPL", "Source Maps", "VS Code Grammar", "Trust Layer SSO", "Signal Chat", "Blockchain Hallmarks", "4-Tier Affiliate Program"],
    icon: Code2,
    gradient: "from-cyan-500 to-teal-500",
    status: "Production",
  },
];

function AnimatedCounter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

function LanguageBar({ breakdown, totalLines }: { breakdown: AppMetric["breakdown"]; totalLines: number }) {
  const colors = [
    "bg-gradient-to-r from-cyan-400 to-blue-500",
    "bg-gradient-to-r from-purple-400 to-pink-500",
    "bg-gradient-to-r from-amber-400 to-orange-500",
    "bg-gradient-to-r from-emerald-400 to-green-500",
    "bg-gradient-to-r from-rose-400 to-red-500",
    "bg-gradient-to-r from-indigo-400 to-violet-500",
  ];

  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden bg-white/5 mb-3">
        {breakdown.map((item, i) => {
          const pct = (item.lines / totalLines) * 100;
          if (pct < 1) return null;
          return (
            <div
              key={i}
              className={`${colors[i % colors.length]} transition-all duration-1000`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {breakdown.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
            <span>{item.language}</span>
            <span className="text-white/40">{item.lines.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EcosystemMetrics() {
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const totalLines = ecosystemMetrics.reduce((sum, app) => sum + app.totalLines, 0);
  const totalFiles = ecosystemMetrics.reduce((sum, app) => sum + app.totalFiles, 0);
  const totalApps = ecosystemMetrics.length;
  const totalEndpoints = ecosystemMetrics.reduce((sum, app) => sum + (app.apiEndpoints || 0), 0);
  const uniqueStack = Array.from(new Set(ecosystemMetrics.flatMap(app => app.stack)));

  const sortedApps = [...ecosystemMetrics].sort((a, b) => b.totalLines - a.totalLines);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title="Ecosystem Metrics - DarkWave Studios"
        description={`${totalLines.toLocaleString()}+ lines of hand-written code across ${totalApps} production applications. Explore the full Trust Layer ecosystem codebase.`}
        keywords="Trust Layer ecosystem metrics, codebase statistics, lines of code, production applications, full-stack development"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://darkwavestudios.io" },
          { name: "Ecosystem", url: "https://darkwavestudios.io/ecosystem" },
          { name: "Metrics", url: "https://darkwavestudios.io/metrics" },
        ]}
      />

      <div className="fixed inset-0 bg-background -z-20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.08),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center_right,rgba(6,182,212,0.06),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/60 border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ecosystem" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all duration-300" data-testid="back-ecosystem">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Ecosystem Metrics</span>
            </div>
          </div>
          <Link 
            href="/ecosystem"
            className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
            data-testid="button-view-apps"
          >
            <span className="relative z-10">View Apps</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-sm font-semibold text-primary mb-8 shadow-lg shadow-primary/10">
            <Terminal className="w-4 h-4" />
            Living Codebase Metrics
          </div>
          <h1 className="text-4xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-primary to-purple-400 bg-clip-text text-transparent">
              <AnimatedCounter target={totalLines} duration={2500} />
            </span>
            <span className="block text-xl lg:text-3xl mt-2 text-white/60 font-medium">Lines of Hand-Written Code</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            Across {totalApps} production applications. No boilerplate. No generated output. 
            Pure, hand-crafted source code powering the entire Trust Layer ecosystem.
          </p>
          <p className="text-xs text-muted-foreground/50 mt-4">
            Last updated: February 14, 2026 &middot; Excludes node_modules, build artifacts, and lock files
          </p>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-16 lg:mb-24"
        >
          {[
            { icon: Code2, label: "Total Lines", value: totalLines, gradient: "from-cyan-500/20 to-blue-500/20", color: "text-cyan-400" },
            { icon: FileCode2, label: "Source Files", value: totalFiles, gradient: "from-purple-500/20 to-pink-500/20", color: "text-purple-400" },
            { icon: Layers, label: "Applications", value: totalApps, gradient: "from-amber-500/20 to-orange-500/20", color: "text-amber-400" },
            { icon: Server, label: "API Endpoints", value: totalEndpoints, gradient: "from-emerald-500/20 to-green-500/20", color: "text-emerald-400" },
            { icon: LayoutGrid, label: "Widgets", value: 102, gradient: "from-indigo-500/20 to-violet-500/20", color: "text-indigo-400" },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <GlassCard variant="stat" className="rounded-2xl p-6 lg:p-8 text-center hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 group" data-testid={`stat-card-${i}`}>
                <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className={`text-3xl lg:text-4xl font-bold font-display ${stat.color} mb-1`}>
                  <AnimatedCounter target={stat.value} duration={2000} suffix={stat.value > 1000 ? "+" : ""} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 lg:mb-24"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
            <h2 className="text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Codebase Breakdown
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-8 ml-4">Ranked by lines of code. Click any app to expand details.</p>

          <div className="space-y-4">
            {sortedApps.map((app, index) => {
              const isExpanded = expandedApp === app.id;
              const pctOfTotal = ((app.totalLines / totalLines) * 100).toFixed(1);

              return (
                <div
                  key={app.id}
                  className={`relative group cursor-pointer transition-all duration-500 ${isExpanded ? 'scale-[1.01]' : 'hover:scale-[1.005]'}`}
                  onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                  data-testid={`app-metric-${app.id}`}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${app.gradient} opacity-0 ${isExpanded ? 'opacity-[0.08]' : 'group-hover:opacity-[0.05]'} transition-opacity duration-500`} />
                  <GlassCard variant="feature" className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${isExpanded ? 'border-primary/30 shadow-xl shadow-primary/5' : ''}`}>
                    <div className="p-5 lg:p-6">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                          <div className="text-lg font-mono text-white/20 w-8 text-right">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg`}>
                            <app.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-display font-bold text-lg lg:text-xl truncate">{app.name}</h3>
                            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold uppercase tracking-wider">{app.status}</span>
                            {app.version && (
                              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50 font-mono">{app.version}</span>
                            )}
                          </div>
                          <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5" />
                              {app.totalLines.toLocaleString()} lines
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FileCode2 className="w-3.5 h-3.5" />
                              {app.totalFiles.toLocaleString()} files
                            </span>
                            {app.apiEndpoints && (
                              <span className="flex items-center gap-1.5">
                                <Server className="w-3.5 h-3.5" />
                                {app.apiEndpoints} endpoints
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-6 shrink-0">
                          <div className="text-right">
                            <div className="text-2xl font-bold font-display bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                              {app.totalLines.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">{pctOfTotal}% of ecosystem</div>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>

                        <div className="lg:hidden text-right shrink-0">
                          <div className="text-lg font-bold">{(app.totalLines / 1000).toFixed(0)}k</div>
                          <div className="text-[10px] text-muted-foreground">{pctOfTotal}%</div>
                        </div>
                      </div>

                      <div className="mt-4 lg:hidden flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{app.totalFiles.toLocaleString()} files</span>
                        {app.apiEndpoints && <span>{app.apiEndpoints} endpoints</span>}
                      </div>

                      <div className="mt-4">
                        <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${app.gradient} transition-all duration-1000`}
                            style={{ width: `${(app.totalLines / sortedApps[0].totalLines) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-5 lg:px-6 pb-6 pt-2 border-t border-white/5">
                        <div className="grid lg:grid-cols-2 gap-6 mt-4">
                          <div>
                            <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                              <Palette className="w-4 h-4 text-primary" />
                              Language Breakdown
                            </h4>
                            <LanguageBar breakdown={app.breakdown} totalLines={app.totalLines} />
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-primary" />
                              Tech Stack
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {app.stack.map((tech, i) => (
                                <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {app.highlights && (
                          <div className="mt-5">
                            <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              Highlights
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {app.highlights.map((h, i) => (
                                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-5 flex items-center gap-3">
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
                            onClick={(e) => e.stopPropagation()}
                            data-testid={`visit-${app.id}`}
                          >
                            Visit Live App
                          </a>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 lg:mb-24"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            <h2 className="text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Technology Footprint
            </h2>
          </div>

          <GlassCard glow className="rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold">{uniqueStack.length} Technologies</h3>
              <span className="text-xs text-muted-foreground">across the ecosystem</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {uniqueStack.sort().map((tech, i) => (
                <span
                  key={i}
                  className="text-sm px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/40 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-default"
                  data-testid={`tech-${tech.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard glow className="rounded-3xl p-10 lg:p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Growing Every Day
            </h2>
            <p className="text-muted-foreground mb-3 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
              These metrics are updated after every development session. The Trust Layer ecosystem 
              is continuously evolving with new features, applications, and improvements.
            </p>
            <p className="text-xs text-muted-foreground/60 mb-8">
              Additional apps pending metrics: StrikeAgent, Trust Shield, Chronicles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ecosystem"
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                data-testid="button-explore-ecosystem"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore the Ecosystem
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/investors"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 font-semibold hover:bg-white/10 hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-2"
                data-testid="button-investor-info"
              >
                Investor Information
              </Link>
            </div>
          </GlassCard>
        </motion.section>
      </main>

      <footer className="border-t border-white/5 py-10 backdrop-blur-xl bg-background/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">DarkWave Studios, LLC &middot; All metrics represent hand-written source code only</p>
        </div>
      </footer>
    </div>
  );
}
