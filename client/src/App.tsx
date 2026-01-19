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
import NotFound from "@/pages/not-found";

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
