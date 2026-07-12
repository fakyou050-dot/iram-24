/**
 * Client-side image compression → WebP.
 * Keeps GIF/SVG as-is. Downscales large images and re-encodes to WebP
 * (falls back to JPEG if the browser doesn't support WebP encoding).
 */
export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  /** File size (bytes) below which we skip work. Default 60 KB. */
  minSizeBytes?: number;
}

const readAsDataURL = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export async function compressImage(file: File, opts: CompressOptions = {}): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.82,
    minSizeBytes = 60 * 1024,
  } = opts;

  if (!file || !file.type.startsWith("image/")) return file;
  // Skip formats we shouldn't re-encode
  if (/gif|svg|x-icon|vnd\.microsoft\.icon/i.test(file.type)) return file;
  if (file.size < minSizeBytes) return file;

  try {
    const dataUrl = await readAsDataURL(file);
    const img = await loadImage(dataUrl);
    let { width, height } = img;
    const ratio = Math.min(1, maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    let finalBlob = blob;
    let ext = "webp";
    let mime = "image/webp";
    if (!finalBlob || finalBlob.size === 0) {
      finalBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );
      ext = "jpg";
      mime = "image/jpeg";
    }
    if (!finalBlob) return file;
    // If somehow we made it bigger, keep original
    if (finalBlob.size >= file.size) return file;

    const base = file.name.replace(/\.[^/.]+$/, "");
    return new File([finalBlob], `${base}.${ext}`, { type: mime, lastModified: Date.now() });
  } catch {
    return file;
  }
}
