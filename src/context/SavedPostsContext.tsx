
'use client';

import type { InstagramPost } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

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
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

export const SavedPostsProvider = ({ children }: { children: ReactNode }) => {
  const [savedPosts, setSavedPosts] = useState<InstagramPost[]>([]);
  const [collections, setCollections] = useState<Record<string, Collection>>({
      'reels-inspiration': { id: 'reels-inspiration', name: 'Reels Inspiration', postIds: [] },
      'carousel-ideas': { id: 'carousel-ideas', name: 'Carousel Ideas', postIds: [] },
      'hashtag-research': { id: 'hashtag-research', name: 'Hashtag Research', postIds: [] },
  });
  const { toast } = useToast();

  const createCollection = (name: string) => {
    const newId = name.toLowerCase().replace(/\s+/g, '-');
    if (!collections[newId]) {
      setCollections(prev => ({
        ...prev,
        [newId]: { id: newId, name, postIds: [] }
      }));
       toast({
        title: "Collection Created",
        description: `Successfully created the "${name}" collection.`,
      });
    } else {
         toast({
            variant: "destructive",
            title: "Collection Exists",
            description: `A collection with this name already exists.`,
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
                postIds: [...collection.postIds, post.id]
            };
            return { ...prev, [collectionId]: updatedCollection };
        }
        return prev;
    });

     toast({
        title: "Post Saved!",
        description: `Saved to "${collections[collectionId].name}".`,
      });
  };

  const removeSavedPost = (postId: string) => {
    // This function might need to be smarter if a post can be in multiple collections
    // For now, let's assume we remove it from all collections and the master list
    setSavedPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    setCollections(prev => {
        const newCollections = { ...prev };
        for (const collectionId in newCollections) {
            newCollections[collectionId].postIds = newCollections[collectionId].postIds.filter(id => id !== postId);
        }
        return newCollections;
    });
     toast({
        title: "Post Removed",
        description: `The post has been removed from your saved items.`,
      });
  };

  return (
    <SavedPostsContext.Provider value={{ savedPosts, collections, addPostToCollection, removeSavedPost, createCollection }}>
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
