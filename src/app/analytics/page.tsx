
'use client';

import * as React from 'react';
import { AppLayout } from "@/components/app/AppLayout";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, UserX, LineChart, MessageCircle, Heart, Users, UserPlus, FileText, AtSign } from 'lucide-react';
import { getUserAnalytics } from '@/ai/flows/user-analytics-flow';
import type { InstagramUserProfile, HistoryPoint } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';


function formatMetric(num?: number): string {
    if (num === undefined) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y`;
  
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo`;
  
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
  
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
  
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m`;
  
    return `${Math.floor(seconds)}s`;
}

const chartTooltipConfig = {
  value: {
    label: "Value",
  },
} satisfies ChartConfig

const followersChartConfig = {
    value: {
      label: "Followers",
      color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

const engagementChartConfig = {
    value: {
      label: "Engagement",
      color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig


export default function AnalyticsPage() {
    const [username, setUsername] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [profile, setProfile] = React.useState<InstagramUserProfile | null>(null);
    const [searchPerformed, setSearchPerformed] = React.useState(false);

    const handleSearch = async () => {
        if (!username) return;
        setIsLoading(true);
        setProfile(null);
        setSearchPerformed(true);
        try {
            const response = await getUserAnalytics({ username });
            setProfile(response.profile);
        } catch (error) {
            console.error("Failed to fetch user analytics:", error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <AppLayout>
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight">
              User Analytics
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Search for an Instagram username to view their profile stats and recent post performance.
            </p>
          </div>

          <div className="flex items-center gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Search by @username... (try 'travel.junkie')"
                      className="w-full h-12 pl-10 text-base rounded-lg"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
              </div>
              <Button
                  size="lg"
                  className="h-12"
                  onClick={handleSearch}
                  disabled={isLoading}
              >
                  {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Search className="mr-2" />}
                  Search
              </Button>
          </div>
          
          <div className="mt-12">
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            
            {!isLoading && searchPerformed && !profile && (
                <div className="mt-8 text-center py-16 px-4 bg-card border rounded-xl">
                    <UserX className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">User Not Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Could not find a user with that username. Check the spelling and try again.
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                      <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatMetric(profile.postCount)}</div>
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
                   <Card className="col-span-2 md:col-span-3 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Metrics</CardTitle>
                       <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex justify-around">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{formatMetric(profile.avgLikes)}</p>
                        <p className="text-xs text-muted-foreground">Avg. Likes</p>
                      </div>
                       <div className="text-center">
                        <p className="text-2xl font-bold">{formatMetric(profile.avgComments)}</p>
                        <p className="text-xs text-muted-foreground">Avg. Comments</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3 space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead className="w-[100px]">Preview</TableHead>
                                      <TableHead>Caption</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Likes</TableHead>
                                      <TableHead>Comments</TableHead>
                                      <TableHead>Published</TableHead>
                                      <TableHead className="text-right">Link</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {profile.recentPosts.map(post => (
                                      <TableRow key={post.id}>
                                          <TableCell>
                                              {post.thumbnailUrl && <Image src={post.thumbnailUrl} alt={post.caption.substring(0, 30)} width={64} height={64} className="rounded-md object-cover aspect-square" />}
                                          </TableCell>
                                          <TableCell className="max-w-xs truncate">{post.caption}</TableCell>
                                          <TableCell><Badge variant="secondary">{post.mediaType}</Badge></TableCell>
                                          <TableCell>{formatMetric(post.metrics.likes)}</TableCell>
                                          <TableCell>{formatMetric(post.metrics.comments)}</TableCell>
                                          <TableCell>{timeAgo(post.publishedAt)} ago</TableCell>
                                          <TableCell className="text-right">
                                              <Button asChild variant="ghost" size="sm">
                                                  <a href={post.url} target="_blank" rel="noopener noreferrer">View</a>
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="lg:col-span-2 space-y-8">
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
