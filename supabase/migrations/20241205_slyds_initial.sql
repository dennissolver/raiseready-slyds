-- ============================================
-- SLYDS PITCH PORTAL - DATABASE SCHEMA
-- Clean schema for single-investor platform
-- Created: December 2024
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- USER ROLES (NEW - for slyds_admin)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('founder', 'slyds_admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================
-- SUPERADMINS (Platform admins - you)
-- ============================================
CREATE TABLE public.superadmins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  permissions JSONB DEFAULT '{
    "view_all_users": true,
    "edit_users": true,
    "delete_users": true,
    "view_analytics": true,
    "manage_features": true,
    "manage_settings": true,
    "impersonate_users": true
  }'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- FOUNDERS (Pitch submitters)
-- ============================================
CREATE TABLE public.founders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  company_name TEXT,
  tagline TEXT,
  country TEXT,

  -- Founder profile
  founder_type TEXT, -- 'first-time', 'serial', 'technical', etc.
  funding_stage TEXT, -- 'pre-seed', 'seed', 'series-a', etc.
  target_market TEXT,
  team_size INTEGER,

  -- Startup details
  problem_statement TEXT,
  solution_statement TEXT,
  traction_details TEXT,
  team_background TEXT,

  -- Funding info
  funding_ask_amount TEXT,
  funding_ask_stage TEXT,
  use_of_funds TEXT,

  -- Status flags
  has_revenue BOOLEAN DEFAULT false,
  has_customers BOOLEAN DEFAULT false,
  has_prototype BOOLEAN DEFAULT false,
  has_domain_expertise BOOLEAN DEFAULT false,
  has_startup_experience BOOLEAN DEFAULT false,

  -- Timestamps
  profile_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PITCH DECKS
-- ============================================
CREATE TABLE public.pitch_decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  founder_id UUID REFERENCES public.founders(id) ON DELETE CASCADE,

  -- File info
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  raw_text TEXT, -- Extracted text for AI

  -- Metadata
  one_liner TEXT,
  sectors TEXT[],
  funding_stage TEXT,
  funding_goal BIGINT,
  target_market TEXT,

  -- Scoring
  readiness_score INTEGER,
  status TEXT DEFAULT 'uploaded', -- 'uploaded', 'analyzing', 'analyzed', 'reviewed'

  -- Versioning
  version INTEGER DEFAULT 1,
  is_latest BOOLEAN DEFAULT true,
  previous_version_id UUID REFERENCES public.pitch_decks(id),
  parent_deck_id UUID REFERENCES public.pitch_decks(id),
  version_notes TEXT,
  improvement_notes TEXT,

  -- Visibility (simplified for Slyds)
  visibility TEXT DEFAULT 'slyds-only', -- 'slyds-only', 'private'

  -- Timestamps
  analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DECK ANALYSIS (AI analysis results)
-- ============================================
CREATE TABLE public.deck_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES public.pitch_decks(id) ON DELETE CASCADE,
  analysis_type TEXT, -- 'initial', 'deep', 'comparison'
  scores JSONB, -- {story: 80, problem: 75, solution: 85, ...}
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT[],
  improvement_suggestions JSONB,
  progress_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- COACHING SESSIONS (AI text coaching)
-- ============================================
CREATE TABLE public.coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  founder_id UUID REFERENCES public.founders(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES public.pitch_decks(id) ON DELETE SET NULL,

  -- Session config
  session_type TEXT DEFAULT 'materials_improvement', -- 'discovery', 'materials_improvement', 'pitch_practice'
  coach_type TEXT DEFAULT 'sharene', -- Slyds AI coach
  current_mode TEXT DEFAULT 'discovery',

  -- Conversation
  conversation JSONB DEFAULT '[]'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  message_count INTEGER DEFAULT 0,

  -- Progress
  phase_completed JSONB DEFAULT '{
    "discovery": false,
    "materials": false,
    "verbal": false,
    "assessment": false
  }'::jsonb,
  focus_areas TEXT[],
  feedback_summary TEXT,

  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused'
  last_activity TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- VOICE COACHING SESSIONS
-- ============================================
CREATE TABLE public.voice_coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pitch_deck_id UUID REFERENCES public.pitch_decks(id) ON DELETE SET NULL,

  -- Session config
  session_type TEXT NOT NULL, -- 'practice', 'simulation', 'feedback'
  coaching_mode TEXT NOT NULL, -- 'supportive', 'challenging', 'technical'
  investor_persona TEXT, -- 'supportive_vc', 'skeptical_angel', 'technical_investor'

  -- Content
  transcript JSONB DEFAULT '[]'::jsonb,
  audio_url TEXT,
  video_url TEXT,

  -- Results
  feedback JSONB,
  metrics JSONB, -- {pace: 120, fillerWords: 5, clarity: 85}
  duration_seconds INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- VOICE SESSIONS (Real-time voice state)
