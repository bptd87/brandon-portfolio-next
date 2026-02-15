
import fs from 'fs';
import path from 'path';

const TARGET_FILE = 'client/src/pages/DesignHistoryTimeline.tsx';
const ASSET_DIR_REL = 'client/public';
const PLACEHOLDER = '/android-chrome-512x512.png';

const run = () => {
    let content = fs.readFileSync(TARGET_FILE, 'utf-8');

    // Regex to find all local asset links
    // Matches: /assets/design-history/[filename]
    const regex = /\/assets\/design-history\/[^"']+/g;

    let count = 0;
    let keepCount = 0;

    const newContent = content.replace(regex, (match) => {
        // match is like "/assets/design-history/foo.jpg"
        // construction local path: client/public/assets/design-history/foo.jpg
        const localPath = path.join(ASSET_DIR_REL, match);

        if (fs.existsSync(localPath)) {
            const stats = fs.statSync(localPath);
            if (stats.size > 1000) {
                keepCount++;
                return match; // Keep valid file
            }
        }

        count++;
        return PLACEHOLDER; // Replace invalid/missing
    });

    fs.writeFileSync(TARGET_FILE, newContent, 'utf-8');
    console.log(`Cleanup complete. Kept ${keepCount} valid images. Replaced ${count} invalid links with placeholder.`);
};

run();
