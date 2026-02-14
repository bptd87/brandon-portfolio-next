
import fs from 'fs';
import path from 'path';

function listEnvKeys() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) {
            console.log('No .env file found');
            return;
        }
        const content = fs.readFileSync(envPath, 'utf-8');
        console.log('--- .env Keys ---');
        content.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Heuristic to identify connection strings
                const isUrl = value.includes('://');
                const protocol = isUrl ? value.split('://')[0] : '';
                console.log(`${key}: ${isUrl ? `[URL: ${protocol}]` : '[Value]'}`);
            }
        });
    } catch (e) {
        console.error('Error:', e);
    }
}

listEnvKeys();
