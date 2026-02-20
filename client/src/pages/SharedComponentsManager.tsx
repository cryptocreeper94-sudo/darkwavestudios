import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
  ChevronRight,
  Code2,
  Eye,
  Save,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Plus,
  Trash2,
  Layers,
  FileCode,
  Paintbrush,
  Zap,
  Shield,
  Clock,
  Hash,
  AlertTriangle,
  Check,
  Lock,
  ArrowLeft
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { motion, AnimatePresence } from "framer-motion";

interface SharedComponent {
  id: number;
  slug: string;
  name: string;
  type: string;
  description: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  config: any;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type EditorTab = "form" | "html" | "css" | "js";

const ADMIN_KEY = "0424";

const componentTypeOptions = [
  { value: "footer", label: "Footer" },
  { value: "header", label: "Header" },
  { value: "banner", label: "Banner / Announcement" },
  { value: "badge", label: "Badge / Widget" },
  { value: "sidebar", label: "Sidebar" },
  { value: "modal", label: "Modal / Popup" },
  { value: "nav", label: "Navigation" },
  { value: "other", label: "Other" },
];

function extractFormFields(component: SharedComponent) {
  const fields: { key: string; label: string; value: string; type: "text" | "textarea" | "number" }[] = [];

  if (component.type === "banner" || component.slug === "announcement-bar") {
    const textMatch = component.htmlContent.match(/<span[^>]*class="[^"]*text[^"]*"[^>]*>([^<]+)<\/span>/);
    if (textMatch) fields.push({ key: "bannerText", label: "Announcement Text", value: textMatch[1], type: "text" });
    const linkMatch = component.htmlContent.match(/href="([^"]+)"/);
    if (linkMatch) fields.push({ key: "bannerLink", label: "Link URL", value: linkMatch[1], type: "text" });
  }

  if (component.type === "footer" || component.slug === "footer") {
    const tagMatch = component.htmlContent.match(/<p class="dw-sf-tag">([^<]+)<\/p>/);
    if (tagMatch) fields.push({ key: "tagline", label: "Tagline", value: tagMatch[1], type: "textarea" });

    const appsMatch = component.htmlContent.match(/<b>(\d+)<\/b>\s*Apps/);
    if (appsMatch) fields.push({ key: "totalApps", label: "Total Apps", value: appsMatch[1], type: "number" });

    const widgetsMatch = component.htmlContent.match(/<b>(\d+)<\/b>\s*Widgets/);
    if (widgetsMatch) fields.push({ key: "totalWidgets", label: "Total Widgets", value: widgetsMatch[1], type: "number" });

    const locMatch = component.htmlContent.match(/<b>([^<]+)<\/b>\s*LOC/);
    if (locMatch) fields.push({ key: "totalLOC", label: "Total LOC", value: locMatch[1], type: "text" });
  }

  if (component.type === "badge" || component.slug === "trust-badge") {
    const labelMatch = component.htmlContent.match(/class="dw-tb-label">([^<]+)<\/span>/);
    if (labelMatch) fields.push({ key: "badgeLabel", label: "Badge Label", value: labelMatch[1], type: "text" });
    const subMatch = component.htmlContent.match(/class="dw-tb-sub">([^<]+)<\/span>/);
    if (subMatch) fields.push({ key: "badgeSub", label: "Badge Subtitle", value: subMatch[1], type: "text" });
  }

  fields.push({ key: "name", label: "Component Name", value: component.name, type: "text" });
  fields.push({ key: "description", label: "Description", value: component.description || "", type: "textarea" });

  return fields;
}

