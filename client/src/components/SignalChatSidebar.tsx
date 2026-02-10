import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Radio, Hash, Send, Users, MessageSquare, Wifi, WifiOff, Shield, Eye, EyeOff, Check, X, LogOut, Mail, User, Lock, ChevronLeft, Bell } from "lucide-react";
import { useLocation } from "wouter";

interface ChatChannel {
  id: string;
  name: string;
  description: string | null;
  category: string;
  isDefault: boolean | null;
}

interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  avatarColor: string;
  role: string;
  content: string;
  replyToId: string | null;
  createdAt: string;
}

interface ChatUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarColor: string;
  role: string;
  trustLayerId: string | null;
}

function PasswordRequirements({ password }: { password: string }) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2 text-xs">
        {hasMinLength ? <Check className="w-3 h-3 text-green-400" /> : <X className="w-3 h-3 text-red-400" />}
        <span className={hasMinLength ? "text-green-400" : "text-red-400"}>Min 8 characters</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {hasUppercase ? <Check className="w-3 h-3 text-green-400" /> : <X className="w-3 h-3 text-red-400" />}
        <span className={hasUppercase ? "text-green-400" : "text-red-400"}>1 capital letter</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {hasSpecial ? <Check className="w-3 h-3 text-green-400" /> : <X className="w-3 h-3 text-red-400" />}
        <span className={hasSpecial ? "text-green-400" : "text-red-400"}>1 special character</span>
      </div>
    </div>
  );
}