-- ============================================
CREATE TABLE public.voice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.pitch_decks(id) ON DELETE SET NULL,

  -- Session config
  coaching_mode TEXT NOT NULL,
  investor_persona TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'ended'

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- VOICE MESSAGES (Chat history)
-- ============================================
CREATE TABLE public.voice_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.voice_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  audio_url TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- VOICE FEEDBACK (AI feedback on pitch)
-- ============================================
CREATE TABLE public.voice_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.voice_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.pitch_decks(id) ON DELETE SET NULL,

  -- Scores (Slyds storytelling criteria)
  overall_score INTEGER,
  story_clarity_score INTEGER,
  story_clarity_feedback TEXT,
  emotional_connection_score INTEGER,
  emotional_connection_feedback TEXT,
  problem_articulation_score INTEGER,
  problem_articulation_feedback TEXT,
  delivery_quality_score INTEGER,
  delivery_quality_feedback TEXT,

  -- Feedback arrays
  strengths TEXT[],
  improvements TEXT[],
  recommendations TEXT[],

  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- AI FEEDBACK (General AI feedback storage)
-- ============================================
CREATE TABLE public.ai_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID,
  deck_id UUID REFERENCES public.pitch_decks(id) ON DELETE CASCADE,
  slide_number INTEGER,
  feedback_type TEXT, -- 'improvement', 'praise', 'question'
  original_content TEXT,
  suggestion TEXT,
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SLYDS PROFILE (Single investor - Slyds team)
-- ============================================
CREATE TABLE public.investor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,

  -- Organization
  firm TEXT DEFAULT 'SlydS',
  organization_name TEXT DEFAULT 'SlydS Advisory',
  investor_type TEXT DEFAULT 'advisory', -- 'advisory', 'vc', 'angel'
  website_url TEXT DEFAULT 'https://slyds.com',
  linkedin_url TEXT,

  -- Investment criteria
  focus_areas TEXT[],
  sectors TEXT[],
  stages TEXT[], -- 'pre-seed', 'seed', 'series-a'
  geographies TEXT[] DEFAULT ARRAY['India', 'Southeast Asia'],
  min_ticket_size BIGINT,
  max_ticket_size BIGINT,

  -- Thesis
  investment_philosophy TEXT,
  ideal_founder_profile TEXT,
  deal_breakers TEXT,

  -- Preferences (from AI discovery)
  preferences JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SLYDS DISCOVERY SESSIONS (Thesis refinement)
-- ============================================
CREATE TABLE public.investor_discovery_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES public.investor_profiles(id) ON DELETE CASCADE,
  conversation JSONB DEFAULT '[]'::jsonb,
  extracted_criteria JSONB, -- AI-extracted investment criteria
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- SLYDS SHORTLIST (Founders Slyds is tracking)
-- ============================================
CREATE TABLE public.investor_watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  founder_id UUID NOT NULL REFERENCES public.founders(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  tags TEXT[], -- 'high-priority', 'follow-up', 'meeting-scheduled'
  last_viewed_at TIMESTAMPTZ,
  UNIQUE(investor_id, founder_id)
);

-- ============================================
-- KNOWLEDGE BASE (AI coaching knowledge)
-- ============================================
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL, -- 'storytelling', 'pitch-structure', 'fundraising', 'indian-market'
  tags TEXT[],
  founder_types TEXT[], -- Which founder types this applies to
  source_url TEXT,
  source_type TEXT, -- 'article', 'video', 'book', 'internal'
  author TEXT,
  published_date DATE,
  embedding vector(1536), -- For semantic search
  relevance_score NUMERIC DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- NOTIFICATION PREFERENCES
-- ============================================
CREATE TABLE public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,

  -- Alert types
  alert_score_change BOOLEAN DEFAULT true,
  alert_new_match BOOLEAN DEFAULT true,
  alert_profile_view BOOLEAN DEFAULT false,
  alert_status_change BOOLEAN DEFAULT true,

  -- Digest settings
  digest_frequency TEXT DEFAULT 'realtime', -- 'realtime', 'daily', 'weekly'
  digest_time TIME DEFAULT '09:00:00',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

