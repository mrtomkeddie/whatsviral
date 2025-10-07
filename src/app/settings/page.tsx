'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Instagram, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
  const [connected, setConnected] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/auth/meta/session');
        if (res.ok) {
          const data = await res.json();
          setConnected(!!data.connected);
        } else {
          setConnected(false);
        }
      } catch (e) {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  return (
    <AppLayout>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-headline tracking-tight">Settings</h1>
            <p className="mt-2 text-muted-foreground">Manage your WhatsViral account and Instagram connection.</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="h-5 w-5" /> Instagram Connection
                  </CardTitle>
                  <CardDescription>Connect your Instagram Business account to enable live insights across the app.</CardDescription>
                </div>
                {connected ? (
                  <Badge className="bg-green-500/15 text-green-600 border-green-500/30">Connected</Badge>
                ) : (
                  <Badge variant="outline">Not Connected</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Checking connection...</p>
              ) : connected ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Your Instagram Business account is connected. You can disconnect anytime.</p>
                  <div className="flex gap-2">
                    <Button asChild variant="destructive">
                      <a href="/api/auth/meta/logout">Disconnect</a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="/me">Go to My Insights</a>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" /> We only store access tokens in secure cookies. You can revoke access at any time.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">To enable live data, connect an Instagram Business account.</p>
                  <div className="flex gap-2">
                    <Button asChild>
                      <a href="/api/auth/meta/start">Connect Instagram</a>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldAlert className="h-4 w-4" /> We request read-only permissions to your page and Instagram profile.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>General preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Additional settings can go here.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}