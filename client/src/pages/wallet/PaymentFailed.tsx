import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { XCircle } from 'lucide-react';

export default function PaymentFailed() {
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <XCircle className="w-16 h-16 mx-auto text-red-600" />
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black">Payment Failed</h1>
            <p className="text-gray-600">We couldn't process your payment. Please try again.</p>
          </div>

          <div className="space-y-2">
            <Button onClick={() => navigate('/wallet/recharge')} className="w-full h-12" data-testid="button-retry">
              Try Again
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full h-12" data-testid="button-home">
              Go Home
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