-- User roles
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- Founders
CREATE INDEX idx_founders_email ON public.founders(email);
CREATE INDEX idx_founders_funding_stage ON public.founders(funding_stage);
CREATE INDEX idx_founders_created_at ON public.founders(created_at DESC);

-- Pitch decks
CREATE INDEX idx_pitch_decks_founder_id ON public.pitch_decks(founder_id);
CREATE INDEX idx_pitch_decks_status ON public.pitch_decks(status);
CREATE INDEX idx_pitch_decks_is_latest ON public.pitch_decks(is_latest) WHERE is_latest = true;
CREATE INDEX idx_pitch_decks_created_at ON public.pitch_decks(created_at DESC);

-- Coaching sessions
CREATE INDEX idx_coaching_sessions_founder_id ON public.coaching_sessions(founder_id);
CREATE INDEX idx_coaching_sessions_deck_id ON public.coaching_sessions(deck_id);
CREATE INDEX idx_coaching_sessions_status ON public.coaching_sessions(status);

-- Voice sessions
CREATE INDEX idx_voice_sessions_user_id ON public.voice_sessions(user_id);
CREATE INDEX idx_voice_sessions_status ON public.voice_sessions(status);
CREATE INDEX idx_voice_coaching_user_id ON public.voice_coaching_sessions(user_id);

-- Watchlist
CREATE INDEX idx_investor_watchlist_investor ON public.investor_watchlist(investor_id);
CREATE INDEX idx_investor_watchlist_founder ON public.investor_watchlist(founder_id);

-- Knowledge base
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_base_embedding ON public.knowledge_base USING ivfflat (embedding vector_cosine_ops);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.superadmins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deck_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_discovery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Helper function to check if user is slyds_admin
CREATE OR REPLACE FUNCTION public.is_slyds_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'slyds_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.superadmins
    WHERE id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USER ROLES POLICIES
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Superadmins can manage all roles" ON public.user_roles
  FOR ALL USING (is_superadmin());

-- SUPERADMINS POLICIES
CREATE POLICY "Superadmins can view themselves" ON public.superadmins
  FOR SELECT USING (id = auth.uid());

-- FOUNDERS POLICIES
CREATE POLICY "Founders can view own profile" ON public.founders
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Founders can update own profile" ON public.founders
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Founders can insert own profile" ON public.founders
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Slyds admins can view all founders" ON public.founders
  FOR SELECT USING (is_slyds_admin() OR is_superadmin());

-- PITCH DECKS POLICIES
CREATE POLICY "Founders can manage own decks" ON public.pitch_decks
  FOR ALL USING (founder_id = auth.uid());

CREATE POLICY "Slyds admins can view all decks" ON public.pitch_decks
  FOR SELECT USING (is_slyds_admin() OR is_superadmin());

-- DECK ANALYSIS POLICIES
CREATE POLICY "Founders can view own analysis" ON public.deck_analysis
  FOR SELECT USING (
    deck_id IN (SELECT id FROM public.pitch_decks WHERE founder_id = auth.uid())
  );

CREATE POLICY "System can insert analysis" ON public.deck_analysis
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Slyds admins can view all analysis" ON public.deck_analysis
  FOR SELECT USING (is_slyds_admin() OR is_superadmin());

-- COACHING SESSIONS POLICIES
CREATE POLICY "Founders can manage own sessions" ON public.coaching_sessions
  FOR ALL USING (founder_id = auth.uid());

CREATE POLICY "Slyds admins can view all sessions" ON public.coaching_sessions
  FOR SELECT USING (is_slyds_admin() OR is_superadmin());

