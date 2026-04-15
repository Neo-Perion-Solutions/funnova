const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

async function testAdmin() {
  const result = await pool.query(
    'SELECT login_id, name, password_hash FROM admins WHERE login_id = $1',
    ['ADMIN-001']
  );

  if (result.rows.length > 0) {
    const admin = result.rows[0];
    console.log('✅ Admin found:', admin.login_id, '-', admin.name);
    console.log('Hash length:', admin.password_hash.length);

    const match = await bcrypt.compare('admin123', admin.password_hash);
    console.log('Password test (admin123):', match);

    if (!match) {
      console.log('\n⚠️  Password mismatch! Creating new hash...');
      const newHash = await bcrypt.hash('admin123', 10);
      await pool.query(
        'UPDATE admins SET password_hash = $1 WHERE login_id = $2',
        [newHash, 'ADMIN-001']
      );
      console.log('✅ Password updated!');
    }
  } else {
    console.log('❌ Admin not found');
  }

  process.exit(0);
}

testAdmin().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
