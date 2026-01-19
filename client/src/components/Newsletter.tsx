import { useState } from "react";
import { Mail, Send, Loader2, CheckCircle2, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || null })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setEmail("");
        setName("");
      } else {
        setError(result.error || "Failed to subscribe");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 gradient-border card-3d bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg gradient-text">You're In!</h3>
            <p className="text-sm text-muted-foreground">Check your inbox for a welcome email.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 gradient-border card-3d">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg lg:text-xl">Stay Updated</h3>
          <p className="text-sm text-muted-foreground">Get insights on AI, web development, and savings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-all"
            data-testid="input-newsletter-name"
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition-all"
            data-testid="input-newsletter-email"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !email}
          className="btn-glow w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-subscribe"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Subscribe
            </>
          )}
        </button>
        
        <p className="text-xs text-muted-foreground text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
