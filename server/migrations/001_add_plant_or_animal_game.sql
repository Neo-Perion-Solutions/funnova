-- Migration: Add Plant or Animal game and make lesson_id nullable in games table

-- Step 1: Make lesson_id nullable in games table
ALTER TABLE games ALTER COLUMN lesson_id DROP NOT NULL;

-- Step 2: Create "Plant or Animal?" game (standalone, no lesson)
INSERT INTO games (lesson_id, title, game_url, icon, is_active, game_order)
VALUES (NULL, 'Plant or Animal?', '/game/plant-or-animal', '🌱', true, 1)
ON CONFLICT DO NOTHING;

-- Done!
