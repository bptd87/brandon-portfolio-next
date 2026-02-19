import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function check() {
  // Find All My Sons project
  const { data: projects, error: projError } = await supabase
    .from('projects')
    .select('*')
    .eq('title', 'All My Sons')
    .single();
    
  console.log('All My Sons Project:', projects);
  if (projError) console.log('Project Error:', projError);
  
  if (projects?.id) {
    // Check project_images for this project
    const { data: images, error: imgError } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projects.id);
      
    console.log('Project Images:', images);
    if (imgError) console.log('Images Error:', imgError);
  }
  
  // Check experiential_gallery for this project
  const { data: gallery, error: galError } = await supabase
    .from('experiential_gallery')
    .select('*')
    .eq('project_id', projects?.id);
    
  console.log('Experiential Gallery Entry:', gallery);
  if (galError) console.log('Gallery Error:', galError);
}

check();
