"use client";

import * as React from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Header } from "@/components/app/Header";
import { PostCard } from "@/components/app/PostCard";
import { OnboardingWizard } from "@/components/app/OnboardingWizard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoPosts } from "@/lib/demo-data";
import type { Post } from "@/lib/types";
import { FileQuestion } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("emerging");
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  React.useEffect(() => {
    // Simulate initial data fetch and check for first visit
    setPosts(demoPosts);
    const isFirstVisit = !localStorage.getItem("hasVisitedTrendTorch");
    if (isFirstVisit) {
      setShowOnboarding(true);
      localStorage.setItem("hasVisitedTrendTorch", "true");
    }

    // Simulate data freshness updates
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Here you would typically refetch data based on user's new sources
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "emerging") return post.momentumBucket === "Emerging";
    if (activeTab === "heating") return post.momentumBucket === "Heating";
    if (activeTab === "on-fire") return post.momentumBucket === "On Fire";
    return false;
  });

  return (
    <AppLayout>
      <Header lastUpdated={lastUpdated} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Tabs
          defaultValue="emerging"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="emerging">
              <span className="mr-2">🔥</span> Emerging
            </TabsTrigger>
            <TabsTrigger value="heating">
              <span className="mr-2">🚀</span> Heating
            </TabsTrigger>
            <TabsTrigger value="on-fire">
              <span className="mr-2">🌟</span> On Fire
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emerging" className="mt-6">
            <ContentGrid posts={filteredPosts} />
          </TabsContent>
          <TabsContent value="heating" className="mt-6">
            <ContentGrid posts={filteredPosts} />
          </TabsContent>
          <TabsContent value="on-fire" className="mt-6">
            <ContentGrid posts={filteredPosts} />
          </TabsContent>
        </Tabs>
      </main>
      <OnboardingWizard
        isOpen={showOnboarding}
        onClose={handleOnboardingComplete}
      />
    </AppLayout>
  );
}

function ContentGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center rounded-lg border-2 border-dashed bg-muted/50">
        <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">No Trends Found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Try adjusting your filters or add more sources to discover new trends.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
