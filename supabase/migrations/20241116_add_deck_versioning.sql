-- Add versioning support to pitch_decks table
ALTER TABLE pitch_decks 
ADD COLUMN parent_deck_id UUID REFERENCES pitch_decks(id) ON DELETE CASCADE,
ADD COLUMN version INTEGER DEFAULT 1,
ADD COLUMN version_notes TEXT;

-- Create index for faster version queries
CREATE INDEX idx_pitch_decks_parent ON pitch_decks(parent_deck_id);

-- Add comment for documentation
COMMENT ON COLUMN pitch_decks.parent_deck_id IS 'References the previous version of this deck for version tracking';
COMMENT ON COLUMN pitch_decks.version IS 'Version number, increments with each upload';
COMMENT ON COLUMN pitch_decks.version_notes IS 'User notes about what changed in this version';
