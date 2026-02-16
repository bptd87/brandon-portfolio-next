import { supabase } from '@/lib/supabase';

/**
 * Uploads a file to Supabase Storage with 1-year cache and organization.
 * 
 * Path format: [bucket]/[folder]/[year]/[month]/[filename]
 * Example: articles/2024/02/my-image.webp
 * 
 * Cache: 1 year (31536000 seconds) for all files
 * - Files are cached by browser for repeat visits
 * - Use versioned filenames for cache-busting if content changes
 */
export async function uploadImage(
    file: File,
    bucket: string,
    folder: string = 'general'
): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Clean filename: basic slugification
    const cleanName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, '-')
        .replace(/-+/g, '-');

    const filePath = `${folder}/${year}/${month}/${cleanName}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '31536000', // 1 year in seconds for optimal browser caching
            upsert: true,
        });

    if (error) {
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}
