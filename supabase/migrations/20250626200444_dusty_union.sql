/*
  # Create marketplace and likes system for IP projects

  1. New Tables
    - `marketplace_items` - Public marketplace listings for IP projects
    - `project_likes` - User likes for projects
    - `project_purchases` - Purchase history

  2. Security
    - Enable RLS on all tables
    - Add policies for public viewing and authenticated interactions

  3. Features
    - Public marketplace for all approved IP projects
    - Like system with user tracking
    - Purchase tracking and history
    - Leaderboard functionality
*/

-- Create marketplace_items table
CREATE TABLE IF NOT EXISTS marketplace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_registration_id uuid NOT NULL REFERENCES ip_registrations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL,
  founder_name text NOT NULL,
  company_name text,
  demo_link text,
  presentation_video text,
  ipfs_url text NOT NULL,
  thumbnail_url text,
  likes_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  purchase_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_likes table
CREATE TABLE IF NOT EXISTS project_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marketplace_item_id uuid NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, marketplace_item_id)
);

-- Create project_purchases table
CREATE TABLE IF NOT EXISTS project_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marketplace_item_id uuid NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
  purchase_price decimal(10,2) NOT NULL,
  transaction_hash text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_purchases ENABLE ROW LEVEL SECURITY;

-- Marketplace items policies (public read, owner write)
CREATE POLICY "Anyone can view active marketplace items"
  ON marketplace_items
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "IP owners can manage their marketplace items"
  ON marketplace_items
  FOR ALL
  TO authenticated
  USING (
    ip_registration_id IN (
      SELECT id FROM ip_registrations WHERE user_id = auth.uid()
    )
  );

-- Project likes policies
CREATE POLICY "Anyone can view likes"
  ON project_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage their likes"
  ON project_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Purchase policies
CREATE POLICY "Users can view their own purchases"
  ON project_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create purchases"
  ON project_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_likes ON marketplace_items(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_created ON marketplace_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_featured ON marketplace_items(is_featured, likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_project_likes_item ON project_likes(marketplace_item_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_user ON project_likes(user_id);

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE marketplace_items 
    SET likes_count = likes_count + 1,
        updated_at = now()
    WHERE id = NEW.marketplace_item_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE marketplace_items 
    SET likes_count = likes_count - 1,
        updated_at = now()
    WHERE id = OLD.marketplace_item_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for likes count
DROP TRIGGER IF EXISTS trigger_update_likes_count ON project_likes;
CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON project_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_likes_count();

-- Function to auto-create marketplace items from approved IP registrations
CREATE OR REPLACE FUNCTION create_marketplace_item_from_ip()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create marketplace item if IP is approved and not already in marketplace
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    INSERT INTO marketplace_items (
      ip_registration_id,
      title,
      description,
      price,
      category,
      founder_name,
      company_name,
      demo_link,
      presentation_video,
      ipfs_url,
      thumbnail_url
    ) VALUES (
      NEW.id,
      NEW.title,
      NEW.description,
      CASE 
        WHEN NEW.category = 'AI/ML' THEN 50000
        WHEN NEW.category = 'Blockchain' THEN 75000
        WHEN NEW.category = 'Fintech' THEN 60000
        WHEN NEW.category = 'Healthtech' THEN 80000
        ELSE 40000
      END, -- Dynamic pricing based on category
      NEW.category,
      NEW.founder_name,
      NEW.company_name,
      NEW.demo_link,
      NEW.presentation_video,
      NEW.ipfs_url,
      COALESCE(
        'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
        'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2'
      )
    ) ON CONFLICT (ip_registration_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto marketplace creation
DROP TRIGGER IF EXISTS trigger_create_marketplace_item ON ip_registrations;
CREATE TRIGGER trigger_create_marketplace_item
  AFTER UPDATE ON ip_registrations
  FOR EACH ROW
  EXECUTE FUNCTION create_marketplace_item_from_ip();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(item_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE marketplace_items 
  SET views_count = views_count + 1,
      updated_at = now()
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

-- Add some sample data for existing IP registrations
DO $$
DECLARE
  ip_record RECORD;
BEGIN
  FOR ip_record IN 
    SELECT * FROM ip_registrations 
    WHERE status = 'approved' 
    AND id NOT IN (SELECT ip_registration_id FROM marketplace_items WHERE ip_registration_id IS NOT NULL)
  LOOP
    INSERT INTO marketplace_items (
      ip_registration_id,
      title,
      description,
      price,
      category,
      founder_name,
      company_name,
      demo_link,
      presentation_video,
      ipfs_url,
      thumbnail_url
    ) VALUES (
      ip_record.id,
      ip_record.title,
      ip_record.description,
      CASE 
        WHEN ip_record.category = 'AI/ML' THEN 50000
        WHEN ip_record.category = 'Blockchain' THEN 75000
        WHEN ip_record.category = 'Fintech' THEN 60000
        WHEN ip_record.category = 'Healthtech' THEN 80000
        ELSE 40000
      END,
      ip_record.category,
      ip_record.founder_name,
      ip_record.company_name,
      ip_record.demo_link,
      ip_record.presentation_video,
      ip_record.ipfs_url,
      CASE 
        WHEN ip_record.category = 'AI/ML' THEN 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2'
        WHEN ip_record.category = 'Blockchain' THEN 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2'
        WHEN ip_record.category = 'Fintech' THEN 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2'
        WHEN ip_record.category = 'Healthtech' THEN 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2'
        ELSE 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2'
      END
    );
  END LOOP;
END $$;