
'use client';

import * as React from 'react';
import { AppLayout } from "@/components/app/AppLayout";
import { Loader2, LineChart, MessageCircle, Heart, Users, UserPlus, FileText, AtSign, Star, Instagram } from 'lucide-react';
import { getUserAnalytics } from '@/ai/flows/user-analytics-flow';
import type { InstagramUserProfile, InstagramPost } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';


function formatMetric(num?: number): string {
    if (num === undefined) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
}

function TimeAgo({ dateString }: { dateString: string }) {
    const [ago, setAgo] = React.useState('');

    React.useEffect(() => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}y ago`);
            return;
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}mo ago`);
            return;
        }
        interval = seconds / 86400;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}d ago`);
            return;
        }
        interval = seconds / 3600;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}h ago`);
            return;
        }
        interval = seconds / 60;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}m ago`);
            return;
        }
        setAgo(`${Math.floor(seconds)}s ago`);
    }, [dateString]);

    return <>{ago}</>;
}

const followersChartConfig = {
    value: {
      label: "Followers",
      color: "hsl(var(--chart-1))",
    },
} satisfies import('@/components/ui/chart').ChartConfig;

const engagementChartConfig = {
    value: {
      label: "Engagement",
      color: "hsl(var(--chart-2))",
    },
} satisfies import('@/components/ui/chart').ChartConfig;

const PostListItem = ({ post }: { post: InstagramPost }) => (
    <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
            {post.thumbnailUrl && (
                <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                    <Image src={post.thumbnailUrl} alt={post.caption.substring(0, 50)} fill className="rounded-md object-cover" />
                </div>
            )}
            <div className="flex-grow flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2 flex-grow">{post.caption}</p>
                <div className="mt-auto space-y-3 pt-2">
                     <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5" title="Likes">
                                <Heart className="w-4 h-4" />
                                <span className="font-medium">{formatMetric(post.metrics.likes)}</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Comments">
                                <MessageCircle className="w-4 h-4" />
                                <span className="font-medium">{formatMetric(post.metrics.comments)}</span>
                            </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">{post.mediaType.replace('_', ' ').toLowerCase()}</Badge>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground"><TimeAgo dateString={post.publishedAt} /></span>
                        <Button asChild variant="ghost" size="sm">
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                View on Instagram <Instagram className="w-3.5 h-3.5" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);


export default function MyAnalyticsPage() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [profile, setProfile] = React.useState<InstagramUserProfile | null>(null);

    React.useEffect(() => {
        const fetchMyAnalytics = async () => {
            setIsLoading(true);
            try {
                // In a real app, you'd get the logged-in user's username.
                // We'll use the demo user for this example.
                const response = await getUserAnalytics({ username: 'travel.junkie' });
                setProfile(response.profile);
            } catch (error) {
                console.error("Failed to fetch user analytics:", error);
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyAnalytics();
    }, []);

  return (
    <AppLayout>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight">
              Your Analytics
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Measure your growth. Your personal Instagram performance dashboard.
            </p>
          </div>

          <div className="mt-12">
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            
            {!isLoading && !profile && (
                <div className="mt-8 text-center py-16 px-4 bg-card border rounded-xl">
                    <h3 className="mt-4 text-lg font-semibold">Could Not Load Analytics</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        There was an error fetching your data. Please try again later.
                    </p>
                </div>
            )}

            {profile && (
              <div className="space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24 border-4 border-primary">
                        <AvatarImage src={profile.profilePictureUrl} alt={profile.username} />
                        <AvatarFallback>{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                        <a href={`https://instagram.com/${profile.username}`} target="_blank" rel="noopener noreferrer" className="text-lg text-muted-foreground hover:underline">@{profile.username}</a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Followers</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatMetric(profile.followers)}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Following</CardTitle>
                          <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatMetric(profile.following)}</div>
                        </CardContent>
                      </Card>
                       <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
                          <LineChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{profile.engagementRate.toFixed(2)}%</div>
                        </CardContent>
                      </Card>
                       <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatMetric(profile.postCount)}</div>
                        </CardContent>
                      </Card>
                    </div>

                     <Card>
                        <CardHeader>
                            <CardTitle>Recent Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {profile.recentPosts.map(post => (
                                    <PostListItem key={post.id} post={post} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                  </div>
                  <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Follower Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={followersChartConfig} className="h-[200px] w-full">
                                <RechartsLineChart data={profile.followerHistory} margin={{ left: 12, right: 12 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                                    <YAxis tickFormatter={(value) => formatMetric(value)} />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} />
                                </RechartsLineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Engagement Rate Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={engagementChartConfig} className="h-[200px] w-full">
                                <RechartsLineChart data={profile.engagementHistory} margin={{ left: 12, right: 12 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                                    <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 'dataMax + 1']} />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} />
                                </RechartsLineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Top Mentions</CardTitle>
                            <CardDescription>Collaborators & Mentions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {profile.topMentions.length > 0 ? (
                                <div className="space-y-4">
                                    {profile.topMentions.map(mention => (
                                        <div key={mention.username} className="flex items-center justify-between">
                                            <a href={`https://instagram.com/${mention.username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                                                <AtSign className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                                <span className="font-medium group-hover:underline">{mention.username}</span>
                                            </a>
                                            <Badge variant="secondary">{mention.count} {mention.count > 1 ? 'mentions' : 'mention'}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No frequent mentions found in recent posts.</p>
                            )}
                        </CardContent>
                    </Card>
                    {profile.mostEngagedPost && (
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="text-amber-400" />
                                    Most Engaged Post
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {profile.mostEngagedPost.thumbnailUrl && (
                                     <a href={profile.mostEngagedPost.url} target="_blank" rel="noopener noreferrer">
                                        <Image src={profile.mostEngagedPost.thumbnailUrl} alt={profile.mostEngagedPost.caption} width={400} height={400} className="rounded-lg object-cover w-full aspect-square" />
                                     </a>
                                )}
                                <p className="text-sm text-muted-foreground line-clamp-2">{profile.mostEngagedPost.caption}</p>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 font-medium" title="Likes">
                                            <Heart className="w-4 h-4 text-red-500" />
                                            <span>{formatMetric(profile.mostEngagedPost.metrics.likes)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-medium" title="Comments">
                                            <MessageCircle className="w-4 h-4 text-sky-500" />
                                            <span>{formatMetric(profile.mostEngagedPost.metrics.comments)}</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline"><TimeAgo dateString={profile.mostEngagedPost.publishedAt} /></Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
