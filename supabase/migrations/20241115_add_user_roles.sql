
-- Add to founders table for role tracking
ALTER TABLE founders ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'founder';
-- Values: 'founder' or 'investor'

-- Update trigger to set role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.founders (id, email, name, user_role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'founder'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
