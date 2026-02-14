/**
 * Optimizes an image file for web usage.
 * - Resizes to a maximum width/height (default 1920px)
 * - Converts to WebP format
 * - Compresses quality (default 0.8)
 * - Renames to a URL-friendly slug
 */
export async function processImageForUpload(
    file: File,
    maxWidth = 1920,
    quality = 0.8
): Promise<File> {
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

            // 4. Convert to WebP blob
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
                    const newName = `${text}-${timestamp}.webp`;

                    // 6. Create new File object
                    const optimizedFile = new File([blob], newName, {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });

                    resolve(optimizedFile);
                },
                'image/webp',
                quality
            );
        };

        reader.readAsDataURL(file);
    });
}
