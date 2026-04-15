const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

// Connection to Neon database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initializeDatabase() {
  let client;
  try {
    console.log('🔄 Connecting to Neon database...');
    client = await pool.connect();
    console.log('✅ Connected to Neon PostgreSQL');

    // Read schema file
    console.log('\n📋 Reading schema.sql...');
    const schema = fs.readFileSync('./schema.sql', 'utf8');

    // Split and execute schema statements
    console.log('🔨 Creating database tables...');
    const schemaStatements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (const statement of schemaStatements) {
      try {
        await client.query(statement);
      } catch (err) {
        // Ignore "does not exist" errors (normal on first run)
        if (!err.message.includes('does not exist')) {
          throw err;
        }
      }
    }
    console.log('✅ Database schema created successfully');

    // Read seed file
    console.log('\n🌱 Reading seed.sql...');
    const seed = fs.readFileSync('./seed.sql', 'utf8');

    // Split and execute seed statements
    console.log('📥 Seeding test data...');
    const seedStatements = seed
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (const statement of seedStatements) {
      if (statement) {
        await client.query(statement);
      }
    }
    console.log('✅ Test data seeded successfully');

    // Verify data
    console.log('\n✔️ Verifying setup...');
    const adminsResult = await client.query('SELECT COUNT(*) FROM admins');
    const adminCount = adminsResult.rows[0].count;

    const studentsResult = await client.query('SELECT COUNT(*) FROM students');
    const studentCount = studentsResult.rows[0].count;

    const lessonsResult = await client.query('SELECT COUNT(*) FROM lessons');
    const lessonCount = lessonsResult.rows[0].count;

    console.log(`\n📊 Database Summary:`);
    console.log(`   ✓ Admins: ${adminCount}`);
    console.log(`   ✓ Students: ${studentCount}`);
    console.log(`   ✓ Lessons: ${lessonCount}`);

    // Show test credentials
    console.log('\n🔐 Test Credentials:');
    console.log('   ┌────────────────────────────────────────┐');
    console.log('   │ ADMIN LOGIN:                           │');
    console.log('   │ Login ID: ADMIN-001                    │');
    console.log('   │ Password: password123                  │');
    console.log('   │ Role: main_admin                       │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ SUB_ADMIN LOGIN:                       │');
    console.log('   │ Login ID: ADMIN-002                    │');
    console.log('   │ Password: password123                  │');
    console.log('   │ Role: sub_admin                        │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ STUDENT LOGIN:                         │');
    console.log('   │ Login ID: STU-001                      │');
    console.log('   │ Password: password123                  │');
    console.log('   │ Grade: 4                              │');
    console.log('   ├────────────────────────────────────────┤');
    console.log('   │ STUDENT LOGIN 2:                       │');
    console.log('   │ Login ID: STU-002                      │');
    console.log('   │ Password: password123                  │');
    console.log('   │ Grade: 5                              │');
    console.log('   └────────────────────────────────────────┘');

    console.log('\n✅ DATABASE SETUP COMPLETE!\n');
    console.log('Ready to run the application:');
    console.log('   1. Start backend: npm start');
    console.log('   2. Start frontend: npm run dev');
    console.log('   3. Admin login at http://localhost:5173/admin/login');
    console.log('   4. Student login at http://localhost:5173/student/login\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:');
    console.error(`   ${error.message}`);
    console.error('\n📝 Troubleshooting:');
    console.error('   • Check DATABASE_URL in .env file');
    console.error('   • Ensure you have internet connection (Neon is cloud-based)');
    console.error('   • Verify schema.sql and seed.sql exist in server directory');
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

initializeDatabase();
