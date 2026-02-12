import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
  } = {}
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'portfolio',
        public_id: options.publicId,
        resource_type: options.resourceType || 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error('Upload failed - no result'));
        }
      }
    );

    uploadStream.end(buffer);
  });
}
