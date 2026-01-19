import { Link } from "wouter";
import { CheckCircle2, ArrowRight, Home, Mail } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mx-auto mb-8 animate-pulse">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        
        <h1 className="text-3xl lg:text-4xl font-bold font-display mb-4">
          Payment <span className="gradient-text">Successful!</span>
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Thank you for your purchase! We've sent a confirmation email with your receipt and next steps.
        </p>

        <div className="glass-card rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            What's Next?
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Check your email for the confirmation and receipt</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
              <span>We'll reach out within 24 hours to schedule a kickoff call</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Access your client portal (link in email)</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="glow-button px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl flex items-center justify-center gap-2"
            data-testid="link-home"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link 
            href="/book"
            className="px-6 py-3 glass-card rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            data-testid="link-book"
          >
            Schedule Kickoff
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
