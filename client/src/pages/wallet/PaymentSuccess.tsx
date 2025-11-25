import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black">Payment Successful</h1>
            <p className="text-gray-600">Your wallet has been recharged successfully</p>
          </div>

          <Button onClick={() => navigate('/')} className="w-full h-12" data-testid="button-continue">
            Continue Shopping
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
