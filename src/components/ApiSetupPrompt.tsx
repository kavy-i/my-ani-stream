import { store } from '@/lib/store';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export function ApiSetupPrompt() {
  const [url, setUrl] = useState('');

  const handleSave = () => {
    if (url.trim()) {
      store.setApiUrl(url.trim());
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Settings className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Welcome to AniTube</h2>
          <p className="text-sm text-muted-foreground">
            Enter your Consumet API URL to get started. You can host one on Vercel for free.
          </p>
        </div>
        <div className="space-y-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-consumet-api.vercel.app"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <Button onClick={handleSave} className="w-full" disabled={!url.trim()}>
            Connect API
          </Button>
        </div>
      </div>
    </div>
  );
}
