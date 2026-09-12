import { useRef, useState } from 'react';
import { Camera, Loader2, AlertCircle } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import {
  storageService, validateFile,
  type UploadResult,
} from '@/services/storageService';

interface AvatarUploaderProps {
  currentUrl?: string;
  userName: string;
  userId: string;
  onUpload: (url: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarUploader({
  currentUrl, userName, userId, onUpload, size = 'xl',
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    const validationError = validateFile(file, 'avatars');
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setUploading(true);
    try {
      const result: UploadResult = await storageService.uploadAvatar(file, userId);
      onUpload(result.url);
    } catch {
      setError('Nie udało się wgrać zdjęcia. Spróbuj ponownie.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="relative">
        <Avatar name={userName} src={currentUrl} size={size} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold-400 text-graphite-700 shadow-md transition-colors hover:bg-gold-500 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-error/5 px-3 py-2">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error" />
          <p className="text-xs text-error">{error}</p>
        </div>
      )}
      <p className="text-xs text-graphite-300">JPG, PNG, WEBP - max 8 MB</p>
    </div>
  );
}
