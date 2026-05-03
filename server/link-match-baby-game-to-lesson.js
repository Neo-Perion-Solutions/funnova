const db = require('./config/db');

async function linkMatchBabyGameToLesson() {
  try {
    console.log('🔍 Finding "Animals and Their Habitats" lesson...');

    // Find the lesson
    const lessonResult = await db.query(
      `SELECT id FROM lessons WHERE title = $1 LIMIT 1`,
      ['Animals and their types']
    );

    if (lessonResult.rows.length === 0) {
      console.log('❌ Lesson "Animals and Their Habitats" not found');
      console.log('   Available lessons:');
      const allLessons = await db.query(`SELECT id, title FROM lessons LIMIT 20`);
      allLessons.rows.forEach(l => console.log(`   - [${l.id}] ${l.title}`));
      process.exit(1);
    }

    const lessonId = lessonResult.rows[0].id;
    console.log(`✓ Found lesson [${lessonId}]: Animals and Their Habitats`);

    // Check if Match Baby to Animal game exists
    console.log('🔍 Looking for "Match Baby to Animal" game...');
    const gameResult = await db.query(
      `SELECT id FROM games WHERE title = $1 LIMIT 1`,
      ['Match Baby to Animal']
    );

    let gameId;
    if (gameResult.rows.length > 0) {
      gameId = gameResult.rows[0].id;
      console.log(`✓ Found existing game [${gameId}]: Match Baby to Animal`);
      
      // Update lesson_id just in case
      await db.query(
        `UPDATE games SET lesson_id = $1, game_url = $2 WHERE id = $3`,
        [lessonId, 'match-baby-to-animal', gameId]
      );
    } else {
      console.log('✓ Creating new game record...');
      const newGame = await db.query(
        `INSERT INTO games (lesson_id, title, game_url, is_active)
         VALUES ($1, $2, $3, true)
         RETURNING id`,
        [lessonId, 'Match Baby to Animal', 'match-baby-to-animal']
      );
      gameId = newGame.rows[0].id;
      console.log(`✓ Created game [${gameId}]: Match Baby to Animal`);
    }

    console.log(`✓ Linked game [${gameId}] to lesson [${lessonId}]`);
    console.log('\n✅ Setup complete! The game is now available in the lesson.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

linkMatchBabyGameToLesson();
