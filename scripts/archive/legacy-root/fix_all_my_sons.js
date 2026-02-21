import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function fixAndMigrate() {
  try {
    // Get the failed project
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', 1) // "All My Sons" rendering
      .single();

    console.log(`Fixing and migrating: "${project.title}"`);
    console.log(`  Original status: "${project.status}"`);

    // Insert with corrected status
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
        status: 'published', // Fix: was 'gallery_only'
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
      console.log(`  ❌ Error: ${insertError.message}`);
      process.exit(1);
    }

    console.log(`  ✅ Created rendering_project ID ${newProject.id}`);

    // Copy images
    const { data: images } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', project.id);

    if (images && images.length > 0) {
      console.log(`  📷 Migrating ${images.length} images...`);
      
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
      console.log(`  ✅ Copied ${images.length} images`);
    }

    // Add to gallery
    await supabase
      .from('rendering_gallery')
      .insert({
        rendering_project_id: newProject.id,
        display_title: project.title,
        alt_text: project.title,
        description: project.excerpt,
        sort_order: 0,
      });

    console.log(`  ✅ Added to rendering_gallery`);
    console.log('\n✅ All rendering projects migrated!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  process.exit(0);
}

fixAndMigrate();
