import { Router, Request, Response } from 'express';
import { getDb } from './db';
import { projects } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Endpoint to get first hero image URL for preload hint
router.get('/hero-image-url', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const firstProject = await db
      .select({ coverImageUrl: projects.coverImageUrl })
      .from(projects)
      .where(and(eq(projects.featured, true), eq(projects.status, 'published')))
      .orderBy(projects.id)
      .limit(1);
    
    if (firstProject.length > 0 && firstProject[0].coverImageUrl) {
      res.json({ url: firstProject[0].coverImageUrl });
    } else {
      res.status(404).json({ error: 'No hero image found' });
    }
  } catch (error) {
    console.error('Hero image fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch hero image' });
  }
});

export default router;
