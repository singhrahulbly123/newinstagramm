export type StoryMediaType = 'image' | 'video';

export type StoryProfile = {
  username: string;
  displayName: string;
  avatarUrl: string;
  verified: boolean;
  isPrivate: boolean;
  followerCount: number | null;
  followingCount: number | null;
  biography: string | null;
  storyCount: number;
  externalUrl?: string | null;
};

export type StoryItem = {
  id: string;
  mediaType: StoryMediaType;
  title: string;
  filename: string;
  primaryUrl: string;
  thumbnailUrl: string;
  previewUrl: string;
  downloadUrl: string;
  proxyUrl: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  takenAt: number | null;
};

export type StoryExtractionResult = {
  sourceUrl: string;
  profile: StoryProfile;
  stories: StoryItem[];
  extractedAt: string;
  diagnostics: string[];
};

export type StoryApiResponse = {
  success: boolean;
  cached: boolean;
  sourceUrl?: string;
  profile?: StoryProfile;
  stories?: StoryItem[];
  extractedAt?: string;
  diagnostics?: string[];
  error?: string;
};
