-- RaiseReady Database Schema
-- Initial migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Founders table
CREATE TABLE founders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    country TEXT,
    impact_focus TEXT[], -- SDG categories
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pitch decks table
CREATE TABLE pitch_decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    founder_id UUID REFERENCES founders(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT, -- 'pdf', 'pptx', 'google_slides'
    status TEXT DEFAULT 'uploaded', -- 'uploaded', 'processing', 'analyzed', 'error'
    readiness_score INTEGER, -- 0-100
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pitch videos table (for future use)
CREATE TABLE pitch_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deck_id UUID REFERENCES pitch_decks(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    transcript JSONB, -- [{timestamp, text, slide_number}]
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coaching sessions table
CREATE TABLE coaching_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deck_id UUID REFERENCES pitch_decks(id) ON DELETE CASCADE,
    coach_type TEXT DEFAULT 'primary', -- 'primary', 'market_analyst', 'visual_designer'
    conversation JSONB DEFAULT '[]'::jsonb, -- [{role, content, timestamp}]
    feedback_summary TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI feedback table
CREATE TABLE ai_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    deck_id UUID REFERENCES pitch_decks(id) ON DELETE CASCADE,
    slide_number INTEGER,
    feedback_type TEXT, -- 'structure', 'story', 'delivery', 'visuals', 'market'
    original_content TEXT,
    suggestion TEXT,
    reasoning TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investor profiles table (for future matching)
CREATE TABLE investor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    firm TEXT,
    focus_areas TEXT[],
    check_size_min INTEGER,
    check_size_max INTEGER,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deck analysis table (structured analysis results)
CREATE TABLE deck_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deck_id UUID REFERENCES pitch_decks(id) ON DELETE CASCADE,
    analysis_type TEXT, -- 'initial', 'detailed', 'final'
    scores JSONB, -- {problem_clarity: 85, solution_fit: 70, ...}
    strengths TEXT[],
    weaknesses TEXT[],
    recommendations TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_pitch_decks_founder ON pitch_decks(founder_id);
CREATE INDEX idx_coaching_sessions_deck ON coaching_sessions(deck_id);
CREATE INDEX idx_ai_feedback_session ON ai_feedback(session_id);
CREATE INDEX idx_ai_feedback_deck ON ai_feedback(deck_id);

-- Row Level Security (RLS)
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies (founders can only see their own data)
CREATE POLICY "Founders can view own data" ON founders
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Founders can view own decks" ON pitch_decks
    FOR ALL USING (founder_id IN (SELECT id FROM founders WHERE auth.uid()::text = id::text));

CREATE POLICY "Founders can view own sessions" ON coaching_sessions
    FOR ALL USING (deck_id IN (
        SELECT id FROM pitch_decks WHERE founder_id IN (
            SELECT id FROM founders WHERE auth.uid()::text = id::text
        )
    ));
