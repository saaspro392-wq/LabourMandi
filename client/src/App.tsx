import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-context";
import Dashboard from "@/pages/Dashboard";
import PostJob from "@/pages/PostJob";
import NotFound from "@/pages/not-found";
import About from "@/pages/About";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import RefundPolicy from "@/pages/RefundPolicy";
import CancellationPolicy from "@/pages/CancellationPolicy";
import OTPLogin from "@/pages/auth/OTPLogin";
import OTPVerification from "@/pages/auth/OTPVerification";
import RechargeRazorpay from "@/pages/wallet/RechargeRazorpay";
import PaymentSuccess from "@/pages/wallet/PaymentSuccess";
import PaymentFailed from "@/pages/wallet/PaymentFailed";
import PostSuccess from "@/pages/job/PostSuccess";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/post-job" component={PostJob} />
      <Route path="/auth/otp-login" component={OTPLogin} />
      <Route path="/auth/verify-otp" component={OTPVerification} />
      <Route path="/wallet/recharge" component={RechargeRazorpay} />
      <Route path="/wallet/payment-success" component={PaymentSuccess} />
      <Route path="/wallet/payment-failed" component={PaymentFailed} />
      <Route path="/job/post-success" component={PostSuccess} />
      <Route path="/about" component={About} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/cancellation-policy" component={CancellationPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
