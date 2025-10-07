import { NextRequest, NextResponse } from 'next/server';

function getCookie(req: NextRequest, name: string): string | undefined {
  const cookie = req.cookies.get(name);
  return cookie?.value;
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

export async function GET(req: NextRequest) {
  const pageAccessToken = getCookie(req, 'meta_page_token');
  const igUserId = getCookie(req, 'meta_ig_user_id');
  const connectedFlag = getCookie(req, 'meta_connected');

  if (!pageAccessToken || !igUserId || !connectedFlag) {
    return NextResponse.json({ connected: false });
  }

  try {
    const igProfile = await getIgProfile(igUserId, pageAccessToken);
    const mediaRes = await getRecentMedia(igUserId, pageAccessToken);
    const mediaItems: any[] = Array.isArray(mediaRes?.data) ? mediaRes.data : [];

    const recentPosts = mediaItems.map((m) => ({
      id: m.id,
      platform: 'instagram' as const,
      caption: m.caption ?? '',
      author: igProfile.username ?? '',
      authorFollowers: igProfile.followers_count ?? undefined,
      url: m.permalink ?? '',
      publishedAt: m.timestamp ?? new Date().toISOString(),
      metrics: {
        likes: m.like_count ?? 0,
        comments: m.comments_count ?? 0,
      },
      thumbnailUrl: m.media_url ?? undefined,
      mediaType: (m.media_type as 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM') ?? 'IMAGE',
    }));

    const mostEngagedPost = recentPosts.reduce((best, p) => {
      const score = (p.metrics.likes ?? 0) + (p.metrics.comments ?? 0);
      const bestScore = (best?.metrics.likes ?? 0) + (best?.metrics.comments ?? 0);
      return score > bestScore ? p : best;
    }, undefined as any);

    const profile = {
      id: igUserId,
      username: igProfile.username ?? '',
      fullName: igProfile.name ?? igProfile.username ?? '',
      profilePictureUrl: igProfile.profile_picture_url ?? '',
      followers: igProfile.followers_count ?? 0,
      following: igProfile.follows_count ?? 0,
      postCount: igProfile.media_count ?? 0,
      engagementRate: 0,
      avgLikes: 0,
      avgComments: 0,
      postingFrequency: 'Unknown',
      mostEngagedPost,
      recentPosts,
      followerHistory: [],
      engagementHistory: [],
      topMentions: [],
    };

    return NextResponse.json({ connected: true, profile });
  } catch (e: any) {
    return NextResponse.json({ connected: false, error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}