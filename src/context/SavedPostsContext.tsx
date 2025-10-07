
'use client';

import type { InstagramPost, InstagramUserProfile } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface Collection {
  id: string;
  name: string;
  postIds: string[];
}

interface SavedPostsContextType {
  savedPosts: InstagramPost[];
  collections: Record<string, Collection>;
  addPostToCollection: (post: InstagramPost, collectionId: string) => void;
  removeSavedPost: (postId: string) => void;
  createCollection: (name: string) => void;
  // Profiles support (MVP)
  savedProfiles: InstagramUserProfile[];
  addProfile: (profile: InstagramUserProfile) => void;
  removeSavedProfile: (profileId: string) => void;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

export const SavedPostsProvider = ({ children }: { children: ReactNode }) => {
  const [savedPosts, setSavedPosts] = useState<InstagramPost[]>([]);
  const [collections, setCollections] = useState<Record<string, Collection>>({
    'reels-inspiration': { id: 'reels-inspiration', name: 'Reels Inspiration', postIds: [] },
    'carousel-ideas': { id: 'carousel-ideas', name: 'Carousel Ideas', postIds: [] },
    'hashtag-research': { id: 'hashtag-research', name: 'Hashtag Research', postIds: [] },
  });
  const [savedProfiles, setSavedProfiles] = useState<InstagramUserProfile[]>([]);
  const { toast, dismiss } = useToast();

  // Initialize saved state from localStorage on mount
  useEffect(() => {
    try {
      const postsRaw = localStorage.getItem('wv_saved_posts');
      if (postsRaw) {
        const parsed = JSON.parse(postsRaw);
        if (Array.isArray(parsed)) setSavedPosts(parsed as InstagramPost[]);
      }
      const collectionsRaw = localStorage.getItem('wv_collections');
      if (collectionsRaw) {
        const parsed = JSON.parse(collectionsRaw);
        if (parsed && typeof parsed === 'object') setCollections(parsed as Record<string, Collection>);
      }
      const profilesRaw = localStorage.getItem('wv_saved_profiles');
      if (profilesRaw) {
        const parsed = JSON.parse(profilesRaw);
        if (Array.isArray(parsed)) setSavedProfiles(parsed as InstagramUserProfile[]);
      }
    } catch (e) {
      // ignore storage/parse errors
    }
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wv_saved_posts', JSON.stringify(savedPosts));
      localStorage.setItem('wv_collections', JSON.stringify(collections));
      localStorage.setItem('wv_saved_profiles', JSON.stringify(savedProfiles));
    } catch (e) {
      // ignore storage errors
    }
  }, [savedPosts, collections, savedProfiles]);

  const createCollection = (name: string) => {
    const newId = name.toLowerCase().replace(/\s+/g, '-');
    if (!collections[newId]) {
      setCollections(prev => ({
        ...prev,
        [newId]: { id: newId, name, postIds: [] }
      }));
      toast({
        title: 'Collection Created',
        description: `Successfully created the "${name}" collection.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Collection Exists',
        description: 'A collection with this name already exists.',
      });
    }
  };

  const addPostToCollection = (post: InstagramPost, collectionId: string) => {
    // Add post to master list if it's not already there
    if (!savedPosts.some(p => p.id === post.id)) {
      setSavedPosts(prevPosts => [...prevPosts, post]);
    }

    // Add post ID to the specified collection, avoiding duplicates
    setCollections(prev => {
      const collection = prev[collectionId];
      if (collection && !collection.postIds.includes(post.id)) {
        const updatedCollection = {
          ...collection,
          postIds: [...collection.postIds, post.id],
        };
        return { ...prev, [collectionId]: updatedCollection };
      }
      return prev;
    });

    toast({
      title: 'Post Saved!',
      description: `Saved to "${collections[collectionId].name}".`,
    });
  };

  const removeSavedPost = (postId: string) => {
    const originalPost = savedPosts.find(p => p.id === postId);
    const affectedCollectionIds = Object.values(collections)
      .filter(c => c.postIds.includes(postId))
      .map(c => c.id);

    // Remove from master list and all collections
    setSavedPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    setCollections(prev => {
      const newCollections = { ...prev };
      for (const collectionId in newCollections) {
        newCollections[collectionId].postIds = newCollections[collectionId].postIds.filter(id => id !== postId);
      }
      return newCollections;
    });
    toast({
      title: 'Post Removed',
      description: 'The post has been removed from your saved items.',
      action: (
        <ToastAction
          altText="Undo"
          onClick={() => {
            if (originalPost) {
              setSavedPosts(prev => (prev.some(p => p.id === postId) ? prev : [...prev, originalPost]));
            }
            if (affectedCollectionIds.length) {
              setCollections(prev => {
                const next = { ...prev };
                for (const id of affectedCollectionIds) {
                  const col = next[id];
                  if (col && !col.postIds.includes(postId)) {
                    col.postIds = [...col.postIds, postId];
                  }
                }
                return next;
              });
            }
            dismiss();
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  // Profiles support (MVP)
  const addProfile = (profile: InstagramUserProfile) => {
    const alreadySaved = savedProfiles.some(p => p.id === profile.id);
    if (!alreadySaved) {
      setSavedProfiles(prev => [...prev, profile]);
      toast({
        title: 'Profile Saved',
        description: `${profile.username} has been saved.`,
      });
    } else {
      toast({
        title: 'Already Saved',
        description: `${profile.username} is already in your saved profiles.`,
      });
    }
  };

  const removeSavedProfile = (profileId: string) => {
    const originalProfile = savedProfiles.find(p => p.id === profileId);
    setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
    toast({
      title: 'Profile Removed',
      description: 'The profile has been removed from your saved items.',
      action: (
        <ToastAction
          altText="Undo"
          onClick={() => {
            if (originalProfile) {
              setSavedProfiles(prev => (prev.some(p => p.id === profileId) ? prev : [...prev, originalProfile]));
            }
            dismiss();
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  return (
    <SavedPostsContext.Provider
      value={{
        savedPosts,
        collections,
        addPostToCollection,
        removeSavedPost,
        createCollection,
        savedProfiles,
        addProfile,
        removeSavedProfile,
      }}
    >
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (context === undefined) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
};
