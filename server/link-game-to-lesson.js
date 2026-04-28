const db = require('./config/db');

async function linkGameToLesson() {
  try {
    console.log('🔍 Finding "Plants and their types" lesson...');

    // Find the lesson
    const lessonResult = await db.query(
      `SELECT id FROM lessons WHERE title ILIKE '%Plants and their types%' OR title ILIKE '%plants%' LIMIT 1`
    );

    if (lessonResult.rows.length === 0) {
      console.log('❌ Lesson "Plants and their types" not found');
      console.log('   Available lessons:');
      const allLessons = await db.query(`SELECT id, title FROM lessons LIMIT 10`);
      allLessons.rows.forEach(l => console.log(`   - [${l.id}] ${l.title}`));
      process.exit(1);
    }

    const lessonId = lessonResult.rows[0].id;
    console.log(`✓ Found lesson [${lessonId}]: Plants and their types`);

    // Check if Plant or Animal game exists
    console.log('🔍 Looking for "Plant or Animal?" game...');
    const gameResult = await db.query(
      `SELECT id FROM games WHERE title = $1 LIMIT 1`,
      ['Plant or Animal?']
    );

    let gameId;
    if (gameResult.rows.length > 0) {
      gameId = gameResult.rows[0].id;
      console.log(`✓ Found existing game [${gameId}]: Plant or Animal?`);
    } else {
      console.log('✓ Creating new game record...');
      const newGame = await db.query(
        `INSERT INTO games (lesson_id, title, game_url, is_active)
         VALUES ($1, $2, $3, true)
         RETURNING id`,
        [lessonId, 'Plant or Animal?', 'plant-or-animal']
      );
      gameId = newGame.rows[0].id;
      console.log(`✓ Created game [${gameId}]: Plant or Animal?`);
    }

    // Update game to link to lesson (if not already)
    await db.query(
      `UPDATE games SET lesson_id = $1 WHERE id = $2`,
      [lessonId, gameId]
    );

    console.log(`✓ Linked game [${gameId}] to lesson [${lessonId}]`);
    console.log('\n✅ Setup complete! The game is now available in the lesson.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

linkGameToLesson();
