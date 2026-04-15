/**
 * seed-admin.js
 * Creates default admin and student users for testing
 * Run: node seed-admin.js
 */

const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('🌱 Seeding default users...\n');

    // Hash passwords
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const studentPasswordHash = await bcrypt.hash('student123', 10);

    // Check if admin already exists
    const adminExists = await pool.query(
      'SELECT id FROM admins WHERE login_id = $1',
      ['ADMIN-001']
    );

    if (adminExists.rows.length === 0) {
      await pool.query(
        `INSERT INTO admins (login_id, name, email, password_hash, role, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          'ADMIN-001',
          'Main Admin',
          'admin@funnova.com',
          adminPasswordHash,
          'main_admin',
          '👨‍💼'
        ]
      );
      console.log('✅ Created admin user:');
      console.log('   Login ID: ADMIN-001');
      console.log('   Password: admin123');
      console.log('   Role: main_admin\n');
    } else {
      console.log('⏭️  Admin user already exists\n');
    }

    // Check if default student exists
    const studentExists = await pool.query(
      'SELECT id FROM students WHERE login_id = $1',
      ['STUDENT-001']
    );

    if (studentExists.rows.length === 0) {
      await pool.query(
        `INSERT INTO students (login_id, name, password_hash, grade, section, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          'STUDENT-001',
          'Test Student',
          studentPasswordHash,
          4,
          'A',
          '👧'
        ]
      );
      console.log('✅ Created student user:');
      console.log('   Login ID: STUDENT-001');
      console.log('   Password: student123');
      console.log('   Grade: 4, Section: A\n');
    } else {
      console.log('⏭️  Student user already exists\n');
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedData();