-- VOICE SESSION POLICIES
CREATE POLICY "Users can manage own voice sessions" ON public.voice_sessions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own voice coaching" ON public.voice_coaching_sessions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own voice messages" ON public.voice_messages
  FOR ALL USING (
    session_id IN (SELECT id FROM public.voice_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own voice feedback" ON public.voice_feedback
  FOR ALL USING (user_id = auth.uid());

-- AI FEEDBACK POLICIES
CREATE POLICY "Founders can view own AI feedback" ON public.ai_feedback
  FOR SELECT USING (
    deck_id IN (SELECT id FROM public.pitch_decks WHERE founder_id = auth.uid())
  );

CREATE POLICY "System can insert AI feedback" ON public.ai_feedback
  FOR INSERT WITH CHECK (true);

-- INVESTOR PROFILES POLICIES (Slyds thesis)
CREATE POLICY "Slyds admins can manage investor profiles" ON public.investor_profiles
  FOR ALL USING (is_slyds_admin() OR is_superadmin());

CREATE POLICY "Anyone can view Slyds profile" ON public.investor_profiles
  FOR SELECT USING (true);

-- INVESTOR DISCOVERY POLICIES
CREATE POLICY "Slyds admins can manage discovery" ON public.investor_discovery_sessions
  FOR ALL USING (is_slyds_admin() OR is_superadmin());

-- WATCHLIST POLICIES (Slyds shortlist)
CREATE POLICY "Slyds admins can manage watchlist" ON public.investor_watchlist
  FOR ALL USING (is_slyds_admin() OR is_superadmin());

-- KNOWLEDGE BASE POLICIES
CREATE POLICY "Everyone can read knowledge base" ON public.knowledge_base
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage knowledge base" ON public.knowledge_base
  FOR ALL USING (is_slyds_admin() OR is_superadmin());

-- NOTIFICATION PREFERENCES POLICIES
CREATE POLICY "Users can manage own preferences" ON public.notification_preferences
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_founders_updated_at
  BEFORE UPDATE ON public.founders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_pitch_decks_updated_at
  BEFORE UPDATE ON public.pitch_decks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_coaching_sessions_updated_at
  BEFORE UPDATE ON public.coaching_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_investor_profiles_updated_at
  BEFORE UPDATE ON public.investor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_voice_sessions_updated_at
  BEFORE UPDATE ON public.voice_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Slyds investor profile (will be linked to Pankaj's account)
INSERT INTO public.investor_profiles (
  id,
  email,
  name,
  firm,
  organization_name,
  investor_type,
  website_url,
  focus_areas,
  sectors,
  stages,
  geographies,
  investment_philosophy,
  ideal_founder_profile
) VALUES (
  uuid_generate_v4(),
  'pankaj@slyds.com',
  'SlydS Advisory',
  'SlydS',
  'SlydS - India''s Leading Fundraising Advisory',
  'advisory',
  'https://slyds.com',
  ARRAY['Storytelling', 'Fundraising Strategy', 'Investor Relations'],
  ARRAY['Technology', 'Consumer', 'Healthcare', 'Fintech', 'EdTech', 'CleanTech'],
  ARRAY['Pre-Seed', 'Seed', 'Series A', 'Series B'],
  ARRAY['India', 'Southeast Asia', 'Global'],
  'We believe every great startup has a compelling story. Our mission is to help founders articulate their vision in a way that resonates with the right investors. With $2B+ raised for 500+ startups, we know what it takes to close rounds.',
  'Passionate founders who are solving real problems, have deep domain expertise, and are coachable. We look for clarity of thought, market understanding, and the ability to build and lead teams.'
);

-- Insert some starter knowledge base entries for Slyds methodology
INSERT INTO public.knowledge_base (title, content, summary, category, tags, source_type, author) VALUES
(
  'The Slyds Storytelling Framework',
  'Great fundraising is about emotional transfer, not information transfer. Investors don''t invest in decks - they invest in founders and visions. Your pitch should make them FEEL the problem, see the opportunity, and believe in your ability to execute.',
  'Core storytelling principles for fundraising',
  'storytelling',
  ARRAY['storytelling', 'pitch', 'methodology'],
  'internal',
  'SlydS Advisory'
),
(
  'The 10-Slide Pitch Structure',
  '1. Hook (Problem Visualization), 2. Problem Statement, 3. Solution, 4. Market Opportunity, 5. Business Model, 6. Traction, 7. Team, 8. Competition, 9. Financial Projections, 10. The Ask. Each slide should answer one question and lead naturally to the next.',
  'Recommended pitch deck structure',
  'pitch-structure',
  ARRAY['deck', 'structure', 'slides'],
  'internal',
  'SlydS Advisory'
),
(
  'Indian VC Landscape 2024',
  'The Indian startup ecosystem has matured significantly. Key trends: Focus on profitability, down rounds are normal, sector rotation toward AI/DeepTech, increasing interest in B2B SaaS. Top VCs: Sequoia, Accel, Matrix, Peak XV, Lightspeed.',
  'Overview of Indian venture capital market',
  'indian-market',
  ARRAY['india', 'vc', 'market', 'trends'],
  'internal',
  'SlydS Advisory'
);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant access to sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- STORAGE BUCKETS (Run in Dashboard)
-- ============================================
-- Create these buckets manually in Supabase Dashboard:
-- 1. pitch-decks (private) - For uploaded pitch deck files
-- 2. voice-recordings (private) - For voice coaching audio
-- 3. avatars (public) - For profile pictures

-- Storage policies will be configured in Dashboard

COMMENT ON SCHEMA public IS 'SlydS Pitch Portal - Single investor platform for SlydS Advisory';