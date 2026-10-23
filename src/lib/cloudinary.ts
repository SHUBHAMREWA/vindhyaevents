import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "demo",
  api_secret: process.env.CLOUDINARY_API_SECRET || "demo",
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Upload a file buffer or base64 data to Cloudinary with WebP conversion
 */
export async function uploadToCloudinary(
  fileBufferOrBase64: Buffer | string,
  folder: string = "vindhya_events"
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "image" as const,
      format: "webp",
      quality: "auto",
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "webp" },
      ],
    };

    if (typeof fileBufferOrBase64 === "string") {
      cloudinary.uploader.upload(fileBufferOrBase64, uploadOptions, (err, res) => {
        if (err || !res) return reject(err || new Error("Cloudinary upload failed"));
        resolve({
          url: res.url,
          secure_url: res.secure_url,
          public_id: res.public_id,
          format: res.format,
          width: res.width,
          height: res.height,
        });
      });
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (err, res) => {
        if (err || !res) return reject(err || new Error("Cloudinary upload failed"));
        resolve({
          url: res.url,
          secure_url: res.secure_url,
          public_id: res.public_id,
          format: res.format,
          width: res.width,
          height: res.height,
        });
      });

      uploadStream.end(fileBufferOrBase64);
    }
  });
}

/**
 * Delete an image from Cloudinary by its public_id
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
}

/**
 * Safely extract public_id from Cloudinary URL or public_id string.
 * Returns null if the URL is external (Unsplash, local, etc.).
 */
export function extractCloudinaryPublicId(urlOrPublicId?: string): string | null {
  if (!urlOrPublicId || typeof urlOrPublicId !== "string") return null;
  const trimmed = urlOrPublicId.trim();
  if (!trimmed) return null;

  // If it doesn't look like an HTTP URL, treat it as a direct public_id
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed;
  }

  // If it's an external link (Unsplash, Pexels, local /images, etc.), it's not Cloudinary
  if (!trimmed.includes("cloudinary.com")) {
    return null;
  }

  try {
    const parts = trimmed.split("/upload/");
    if (parts.length < 2) return null;
    let afterUpload = parts[1];
    // Remove transformations if present (e.g. w_500,c_fill/)
    const versionIndex = afterUpload.search(/v\d+\//);
    if (versionIndex !== -1) {
      afterUpload = afterUpload.substring(versionIndex).replace(/^v\d+\//, "");
    }
    // Remove query params or hash if any
    afterUpload = afterUpload.split("?")[0].split("#")[0];
    // Remove file extension (e.g. .webp, .jpg, .png)
    const dotIdx = afterUpload.lastIndexOf(".");
    if (dotIdx > 0) {
      afterUpload = afterUpload.substring(0, dotIdx);
    }
    return afterUpload || null;
  } catch {
    return null;
  }
}

/**
 * Safely delete an image from Cloudinary without throwing errors.
 * If the image is not on Cloudinary (e.g., Unsplash, external link) or deletion fails,
 * it safely ignores and returns false, preventing any API failure.
 */
export async function safeDeleteCloudinaryImage(urlOrPublicId?: string): Promise<boolean> {
  if (!urlOrPublicId) return false;
  try {
    const publicId = extractCloudinaryPublicId(urlOrPublicId);
    if (!publicId) return false; // Non-Cloudinary link (Unsplash etc.), skip silently
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (error) {
    console.warn("Cloudinary safe delete notice (ignored):", error);
    return false;
  }
}

export default cloudinary;
