
import fs from 'fs';

const TARGET_FILE = 'client/src/pages/DesignHistoryTimeline.tsx';
const PLACEHOLDER = '/android-chrome-512x512.png';

const run = () => {
    let content = fs.readFileSync(TARGET_FILE, 'utf-8');

    // Replace all remaining manuscdn URLs with the placeholder
    // Specific regex to avoid matching across lines or closing quotes
    // Matches: https://files.manuscdn.com/ followed by non-quote characters
    const regex = /https:\/\/files\.manuscdn\.com\/[^"'\s\133\135]+/g;

    let count = 0;
    const newContent = content.replace(regex, (match) => {
        count++;
        return PLACEHOLDER;
    });

    fs.writeFileSync(TARGET_FILE, newContent, 'utf-8');
    console.log(`Replaced ${count} broken links with placeholder.`);
};

run();
