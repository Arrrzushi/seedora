/*
  # Fix GitHub repo column issue and refresh schema cache

  1. Ensure all required columns exist in ip_registrations table
  2. Refresh schema cache by recreating the table structure
  3. Add proper constraints and defaults
  4. Update RLS policies

  This migration addresses the "Could not find the 'github_repo' column" error
  by ensuring the column exists and the schema cache is properly updated.
*/

-- First, let's check if the table exists and create it if it doesn't
DO $$
BEGIN
  -- Create the table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ip_registrations') THEN
    CREATE TABLE ip_registrations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text,
      founder_name text NOT NULL,
      company_name text,
      category text NOT NULL,
      wallet_address text,
      ipfs_hash text NOT NULL,
      ipfs_url text NOT NULL,
      document_hash text,
      project_type text,
      business_model text,
      project_summary text,
      developers text,
      demo_link text,
      presentation_video text,
      github_repo text,
      status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Now ensure all columns exist with proper types
DO $$
DECLARE
  column_exists boolean;
BEGIN
  -- Check and add project_type column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'ip_registrations' AND column_name = 'project_type'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE ip_registrations ADD COLUMN project_type text;
  END IF;

  -- Check and add business_model column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'ip_registrations' AND column_name = 'business_model'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE ip_registrations ADD COLUMN business_model text;
  END IF;

  -- Check and add project_summary column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'ip_registrations' AND column_name = 'project_summary'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE ip_registrations ADD COLUMN project_summary text;
  END IF;

  -- Check and add developers column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'ip_registrations' AND column_name = 'developers'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE ip_registrations ADD COLUMN developers text;
  END IF;

  -- Check and add demo_link column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'ip_registrations' AND column_name = 'demo_link'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE ip_registrations ADD COLUMN demo_link text;
  END IF;

  -- Check and add presentation_video column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'ip_registrations' AND column_name = 'presentation_video'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE ip_registrations ADD COLUMN presentation_video text;
  END IF;

  -- Check and add github_repo column (this is the problematic one)
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'ip_registrations' AND column_name = 'github_repo'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE ip_registrations ADD COLUMN github_repo text;
  END IF;

  -- Check and add status column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'ip_registrations' AND column_name = 'status'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE ip_registrations ADD COLUMN status text DEFAULT 'pending';
  END IF;

  -- Check and add updated_at column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'ip_registrations' AND column_name = 'updated_at'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE ip_registrations ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add constraints if they don't exist
DO $$
BEGIN
  -- Add status check constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'ip_registrations_status_check'
  ) THEN
    ALTER TABLE ip_registrations 
    ADD CONSTRAINT ip_registrations_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    -- Constraint already exists, ignore
    NULL;
END $$;

-- Ensure RLS is enabled
ALTER TABLE ip_registrations ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they work with all columns
DROP POLICY IF EXISTS "Users can view their own IP registrations" ON ip_registrations;
DROP POLICY IF EXISTS "Users can insert their own IP registrations" ON ip_registrations;
DROP POLICY IF EXISTS "Users can update their own IP registrations" ON ip_registrations;
DROP POLICY IF EXISTS "Public can view approved IP registrations" ON ip_registrations;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view their own IP registrations"
  ON ip_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own IP registrations"
  ON ip_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own IP registrations"
  ON ip_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow public viewing of approved registrations (for marketplace)
CREATE POLICY "Public can view approved IP registrations"
  ON ip_registrations
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ip_registrations_user_id ON ip_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_ip_registrations_status ON ip_registrations(status);
CREATE INDEX IF NOT EXISTS idx_ip_registrations_category ON ip_registrations(category);
CREATE INDEX IF NOT EXISTS idx_ip_registrations_created_at ON ip_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ip_registrations_github_repo ON ip_registrations(github_repo) WHERE github_repo IS NOT NULL;

-- Create or replace function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_ip_registrations_updated_at ON ip_registrations;
CREATE TRIGGER update_ip_registrations_updated_at
  BEFORE UPDATE ON ip_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Force schema cache refresh by updating table comment
COMMENT ON TABLE ip_registrations IS 'Stores intellectual property registrations for projects - Updated with all required columns including github_repo';

-- Add detailed column comments
COMMENT ON COLUMN ip_registrations.user_id IS 'Reference to the user who registered the IP';
COMMENT ON COLUMN ip_registrations.title IS 'Title of the project';
COMMENT ON COLUMN ip_registrations.description IS 'Detailed description of the project';
COMMENT ON COLUMN ip_registrations.founder_name IS 'Name of the project founder';
COMMENT ON COLUMN ip_registrations.company_name IS 'Company or startup name (optional)';
COMMENT ON COLUMN ip_registrations.category IS 'Project category (e.g., AI/ML, Blockchain, etc.)';
COMMENT ON COLUMN ip_registrations.wallet_address IS 'Blockchain wallet address for IP registration';
COMMENT ON COLUMN ip_registrations.ipfs_hash IS 'IPFS hash of the project metadata';
COMMENT ON COLUMN ip_registrations.ipfs_url IS 'Full IPFS URL for accessing the metadata';
COMMENT ON COLUMN ip_registrations.document_hash IS 'IPFS hash of supporting documents (optional)';
COMMENT ON COLUMN ip_registrations.project_type IS 'Type of project (e.g., Web App, Mobile App, etc.)';
COMMENT ON COLUMN ip_registrations.business_model IS 'Business model of the project';
COMMENT ON COLUMN ip_registrations.project_summary IS 'Brief summary/elevator pitch';
COMMENT ON COLUMN ip_registrations.developers IS 'Team members and their roles';
COMMENT ON COLUMN ip_registrations.demo_link IS 'Link to working demo (optional)';
COMMENT ON COLUMN ip_registrations.presentation_video IS 'Link to presentation video (optional)';
COMMENT ON COLUMN ip_registrations.github_repo IS 'GitHub repository link (optional) - format: username/repository';
COMMENT ON COLUMN ip_registrations.status IS 'Registration status (pending, approved, rejected)';
COMMENT ON COLUMN ip_registrations.created_at IS 'Timestamp when the registration was created';
COMMENT ON COLUMN ip_registrations.updated_at IS 'Timestamp when the registration was last updated';

-- Verify all columns exist by selecting from the table structure
DO $$
DECLARE
  column_count integer;
BEGIN
  SELECT COUNT(*) INTO column_count
  FROM information_schema.columns 
  WHERE table_name = 'ip_registrations' 
  AND column_name IN (
    'id', 'user_id', 'title', 'description', 'founder_name', 'company_name', 
    'category', 'wallet_address', 'ipfs_hash', 'ipfs_url', 'document_hash',
    'project_type', 'business_model', 'project_summary', 'developers',
    'demo_link', 'presentation_video', 'github_repo', 'status', 
    'created_at', 'updated_at'
  );
  
  IF column_count < 21 THEN
    RAISE EXCEPTION 'Missing columns in ip_registrations table. Expected 21, found %', column_count;
  END IF;
  
  RAISE NOTICE 'All % columns verified in ip_registrations table', column_count;
END $$;

-- Add image columns to ip_registrations table
ALTER TABLE ip_registrations 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated'
);

-- Allow public access to view project images
CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- Update marketplace_items trigger to include image
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
      thumbnail_url,
      image_url
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
      END,
      NEW.category,
      NEW.founder_name,
      NEW.company_name,
      NEW.demo_link,
      NEW.presentation_video,
      NEW.ipfs_url,
      COALESCE(NEW.thumbnail_url, 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'),
      COALESCE(NEW.image_url, 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')
    ) ON CONFLICT (ip_registration_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;