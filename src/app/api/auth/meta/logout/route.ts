import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const resp = NextResponse.redirect(new URL('/settings', req.url));
  const cookieNames = ['meta_connected','meta_user_token','meta_page_token','meta_ig_user_id','meta_profile_snapshot'];
  cookieNames.forEach(name => {
    resp.cookies.set({ name, value: '', path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0 });
  });
  return resp;
}