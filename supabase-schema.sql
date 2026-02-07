-- Create reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  qr_type TEXT NOT NULL,
  qr_data TEXT NOT NULL,
  category TEXT NOT NULL,
  details TEXT,
  location TEXT,
  security_status TEXT,
  security_checks JSONB
);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON reports
  FOR SELECT USING (true);

-- Create policy to allow public insert
CREATE POLICY "Allow public insert" ON reports
  FOR INSERT WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_security_status ON reports(security_status);
