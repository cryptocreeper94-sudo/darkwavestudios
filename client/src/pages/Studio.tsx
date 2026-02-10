import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft, Upload, FolderPlus, Play, Download, RefreshCw,
  Film, Image, Music, FileText, Clock, CheckCircle, AlertCircle,
  Monitor, Grid, List, Search, Filter, ChevronRight, Loader2, LogIn, Shield
} from "lucide-react";
import Footer from "@/components/Footer";

function Studio() {
  const [token, setToken] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"media" | "projects" | "editor" | "events">("media");
  const [mediaCategory, setMediaCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const saved = localStorage.getItem("trustvault_token") || localStorage.getItem("signal_chat_token");
    if (saved) setToken(saved);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (creds: { username: string; password: string }) => {
      const res = await fetch("/api/chat/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("trustvault_token", data.token);
        setLoginError("");
      } else {
        setLoginError(data.error || "Login failed");
      }
    },
  });

  const { data: connectionStatus, isLoading: checkingConnection } = useQuery({
    queryKey: ["trustvault-status", token],
    queryFn: async () => {
      const res = await fetch("/api/trustvault/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
    retry: false,
  });

  const { data: mediaData, isLoading: loadingMedia } = useQuery({
    queryKey: ["trustvault-media", token, mediaCategory],
    queryFn: async () => {
      const params = new URLSearchParams({ page: "1", limit: "20" });
      if (mediaCategory !== "all") params.set("category", mediaCategory);
      const res = await fetch(`/api/trustvault/media?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token && activeTab === "media",
  });

  const { data: eventsData } = useQuery({
    queryKey: ["trustvault-events", token],
    queryFn: async () => {
      const res = await fetch("/api/trustvault/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token && activeTab === "events",
    refetchInterval: 10000,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: { name: string; type: string }) => {
      const res = await fetch("/api/trustvault/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(projectData),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trustvault-media"] }),
  });

  const uploadMutation = useMutation({
    mutationFn: async (uploadData: { filename: string; contentType: string; size: number }) => {
      const res = await fetch("/api/trustvault/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(uploadData),
      });
      return res.json();
    },
  });

  const embedMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const res = await fetch("/api/trustvault/editor/embed-token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectId }),
      });
      return res.json();
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("trustvault_token");
  };

  const categoryIcons: Record<string, any> = {
    all: Grid, video: Film, image: Image, audio: Music, document: FileText,
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto px-4 pt-32 pb-20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-4">
              <Monitor className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">TrustVault Studio</h1>
            <p className="text-gray-400">Sign in with your Trust Layer account to access the media editor</p>
          </div>

          <form onSubmit={handleLogin} className="glass-card p-6 rounded-xl space-y-4" data-testid="studio-login-form">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(f => ({ ...f, username: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                placeholder="Your Trust Layer username"
                data-testid="input-studio-username"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                placeholder="Your password"
                data-testid="input-studio-password"
              />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 font-semibold transition-all flex items-center justify-center gap-2"
              data-testid="button-studio-login"
            >
              {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              Sign In
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Uses Trust Layer SSO — same account as Signal Chat
            </p>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition" data-testid="button-studio-back">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">TrustVault Studio</h1>
              <p className="text-gray-400 text-sm">Media editor powered by TrustVault</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Connected via Trust Layer SSO</span>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition" data-testid="button-studio-logout">
              Sign Out
            </button>
          </div>
        </div>

        {checkingConnection && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <span className="ml-3 text-gray-400">Connecting to TrustVault...</span>
          </div>
        )}

        {!checkingConnection && connectionStatus?.error && (
          <div className="glass-card p-8 rounded-xl text-center">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Connection Issue</h2>
            <p className="text-gray-400 mb-4">{connectionStatus.error}</p>
            <p className="text-sm text-gray-500">TrustVault may be temporarily unavailable. Your Trust Layer SSO token is valid — try again in a moment.</p>
          </div>
        )}

        {!checkingConnection && !connectionStatus?.error && (
          <>
            <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
              {(["media", "projects", "editor", "events"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium capitalize transition ${
                    activeTab === tab ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                  data-testid={`tab-studio-${tab}`}
                >
                  {tab === "events" ? "Render Events" : tab}
                </button>
              ))}
            </div>

            {activeTab === "media" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {Object.entries(categoryIcons).map(([cat, Icon]) => (
                      <button
                        key={cat}
                        onClick={() => setMediaCategory(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
                          mediaCategory === cat ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"
                        }`}
                        data-testid={`filter-media-${cat}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{cat}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none w-48"
                        data-testid="input-media-search"
                      />
                    </div>
                    <button
                      onClick={() => uploadMutation.mutate({ filename: "new-upload", contentType: "video/mp4", size: 0 })}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-sm font-medium transition"
                      data-testid="button-upload-media"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                </div>

                {loadingMedia ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="aspect-video bg-white/5 rounded-xl shimmer-skeleton" />
                    ))}
                  </div>
                ) : mediaData?.items?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mediaData.items.map((item: any) => (
                      <div key={item.id} className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-purple-500/50 transition" data-testid={`media-item-${item.id}`}>
                        <div className="aspect-video bg-white/5 flex items-center justify-center relative">
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt={item.filename} className="w-full h-full object-cover" />
                          ) : (
                            <Film className="w-8 h-8 text-gray-600" />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium truncate">{item.filename || item.name}</p>
                          <p className="text-xs text-gray-500">{item.category || "video"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No media yet</h3>
                    <p className="text-gray-400 text-sm mb-4">Upload your first file to get started with TrustVault Studio</p>
                    <button
                      onClick={() => uploadMutation.mutate({ filename: "new-upload", contentType: "video/mp4", size: 0 })}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-sm font-medium"
                      data-testid="button-upload-empty"
                    >
                      Upload Media
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Projects</h2>
                  <button
                    onClick={() => createProjectMutation.mutate({ name: `Project ${Date.now()}`, type: "video" })}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-sm font-medium hover:from-purple-500 hover:to-cyan-500 transition"
                    data-testid="button-create-project"
                  >
                    <FolderPlus className="w-4 h-4" />
                    New Project
                  </button>
                </div>

                <div className="text-center py-20">
                  <FolderPlus className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Create your first project</h3>
                  <p className="text-gray-400 text-sm">Projects let you organize media, edit timelines, and export renders</p>
                </div>
              </div>
            )}

            {activeTab === "editor" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">Embedded Editor</h2>
                  <p className="text-gray-400 text-sm">Open TrustVault's full media editor directly in DarkWave Studios</p>
                </div>

                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-cyan-900/20 flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">TrustVault Editor</h3>
                      <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                        Select a project first, then launch the embedded editor to start editing your media
                      </p>
                      <button
                        onClick={() => embedMutation.mutate("latest")}
                        disabled={embedMutation.isPending}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 font-semibold flex items-center gap-2 mx-auto transition"
                        data-testid="button-launch-editor"
                      >
                        {embedMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Launch Editor
                      </button>
                    </div>
                  </div>
                  {embedMutation.data?.editorUrl && (
                    <iframe
                      src={embedMutation.data.editorUrl}
                      className="w-full"
                      style={{ height: "70vh" }}
                      allow="camera; microphone; fullscreen"
                      title="TrustVault Editor"
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Render Events</h2>
                  <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["trustvault-events"] })}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition"
                    data-testid="button-refresh-events"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {eventsData?.events?.length > 0 ? (
                  <div className="space-y-3">
                    {eventsData.events.map((evt: any, i: number) => (
                      <div key={i} className="glass-card p-4 rounded-xl flex items-center justify-between" data-testid={`event-${i}`}>
                        <div className="flex items-center gap-3">
                          {evt.status === "complete" ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : evt.status === "failed" ? (
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                          )}
                          <div>
                            <p className="font-medium">{evt.event}</p>
                            <p className="text-xs text-gray-500">Project: {evt.projectId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm capitalize text-gray-300">{evt.status}</p>
                          {evt.downloadUrl && (
                            <a href={evt.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                              <Download className="w-3 h-3" /> Download
                            </a>
                          )}
                          {evt.timestamp && (
                            <p className="text-xs text-gray-600">{new Date(evt.timestamp).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No render events yet</h3>
                    <p className="text-gray-400 text-sm">When you export a project, render status updates will appear here via webhook</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Studio;
