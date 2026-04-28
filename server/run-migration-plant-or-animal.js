const db = require('./config/db');

async function runMigration() {
  try {
    // Step 1: Make lesson_id nullable
    console.log('Making lesson_id nullable in games table...');
    await db.query('ALTER TABLE games ALTER COLUMN lesson_id DROP NOT NULL');
    console.log('✓ lesson_id is now nullable');

    // Step 2: Insert Plant or Animal game
    console.log('Inserting "Plant or Animal?" game...');
    const result = await db.query(
      `INSERT INTO games (lesson_id, title, game_url, is_active)
       VALUES (NULL, $1, $2, true)
       ON CONFLICT DO NOTHING
       RETURNING *`,
      ['Plant or Animal?', '/game/plant-or-animal']
    );

    if (result.rows.length > 0) {
      console.log('✓ Game created:', result.rows[0]);
    } else {
      console.log('✓ Game already exists');
    }

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
