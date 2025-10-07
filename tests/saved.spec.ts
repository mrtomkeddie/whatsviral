import { test, expect } from '@playwright/test';

const LS_KEYS = {
  posts: 'wv_saved_posts',
  profiles: 'wv_saved_profiles',
  collections: 'wv_collections',
};

function seedLocalStorage(page, data: Partial<Record<keyof typeof LS_KEYS, any>>) {
  return page.addInitScript(({ LS_KEYS, data }) => {
    localStorage.clear();
    if (data.posts) localStorage.setItem(LS_KEYS.posts, JSON.stringify(data.posts));
    if (data.profiles) localStorage.setItem(LS_KEYS.profiles, JSON.stringify(data.profiles));
    if (data.collections) localStorage.setItem(LS_KEYS.collections, JSON.stringify(data.collections));
  }, { LS_KEYS, data });
}

// Basic sample post and profile for tests
const samplePost = {
  id: 'test-post-1',
  platform: 'instagram',
  caption: 'Test caption for Playwright',
  author: 'playwright.user',
  url: 'https://instagram.com/p/test',
  publishedAt: new Date().toISOString(),
  metrics: { likes: 10, comments: 1, topScore: 9.1 },
  thumbnailUrl: 'https://picsum.photos/seed/test-post-1/480/480',
  mediaType: 'IMAGE',
};

const sampleProfile = {
  id: 'test-profile-1',
  username: 'playwright.profile',
  fullName: 'Playwright User',
  profilePictureUrl: 'https://picsum.photos/seed/test-user/150/150',
  followers: 1000,
  following: 100,
  postCount: 10,
  engagementRate: 2.0,
  avgLikes: 100,
  avgComments: 5,
  postingFrequency: '1 post/week',
  recentPosts: [],
  followerHistory: [],
  engagementHistory: [],
  topMentions: [],
};

const baseCollections = {
  'reels-inspiration': { id: 'reels-inspiration', name: 'Reels Inspiration', postIds: ['test-post-1'] },
};

// Posts: Unsave confirm and Undo restores
test('Saved page: Unsave post then Undo restores it', async ({ page }) => {
  await seedLocalStorage(page, { posts: [samplePost], collections: baseCollections });
  await page.goto('/saved');

  // Ensure All Posts tab shows our post
  await expect(page.getByRole('heading', { name: 'Saved Items', exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'All Posts' })).toBeVisible();
  await expect(page.getByText('Test caption for Playwright')).toBeVisible();

  // Open Unsave dialog and confirm
  await page.getByRole('button', { name: 'Unsave' }).click();
  await expect(page.getByText('Unsave this post?')).toBeVisible();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Unsave' }).click();

  // Toast appears with Undo, click it
  await expect(page.getByText('Post Removed', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();

  // Post visible again
  await expect(page.getByText('Test caption for Playwright')).toBeVisible();
});

// Posts: Cancel unsave keeps post
test('Saved page: Cancel Unsave keeps the post', async ({ page }) => {
  await seedLocalStorage(page, { posts: [samplePost], collections: baseCollections });
  await page.goto('/saved');

  await page.getByRole('button', { name: 'Unsave' }).click();
  await expect(page.getByText('Unsave this post?')).toBeVisible();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Cancel' }).click();

  await expect(page.getByText('Test caption for Playwright')).toBeVisible();
});

// Profiles: Unsave confirm and Undo restores
test('Saved page: Unsave profile then Undo restores it', async ({ page }) => {
  await seedLocalStorage(page, { profiles: [sampleProfile] });
  await page.goto('/saved');

  // Switch to Profiles tab
  await page.getByRole('tab', { name: 'Profiles' }).click();

  await expect(page.getByRole('img', { name: 'playwright.profile' })).toBeVisible();

  // Unsave and Undo
  await page.getByRole('button', { name: 'Unsave' }).click();
  await expect(page.getByText('Unsave this profile?')).toBeVisible();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Unsave' }).click();

  await expect(page.getByText('Profile Removed', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();

  await expect(page.getByText('@playwright.profile', { exact: true })).toBeVisible();
});

// Profiles: Cancel unsave keeps profile
test('Saved page: Cancel Unsave keeps the profile', async ({ page }) => {
  await seedLocalStorage(page, { profiles: [sampleProfile] });
  await page.goto('/saved');

  await page.getByRole('tab', { name: 'Profiles' }).click();
  await page.getByRole('button', { name: 'Unsave' }).click();
  await expect(page.getByText('Unsave this profile?')).toBeVisible();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Cancel' }).click();

  await expect(page.getByText('@playwright.profile', { exact: true })).toBeVisible();
});