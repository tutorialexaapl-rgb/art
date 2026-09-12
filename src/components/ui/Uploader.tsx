import { ImagePlus, X, AlertCircle, Loader2 } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  storageService, validateFile, validateFileCount, getMaxFiles, getMaxSizeMb,
  type StorageBucket, type UploadResult, type UploadValidationError,
} from '@/services/storageService';

export interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  path?: string;
  file?: File;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

interface MultiImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  bucket: StorageBucket;
  userId: string;
  max?: number;
  label?: string;
  hint?: string;
}

export function isImageReady(img: UploadedImage): boolean {
  return (
    !img.uploading &&
    !img.error &&
    typeof img.url === 'string' &&
    (img.url.startsWith('http://') || img.url.startsWith('https://'))
  );
}

export function hasUploadingImages(images: UploadedImage[]): boolean {
  return images.some((img) => img.uploading);
}

export function hasErroredImages(images: UploadedImage[]): boolean {
  return images.some((img) => img.error);
}

export function hasBlobImages(images: UploadedImage[]): boolean {
  return images.some((img) => img.url.startsWith('blob:'));
}

export function getValidImageUrls(images: UploadedImage[]): string[] {
  return images.filter(isImageReady).map((img) => img.url);
}

export function validateImagesForSubmit(images: UploadedImage[]): string | null {
  if (hasUploadingImages(images)) {
    return 'Zdjęcia są jeszcze przesyłane. Poczekaj na zakończenie uploadu.';
  }
  if (hasErroredImages(images)) {
    return 'Jedno ze zdjęć nie zostało przesłane poprawnie. Usuń je lub spróbuj ponownie.';
  }
  if (hasBlobImages(images)) {
    return 'Jedno ze zdjęć nie zostało jeszcze przesłane. Spróbuj ponownie za chwilę.';
  }
  return null;
}

export function MultiImageUploader({
  images, onChange, bucket, userId, max, label, hint,
}: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const imagesRef = useRef(images);
  imagesRef.current = images;

  const effectiveMax = max ?? getMaxFiles(bucket) ?? 10;
  const maxMb = getMaxSizeMb(bucket);
  const remaining = effectiveMax - images.length;

  const updateImage = useCallback((imgId: string, patch: Partial<UploadedImage>) => {
    const next = imagesRef.current.map((img) =>
      img.id === imgId ? { ...img, ...patch } : img
    );
    imagesRef.current = next;
    onChange(next);
  }, [onChange]);

  const uploadSingle = useCallback(async (file: File, imgId: string) => {
    const uploadFn = bucket === 'commission-inspirations'
      ? storageService.uploadCommissionInspiration
      : bucket === 'artist-portfolio'
        ? storageService.uploadPortfolioImage
        : storageService.uploadMilestoneAttachment;

    try {
      const result = await uploadFn(file, userId, (percent) => {
        updateImage(imgId, { progress: percent });
      });
      updateImage(imgId, {
        url: result.url,
        path: result.path,
        uploading: false,
        progress: 100,
        error: undefined,
      });
    } catch (err) {
      console.error('[Uploader] upload failed:', {
        imgId, fileName: file.name,
        message: err instanceof Error ? err.message : String(err),
      });
      updateImage(imgId, {
        uploading: false,
        error: err instanceof Error ? err.message : 'Błąd uploadu',
      });
    }
  }, [bucket, userId, updateImage]);

  const handleFiles = useCallback(async (files: FileList) => {
    setError(null);
    const fileArray = Array.from(files);
    const validationErrors: UploadValidationError[] = [];
    const validFiles: File[] = [];

    const currentCount = imagesRef.current.length;

    for (const file of fileArray) {
      const countError = validateFileCount(currentCount + validFiles.length, bucket);
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

    const newImages: UploadedImage[] = validFiles.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      file,
      uploading: true,
      progress: 0,
    }));

    const baseImages = imagesRef.current;
    const withNew = [...baseImages, ...newImages];
    imagesRef.current = withNew;
    onChange(withNew);

    for (let i = 0; i < validFiles.length; i++) {
      await uploadSingle(validFiles[i], newImages[i].id);
    }
  }, [bucket, onChange, uploadSingle]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  function handleRemove(id: string) {
    const target = imagesRef.current.find((img) => img.id === id);
    if (target?.url.startsWith('blob:')) URL.revokeObjectURL(target.url);
    if (target?.path && !target.path.startsWith('blob:')) {
      storageService.deleteFile(bucket, target.path).catch(() => {});
    }
    const next = imagesRef.current.filter((img) => img.id !== id);
    imagesRef.current = next;
    onChange(next);
  }

  const handleRetry = useCallback(async (id: string) => {
    const target = imagesRef.current.find((img) => img.id === id);
    if (!target || !target.file) return;
    setError(null);
    updateImage(id, { uploading: true, error: undefined, progress: 0 });
    await uploadSingle(target.file, id);
  }, [updateImage, uploadSingle]);

  return (
    <div>
      {label && <span className="label-elegant">{label}</span>}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'mt-1 rounded-xl border border-dashed transition-all',
          remaining > 0
            ? isDragging ? 'border-gold-400 bg-gold-50/30' : 'border-graphite-400/20 hover:border-gold-400'
            : 'opacity-50'
        )}
      >
        {remaining > 0 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 py-6 text-graphite-300 transition-colors hover:text-gold-500"
          >
            <ImagePlus className="h-7 w-7" />
            <span className="text-sm">Kliknij lub przeciągnij zdjęcia tutaj</span>
            <span className="text-xs text-graphite-200">JPG, PNG, WEBP - max {maxMb} MB każde</span>
          </button>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 py-4 text-sm text-graphite-200">
            Osiągnięto limit {effectiveMax} zdjęć
          </div>
        )}
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

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-graphite-400/10">
              <img src={img.url} alt={`Przesłane zdjęcie: ${img.filename}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
              {img.uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-graphite-700/60">
                  <Loader2 className="h-5 w-5 animate-spin text-ivory-100" />
                  <div className="h-1 w-16 overflow-hidden rounded-full bg-ivory-100/20">
                    <div
                      className="h-full bg-gold-400 transition-all"
                      style={{ width: `${img.progress ?? 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-ivory-100">{img.progress ?? 0}%</span>
                </div>
              )}
              {img.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-error/80 p-1 text-center">
                  <AlertCircle className="h-4 w-4 text-ivory-100" />
                  <span className="text-[10px] text-ivory-100">{img.error}</span>
                  <button
                    type="button"
                    onClick={() => handleRetry(img.id)}
                    className="text-[10px] underline text-ivory-100"
                  >
                    Spróbuj ponownie
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(img.id)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-graphite-700/70 text-ivory-100 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-error"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="mt-2 text-xs text-graphite-300">{images.length} / {effectiveMax} zdjęć</p>
      )}

      {hint && !error && <p className="mt-1.5 text-xs text-graphite-300">{hint}</p>}
    </div>
  );
}
