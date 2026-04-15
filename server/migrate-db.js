const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function dropAllTables(client) {
  console.log('🗑️  Dropping all existing tables...');
  try {
    await client.query(`
      DROP TABLE IF EXISTS
        student_answers,
        lesson_completions,
        game_scores,
        games,
        questions,
        sections,
        lessons,
        units,
        subjects,
        students,
        admins
      CASCADE
    `);
    console.log('✅ All tables dropped');
  } catch (err) {
    console.error('❌ Error dropping tables:', err.message);
    throw err;
  }
}

async function createSchema(client) {
  console.log('\n🏗️  Creating new schema with separate admin and student tables...');

  const schema = fs.readFileSync('./schema.sql', 'utf8');
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await client.query(statement);
    } catch (err) {
      if (!err.message.includes('does not exist')) {
        console.error('❌ Schema error:', err.message);
        throw err;
      }
    }
  }
  console.log('✅ Schema created');
}

async function seedData(client) {
  console.log('\n🌱 Seeding test data...');

  const seed = fs.readFileSync('./seed.sql', 'utf8');
  const statements = seed
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  for (const statement of statements) {
    if (statement) {
      try {
        await client.query(statement);
      } catch (err) {
        console.error('❌ Seed error:', err.message);
        console.error('Statement:', statement.substring(0, 100));
        throw err;
      }
    }
  }
  console.log('✅ Data seeded');
}

async function verifyAndReport(client) {
  console.log('\n✔️ Verifying setup...\n');

  const getTables = async (tableName) => {
    try {
      const result = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
      return parseInt(result.rows[0].count);
    } catch {
      return 0;
    }
  };

  const adminCount = await getTables('admins');
  const studentCount = await getTables('students');
  const subjectCount = await getTables('subjects');
  const lessonCount = await getTables('lessons');
  const questionCount = await getTables('questions');

  console.log('📊 Database Summary:');
  console.log(`   ✓ Admins: ${adminCount}`);
  console.log(`   ✓ Students: ${studentCount}`);
  console.log(`   ✓ Subjects: ${subjectCount}`);
  console.log(`   ✓ Lessons: ${lessonCount}`);
  console.log(`   ✓ Questions: ${questionCount}`);

  console.log('\n🔐 Test Credentials (all passwords: password123):');
  console.log('   ┌──────────────────────────────────────────┐');
  console.log('   │ ADMIN:                                   │');
  console.log('   │   ID: ADMIN-001, Role: main_admin        │');
  console.log('   │   ID: ADMIN-002, Role: sub_admin         │');
  console.log('   ├──────────────────────────────────────────┤');
  console.log('   │ STUDENT:                                 │');
  console.log('   │   ID: STU-001, Grade: 4                  │');
  console.log('   │   ID: STU-002, Grade: 5                  │');
  console.log('   └──────────────────────────────────────────┘');
}

async function migrate() {
  let client;
  try {
    console.log('🔄 Connecting to Neon database...\n');
    client = await pool.connect();
    console.log('✅ Connected\n');

    await dropAllTables(client);
    await createSchema(client);
    await seedData(client);
    await verifyAndReport(client);

    console.log('\n✅ MIGRATION COMPLETE!\n');
    console.log('Next steps:');
    console.log('   1. npm start (backend)');
    console.log('   2. npm run dev (frontend)');
    console.log('   3. Test admin login at http://localhost:5173/admin/login');
    console.log('   4. Test student login at http://localhost:5173/student/login\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

migrate();
