/**
 * compressImage.ts
 *
 * Thin wrapper around browser-image-compression.
 * Install once:  npm install browser-image-compression
 *
 * All compression is done in a Web Worker (useWebWorker: true) so the
 * main thread — and therefore the UI — is never blocked.
 *
 * Compression targets:
 *   • maxSizeMB: 1 MB  → safe ceiling that clears most server limits
 *   • maxWidthOrHeight: 1920 → full-HD is plenty for a listing card / detail view
 *
 * The function is intentionally silent about failures; callers receive the
 * original file unchanged if compression throws for any reason.
 */

import imageCompression from "browser-image-compression";

/** Accepted raw size before we even attempt compression (10 MB). */
export const MAX_RAW_SIZE_MB  = 10;
export const MAX_RAW_SIZE_BYTES = MAX_RAW_SIZE_MB * 1024 * 1024;

/** Target compressed ceiling. */
const TARGET_SIZE_MB = 1;

export async function compressImage(file: File): Promise<File> {
  // Skip non-images and tiny files that don't need compressing
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= TARGET_SIZE_MB * 1024 * 1024) return file;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB:        TARGET_SIZE_MB,
      maxWidthOrHeight: 1920,
      useWebWorker:     true,
      // Preserve the original file name so it round-trips correctly
      fileType:         file.type as "image/jpeg" | "image/png" | "image/webp",
    });

    // Return as a proper File (not Blob) so FormData appends with the right name
    return new File([compressed], file.name, { type: compressed.type });
  } catch {
    // Compression failed — send the original rather than breaking the upload
    return file;
  }
}

/**
 * Compress an array of files sequentially.
 * Returns an array of the same length; failed items fall back to original.
 */
export async function compressImages(files: File[]): Promise<File[]> {
  const results: File[] = [];
  for (const file of files) {
    results.push(await compressImage(file));
  }
  return results;
}
