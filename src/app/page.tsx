"use client";

import * as React from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Header } from "@/components/app/Header";
import { PostCard } from "@/components/app/PostCard";
import { OnboardingWizard } from "@/components/app/OnboardingWizard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoPosts } from "@/lib/demo-data";
import type { Post } from "@/lib/types";
import { FileQuestion, Rocket, Star, TrendingUp } from "lucide-react";

const TAB_CONFIG = {
  emerging: {
    label: "Emerging",
    icon: TrendingUp,
    filter: (post: Post) => post.momentumBucket === "Emerging",
  },
  heating: {
    label: "Heating",
    icon: Rocket,
    filter: (post: Post) => post.momentumBucket === "Heating",
  },
  "on-fire": {
    label: "On Fire",
    icon: Star,
    filter: (post: Post) => post.momentumBucket === "On Fire",
  },
};

export default function Home() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<keyof typeof TAB_CONFIG>("emerging");
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  React.useEffect(() => {
    setPosts(demoPosts);
    const isFirstVisit = !localStorage.getItem("hasVisitedTrendTorch");
    if (isFirstVisit) {
      setShowOnboarding(true);
      localStorage.setItem("hasVisitedTrendTorch", "true");
    }

    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const filteredPosts = posts.filter(TAB_CONFIG[activeTab].filter);

  return (
    <AppLayout>
      <Header lastUpdated={lastUpdated} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Tabs
          defaultValue="emerging"
          onValueChange={(value) => setActiveTab(value as keyof typeof TAB_CONFIG)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex bg-card border">
            {Object.entries(TAB_CONFIG).map(([key, { label, icon: Icon }]) => (
              <TabsTrigger key={key} value={key}>
                <Icon className="mr-2 h-4 w-4" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(TAB_CONFIG).map((key) => (
            <TabsContent key={key} value={key} className="mt-6">
              <ContentGrid posts={filteredPosts} />
            </TabsContent>
          ))}
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
      <div className="flex flex-col items-center justify-center h-96 text-center rounded-lg border-2 border-dashed bg-card">
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
