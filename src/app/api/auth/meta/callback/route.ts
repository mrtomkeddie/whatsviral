import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

async function exchangeCodeForToken(code: string, redirectUri: string) {
  const clientId = getEnv('META_APP_ID');
  const clientSecret = getEnv('META_APP_SECRET');
  const url = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('client_secret', clientSecret);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('code', code);

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }
  return res.json() as Promise<{ access_token: string; token_type: string; expires_in: number }>;
}

async function exchangeForLongLivedToken(shortLivedToken: string) {
  const clientId = getEnv('META_APP_ID');
  const clientSecret = getEnv('META_APP_SECRET');
  const url = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
  url.searchParams.set('grant_type', 'fb_exchange_token');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('client_secret', clientSecret);
  url.searchParams.set('fb_exchange_token', shortLivedToken);
  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) throw new Error(`Long-lived token exchange failed: ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; token_type: string; expires_in: number }>;
}

async function getPages(accessToken: string) {
  const res = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
  if (!res.ok) throw new Error(`Failed to fetch pages: ${await res.text()}`);
  return res.json() as Promise<{ data: Array<{ id: string; name: string; access_token?: string }> }>;
}

async function getInstagramBusinessAccount(pageId: string, pageAccessToken: string) {
  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`);
  if (!res.ok) throw new Error(`Failed to fetch IG business account: ${await res.text()}`);
  return res.json() as Promise<{ instagram_business_account?: { id: string } }>;
}

async function getIgProfile(igUserId: string, pageAccessToken: string) {
  const fields = [
    'username', 'name', 'profile_picture_url', 'followers_count', 'follows_count', 'media_count'
  ].join(',');
  const res = await fetch(`https://graph.facebook.com/v19.0/${igUserId}?fields=${fields}&access_token=${pageAccessToken}`);
  if (!res.ok) throw new Error(`Failed to fetch IG profile: ${await res.text()}`);
  return res.json() as Promise<any>;
}

async function getRecentMedia(igUserId: string, pageAccessToken: string) {
  const fields = [
    'id', 'caption', 'media_type', 'media_url', 'permalink', 'timestamp', 'like_count', 'comments_count'
  ].join(',');
  const res = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media?fields=${fields}&access_token=${pageAccessToken}`);
  if (!res.ok) throw new Error(`Failed to fetch IG media: ${await res.text()}`);
  return res.json() as Promise<any>;
}

function setEncryptedCookie(resp: NextResponse, name: string, value: string, maxAgeSeconds: number) {
  // NOTE: You may replace this with a stronger encryption (e.g., jose + AES-GCM). For now, mark as HttpOnly/Secure/SameSite.
  resp.cookies.set({
    name,
    value,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  });
}

export async function GET(req: NextRequest) {
  const redirectUri = getEnv('META_REDIRECT_URI');
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const tokenRes = await exchangeCodeForToken(code, redirectUri);
    const userShortToken = tokenRes.access_token;
    const longLivedUserTokenRes = await exchangeForLongLivedToken(userShortToken);
    const userAccessToken = longLivedUserTokenRes.access_token;

    // Fetch pages and get the first page with a page access token
    const pagesRes = await getPages(userAccessToken);
    const page = pagesRes.data.find(p => p.access_token);
    if (!page) throw new Error('No managed page with access token found');

    const pageAccessToken = page.access_token as string;

    // Fetch IG Business Account ID
    const igRes = await getInstagramBusinessAccount(page.id, pageAccessToken);
    const igBiz = igRes.instagram_business_account;
    if (!igBiz) throw new Error('No Instagram Business Account connected');

    const igUserId = igBiz.id;

    // Fetch profile and recent media
    const profile = await getIgProfile(igUserId, pageAccessToken);
    const media = await getRecentMedia(igUserId, pageAccessToken);

    // Store tokens in cookie (consider encrypting + rotating)
    const response = NextResponse.redirect(new URL('/me', req.url));
    setEncryptedCookie(response, 'meta_connected', '1', 60 * 60 * 24 * 60);
    setEncryptedCookie(response, 'meta_user_token', userAccessToken, 60 * 60 * 24 * 60); // 60 days
    setEncryptedCookie(response, 'meta_page_token', pageAccessToken, 60 * 60 * 24 * 60);
    setEncryptedCookie(response, 'meta_ig_user_id', igUserId, 60 * 60 * 24 * 60);

    // Optionally store lightweight profile snapshot for quick UI hydration
    setEncryptedCookie(response, 'meta_profile_snapshot', JSON.stringify({ profile, pageId: page.id }), 60 * 60 * 24 * 7);

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Unknown error' }, { status: 500 });
  }
}