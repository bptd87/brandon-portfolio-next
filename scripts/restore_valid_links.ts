
import fs from 'fs';
import path from 'path';

const TARGET_FILE = 'client/src/pages/DesignHistoryTimeline.tsx';
const ASSET_DIR = 'client/public/assets/design-history';

async function updateLinks() {
    const fileContent = fs.readFileSync(TARGET_FILE, 'utf-8');
    const urlRegex = /https:\/\/files\.manuscdn\.com\/[^"']+/g;
    const matches = [...new Set(fileContent.match(urlRegex) || [])];

    let updatedContent = fileContent;
    let count = 0;

    for (const url of matches) {
        const filename = url.split('/').pop();
        if (!filename) continue;

        const localPath = path.join(ASSET_DIR, filename);
        const publicUrl = `/assets/design-history/${filename}`;

        if (fs.existsSync(localPath)) {
            const stats = fs.statSync(localPath);
            if (stats.size > 1000) {
                updatedContent = updatedContent.split(url).join(publicUrl);
                count++;
            }
        }
    }

    fs.writeFileSync(TARGET_FILE, updatedContent, 'utf-8');
    console.log(`Restored ${count} valid local links.`);
}

updateLinks();
