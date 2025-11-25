import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RechargeRazorpay() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState('1000');
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    if (!amount || parseInt(amount) < 100) {
      toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Minimum recharge is ₹100' });
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderResponse = await apiRequest('POST', '/api/wallet/create-order', { amount: parseInt(amount) });
      
      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: parseInt(amount) * 100,
        currency: 'INR',
        name: 'Labour Mandi',
        description: `Wallet Recharge - ₹${amount}`,
        order_id: orderResponse.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await apiRequest('POST', '/api/wallet/verify-payment', {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              toast({ title: 'Success', description: 'Wallet recharged successfully' });
              queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
              navigate('/');
            }
          } catch (error: any) {
            toast({ variant: 'destructive', title: 'Verification Failed', description: error.message });
          }
        },
        prefill: { contact: '', email: '' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-black">Recharge Wallet</h1>
            <p className="text-gray-600">Add funds to your wallet instantly</p>
          </div>

          <Card className="p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-black">Amount (₹)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                step="100"
                data-testid="input-amount"
                className="mt-2 h-12"
              />
            </div>

            <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
              Total: ₹{amount}
            </div>

            <Button
              onClick={handleRecharge}
              disabled={loading}
              className="w-full h-12"
              data-testid="button-recharge"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
              Proceed to Pay
            </Button>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
