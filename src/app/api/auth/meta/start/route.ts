import { NextRequest, NextResponse } from 'next/server';

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export async function GET(req: NextRequest) {
  const appId = process.env.META_APP_ID;
  if (!appId) {
    return NextResponse.json({ error: 'META_APP_ID is not set in environment' }, { status: 500 });
  }
  const redirectUri = process.env.META_REDIRECT_URI ?? new URL('/api/auth/meta/callback', req.nextUrl.origin).toString();

  // Minimal set of scopes to read pages and IG basic profile. Expand later as needed.
  const scopes = [
    'pages_show_list',
    'instagram_basic',
    // 'instagram_manage_insights',
    // 'business_management',
  ].join(',');

  // In production you should persist and validate state to prevent CSRF
  const state = Math.random().toString(36).slice(2);

  const url = new URL('https://www.facebook.com/dialog/oauth');
  url.searchParams.set('client_id', appId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', state);
  url.searchParams.set('scope', scopes);

  return NextResponse.redirect(url.toString(), { status: 302 });
}