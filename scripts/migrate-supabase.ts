import { getDb } from '../server/db';
import { projects, projectImages } from '../drizzle/schema';
import { storagePut } from '../server/storage';
import fs from 'fs';
import path from 'path';

// Read exported Supabase data
const dataDir = path.join(process.cwd(), 'data');
const projectsData = JSON.parse(
  fs.readFileSync(path.join(dataDir, 'portfolio_projects.json'), 'utf-8')
);

console.log('🧪 TEST MIGRATION - First 2 projects (1 Scenic Design, 1 Experiential)');
console.log('✅ Connected to database\n');

// Get one Scenic Design and one Experiential Design project for testing
const scenicProject = projectsData.find((p: any) => p.category === 'Scenic Design');
const experientialProject = projectsData.find((p: any) => p.category === 'Experiential Design');
const testProjects = [scenicProject, experientialProject].filter(Boolean);

console.log(`📦 Testing with ${testProjects.length} projects:`);
testProjects.forEach((p: any, i: number) => {
  console.log(`   ${i + 1}. ${p.title} (${p.category})`);
});
console.log('');

// Map category to discipline
function mapDiscipline(category: string): string {
  const mapping: Record<string, string> = {
    'Scenic Design': 'scenic_design',
    'Experiential Design': 'experiential_design',
    'Rendering': 'rendering',
    'Scenic Models': 'scenic_models'
  };
  return mapping[category] || 'scenic_design';
}

// Get gallery mapping based on discipline
function getGalleryMapping(discipline: string) {
  switch (discipline) {
    case 'scenic_design':
      // Scenic Design: hero=renderings, process=production photos
      return {
        hero: 'rendering',
        process: 'production'
      };
    case 'experiential_design':
      // Experiential: hero=production photos, process=technical docs
      return {
        hero: 'production',
        process: 'rendering'
      };
    case 'rendering':
      // Rendering: hero=renderings, process=reference
      return {
        hero: 'rendering',
        process: 'production'
      };
    case 'scenic_models':
      // Scenic Models: hero=model photos, process=build process
      return {
        hero: 'production',
        process: 'rendering'
      };
    default:
      return {
        hero: 'production',
        process: 'rendering'
      };
  }
}

// Download and upload image to S3
async function migrateImage(url: string): Promise<string | null> {
  if (!url || url === '') return null;
  
  try {
    console.log(`   📥 ${url.substring(0, 80)}...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`   ❌ Failed to download: ${response.status}`);
      return null;
    }
    
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Get file extension from URL
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath) || '.jpg';
    const filename = path.basename(urlPath);
    
    // Upload to S3
    const fileKey = `migrated/${filename}`;
    const contentType = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
    const { url: s3Url } = await storagePut(fileKey, uint8Array, contentType);
    
    console.log(`   ✅ Uploaded`);
    return s3Url;
  } catch (error) {
    console.log(`   ❌ Error: ${error}`);
    return null;
  }
}

// Get database connection
const db = await getDb();
if (!db) {
  console.error('❌ Failed to connect to database');
  process.exit(1);
}

// Migrate projects
for (const supaProject of testProjects) {
  console.log(`🎨 ${supaProject.title}`);
  
  const discipline = mapDiscipline(supaProject.category);
  console.log(`   Category: ${supaProject.category} → ${discipline}`);
  
  // Upload cover image
  console.log(`   Cover image:`);
  const coverImageUrl = await migrateImage(supaProject.card_image);
  
  // Map creative team
  const creativeTeam = supaProject.credits || [];
  
  // Map design notes (array to string)
  const designNotes = Array.isArray(supaProject.design_notes) 
    ? supaProject.design_notes.join('\n\n')
    : (supaProject.design_notes || '');
  
  // Create project
  const [newProject] = await db.insert(projects).values({
    title: supaProject.title,
    slug: supaProject.slug,
    discipline,
    subcategory: supaProject.subcategory || null,
    venue: supaProject.venue || null,
    location: supaProject.location || null,
    year: supaProject.year || null,
    client: supaProject.client_name || null,
    excerpt: supaProject.description || '',
    description: supaProject.project_overview || supaProject.description || '',
    designNotes,
    creativeTeam: JSON.stringify(creativeTeam),
    coverImageUrl,
    published: supaProject.published ?? true,
    featured: supaProject.featured ?? false,
    viewCount: supaProject.views || 0,
    likeCount: supaProject.likes || 0,
  }).$returningId();
  
  console.log(`   ✅ Project created (ID: ${newProject.id})`);
  
  // Get gallery mapping for this discipline
  const galleryMapping = getGalleryMapping(discipline);
  
  // Migrate gallery images
  const galleries = supaProject.galleries || {};
  const heroImages = galleries.hero || [];
  const processImages = galleries.process || [];
  const heroCaptions = galleries.heroCaptions || [];
  const processCaptions = galleries.processCaptions || [];
  
  let imageOrder = 0;
  
  // Migrate hero gallery
  if (heroImages.length > 0) {
    console.log(`   Hero images (${heroImages.length}):`);
    for (let i = 0; i < heroImages.length; i++) {
      const imageUrl = heroImages[i];
      if (!imageUrl || imageUrl === '') continue;
      
      const s3Url = await migrateImage(imageUrl);
      if (s3Url) {
        await db.insert(projectImages).values({
          projectId: newProject.id,
          imageUrl: s3Url,
          imageType: galleryMapping.hero, // Use discipline-specific mapping
          caption: heroCaptions[i] || null,
          displayOrder: imageOrder++,
        });
      }
    }
  }
  
  // Migrate process gallery
  if (processImages.length > 0) {
    console.log(`   Process images (${processImages.length}):`);
    for (let i = 0; i < processImages.length; i++) {
      const imageUrl = processImages[i];
      if (!imageUrl || imageUrl === '') continue;
      
      const s3Url = await migrateImage(imageUrl);
      if (s3Url) {
        await db.insert(projectImages).values({
          projectId: newProject.id,
          imageUrl: s3Url,
          imageType: galleryMapping.process, // Use discipline-specific mapping
          caption: processCaptions[i] || null,
          displayOrder: imageOrder++,
        });
      }
    }
  }
  
  // Migrate YouTube videos
  const youtubeVideos = supaProject.youtube_videos || [];
  if (youtubeVideos.length > 0) {
    console.log(`   YouTube videos (${youtubeVideos.length}):`);
    for (const videoUrl of youtubeVideos) {
      if (!videoUrl || videoUrl === '') continue;
      
      await db.insert(projectImages).values({
        projectId: newProject.id,
        imageUrl: '', // No image for videos
        videoUrl,
        imageType: 'video',
        displayOrder: imageOrder++,
      });
      console.log(`   ✅ Added video: ${videoUrl}`);
    }
  }
  
  const totalImages = imageOrder;
  console.log(`   ✅ Imported ${totalImages} images/videos\n`);
}

console.log('✨ Test Migration Complete!');
console.log('==================');
console.log(`✅ Imported: ${testProjects.length} projects`);
console.log('🎉 Success! Check your portfolio at /projects');

process.exit(0);
