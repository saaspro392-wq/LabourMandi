import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';
import { signInWithGoogle } from '@/lib/firebase';

export default function OTPLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { idToken } = await signInWithGoogle();
      const response = await apiRequest('POST', '/api/auth/google', { idToken });
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        toast({ title: 'Success', description: 'Signed in with Google' });
        navigate('/');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Google sign-in failed' });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-bold text-black">Welcome to LabourMandi</h1>
            <p className="text-gray-600 text-lg">Sign in with your Google account to get started</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-google-login"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2 text-center text-sm text-gray-500">
            <p>First time here? You'll be automatically registered on first login.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
