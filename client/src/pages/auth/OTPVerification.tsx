import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { authStorage } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function OTPVerification() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchParams] = useLocation()[2] as [string, any, Record<string, string>];
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const phone = new URLSearchParams(searchParams).get('phone') || '';

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({ variant: 'destructive', title: 'Invalid OTP', description: 'Please enter a 6-digit OTP' });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/verify-otp', { phone, otp });
      if (response.token) {
        authStorage.setToken(response.token);
        queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
        toast({ title: 'Success', description: 'Signed in successfully' });
        navigate('/');
      }
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
            <h1 className="text-3xl font-bold text-black">Verify OTP</h1>
            <p className="text-gray-600">We've sent a code to {phone}</p>
          </div>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              data-testid="input-otp"
              className="h-12 text-lg text-center tracking-widest"
            />

            <Button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full h-12 text-lg"
              data-testid="button-verify-otp"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
              Verify OTP
            </Button>
          </div>

          <button
            onClick={() => navigate('/auth/otp-login')}
            className="w-full text-center text-sm text-red-600 font-semibold hover:underline"
          >
            Change phone number
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
