'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSavedPosts } from '@/context/SavedPostsContext';
import type { InstagramPost } from '@/lib/types';
import { Plus, Bookmark, FolderPlus } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface SaveToCollectionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  post: InstagramPost;
}

export function SaveToCollectionDialog({ isOpen, onOpenChange, post }: SaveToCollectionDialogProps) {
  const { collections, addPostToCollection, createCollection } = useSavedPosts();
  const [newCollectionName, setNewCollectionName] = React.useState('');
  const [showNewCollectionInput, setShowNewCollectionInput] = React.useState(false);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName('');
      setShowNewCollectionInput(false);
    }
  };

  const handleSave = (collectionId: string) => {
    addPostToCollection(post, collectionId);
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!isOpen) {
      setShowNewCollectionInput(false);
      setNewCollectionName('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
          <DialogDescription>
            Organize your saved posts into collections.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <ScrollArea className="h-48">
                <div className="space-y-2 pr-6">
                    {Object.values(collections).map((collection) => (
                        <Button
                            key={collection.id}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => handleSave(collection.id)}
                        >
                            <Bookmark className="mr-2 h-4 w-4" />
                            {collection.name}
                            <span className="ml-auto text-xs text-muted-foreground">{collection.postIds.length} items</span>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
        <DialogFooter className='flex-col gap-2'>
          {showNewCollectionInput ? (
            <div className="flex items-center space-x-2">
              <Input
                placeholder="e.g. Reel Ideas"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
              />
              <Button onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>Create</Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setShowNewCollectionInput(true)}
              className="w-full justify-center"
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              Create New Collection
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
