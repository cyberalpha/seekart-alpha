-- Enable leaked password protection for better security
-- This prevents users from using compromised passwords

-- Note: This cannot be done via SQL migration as it requires Auth configuration
-- The user will need to enable this in the Supabase dashboard under Authentication > Settings
-- For now, we'll add a comment to remind about this

-- Placeholder comment for enabling leaked password protection
-- User must enable this in Supabase dashboard: Authentication > Settings > Password Strength
-- Enable "Password breach protection" to prevent users from using compromised passwords