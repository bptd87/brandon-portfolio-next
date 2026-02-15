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

        try {
            await connection.execute('ALTER TABLE rendering_gallery ADD COLUMN description TEXT');
            console.log('Successfully added description column to rendering_gallery');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Column description already exists in rendering_gallery');
            } else {
                console.error('Failed to add column:', e);
                throw e;
            }
        }

        await connection.end();
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
}

run();
