import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PostSuccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [jobId] = useState(new URLSearchParams(window.location.search).get('jobId') || '');

  const copyJobId = () => {
    navigator.clipboard.writeText(jobId);
    toast({ title: 'Copied', description: 'Job ID copied to clipboard' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black">Job Posted Successfully!</h1>
            <p className="text-gray-600">Your job has been published and technicians can now apply.</p>
          </div>

          {jobId && (
            <div className="bg-gray-100 p-4 rounded space-y-2">
              <p className="text-sm text-gray-600">Job ID</p>
              <div className="flex items-center justify-between bg-white p-2 rounded">
                <code className="text-sm font-mono text-black">{jobId}</code>
                <button onClick={copyJobId} data-testid="button-copy-job-id">
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={() => navigate('/')} className="w-full h-12" data-testid="button-back-home">
              Back to Home
            </Button>
            <Button onClick={() => navigate('/post-job')} variant="outline" className="w-full h-12" data-testid="button-post-another">
              Post Another Job
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
