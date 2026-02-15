
import { createConnection } from 'mysql2/promise';

async function run() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    try {
        const connection = await createConnection(url);
        console.log('Connected to database');

        console.log('--- Checking rendering_gallery columns ---');
        const [renderingCols] = await connection.execute('SHOW COLUMNS FROM rendering_gallery');
        console.log(renderingCols.map(c => `${c.Field} (${c.Type})`).join('\n'));

        console.log('\n--- Checking projectImages columns ---');
        const [imageCols] = await connection.execute('SHOW COLUMNS FROM projectImages');
        console.log(imageCols.map(c => `${c.Field} (${c.Type})`).join('\n'));

        await connection.end();
    } catch (e) {
        console.error('Failed to get schema:', e);
        process.exit(1);
    }
}

run();