export default function SignalChatSidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showChannels, setShowChannels] = useState(false);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSeenRef = useRef<number>(Date.now());
  const isOnChatPage = location === "/chat";

  useEffect(() => {
    const savedToken = localStorage.getItem("tl-sso-token");
    if (savedToken) {
      fetch("/api/chat/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setCurrentUser(data.user);
            setAuthToken(savedToken);
          } else {
            localStorage.removeItem("tl-sso-token");
          }
        })
        .catch(() => localStorage.removeItem("tl-sso-token"));
    }
  }, []);

  const { data: channelsData } = useQuery<{ success: boolean; channels: ChatChannel[] }>({
    queryKey: ["/api/chat/channels"],
    enabled: !!currentUser,
  });

  const channels = channelsData?.channels || [];
  const ecosystemChannels = channels.filter(c => c.category === "ecosystem");
  const appChannels = channels.filter(c => c.category === "app-support");

  useEffect(() => {
    if (channels.length > 0 && !activeChannel) {
      const defaultChannel = channels.find(c => c.name === "general") || channels[0];
      setActiveChannel(defaultChannel);
    }
  }, [channels, activeChannel]);

  const connectWebSocket = useCallback(() => {
    if (!currentUser || !activeChannel) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      const token = localStorage.getItem("tl-sso-token");
      ws.send(JSON.stringify({
        type: "join",
        token,
        channelId: activeChannel.id,
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "history":
          setMessages(data.messages);
          break;
        case "message":
          setMessages(prev => [...prev, data]);
          if (!isOpen && data.userId !== currentUser.id) {
            setUnreadCount(prev => prev + 1);
            setHasNewMessage(true);
            setTimeout(() => setHasNewMessage(false), 3000);
          }
          break;
        case "typing":
          if (data.userId !== currentUser.id) {
            setTypingUsers(prev => {
              if (prev.includes(data.username)) return prev;
              return [...prev, data.username];
            });
            setTimeout(() => {
              setTypingUsers(prev => prev.filter(u => u !== data.username));
            }, 3000);
          }
          break;
        case "presence":
          setOnlineCount(data.onlineCount);
          break;
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(() => {
        if (currentUser && activeChannel) {
          connectWebSocket();
        }
      }, 3000);
    };

    ws.onerror = () => {
      setConnected(false);
    };
  }, [currentUser, activeChannel, isOpen]);

  useEffect(() => {
    if (currentUser && activeChannel) {
      connectWebSocket();
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [currentUser, activeChannel?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      lastSeenRef.current = Date.now();
    }
  }, [isOpen]);

  const switchChannel = (channel: ChatChannel) => {
    setActiveChannel(channel);
    setMessages([]);
    setShowChannels(false);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "switch_channel",
        channelId: channel.id,
      }));
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: "message",
      content: messageInput.trim(),
    }));
    setMessageInput("");
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "typing" }));
    }
    typingTimeoutRef.current = setTimeout(() => {}, 3000);
  };

  const isPasswordValid = () => {
    return passwordInput.length >= 8 && /[A-Z]/.test(passwordInput) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordInput);
  };

  const handleRegister = async () => {
    if (!usernameInput.trim() || !emailInput.trim() || !passwordInput || !displayNameInput.trim()) return;
    if (!isPasswordValid()) {
      setAuthError("Password does not meet requirements");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/chat/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.trim().toLowerCase().replace(/\s+/g, "-"),
          email: emailInput.trim().toLowerCase(),
          password: passwordInput,
          displayName: displayNameInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("tl-sso-token", data.token);
        setAuthToken(data.token);
        setCurrentUser(data.user);
      } else {
        setAuthError(data.error || "Registration failed");
      }
    } catch {
      setAuthError("Connection error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!usernameInput.trim() || !passwordInput) return;
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/chat/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.trim().toLowerCase().replace(/\s+/g, "-"),
          password: passwordInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("tl-sso-token", data.token);
        setAuthToken(data.token);
        setCurrentUser(data.user);
      } else {
        setAuthError(data.error || "Login failed");
      }
    } catch {
      setAuthError("Connection error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tl-sso-token");
    setCurrentUser(null);
    setAuthToken(null);
    setMessages([]);
    setActiveChannel(null);
    setUsernameInput("");
    setPasswordInput("");
    setEmailInput("");
    setDisplayNameInput("");
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const handleAuthSubmit = () => {
    if (authMode === "login") handleLogin();
    else handleRegister();
  };

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (isOnChatPage) return null;

  return (
    <>
      {/* Side Tab */}
      <button
        data-testid="button-signal-chat-tab"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[9998] flex items-center gap-2 transition-all duration-300 ${
          isOpen ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0"
        }`}
        style={{ writingMode: "vertical-rl" }}
      >
        <div className="relative bg-gradient-to-b from-cyan-600 to-blue-600 text-white px-2 py-4 rounded-l-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow cursor-pointer flex items-center gap-3">
          <Radio className="w-4 h-4 rotate-90" />
          <span className="text-xs font-bold tracking-wider">Signal Chat</span>
          {unreadCount > 0 && (
            <span className="absolute -left-1 -top-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-pulse rotate-90">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          {hasNewMessage && (
            <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping" />
          )}
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Panel */}
      <div
        className={`fixed right-0 top-0 h-full z-[9999] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "min(420px, 100vw)" }}
      >
        <div className="h-full bg-[#0a0a1a] border-l border-cyan-500/20 shadow-2xl shadow-cyan-500/10 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#0f0f2a] border-b border-white/10 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white" data-testid="sidebar-chat-title">Signal Chat</h2>
              <div className="flex items-center gap-2 text-[10px]">
                {currentUser ? (
                  <>
                    <span className="flex items-center gap-1">
                      {connected ? (
                        <><Wifi className="w-2.5 h-2.5 text-green-400" /><span className="text-green-400">Connected</span></>
                      ) : (
                        <><WifiOff className="w-2.5 h-2.5 text-red-400" /><span className="text-red-400">Reconnecting...</span></>
                      )}
                    </span>
                    <span className="text-gray-600">·</span>
                    <span className="text-cyan-400/70 flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" /> {onlineCount}
                    </span>
                  </>
                ) : (
                  <span className="text-cyan-400/70">Trust Layer SSO</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {currentUser && (
                <>
                  <button
                    data-testid="sidebar-button-channels"
                    onClick={() => setShowChannels(!showChannels)}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-colors"
                    title="Channels"
                  >
                    <Hash className="w-3.5 h-3.5" />
                  </button>
                  <button
                    data-testid="sidebar-button-logout"
                    onClick={handleLogout}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </>
              )}
              <button
                data-testid="sidebar-button-close"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Auth Screen */}
          {!currentUser ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-[11px] text-cyan-400/80">Secured by Trust Layer SSO</span>
              </div>

              <div className="flex bg-white/5 rounded-lg p-1 mb-4">
                <button
                  data-testid="sidebar-auth-login"
                  onClick={() => { setAuthMode("login"); setAuthError(""); }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    authMode === "login"
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Sign In
                </button>
                <button
                  data-testid="sidebar-auth-register"
                  onClick={() => { setAuthMode("register"); setAuthError(""); }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    authMode === "register"
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authError && (
                <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                  {authError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-gray-400 mb-1 block">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      data-testid="sidebar-input-username"
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                      placeholder="e.g. sarah-k"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAuthSubmit()}
                    />
                  </div>
                </div>

                {authMode === "register" && (
                  <>
                    <div>
                      <label className="text-[10px] text-gray-400 mb-1 block">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                          data-testid="sidebar-input-email"
                          type="email"
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                          placeholder="e.g. sarah@example.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAuthSubmit()}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 mb-1 block">Display Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                          data-testid="sidebar-input-displayname"
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                          placeholder="e.g. Sarah K."
                          value={displayNameInput}
                          onChange={(e) => setDisplayNameInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAuthSubmit()}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-[10px] text-gray-400 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      data-testid="sidebar-input-password"
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                      placeholder="Enter your password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAuthSubmit()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {authMode === "register" && <PasswordRequirements password={passwordInput} />}
                </div>

                <button
                  data-testid="sidebar-button-auth-submit"
                  onClick={handleAuthSubmit}
                  disabled={
                    authLoading ||
                    !usernameInput.trim() ||
                    !passwordInput ||
                    (authMode === "register" && (!emailInput.trim() || !displayNameInput.trim() || !isPasswordValid()))
                  }
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5" />
                      {authMode === "login" ? "Sign In" : "Create Account"}
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-gray-500">Cross-App SSO · One identity, all apps</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Channel Selector Dropdown */}
              {showChannels && (
                <div className="border-b border-white/10 bg-[#0d0d24] max-h-48 overflow-y-auto flex-shrink-0">
                  <div className="p-2 space-y-0.5">
                    {ecosystemChannels.length > 0 && (
                      <>
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-cyan-400/60 px-2 pt-1 pb-0.5">Ecosystem</div>
                        {ecosystemChannels.map(ch => (
                          <button
                            key={ch.id}
                            data-testid={`sidebar-channel-${ch.name}`}
                            onClick={() => switchChannel(ch)}
                            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all ${
                              activeChannel?.id === ch.id
                                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                                : "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                            }`}
                          >
                            <Hash className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{ch.name}</span>
                          </button>
                        ))}
                      </>
                    )}
                    {appChannels.length > 0 && (
                      <>
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-purple-400/60 px-2 pt-2 pb-0.5">App Support</div>
                        {appChannels.map(ch => (
                          <button
                            key={ch.id}
                            data-testid={`sidebar-channel-${ch.name}`}
                            onClick={() => switchChannel(ch)}
                            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all ${
                              activeChannel?.id === ch.id
                                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                                : "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                            }`}
                          >
                            <Hash className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{ch.name}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Active Channel Bar */}
              {activeChannel && (
                <div className="flex items-center gap-2 px-4 py-2 bg-[#0f0f2a]/50 border-b border-white/10 flex-shrink-0">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-semibold text-white">{activeChannel.name}</span>
                  {activeChannel.description && (
                    <>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-[10px] text-gray-500 truncate">{activeChannel.description}</span>
                    </>
                  )}
                </div>
              )}

              {/* User bar */}
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0d0d24]/50 border-b border-white/5 flex-shrink-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] text-white font-bold flex-shrink-0"
                  style={{ background: currentUser.avatarColor }}
                >
                  {getInitials(currentUser.displayName)}
                </div>
                <span className="text-[10px] text-gray-300 truncate">{currentUser.displayName}</span>
                {currentUser.trustLayerId && (
                  <span className="text-[8px] text-cyan-500/50 truncate ml-auto">TL: {currentUser.trustLayerId.slice(0, 12)}...</span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5" data-testid="sidebar-messages">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="w-8 h-8 text-gray-700 mb-2" />
                    <p className="text-gray-500 text-xs">No messages yet</p>
                    <p className="text-gray-600 text-[10px] mt-1">Be the first in #{activeChannel?.name}</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const showHeader = i === 0 || messages[i - 1].userId !== msg.userId ||
                    new Date(msg.createdAt).getTime() - new Date(messages[i - 1].createdAt).getTime() > 300000;
                  return (
                    <div key={msg.id} className={`group hover:bg-white/[0.02] rounded-md px-1.5 ${showHeader ? "pt-2" : "pt-0"}`}>
                      {showHeader ? (
                        <div className="flex gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] text-white font-bold shadow-sm"
                            style={{ background: msg.avatarColor }}
                          >
                            {msg.role === "bot" ? "B" : getInitials(msg.username)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-semibold ${msg.role === "bot" ? "text-green-400" : "text-white"}`}>{msg.username}</span>
                              {msg.role === "bot" && (
                                <span className="text-[8px] px-1 py-0.5 rounded bg-green-500/20 text-green-400 font-medium">BOT</span>
                              )}
                              {msg.role === "admin" && (
                                <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-medium">ADMIN</span>
                              )}
                              <span className="text-[10px] text-gray-500">{formatTime(msg.createdAt)}</span>
                            </div>
                            <p className="text-xs text-gray-300 mt-0.5 break-words">{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <div className="w-7 flex-shrink-0 flex items-center justify-center">
                            <span className="text-[9px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 break-words">{msg.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
                {typingUsers.length > 0 && (
                  <div className="px-1.5 pt-1">
                    <span className="text-[10px] text-cyan-400/60 animate-pulse">
                      {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="px-3 py-2 border-t border-white/10 bg-[#0d0d24]/50 flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    data-testid="sidebar-input-message"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-cyan-500/40 focus:outline-none transition-colors"
                    placeholder={`Message #${activeChannel?.name || "general"}...`}
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      handleTyping();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <button
                    data-testid="sidebar-button-send"
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || !connected}
                    className="w-9 h-9 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}