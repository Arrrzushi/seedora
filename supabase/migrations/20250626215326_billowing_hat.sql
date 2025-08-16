/*
  # Fix IP registrations table structure

  1. Ensure all required columns exist with proper types
  2. Add missing columns that might be causing insertion failures
  3. Update constraints and defaults
  4. Fix any data type mismatches

  This migration ensures the ip_registrations table has all the columns
  that the application expects to insert data into.
*/

-- First, let's ensure the ip_registrations table exists with all required columns
CREATE TABLE IF NOT EXISTS ip_registrations (
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

-- Add any missing columns that might exist in the application but not in the database
DO $$
BEGIN
  -- Add project_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ip_registrations' AND column_name = 'project_type'
  ) THEN
    ALTER TABLE ip_registrations ADD COLUMN project_type text;
  END IF;

  -- Add business_model column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ip_registrations' AND column_name = 'business_model'
  ) THEN
    ALTER TABLE ip_registrations ADD COLUMN business_model text;
  END IF;

  -- Add project_summary column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ip_registrations' AND column_name = 'project_summary'
  ) THEN
    ALTER TABLE ip_registrations ADD COLUMN project_summary text;
  END IF;

  -- Add developers column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ip_registrations' AND column_name = 'developers'
  ) THEN
    ALTER TABLE ip_registrations ADD COLUMN developers text;
  END IF;

  -- Add demo_link column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ip_registrations' AND column_name = 'demo_link'
  ) THEN
    ALTER TABLE ip_registrations ADD COLUMN demo_link text;
  END IF;

  -- Add presentation_video column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ip_registrations' AND column_name = 'presentation_video'
  ) THEN
    ALTER TABLE ip_registrations ADD COLUMN presentation_video text;
  END IF;

  -- Add github_repo column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ip_registrations' AND column_name = 'github_repo'
  ) THEN
    ALTER TABLE ip_registrations ADD COLUMN github_repo text;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ip_registrations' AND column_name = 'status'
  ) THEN
    ALTER TABLE ip_registrations ADD COLUMN status text DEFAULT 'pending';
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ip_registrations' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE ip_registrations ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE ip_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own IP registrations" ON ip_registrations;
DROP POLICY IF EXISTS "Users can insert their own IP registrations" ON ip_registrations;
DROP POLICY IF EXISTS "Users can update their own IP registrations" ON ip_registrations;

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ip_registrations_user_id ON ip_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_ip_registrations_status ON ip_registrations(status);
CREATE INDEX IF NOT EXISTS idx_ip_registrations_category ON ip_registrations(category);
CREATE INDEX IF NOT EXISTS idx_ip_registrations_created_at ON ip_registrations(created_at DESC);

-- Create function to automatically update updated_at timestamp
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

-- Add comments for documentation
COMMENT ON TABLE ip_registrations IS 'Stores intellectual property registrations for projects';
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
COMMENT ON COLUMN ip_registrations.github_repo IS 'GitHub repository link (optional)';
COMMENT ON COLUMN ip_registrations.status IS 'Registration status (pending, approved, rejected)';