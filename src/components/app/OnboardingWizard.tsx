"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Youtube, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const defaultKeywords = ["minecraft memes", "fitness tips", "productivity hacks"];
const defaultSubreddits = ["r/AskReddit", "r/memes", "r/Entrepreneur"];
const defaultChannels = []; // No default channels to avoid specific endorsements

export function OnboardingWizard({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to TrendTorch!</DialogTitle>
          <DialogDescription>
            Let's set up your first sources to start finding emerging content.
            You can always change these later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="keywords">
              Keywords{" "}
              <span className="text-muted-foreground">(e.g., Google Trends)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {defaultKeywords.map((kw) => (
                <Badge variant="secondary" key={kw} className="flex items-center gap-2">
                  {kw}
                  <button className="rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input id="keywords" placeholder="Add a new keyword..." />
          </div>

          <div className="space-y-3">
            <Label htmlFor="subreddits">
              Subreddits <span className="text-muted-foreground">(e.g., r/funny)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {defaultSubreddits.map((sub) => (
                 <Badge variant="secondary" key={sub} className="flex items-center gap-2">
                   <MessageSquare className="h-3 w-3" />
                  {sub}
                  <button className="rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input id="subreddits" placeholder="Add a subreddit (e.g., r/gaming)..." />
          </div>

          <div className="space-y-3">
            <Label htmlFor="channels">
              YouTube Channels <span className="text-muted-foreground">(e.g., channel URL)</span>
            </Label>
             <div className="flex flex-wrap gap-2">
              {defaultChannels.map((chan) => (
                 <Badge variant="secondary" key={chan} className="flex items-center gap-2">
                   <Youtube className="h-3 w-3" />
                  {chan}
                  <button className="rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input id="channels" placeholder="Add a YouTube channel URL..." />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} type="submit" className="w-full sm:w-auto">
            Start Discovering Trends
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
