import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function migrate() {
  console.log('🔄 Migrating rendering and experiential projects to new tables...\n');

  try {
    // 1. Migrate RENDERING projects
    console.log('=== RENDERING PROJECTS ===');
    const { data: renderingProjects, error: renderingError } = await supabase
      .from('projects')
      .select('*')
      .eq('discipline', 'rendering');

    if (renderingError) throw renderingError;
    console.log(`Found ${renderingProjects.length} rendering projects\n`);

    for (const project of renderingProjects) {
      console.log(`  Migrating: "${project.title}" (${project.year})`);
      
      // Insert into rendering_projects
      const { data: newProject, error: insertError } = await supabase
        .from('rendering_projects')
        .insert({
          title: project.title,
          slug: project.slug,
          excerpt: project.excerpt,
          design_notes: project.design_notes,
          cover_image_url: project.cover_image_url,
          cover_image_key: project.cover_image_key,
          location: project.location,
          client: project.client,
          year: project.year,
          month: project.month,
          status: project.status || 'published',
          featured: project.featured || false,
          metadata: project.metadata,
          seo_title: project.seo_title,
          seo_description: project.seo_description,
          seo_keywords: project.seo_keywords,
          published_at: project.published_at,
        })
        .select()
        .single();

      if (insertError) {
        console.log(`    ❌ Error: ${insertError.message}`);
        continue;
      }

      console.log(`    ✅ Created rendering_project ID ${newProject.id}`);

      // Copy images
      const { data: images } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', project.id);

      if (images && images.length > 0) {
        console.log(`    📷 Migrating ${images.length} images...`);
        
        for (const img of images) {
          await supabase
            .from('rendering_project_images')
            .insert({
              rendering_project_id: newProject.id,
              title: img.title,
              image_url: img.image_url,
              image_key: img.image_key,
              video_url: img.video_url,
              image_type: img.image_type || 'production',
              caption: img.caption,
              alt_text: img.alt_text,
              sort_order: img.sort_order || 0,
            });
        }
        console.log(`    ✅ Copied ${images.length} images`);
      }

      // Add to gallery
      const { error: galleryError } = await supabase
        .from('rendering_gallery')
        .insert({
          rendering_project_id: newProject.id,
          display_title: project.title,
          alt_text: project.title,
          description: project.excerpt,
          sort_order: 0,
        });

      if (galleryError) {
        console.log(`    ⚠️  Gallery: ${galleryError.message}`);
      } else {
        console.log(`    ✅ Added to rendering_gallery`);
      }
    }

    // 2. Migrate EXPERIENTIAL projects
    console.log('\n=== EXPERIENTIAL PROJECTS ===');
    const { data: experientialProjects, error: expError } = await supabase
      .from('projects')
      .select('*')
      .eq('discipline', 'experiential');

    if (expError) throw expError;
    console.log(`Found ${experientialProjects.length} experiential projects\n`);

    for (const project of experientialProjects) {
      console.log(`  Migrating: "${project.title}" (${project.year})`);
      
      // Insert into experiential_projects
      const { data: newProject, error: insertError } = await supabase
        .from('experiential_projects')
        .insert({
          title: project.title,
          slug: project.slug,
          excerpt: project.excerpt,
          design_notes: project.design_notes,
          cover_image_url: project.cover_image_url,
          cover_image_key: project.cover_image_key,
          location: project.location,
          client: project.client,
          year: project.year,
          month: project.month,
          gallery_type: 'rendering', // default
          status: project.status || 'published',
          featured: project.featured || false,
          metadata: project.metadata,
          seo_title: project.seo_title,
          seo_description: project.seo_description,
          seo_keywords: project.seo_keywords,
          published_at: project.published_at,
        })
        .select()
        .single();

      if (insertError) {
        console.log(`    ❌ Error: ${insertError.message}`);
        continue;
      }

      console.log(`    ✅ Created experiential_project ID ${newProject.id}`);

      // Copy images
      const { data: images } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', project.id);

      if (images && images.length > 0) {
        console.log(`    📷 Migrating ${images.length} images...`);
        
        for (const img of images) {
          await supabase
            .from('experiential_project_images')
            .insert({
              experiential_project_id: newProject.id,
              title: img.title,
              image_url: img.image_url,
              image_key: img.image_key,
              video_url: img.video_url,
              image_type: img.image_type || 'production',
              caption: img.caption,
              alt_text: img.alt_text,
              sort_order: img.sort_order || 0,
            });
        }
        console.log(`    ✅ Copied ${images.length} images`);
      }

      // Add to gallery
      const { error: galleryError } = await supabase
        .from('experiential_gallery')
        .insert({
          experiential_project_id: newProject.id,
          gallery_type: 'rendering',
          display_title: project.title,
          alt_text: project.title,
          description: project.excerpt,
          sort_order: 0,
        });

      if (galleryError) {
        console.log(`    ⚠️  Gallery: ${galleryError.message}`);
      } else {
        console.log(`    ✅ Added to experiential_gallery`);
      }
    }

    console.log('\n✅ Migration complete!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrate();
