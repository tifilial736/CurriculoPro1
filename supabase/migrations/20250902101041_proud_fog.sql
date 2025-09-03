/*
  # Create curriculos table

  1. New Tables
    - `curriculos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `titulo` (text, resume title)
      - `dados` (jsonb, resume data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `curriculos` table
    - Add policy for users to manage their own resumes
*/

CREATE TABLE IF NOT EXISTS curriculos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo text NOT NULL,
  dados jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE curriculos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own curriculos"
  ON curriculos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own curriculos"
  ON curriculos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own curriculos"
  ON curriculos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own curriculos"
  ON curriculos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS curriculos_user_id_idx ON curriculos(user_id);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_curriculos_updated_at
  BEFORE UPDATE ON curriculos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();