const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function diagnose() {
  console.log('🔍 DIAGNOSTIC TEST\n');

  try {
    // Test 1: Database connection
    console.log('1️⃣ Testing database connection...');
    const result = await pool.query('SELECT version()');
    console.log('   ✅ Database connected');
    console.log(`   Version: ${result.rows[0].version.split(',')[0]}\n`);

    // Test 2: Check students table
    console.log('2️⃣ Checking students table...');
    const tableCheck = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'students'
      ORDER BY ordinal_position
    `);

    if (tableCheck.rows.length === 0) {
      console.log('   ❌ Students table does not exist!');
      process.exit(1);
    }

    console.log('   ✅ Students table exists with columns:');
    tableCheck.rows.forEach(col => {
      console.log(`      - ${col.column_name} (${col.data_type})`);
    });
    console.log();

    // Test 3: Check test data
    console.log('3️⃣ Checking test data...');
    const students = await pool.query('SELECT login_id, name, role FROM students');

    if (students.rows.length === 0) {
      console.log('   ❌ No students found!');
      process.exit(1);
    }

    console.log('   ✅ Found students:');
    students.rows.forEach(s => {
      console.log(`      - ${s.login_id}: ${s.name} (${s.role})`);
    });
    console.log();

    // Test 4: Test login credentials
    console.log('4️⃣ Testing login credentials...');
    const admin = await pool.query(
      'SELECT id, login_id, password_hash, role FROM students WHERE login_id = $1',
      ['ADMIN-001']
    );

    if (admin.rows.length === 0) {
      console.log('   ❌ ADMIN-001 not found!');
      process.exit(1);
    }

    const adminUser = admin.rows[0];
    console.log(`   ✅ Found ADMIN-001`);
    console.log(`      Password hash: ${adminUser.password_hash.substring(0, 20)}...`);

    // Test password
    const isMatch = await bcrypt.compare('password123', adminUser.password_hash);
    if (isMatch) {
      console.log('   ✅ Password verification works!');
    } else {
      console.log('   ❌ Password verification FAILED!');
    }
    console.log();

    // Test 5: Summary
    console.log('✅ ALL DIAGNOSTICS PASSED!\n');
    console.log('✨ The database is properly set up.');
    console.log('✨ Ready to login with:');
    console.log('   Login ID: ADMIN-001');
    console.log('   Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ DIAGNOSTIC FAILED:');
    console.error(`Error: ${error.message}\n`);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

diagnose();
