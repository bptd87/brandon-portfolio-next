import 'dotenv/config';
import { appRouter } from '../server/routers';

// Mock context
const ctx = {
    req: {} as any,
    res: {} as any,
    user: {
        id: 1,
        openId: 'test-admin',
        name: 'Test Admin',
        email: 'admin@test.com',
        loginMethod: 'test',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date()
    }
};

async function main() {
    console.log('Testing createSignedUploadUrl...');
    // @ts-ignore - Context typing might be strict but runtime execution is lenient
    const caller = appRouter.createCaller(ctx);

    try {
        const result = await caller.projects.createSignedUploadUrl({
            bucket: 'portfolio',
            path: 'test-upload-verification.png'
        });
        console.log('✅ Success! Signed URL generated:');
        console.log('URL:', result.signedUrl);
        console.log('Token (first 10 chars):', result.token.substring(0, 10) + '...');
        console.log('Path:', result.path);

        if (!result.signedUrl || !result.token) {
            console.error('❌ Missing URL or Token in response');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error generating signed URL:', error);
        process.exit(1);
    }
}

main();
