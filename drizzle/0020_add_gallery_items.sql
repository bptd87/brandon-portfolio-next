-- Create gallery_items table
CREATE TABLE gallery_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  gallery_type ENUM('rendering', 'model', 'experiential') NOT NULL DEFAULT 'rendering',
  cover_image_url TEXT,
  cover_image_key TEXT,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX status_idx (status),
  INDEX featured_idx (featured),
  INDEX gallery_type_idx (gallery_type),
  INDEX sort_order_idx (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create gallery_images table (similar to projectImages)
CREATE TABLE gallery_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gallery_item_id INT NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
  image_url TEXT,
  image_key TEXT,
  video_url TEXT,
  caption TEXT,
  alt_text TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX gallery_item_idx (gallery_item_id),
  INDEX sort_order_idx (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