function applyFormFields(component: SharedComponent, fieldKey: string, newValue: string): Partial<SharedComponent> {
  let html = component.htmlContent;

  if (fieldKey === "name") return { name: newValue };
  if (fieldKey === "description") return { description: newValue };

  if (fieldKey === "bannerText") {
    html = html.replace(/(<span[^>]*class="[^"]*text[^"]*"[^>]*>)[^<]+(<\/span>)/, `$1${newValue}$2`);
  } else if (fieldKey === "bannerLink") {
    html = html.replace(/href="[^"]+"/, `href="${newValue}"`);
  } else if (fieldKey === "tagline") {
    html = html.replace(/<p class="dw-sf-tag">[^<]+<\/p>/, `<p class="dw-sf-tag">${newValue}</p>`);
  } else if (fieldKey === "totalApps") {
    html = html.replace(/<b>\d+<\/b>(\s*Apps)/, `<b>${newValue}</b>$1`);
  } else if (fieldKey === "totalWidgets") {
    html = html.replace(/<b>\d+<\/b>(\s*Widgets)/, `<b>${newValue}</b>$1`);
  } else if (fieldKey === "totalLOC") {
    html = html.replace(/<b>[^<]+<\/b>(\s*LOC)/, `<b>${newValue}</b>$1`);
  } else if (fieldKey === "badgeLabel") {
    html = html.replace(/(class="dw-tb-label">)[^<]+(<\/span>)/, `$1${newValue}$2`);
  } else if (fieldKey === "badgeSub") {
    html = html.replace(/(class="dw-tb-sub">)[^<]+(<\/span>)/, `$1${newValue}$2`);
  }

  return { htmlContent: html };
}

