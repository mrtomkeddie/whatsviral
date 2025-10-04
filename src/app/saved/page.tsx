
'use client';

import { AppLayout } from "@/components/app/AppLayout";
import { PostCard } from "@/components/app/PostCard";
import { useSavedPosts } from "@/context/SavedPostsContext";
import { BookmarkX } from "lucide-react";

export default function SavedPage() {
  const { savedPosts } = useSavedPosts();

  return (
    <AppLayout>
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight">
              Saved Items
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Your collection of saved Instagram posts.
            </p>
          </div>

          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedPosts.map(post => (
                <PostCard key={post.id} post={post} activeTab="top" />
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center py-16 px-4 bg-card border rounded-xl">
              <BookmarkX className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Saved Items</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You haven't saved any posts yet. Click the "Save" button on a post to add it here.
              </p>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
