
'use client';

import type { InstagramPost } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SavedPostsContextType {
  savedPosts: InstagramPost[];
  addSavedPost: (post: InstagramPost) => void;
  removeSavedPost: (postId: string) => void;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

export const SavedPostsProvider = ({ children }: { children: ReactNode }) => {
  const [savedPosts, setSavedPosts] = useState<InstagramPost[]>([]);

  const addSavedPost = (post: InstagramPost) => {
    setSavedPosts(prevPosts => [...prevPosts, post]);
  };

  const removeSavedPost = (postId: string) => {
    setSavedPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  };

  return (
    <SavedPostsContext.Provider value={{ savedPosts, addSavedPost, removeSavedPost }}>
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
