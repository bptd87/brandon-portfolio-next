import { supabase } from '@/lib/supabase';

/**
 * Uploads a file to Supabase Storage with organized numbering.
 * Path format: [bucket]/[folder]/[year]/[month]/[filename]
 * Example: articles/2024/02/my-image.webp
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
            cacheControl: '3600',
            upsert: true, // Overwrite if exists, or false if we want unique? user said organized. Upsert true mimics "replace"
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
