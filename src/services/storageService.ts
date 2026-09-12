import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type StorageBucket =
  | 'avatars'
  | 'artist-portfolio'
  | 'commission-inspirations'
  | 'commission-comment-attachments'
  | 'offer-attachments'
  | 'project-milestones'
  | 'message-attachments';

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const BUCKET_SIZE_LIMITS: Record<StorageBucket, number> = {
  'avatars': 2 * 1024 * 1024,
  'artist-portfolio': 8 * 1024 * 1024,
  'commission-inspirations': 8 * 1024 * 1024,
  'commission-comment-attachments': 8 * 1024 * 1024,
  'offer-attachments': 8 * 1024 * 1024,
  'project-milestones': 10 * 1024 * 1024,
  'message-attachments': 8 * 1024 * 1024,
};

const BUCKET_MAX_FILES: Partial<Record<StorageBucket, number>> = {
  'commission-inspirations': 10,
  'artist-portfolio': 20,
  'commission-comment-attachments': 3,
  'offer-attachments': 5,
  'project-milestones': 10,
  'message-attachments': 5,
};

const BUCKET_MAX_SIZE_MB: Record<StorageBucket, number> = {
  'avatars': 2,
  'artist-portfolio': 8,
  'commission-inspirations': 8,
  'commission-comment-attachments': 8,
  'offer-attachments': 8,
  'project-milestones': 10,
  'message-attachments': 8,
};

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UploadValidationError {
  filename: string;
  reason: 'invalid_type' | 'too_large' | 'too_many';
  message: string;
}

export function validateFile(file: File, bucket: StorageBucket): UploadValidationError | null {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return {
      filename: file.name,
      reason: 'invalid_type',
      message: `Plik "${file.name}" ma nieobsługiwany format. Dozwolone: JPG, PNG, WEBP.`,
    };
  }
  const maxSize = BUCKET_SIZE_LIMITS[bucket];
  if (file.size > maxSize) {
    return {
      filename: file.name,
      reason: 'too_large',
      message: `Plik "${file.name}" jest za duży. Maksymalny rozmiar: ${BUCKET_MAX_SIZE_MB[bucket]} MB.`,
    };
  }
  return null;
}

export function validateFileCount(currentCount: number, bucket: StorageBucket): UploadValidationError | null {
  const max = BUCKET_MAX_FILES[bucket];
  if (max === undefined) return null;
  if (currentCount >= max) {
    return {
      filename: '',
      reason: 'too_many',
      message: `Można dodać maksymalnie ${max} zdjęć.`,
    };
  }
  return null;
}

export function getMaxFiles(bucket: StorageBucket): number | undefined {
  return BUCKET_MAX_FILES[bucket];
}

export function getMaxSizeMb(bucket: StorageBucket): number {
  return BUCKET_MAX_SIZE_MB[bucket];
}

function generateFilePath(userId: string, file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const uuid = crypto.randomUUID();
  return `${userId}/${uuid}.${ext}`;
}

async function uploadToBucket(
  bucket: StorageBucket,
  file: File,
  userId: string,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    const url = URL.createObjectURL(file);
    return {
      url,
      path: url,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    };
  }

  const path = generateFilePath(userId, file);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return {
    url: urlData.publicUrl,
    path,
    filename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

async function uploadToPrivateBucket(
  bucket: StorageBucket,
  file: File,
  userId: string,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    const url = URL.createObjectURL(file);
    return {
      url,
      path: url,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    };
  }

  const path = generateFilePath(userId, file);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data: signedUrlData, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600);

  if (signedError) throw signedError;

  return {
    url: signedUrlData.signedUrl,
    path,
    filename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

export const storageService = {
  ACCEPTED_MIME_TYPES,
  BUCKET_SIZE_LIMITS,
  BUCKET_MAX_FILES,

  async uploadAvatar(
    file: File,
    userId: string,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> {
    return uploadToBucket('avatars', file, userId, onProgress);
  },

  async uploadPortfolioImage(
    file: File,
    userId: string,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> {
    return uploadToBucket('artist-portfolio', file, userId, onProgress);
  },

  async uploadCommissionInspiration(
    file: File,
    userId: string,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> {
    return uploadToBucket('commission-inspirations', file, userId, onProgress);
  },

  async uploadCommentAttachment(
    file: File,
    userId: string,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> {
    return uploadToPrivateBucket('commission-comment-attachments', file, userId, onProgress);
  },

  async uploadOfferAttachment(
    file: File,
    userId: string,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> {
    return uploadToPrivateBucket('offer-attachments', file, userId, onProgress);
  },

  async uploadMilestoneAttachment(
    file: File,
    userId: string,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> {
    return uploadToPrivateBucket('project-milestones', file, userId, onProgress);
  },

  async uploadMessageAttachment(
    file: File,
    userId: string,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> {
    return uploadToPrivateBucket('message-attachments', file, userId, onProgress);
  },

  async deleteFile(bucket: StorageBucket, path: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    if (path.startsWith('blob:')) {
      URL.revokeObjectURL(path);
      return;
    }
    const pathParts = path.split(`/${bucket}/`);
    const objectPath = pathParts[pathParts.length - 1];
    const { error } = await supabase.storage.from(bucket).remove([objectPath]);
    if (error) throw error;
  },

  async getSignedUrl(bucket: StorageBucket, path: string, expiresIn = 3600): Promise<string> {
    if (!isSupabaseConfigured) return path;
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  },
};
