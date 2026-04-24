const { pool } = require('./server/config/db');

async function fixSubjects() {
  try {
    // We want only Mathematics and Science for Grade 3, 4, 5
    // First, let's look at all subjects
    const res = await pool.query('SELECT * FROM subjects');
    console.log("Current subjects:", res.rows);

    // Delete everything that is NOT Mathematics or Science
    await pool.query("DELETE FROM subjects WHERE name NOT IN ('Mathematics', 'Science')");
    
    // Check if Mathematics and Science exist for Grades 3, 4, 5
    const grades = [3, 4, 5];
    const keepNames = ['Mathematics', 'Science'];
    const icons = { 'Mathematics': '📐', 'Science': '🔬' };

    for (const g of grades) {
      for (const n of keepNames) {
        // Upsert
        await pool.query(`
          INSERT INTO subjects (grade, name, icon) 
          VALUES ($1, $2, $3)
          ON CONFLICT (grade, name) DO NOTHING
        `, [g, n, icons[n]]);
      }
    }

    const finalRes = await pool.query('SELECT * FROM subjects ORDER BY grade, name');
    console.log("Final subjects:", finalRes.rows);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

fixSubjects();
