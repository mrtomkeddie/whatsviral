export type Platform = "youtube" | "reddit";

export type MomentumMetrics = {
  likes_per_hour: number;
  comments_per_hour: number;
  creator_size_normalized_factor: number;
  age_penalty: number;
  score: number;
};

export type ContentPattern =
  | "POV"
  | "listicle"
  | "meme"
  | "reaction"
  | "tutorial"
  | "countdown"
  | "storytime"
  | "green-screen"
  | "fitness tips"
  | "productivity hacks"
  | "gaming";

export type Post = {
  id: string;
  platform: Platform;
  title: string;
  author: string;
  url: string;
  publishedAt: string; // ISO string
  engagement: {
    likes: number;
    comments: number;
    views?: number;
  };
  momentum: MomentumMetrics;
  momentumBucket: "Emerging" | "Heating" | "On Fire";
  hook: string;
  patternTags: ContentPattern[];
  engagementSnapshots: number[]; // For sparkline, just a list of numbers
};
