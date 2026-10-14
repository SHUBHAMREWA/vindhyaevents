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

export default cloudinary;
