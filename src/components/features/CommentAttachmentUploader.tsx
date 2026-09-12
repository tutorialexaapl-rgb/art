import { useRef, useState, useCallback } from 'react';
import { ImagePlus, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  storageService, validateFile, validateFileCount, getMaxFiles, getMaxSizeMb,
  type StorageBucket, type UploadValidationError,
} from '@/services/storageService';

export interface CommentAttachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  path?: string;
  file?: File;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

interface CommentAttachmentUploaderProps {
  attachments: CommentAttachment[];
  onChange: (attachments: CommentAttachment[]) => void;
  bucket?: StorageBucket;
  userId: string;
  max?: number;
}

export function CommentAttachmentUploader({
  attachments,
  onChange,
  bucket = 'commission-comment-attachments',
  userId,
  max,
}: CommentAttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const effectiveMax = max ?? getMaxFiles(bucket) ?? 3;
  const maxMb = getMaxSizeMb(bucket);
  const remaining = effectiveMax - attachments.length;

  const handleFiles = useCallback(async (files: FileList) => {
    setError(null);
    const fileArray = Array.from(files);
    const validationErrors: UploadValidationError[] = [];
    const validFiles: File[] = [];

    for (const file of fileArray) {
      const countError = validateFileCount(attachments.length + validFiles.length, bucket);
      if (countError) {
        validationErrors.push(countError);
        break;
      }
      const fileError = validateFile(file, bucket);
      if (fileError) {
        validationErrors.push(fileError);
        continue;
      }
      validFiles.push(file);
    }

    if (validationErrors.length > 0) {
      setError(validationErrors[0].message);
    }

    if (validFiles.length === 0) return;

    const newAtts: CommentAttachment[] = validFiles.map((file) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      filename: file.name,
      mimeType: file.type,
      file,
      uploading: true,
      progress: 0,
    }));

    let allAttachments = [...attachments, ...newAtts];
    onChange(allAttachments);

    const uploadFn = bucket === 'commission-comment-attachments'
      ? storageService.uploadCommentAttachment
      : bucket === 'offer-attachments'
        ? storageService.uploadOfferAttachment
        : bucket === 'message-attachments'
          ? storageService.uploadMessageAttachment
          : storageService.uploadCommentAttachment;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const attId = newAtts[i].id;

      try {
        const result = await uploadFn(file, userId, (percent) => {
          onChange(allAttachments.map(att =>
            att.id === attId ? { ...att, progress: percent } : att
          ));
        });
        allAttachments = allAttachments.map(att =>
          att.id === attId
            ? { ...att, url: result.url, path: result.path, uploading: false, progress: 100 }
            : att
        );
        onChange(allAttachments);
      } catch {
        allAttachments = allAttachments.map(att =>
          att.id === attId
            ? { ...att, uploading: false, error: 'Błąd uploadu' }
            : att
        );
        onChange(allAttachments);
      }
    }
  }, [attachments, onChange, bucket, effectiveMax, userId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  function handleRemove(id: string) {
    const target = attachments.find((a) => a.id === id);
    if (target?.url.startsWith('blob:')) URL.revokeObjectURL(target.url);
    if (target?.path && !target.path.startsWith('blob:')) {
      storageService.deleteFile(bucket, target.path).catch(() => {});
    }
    onChange(attachments.filter((a) => a.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {remaining > 0 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              'flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-dashed transition-colors',
              isDragging ? 'border-gold-400 bg-gold-50/30' : 'border-graphite-400/20 hover:border-gold-400 hover:text-gold-500'
            )}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-1 text-graphite-300 transition-colors hover:text-gold-500"
            >
              <ImagePlus className="h-4 w-4" />
              <span className="text-[10px]">Dodaj</span>
            </button>
          </div>
        )}
        {attachments.map((att) => (
          <div key={att.id} className="group relative h-16 w-16 overflow-hidden rounded-xl border border-graphite-400/10">
            <img src={att.url} alt={`Załącznik: ${att.filename}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
            {att.uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-graphite-700/60">
                <Loader2 className="h-4 w-4 animate-spin text-ivory-100" />
                <div className="h-1 w-10 overflow-hidden rounded-full bg-ivory-100/20">
                  <div
                    className="h-full bg-gold-400 transition-all"
                    style={{ width: `${att.progress ?? 0}%` }}
                  />
                </div>
              </div>
            )}
            {att.error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-error/80">
                <AlertCircle className="h-4 w-4 text-ivory-100" />
                <span className="text-[9px] text-ivory-100">{att.error}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => handleRemove(att.id)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-graphite-700/70 text-ivory-100 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-error"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {error && (
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-error/5 px-3 py-2">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error" />
          <p className="text-xs text-error">{error}</p>
        </div>
      )}
      {attachments.length > 0 && !error && (
        <p className={cn('mt-1.5 text-xs text-graphite-300')}>
          {attachments.length} / {effectiveMax} zdjęć - JPG, PNG, WEBP, max {maxMb} MB
        </p>
      )}
    </div>
  );
}
