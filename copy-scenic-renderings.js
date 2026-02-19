import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function copyScenicRenderingsToGallery() {
  console.log('Copying scenic design projects with renderings to rendering_projects...\n');
  
  // Get all scenic design projects
  const { data: scenicProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('discipline', 'scenic_design')
    .eq('status', 'published')
    .order('year', { ascending: false });
  
  console.log(`Found ${scenicProjects.length} scenic design projects\n`);
  
  let copiedCount = 0;
  
  for (const project of scenicProjects) {
    // Check if this project has rendering images
    const { data: renderings } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', project.id)
      .eq('image_type', 'rendering');
    
    if (!renderings || renderings.length === 0) {
      continue;
    }
    
    console.log(`${project.title} (${project.year || 'no year'}): ${renderings.length} rendering(s)`);
    
    // Check if already exists in rendering_projects
    const { data: existing } = await supabase
      .from('rendering_projects')
      .select('id')
      .eq('slug', project.slug)
      .single();
    
    let renderingProjectId;
    
    if (existing) {
      console.log(`  Already exists in rendering_projects (ID: ${existing.id})`);
      renderingProjectId = existing.id;
    } else {
      // Create in rendering_projects
      const { data: newProject, error: createError } = await supabase
        .from('rendering_projects')
        .insert({
          title: project.title,
          slug: project.slug,
          excerpt: project.excerpt,
          design_notes: project.designNotes,
          year: project.year,
          month: project.month,
          location: project.location,
          client: project.client,
          status: 'published',
          featured: false,
          gallery_only: false,
          created_at: project.createdAt,
          updated_at: project.updatedAt
        })
        .select('id')
        .single();
      
      if (createError) {
        console.error(`  Error creating:`, createError.message);
        continue;
      }
      
      renderingProjectId = newProject.id;
      console.log(`  ✓ Created in rendering_projects (ID: ${renderingProjectId})`);
      
      // Copy rendering images to rendering_project_images
      for (const img of renderings) {
        await supabase
          .from('rendering_project_images')
          .insert({
            rendering_project_id: renderingProjectId,
            image_url: img.image_url,
            image_key: img.image_key,
            image_type: 'rendering',
            caption: img.caption,
            alt_text: img.alt_text || project.title,
            sort_order: img.sort_order || 0
          });
      }
      console.log(`  ✓ Copied ${renderings.length} image(s)`);
      
      // Set cover image to first rendering
      await supabase
        .from('rendering_projects')
        .update({
          cover_image_url: renderings[0].image_url,
          cover_image_key: renderings[0].image_key
        })
        .eq('id', renderingProjectId);
    }
    
    // Add to rendering_gallery
    const { error: galleryError } = await supabase
      .from('rendering_gallery')
      .insert({
        rendering_project_id: renderingProjectId,
        display_title: project.title,
        alt_text: project.title,
        sort_order: copiedCount + 10, // Start after existing ones
        active: true
      });
    
    if (galleryError && galleryError.code !== '23505') {
      console.error(`  Error adding to gallery:`, galleryError.message);
    } else if (galleryError?.code === '23505') {
      console.log(`  Already in rendering_gallery`);
    } else {
      console.log(`  ✓ Added to rendering_gallery`);
    }
    
    copiedCount++;
  }
  
  console.log(`\n✓ Processed ${copiedCount} scenic design projects with renderings`);
  console.log('\nNow you can remove the ones you don\'t want from the admin!');
}

copyScenicRenderingsToGallery();
