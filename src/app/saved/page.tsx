
'use client';

import { AppLayout } from "@/components/app/AppLayout";
import { PostCard } from "@/components/app/PostCard";
import { useSavedPosts } from "@/context/SavedPostsContext";
import { BookmarkX, Folder, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export default function SavedPage() {
  const { collections, savedPosts, savedProfiles, removeSavedProfile } = useSavedPosts();
  const [activeTab, setActiveTab] = React.useState('posts');

  const allSavedPosts = React.useMemo(() => Object.values(collections).flatMap(c => c.postIds).map(id => savedPosts.find(p => p.id === id)).filter(Boolean) as any[], [collections, savedPosts]);

  const renderContent = (posts: any[]) => {
     if (posts.length === 0) {
       return (
        <div className="mt-8 text-center py-16 px-4 bg-card border rounded-xl">
            <BookmarkX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Saved Items</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                You haven't saved any posts in this collection yet.
            </p>
        </div>
       )
     }
     return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {posts.map(post => (
                <PostCard key={post.id} post={post} activeTab="top" showUnsave />
            ))}
        </div>
     )
  }

  return (
    <AppLayout>
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight">
              Saved Items
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Your collections of saved Instagram posts.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 sm:grid-cols-none sm:inline-flex h-auto sm:h-10">
                <TabsTrigger value="posts" className="w-full sm:w-auto">Posts</TabsTrigger>
                <TabsTrigger value="profiles" className="w-full sm:w-auto">Profiles</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="posts">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-center">
                  <TabsList className="grid grid-cols-1 sm:grid-cols-none sm:inline-flex h-auto sm:h-10">
                    <TabsTrigger value="all" className="w-full sm:w-auto">All Posts</TabsTrigger>
                    {Object.values(collections).map(collection => (
                      <TabsTrigger key={collection.id} value={collection.id} className="w-full sm:w-auto">
                        {collection.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <TabsContent value="all">
                  {renderContent(allSavedPosts)}
                </TabsContent>
                {Object.values(collections).map(collection => (
                  <TabsContent key={collection.id} value={collection.id}>
                    {renderContent(collection.postIds.map(id => savedPosts.find(p => p.id === id)).filter(Boolean) as any[])}
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
            <TabsContent value="profiles">
              {savedProfiles.length === 0 ? (
                <div className="mt-8 text-center py-16 px-4 bg-card border rounded-xl">
                  <User className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Saved Profiles</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't saved any profiles yet. Search a profile in Profile Search and save it.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                  {savedProfiles.map(profile => (
                     <div key={profile.id} className="border rounded-xl p-4 bg-card">
                       <div className="flex items-center gap-3">
                         <div className="h-12 w-12 rounded-full overflow-hidden border">
                           <img src={profile.profilePictureUrl} alt={profile.username} className="h-full w-full object-cover" />
                         </div>
                         <div className="flex-1">
                           <div className="font-semibold">{profile.fullName}</div>
                           <div className="text-sm text-muted-foreground">@{profile.username}</div>
                         </div>
                       </div>
                       <div className="mt-3 text-sm text-muted-foreground flex gap-4">
                         <span>{profile.followers.toLocaleString()} followers</span>
                         <span>{profile.postCount} posts</span>
                       </div>
                       <div className="mt-4 flex justify-end">
                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                             <Button variant="outline" size="sm">Unsave</Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                             <AlertDialogHeader>
                               <AlertDialogTitle>Unsave this profile?</AlertDialogTitle>
                               <AlertDialogDescription>
                                 This will remove @{profile.username} from your saved profiles.
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel>Cancel</AlertDialogCancel>
                               <AlertDialogAction onClick={() => removeSavedProfile(profile.id)}>Unsave</AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                       </div>
                     </div>
                   ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AppLayout>
  );
}
