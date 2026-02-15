
import fs from 'fs';
import path from 'path';

const TARGET_FILE = 'client/src/pages/DesignHistoryTimeline.tsx';
const ASSET_DIR_REL = 'client/public';
const PLACEHOLDER = '/android-chrome-512x512.png';

const run = () => {
    let content = fs.readFileSync(TARGET_FILE, 'utf-8');

    const regex = /\/assets\/design-history\/[^"'\s]+/g;

    let count = 0;

    const newContent = content.replace(regex, (match) => {
        // match: /assets/design-history/foo.jpg
        // absolute path: client/public/assets/design-history/foo.jpg
        // Remove query params if any
        const cleanMatch = match.split('?')[0];
        const localPath = path.join(ASSET_DIR_REL, cleanMatch);

        // Check if file physically exists
        // Since we just deleted small files, existsSync checks for valid files only
        if (fs.existsSync(localPath)) {
            return match;
        }

        count++;
        return PLACEHOLDER;
    });

    fs.writeFileSync(TARGET_FILE, newContent, 'utf-8');
    console.log(`Final Cleanup: Replaced ${count} links to missing/deleted files with placeholder.`);
};

run();
