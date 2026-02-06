import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Compare from "@/pages/Compare";
import Quote from "@/pages/Quote";
import Admin from "@/pages/Admin";
import Book from "@/pages/Book";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancel from "@/pages/PaymentCancel";
import Analytics from "@/pages/Analytics";
import Blog from "@/pages/Blog";
import BlogAdmin from "@/pages/BlogAdmin";
import Mission from "@/pages/Mission";
import Investors from "@/pages/Investors";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Documents from "@/pages/Documents";
import TrustLayerHub from "@/pages/TrustLayerHub";
import GuardianAI from "@/pages/GuardianAI";
import GuardianAIRegistry from "@/pages/GuardianAIRegistry";
import Developers from "@/pages/Developers";
import Ecosystem from "@/pages/Ecosystem";
import NotFound from "@/pages/not-found";
import WebsiteAudit from "@/pages/WebsiteAudit";
import Resources from "@/pages/Resources";
import MarketingHub from "@/pages/MarketingHub";
import SignalChat from "@/pages/SignalChat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/services" component={Services}/>
      <Route path="/projects" component={Projects}/>
      <Route path="/about" component={About}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/compare" component={Compare}/>
      <Route path="/quote" component={Quote}/>
      <Route path="/book" component={Book}/>
      <Route path="/payment" component={Payment}/>
      <Route path="/payment/success" component={PaymentSuccess}/>
      <Route path="/payment/cancel" component={PaymentCancel}/>
      <Route path="/admin" component={Admin}/>
      <Route path="/analytics" component={Analytics}/>
      <Route path="/blog" component={Blog}/>
      <Route path="/blog/admin" component={BlogAdmin}/>
      <Route path="/mission" component={Mission}/>
      <Route path="/investors" component={Investors}/>
      <Route path="/terms" component={Terms}/>
      <Route path="/privacy" component={Privacy}/>
      <Route path="/documents" component={Documents}/>
      <Route path="/hub" component={TrustLayerHub}/>
      <Route path="/guardian-ai" component={GuardianAI}/>
      <Route path="/guardian-ai-registry" component={GuardianAIRegistry}/>
      <Route path="/developers" component={Developers}/>
      <Route path="/ecosystem" component={Ecosystem}/>
      <Route path="/audit" component={WebsiteAudit}/>
      <Route path="/resources" component={Resources}/>
      <Route path="/marketing" component={MarketingHub}/>
      <Route path="/chat" component={SignalChat}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
