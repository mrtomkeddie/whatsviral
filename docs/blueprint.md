# **App Name**: TrendTorch

## Core Features:

- User Onboarding: First-run wizard to add keywords, channels, and subreddits. Seed default sources like 'minecraft memes', 'fitness tips', r/AskReddit, r/memes.
- Data Collection: Collector jobs fetch the latest videos from YouTube API and Reddit posts (new/hot) every 15 minutes, writing snapshots of engagement metrics.
- Momentum Scoring: Score content by engagement velocity (change in likes/comments per hour), normalized by creator size, with age penalty.
- Ranking and Filtering: Ranked lists of content (Emerging, Heating, On Fire) with filters for platform and timeframe. Search bar for keyword, channel, and subreddit.
- Content Card Display: Each content card displays title, author, link, publish age, sparkline, hook snippet, pattern tags, and 'Why this ranked' tooltip showing delta likes/h, delta comments/h, author size, age penalty, and momentum.
- AI-Powered Content Intelligence: Use a generative AI tool to extract short hooks (≤15 words) and pattern tags (POV, listicle, meme, reaction, tutorial, countdown, storytime, green-screen) for each new item.
- Watchlists and Email Alerts: Users can add watch rules and receive email alerts when momentum crosses a threshold in two consecutive snapshots.

## Style Guidelines:

- Primary color: HSL(210, 70%, 50%) - A vibrant blue (#3399FF) evokes a sense of discovery and insight.
- Background color: HSL(210, 20%, 98%) - A light, desaturated blue (#F5FAFF) provides a clean, trustworthy feel.
- Accent color: HSL(180, 60%, 40%) - A teal green (#33A699) creates contrast and indicates actionable elements.
- Body and headline font: 'PT Sans' (sans-serif) for a balance of modern clarity and readability.
- Clean, simple icons to represent platforms, content types, and actions (saving, exporting).
- A clean, card-based layout emphasizing data freshness and a 'Why this ranked' explainer on each card.
- Subtle animations for data loading and updates to emphasize the real-time nature of the trend analysis.