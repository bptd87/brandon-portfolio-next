import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkFullPageProjects() {
  // Get all rendering projects
  const { data: allProjects } = await supabase
    .from('rendering_projects')
    .select('id, title, cover_image_url')
    .order('id');
  
  // Get gallery items
  const { data: galleryItems } = await supabase
    .from('rendering_gallery')
    .select('project_id');
  
  const galleryIds = new Set(galleryItems?.map(g => g.project_id) || []);
  
  console.log('=== FULL PAGE PROJECTS (NOT in rendering_gallery) ===\n');
  
  const fullPageProjects = allProjects.filter(p => !galleryIds.has(p.id));
  
  for (const project of fullPageProjects) {
    console.log(`${project.title} (ID: ${project.id})`);
    console.log(`Cover: ${project.cover_image_url ? project.cover_image_url.substring(0, 80) + '...' : 'NO COVER'}`);
    
    // Get gallery images
    const { data: galleryImages } = await supabase
      .from('rendering_project_images')
      .select('image_url')
      .eq('rendering_project_id', project.id)
      .order('sort_order');
    
    console.log(`Gallery images: ${galleryImages?.length || 0}`);
    galleryImages?.forEach((img, i) => {
      const isSame = img.image_url === project.cover_image_url;
      console.log(`  ${i + 1}. ${img.image_url.substring(0, 80)}... ${isSame ? '⚠️ SAME AS COVER!' : ''}`);
    });
    console.log('');
  }
  
  console.log('=== GALLERY PROJECTS (IN rendering_gallery) ===\n');
  const galleryProjects = allProjects.filter(p => galleryIds.has(p.id));
  galleryProjects.forEach(p => console.log(`- ${p.title}`));
}

checkFullPageProjects();
