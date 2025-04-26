'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function SendEmailForm() {
  const [repoUrl, setRepoUrl] = useState('');
  const [developerEmail, setDeveloperEmail] = useState('');
  const [exposedCredentials, setExposedCredentials] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl,
          developerEmail,
          exposedCredentials: exposedCredentials.split('\n').filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast.success('Email sent successfully!');
      setRepoUrl('');
      setDeveloperEmail('');
      setExposedCredentials('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div className="space-y-2">
        <label htmlFor="repoUrl" className="block text-sm font-medium">
          Repository URL
        </label>
        <Input
          id="repoUrl"
          type="url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="developerEmail" className="block text-sm font-medium">
          Developer Email
        </label>
        <Input
          id="developerEmail"
          type="email"
          value={developerEmail}
          onChange={(e) => setDeveloperEmail(e.target.value)}
          placeholder="developer@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="exposedCredentials" className="block text-sm font-medium">
          Exposed Credentials (one per line)
        </label>
        <Textarea
          id="exposedCredentials"
          value={exposedCredentials}
          onChange={(e) => setExposedCredentials(e.target.value)}
          placeholder="API_KEY=123456&#10;DATABASE_URL=mongodb://..."
          required
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Sending...' : 'Send Email'}
      </Button>
    </form>
  );
} 