export default function SharedComponentsManager() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [components, setComponents] = useState<SharedComponent[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<Partial<SharedComponent>>({});
  const [activeTab, setActiveTab] = useState<EditorTab>("form");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("other");

  const selected = components.find(c => c.slug === selectedSlug) || null;

  const fetchComponents = useCallback(async () => {
    try {
      const res = await fetch("/api/ecosystem/shared/components");
      const data = await res.json();
      if (data.success) setComponents(data.components);
    } catch { }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchComponents();
  }, [authenticated, fetchComponents]);

  const handleLogin = () => {
    if (password === ADMIN_KEY) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const selectComponent = (slug: string) => {
    setSelectedSlug(slug);
    setEditBuffer({});
    setActiveTab("form");
    setSaveMsg("");
  };

  const getEditValue = (key: keyof SharedComponent) => {
    if (key in editBuffer) return (editBuffer as any)[key];
    return selected ? (selected as any)[key] : "";
  };

  const updateField = (key: string, value: string) => {
    if (!selected) return;
    const updates = applyFormFields({ ...selected, ...editBuffer } as SharedComponent, key, value);
    setEditBuffer(prev => ({ ...prev, ...updates }));
  };

  const updateCode = (key: "htmlContent" | "cssContent" | "jsContent", value: string) => {
    setEditBuffer(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const body: any = {};
      if (editBuffer.name !== undefined) body.name = editBuffer.name;
      if (editBuffer.description !== undefined) body.description = editBuffer.description;
      if (editBuffer.htmlContent !== undefined) body.htmlContent = editBuffer.htmlContent;
      if (editBuffer.cssContent !== undefined) body.cssContent = editBuffer.cssContent;
      if (editBuffer.jsContent !== undefined) body.jsContent = editBuffer.jsContent;
      if (editBuffer.isActive !== undefined) body.isActive = editBuffer.isActive;

      if (Object.keys(body).length === 0) {
        setSaveMsg("No changes to save");
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/ecosystem/shared/components/${selected.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg("Saved! Changes are live across all apps.");
        setEditBuffer({});
        await fetchComponents();
      } else {
        setSaveMsg(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setSaveMsg(`Error: ${err.message}`);
    }
    setSaving(false);
  };

  const handleToggleActive = async () => {
    if (!selected) return;
    const newActive = !(editBuffer.isActive ?? selected.isActive);
    setEditBuffer(prev => ({ ...prev, isActive: newActive }));
  };

  const handleCreate = async () => {
    if (!newSlug || !newName) return;
    setSaving(true);
    try {
      const res = await fetch("/api/ecosystem/shared/components", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY },
        body: JSON.stringify({
          slug: newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          name: newName,
          type: newType,
          htmlContent: `<div class="dw-custom"><!-- Your component HTML --></div>`,
          cssContent: `.dw-custom { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }`,
          jsContent: "",
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowNewForm(false);
        setNewSlug("");
        setNewName("");
        setNewType("other");
        await fetchComponents();
        setSelectedSlug(data.component.slug);
      }
    } catch { }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selected || !confirm(`Delete "${selected.name}" permanently? This will remove it from all apps.`)) return;
    try {
      const res = await fetch(`/api/ecosystem/shared/components/${selected.slug}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": ADMIN_KEY },
      });
      const data = await res.json();
      if (data.success) {
        setSelectedSlug(null);
        await fetchComponents();
      }
    } catch { }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <GlassCard glow className="p-8 rounded-2xl w-[380px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display">Component Manager</h1>
                <p className="text-sm text-muted-foreground">Shared Components System</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                  placeholder="Enter password"
                  data-testid="input-password"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Incorrect password
                  </p>
                )}
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                data-testid="button-login"
              >
                Access Manager
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  const mergedComponent = selected ? { ...selected, ...editBuffer } as SharedComponent : null;
  const formFields = mergedComponent ? extractFormFields(mergedComponent) : [];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)] -z-10" />

      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/developers" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-developers">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span className="font-display text-lg font-bold">Shared Components Manager</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{components.length} components</span>
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-1.5 bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              data-testid="button-new-component"
            >
              <Plus className="w-4 h-4" /> New
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar - Component List */}
          <div className="space-y-3">
            <AnimatePresence>
              {showNewForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <GlassCard className="p-4 rounded-xl space-y-3 mb-3">
                    <h3 className="text-sm font-semibold text-primary">New Component</h3>
                    <input
                      value={newSlug}
                      onChange={e => setNewSlug(e.target.value)}
                      placeholder="slug (e.g. header)"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
                      data-testid="input-new-slug"
                    />
                    <input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="Display Name"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
                      data-testid="input-new-name"
                    />
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                      data-testid="select-new-type"
                    >
                      {componentTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreate}
                        disabled={!newSlug || !newName}
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                        data-testid="button-create-component"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowNewForm(false)}
                        className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                        data-testid="button-cancel-new"
                      >
                        Cancel
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <GlassCard className="p-6 rounded-xl text-center">
                <RefreshCw className="w-5 h-5 text-primary animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </GlassCard>
            ) : (
              components.map(comp => (
                <motion.button
                  key={comp.slug}
                  onClick={() => selectComponent(comp.slug)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selectedSlug === comp.slug
                      ? "bg-primary/10 border-primary/30"
                      : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                  whileHover={{ x: 4 }}
                  data-testid={`button-select-${comp.slug}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{comp.name}</span>
                    <span className={`w-2 h-2 rounded-full ${comp.isActive ? "bg-green-400" : "bg-red-400"}`} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-1.5 py-0.5 rounded bg-white/10">{comp.type}</span>
                    <span>v{comp.version}</span>
                  </div>
                </motion.button>
              ))
            )}
          </div>

          {/* Main Editor Area */}
          {selected ? (
            <div className="space-y-4">
              {/* Top Bar */}
              <GlassCard className="p-4 rounded-xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold font-display">{selected.name}</h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-muted-foreground">{selected.type}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" /> v{selected.version}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(selected.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleActive}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        (editBuffer.isActive ?? selected.isActive) ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                      data-testid="button-toggle-active"
                    >
                      {(editBuffer.isActive ?? selected.isActive) ? (
                        <><ToggleRight className="w-4 h-4" /> Active</>
                      ) : (
                        <><ToggleLeft className="w-4 h-4" /> Inactive</>
                      )}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      data-testid="button-delete-component"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || Object.keys(editBuffer).length === 0}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                      data-testid="button-save"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                  </div>
                </div>
                {saveMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs mt-2 flex items-center gap-1 ${saveMsg.startsWith("Error") ? "text-red-400" : "text-green-400"}`}
                  >
                    {saveMsg.startsWith("Error") ? <AlertTriangle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    {saveMsg}
                  </motion.p>
                )}
              </GlassCard>

              {/* Editor Tabs */}
              <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/10">
                {([
                  { id: "form" as EditorTab, label: "Form Fields", icon: Paintbrush },
                  { id: "html" as EditorTab, label: "HTML", icon: FileCode },
                  { id: "css" as EditorTab, label: "CSS", icon: Paintbrush },
                  { id: "js" as EditorTab, label: "JavaScript", icon: Zap },
                ]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                {/* Editor Panel */}
                <GlassCard className="rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-sm font-semibold">
                      {activeTab === "form" ? "Quick Edit" : activeTab.toUpperCase() + " Source"}
                    </h3>
                  </div>
                  <div className="p-4 max-h-[600px] overflow-y-auto">
                    {activeTab === "form" ? (
                      <div className="space-y-4">
                        {formFields.map(field => (
                          <div key={field.key}>
                            <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                            {field.type === "textarea" ? (
                              <textarea
                                value={field.value}
                                onChange={e => updateField(field.key, e.target.value)}
                                rows={3}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none resize-none"
                                data-testid={`field-${field.key}`}
                              />
                            ) : (
                              <input
                                type={field.type}
                                value={field.value}
                                onChange={e => updateField(field.key, e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
                                data-testid={`field-${field.key}`}
                              />
                            )}
                          </div>
                        ))}
                        {formFields.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            No quick-edit fields available for this component type. Use the HTML/CSS/JS tabs for full editing.
                          </p>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={getEditValue(
                          activeTab === "html" ? "htmlContent" : activeTab === "css" ? "cssContent" : "jsContent"
                        ) as string}
                        onChange={e => updateCode(
                          activeTab === "html" ? "htmlContent" : activeTab === "css" ? "cssContent" : "jsContent",
                          e.target.value
                        )}
                        className="w-full h-[520px] bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-sm text-green-300 font-mono placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none resize-none leading-relaxed"
                        spellCheck={false}
                        data-testid={`editor-${activeTab}`}
                      />
                    )}
                  </div>
                </GlassCard>

                {/* Preview Panel */}
                <GlassCard className="rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold">Live Preview</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 rounded-lg p-0.5">
                      <button
                        onClick={() => setPreviewTheme("dark")}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${previewTheme === "dark" ? "bg-white/10 text-white" : "text-muted-foreground"}`}
                        data-testid="button-theme-dark"
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => setPreviewTheme("light")}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${previewTheme === "light" ? "bg-white/10 text-white" : "text-muted-foreground"}`}
                        data-testid="button-theme-light"
                      >
                        Light
                      </button>
                    </div>
                  </div>
                  <div className="min-h-[520px]">
                    <iframe
                      srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${previewTheme === "dark" ? "#0a0a1a" : "#ffffff"};padding:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}</style><style>${getEditValue("cssContent")}</style></head><body>${(getEditValue("htmlContent") as string).replace(/\{\{theme\}\}/g, previewTheme)}${getEditValue("jsContent") ? `<script>${getEditValue("jsContent")}</script>` : ""}</body></html>`}
                      className="w-full h-[520px] border-0 rounded-b-xl"
                      sandbox="allow-scripts"
                      title="Component Preview"
                      data-testid="preview-iframe"
                    />
                  </div>
                </GlassCard>
              </div>

              {/* Embed Instructions */}
              <GlassCard className="p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Embed This Component</h3>
                </div>
                <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-cyan-300 overflow-x-auto">
                  {`<script src="https://dwsc.io/api/ecosystem/shared/loader.js" data-components="${selected.slug}" data-theme="dark"></script>`}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Or fetch directly: <code className="text-cyan-400">GET /api/ecosystem/shared/render/{selected.slug}?theme=dark</code>
                </p>
              </GlassCard>
            </div>
          ) : (
            <GlassCard glow className="rounded-xl p-12 text-center">
              <Layers className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h2 className="text-xl font-bold font-display mb-2">Select a Component</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Choose a component from the sidebar to view, edit, and preview it. Changes save instantly across all ecosystem apps.
              </p>
              <button
                onClick={() => setShowNewForm(true)}
                className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                data-testid="button-new-component-empty"
              >
                <Plus className="w-4 h-4" /> Create New Component
              </button>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
