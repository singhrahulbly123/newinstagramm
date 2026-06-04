export type AudioFetchStatus = 'idle' | 'loading' | 'success' | 'error';

export type AudioApiResponse = {
  success: boolean;
  audioUrl?: string;
  previewUrl?: string;
  title?: string;
  author?: string;
  duration?: number;
  description?: string;
  fileType?: string;
  fileSize?: number;
  filename?: string;
  error?: string;
  debug?: string[];
};

export type AudioExtractionResult = {
  audioUrl: string | null;
  previewUrl: string | null;
  title: string | null;
  author: string | null;
  duration: number | null;
  description: string | null;
  fileType: string | null;
  filename: string | null;
  debug: string[];
};
