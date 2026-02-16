/**
 * Optimizes an image file for web usage.
 * - Resizes to a maximum width/height (default 1920px)
 * - Converts JPG/JPEG to WebP format (PNG preserved for alpha channels)
 * - Compresses quality (default 0.8 for WebP, 0.9 for PNG)
 * - Renames to a URL-friendly slug
 * 
 * PNG files are NOT converted to WebP to preserve alpha transparency.
 */
export async function processImageForUpload(
    file: File,
    maxWidth = 1920,
    quality = 0.8
): Promise<File> {
    // Determine if this is a PNG file (don't convert to WebP)
    const isPNG = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    const targetFormat = isPNG ? 'image/png' : 'image/webp';
    const targetExtension = isPNG ? 'png' : 'webp';
    const qualityForFormat = isPNG ? 0.9 : quality; // PNG quality can be slightly higher
    return new Promise((resolve, reject) => {
        // 1. Create an image element to load the file
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = (e) => reject(e);

        img.onload = () => {
            // 2. Calculate new dimensions
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            // 3. Draw to canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Better scaling quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // 4. Convert to target format (WebP for JPG/JPEG, PNG for PNG)
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Could not create blob from canvas'));
                        return;
                    }

                    // 5. Generate new filename
                    const originalName = file.name.split('.')[0];
                    const text = originalName
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '') // Remove special chars
                        .replace(/\s+/g, '-')     // Replace spaces with dashes
                        .replace(/-+/g, '-');     // Remove duplicate dashes

                    const timestamp = Date.now().toString().slice(-4); // Add short timestamp for uniqueness
                    const newName = `${text}-${timestamp}.${targetExtension}`;

                    // 6. Create new File object with appropriate format
                    const optimizedFile = new File([blob], newName, {
                        type: targetFormat,
                        lastModified: Date.now(),
                    });

                    resolve(optimizedFile);
                },
                targetFormat,
                qualityForFormat
            );
        };

        reader.readAsDataURL(file);
    });
}
