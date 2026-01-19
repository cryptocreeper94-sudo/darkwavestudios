import { Link } from "wouter";
import { XCircle, ArrowLeft, MessageCircle, RefreshCw } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-12 h-12 text-orange-400" />
        </div>
        
        <h1 className="text-3xl lg:text-4xl font-bold font-display mb-4">
          Payment <span className="text-orange-400">Cancelled</span>
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          No worries! Your payment was not processed. Feel free to try again or reach out if you have questions.
        </p>

        <div className="glass-card rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-display font-bold mb-4">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you experienced any issues or have questions about our plans, we're here to help.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Having trouble with payment? Try a different card or use crypto.</li>
            <li>Not sure which plan is right? Book a free consultation.</li>
            <li>Questions about pricing? Contact us directly.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/payment"
            className="glow-button px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl flex items-center justify-center gap-2"
            data-testid="link-try-again"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Link>
          <Link 
            href="/contact"
            className="px-6 py-3 glass-card rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            data-testid="link-contact"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Support
          </Link>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mt-8 transition-colors"
          data-testid="link-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
