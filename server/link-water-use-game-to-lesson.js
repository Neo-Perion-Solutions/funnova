/**
 * Migration Script: Link Water Use Game to Lesson
 *
 * Usage: node server/link-water-use-game-to-lesson.js
 *
 * This script:
 * 1. Finds the "Uses of Water" lesson in Unit 1
 * 2. Creates or finds the "Water Use Game" record
 * 3. Links the game to the lesson
 * 4. Verifies the relationship in the database
 */

const db = require('./config/db');

async function linkWaterUseGameToLesson() {
  try {
    console.log('🌊 Starting Water Use Game linking process...\n');

    // Step 1: Find "Uses of Water" lesson
    console.log('📍 Searching for "Uses of Water" lesson...');
    const lessonResult = await db.query(
      `SELECT id, title FROM lessons
       WHERE title ILIKE '%water%' OR title ILIKE '%uses of water%'
       ORDER BY id ASC LIMIT 1`
    );

    if (lessonResult.rows.length === 0) {
      // Fallback: search for lesson 4 in unit 1
      console.log('   Not found by title. Searching for Unit 1, lesson position 4...');
      const unitResult = await db.query(
        `SELECT id, title FROM lessons
         WHERE unit_id = 1
         ORDER BY lesson_order ASC
         LIMIT 1 OFFSET 3`
      );

      if (unitResult.rows.length === 0) {
        throw new Error(
          '❌ Could not find "Uses of Water" lesson. ' +
          'Please provide the lesson ID or verify the lesson exists in the database.'
        );
      }

      var lessonId = unitResult.rows[0].id;
      var lessonTitle = unitResult.rows[0].title;
    } else {
      var lessonId = lessonResult.rows[0].id;
      var lessonTitle = lessonResult.rows[0].title;
    }

    console.log(`✅ Found lesson [${lessonId}]: "${lessonTitle}"\n`);

    // Step 2: Find or create game record
    console.log('🎮 Searching for "Water Use Game" record...');
    const gameCheckResult = await db.query(
      `SELECT id FROM games
       WHERE title = 'Water Use Game' OR game_url = 'water-use'`
    );

    let gameId;
    if (gameCheckResult.rows.length > 0) {
      gameId = gameCheckResult.rows[0].id;
      console.log(`✅ Found existing game [${gameId}]: Water Use Game`);
    } else {
      console.log('   Game not found. Creating new game record...');
      const newGame = await db.query(
        `INSERT INTO games (lesson_id, title, game_url, is_active)
         VALUES ($1, $2, $3, true)
         RETURNING id`,
        [lessonId, 'Water Use Game', 'water-use']
      );
      gameId = newGame.rows[0].id;
      console.log(`✅ Created game [${gameId}]: Water Use Game\n`);
    }

    // Step 3: Update game to link to lesson
    console.log('🔗 Linking game to lesson...');
    await db.query(
      `UPDATE games SET lesson_id = $1, is_active = true WHERE id = $2`,
      [lessonId, gameId]
    );
    console.log(`✅ Linked game [${gameId}] to lesson [${lessonId}]\n`);

    // Step 4: Verify the relationship
    console.log('✔️  Verifying database relationship...');
    const verifyResult = await db.query(
      `SELECT g.id, g.title, g.game_url, g.lesson_id, l.title as lesson_title
       FROM games g
       LEFT JOIN lessons l ON g.lesson_id = l.id
       WHERE g.id = $1`,
      [gameId]
    );

    const game = verifyResult.rows[0];
    console.log(`
╔════════════════════════════════════════════╗
║         GAME LINKING VERIFICATION          ║
╠════════════════════════════════════════════╣
║ Game ID:         ${String(game.id).padEnd(32)}║
║ Game Title:      ${game.title.padEnd(31)}║
║ Game URL:        ${game.game_url.padEnd(33)}║
║ Lesson ID:       ${String(game.lesson_id).padEnd(32)}║
║ Lesson Title:    ${(game.lesson_title || 'N/A').padEnd(31)}║
╚════════════════════════════════════════════╝
    `);

    if (!game.lesson_id) {
      throw new Error('❌ Verification failed: Game is not linked to lesson');
    }

    console.log('✅ SUCCESS! Water Use Game is now linked to the lesson!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start the client: cd client && npm run dev');
    console.log('   2. Start the server: cd server && npm start');
    console.log(`   3. Visit: http://localhost:5173/student/lesson/${lessonId}`);
    console.log('   4. Look for "Boss Level · Water Use Game 💧" card');
    console.log('   5. Click "⚡ PLAY GAME" to start!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Ensure the database is running');
    console.error('- Check that server/config/db.js is properly configured');
    console.error('- Verify the "lessons" table exists');
    console.error('- Verify the "games" table exists with proper schema\n');
    process.exit(1);
  }
}

linkWaterUseGameToLesson();
