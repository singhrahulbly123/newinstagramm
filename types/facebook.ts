export type FacebookQuality = {
  label: 'HD' | 'SD' | 'default';
  url: string;
};

export type FacebookExtractionResult = {
  success: boolean;
  title: string | null;
  thumbnail: string | null;
  qualities: FacebookQuality[];
  description: string | null;
  debug: string[];
};

export type FacebookApiResponse = {
  success: boolean;
  title?: string;
  thumbnail?: string;
  description?: string;
  qualities?: FacebookQuality[];
  error?: string;
  debug?: string[];
};

export type FacebookReelExtractionResult = {
  videoUrl: string | null;
  thumbnailUrl: string | null;
  title: string | null;
  description: string | null;
  debug: string[];
};
