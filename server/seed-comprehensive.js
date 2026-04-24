/**
 * Comprehensive Mock Data Seeder
 * Creates 5 students (Grade 3 & 4) with detailed curriculum:
 * - Grade 3: Mathematics (Fractions, Multiplication, Division), Science (Life Science, Physical Science)
 * - Grade 4: Mathematics (Decimals, Fractions, Multiplication), Science (Earth Science, Physical Properties)
 * - Each subject has 2 units, each unit has 2-3 lessons
 * - Each lesson has 2-3 sections with 3 questions each
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const pool = require('./config/db').pool;

// Password hash (password123)
const STUDENT_PASS = '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.';

// ==================== CURRICULUM DATA ====================

const CURRICULUM = {
  3: {
    Mathematics: {
      icon: '📐',
      units: [
        {
          title: 'Fractions Fundamentals',
          lessons: [
            {
              title: 'Introduction to Fractions',
              description: 'Learn what fractions are, their parts, and how they represent parts of a whole.',
              sections: [
                {
                  title: 'What Are Fractions?',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'A fraction represents:',
                      options: { A: 'A part of a whole', B: 'A complete number', C: 'A decimal', D: 'A percentage' },
                      correct: 'A'
                    },
                    {
                      type: 'true_false',
                      text: 'The numerator is the top number of a fraction.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'The bottom number of a fraction is called the __________.',
                      correct: 'denominator'
                    }
                  ]
                },
                {
                  title: 'Fraction Parts and Names',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'In the fraction 3/5, what does 3 represent?',
                      options: { A: 'The denominator', B: 'The numerator', C: 'The whole', D: 'The remainder' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: '1/2 means 1 out of 2 equal parts.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'A fraction with numerator 1 and any denominator is called a __________ fraction.',
                      correct: 'unit'
                    }
                  ]
                }
              ]
            },
            {
              title: 'Comparing and Ordering Fractions',
              description: 'Master how to compare fractions and arrange them in order.',
              sections: [
                {
                  title: 'Comparing Fractions with Same Denominator',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'Which is larger: 3/8 or 5/8?',
                      options: { A: '3/8', B: '5/8', C: 'They are equal', D: 'Cannot determine' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'When fractions have the same denominator, the one with the larger numerator is larger.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'To compare fractions with the same denominator, just compare the __________.',
                      correct: 'numerators'
                    }
                  ]
                },
                {
                  title: 'Comparing Fractions with Same Numerator',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'Which is smaller: 1/3 or 1/6?',
                      options: { A: '1/3', B: '1/6', C: 'They are equal', D: 'Cannot tell' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: '1/4 is smaller than 1/2.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'When the numerator is the same, the fraction with the larger denominator is __________.',
                      correct: 'smaller'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Multiplication Basics',
          lessons: [
            {
              title: 'Skip Counting and Groups',
              description: 'Introduction to multiplication through skip counting and grouping.',
              sections: [
                {
                  title: 'Understanding Multiplication',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'Multiplication is the same as:',
                      options: { A: 'Repeated addition', B: 'Repeated subtraction', C: 'Counting by ones', D: 'Division' },
                      correct: 'A'
                    },
                    {
                      type: 'true_false',
                      text: '3 × 4 means 3 groups of 4.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'The result of a multiplication is called the __________.',
                      correct: 'product'
                    }
                  ]
                },
                {
                  title: 'Multiplication Facts 2s and 3s',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'What is 3 × 7?',
                      options: { A: '20', B: '21', C: '19', D: '24' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: '2 × 9 equals 18.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: '5 × __________ = 25',
                      correct: '5'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    Science: {
      icon: '🔬',
      units: [
        {
          title: 'Life Science Basics',
          lessons: [
            {
              title: 'Plants and Their Parts',
              description: 'Learn about different plant parts and their functions.',
              sections: [
                {
                  title: 'Plant Structure',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'What is the main function of plant roots?',
                      options: { A: 'Absorb sunlight', B: 'Absorb water and nutrients', C: 'Make flowers', D: 'Produce seeds' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'Leaves use sunlight to make food for the plant.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'The green parts of a plant that make food are called __________.',
                      correct: 'leaves'
                    }
                  ]
                },
                {
                  title: 'Plant Life Cycle',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'What grows from plant seeds?',
                      options: { A: 'Flowers', B: 'New plants', C: 'Nutrients', D: 'Water' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'All plants need sunlight, water, and soil to grow.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'The __________ protects the growing plant inside a seed.',
                      correct: 'seed coat'
                    }
                  ]
                }
              ]
            },
            {
              title: 'Animals and Their Habitats',
              description: 'Discover different animals and the places where they live.',
              sections: [
                {
                  title: 'What Are Habitats?',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'A habitat is:',
                      options: { A: 'A type of food', B: 'The place where an animal lives', C: 'An animal behavior', D: 'A plant species' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'All animals live in the same type of habitat.',
                      correct: 'False'
                    },
                    {
                      type: 'fill_blank',
                      text: 'Animals need shelter, food, and __________ in their habitat.',
                      correct: 'water'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Physical Science Basics',
          lessons: [
            {
              title: 'States of Matter',
              description: 'Explore solids, liquids, and gases.',
              sections: [
                {
                  title: 'Solids, Liquids, and Gases',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'Which is a liquid?',
                      options: { A: 'Wood', B: 'Water', C: 'Air', D: 'Rock' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'A gas has a fixed shape.',
                      correct: 'False'
                    },
                    {
                      type: 'fill_blank',
                      text: 'A __________ has a fixed shape and takes up a fixed amount of space.',
                      correct: 'solid'
                    }
                  ]
                },
                {
                  title: 'Changes in Matter',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'What happens when ice melts?',
                      options: { A: 'It becomes a gas', B: 'It becomes a liquid', C: 'It stays a solid', D: 'It disappears' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'When water boils, it changes into steam, which is a gas.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'The change from solid to liquid is called __________.',
                      correct: 'melting'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  4: {
    Mathematics: {
      icon: '📐',
      units: [
        {
          title: 'Fractions and Equivalent Fractions',
          lessons: [
            {
              title: 'Understanding Fractions',
              description: 'Deepen your understanding of fractions and parts of a whole.',
              sections: [
                {
                  title: 'Fraction Basics Review',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'What does 2/5 represent?',
                      options: { A: '2 wholes divided by 5', B: '2 parts out of 5 equal parts', C: '5 parts out of 2', D: 'A decimal' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'A proper fraction has a numerator smaller than the denominator.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'An __________ fraction has a numerator equal to or greater than the denominator.',
                      correct: 'improper'
                    }
                  ]
                },
                {
                  title: 'Equivalent Fractions',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'Which fraction is equivalent to 1/2?',
                      options: { A: '2/3', B: '2/4', C: '3/5', D: '4/6' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'Equivalent fractions represent the same amount but have different numerators and denominators.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'To find equivalent fractions, multiply both numerator and denominator by the same __________.',
                      correct: 'number'
                    }
                  ]
                }
              ]
            },
            {
              title: 'Comparing and Adding Fractions',
              description: 'Learn to compare fractions and add them together.',
              sections: [
                {
                  title: 'Adding Fractions with Same Denominator',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'What is 1/4 + 2/4?',
                      options: { A: '3/4', B: '3/8', C: '3/4', D: '1/2' },
                      correct: 'A'
                    },
                    {
                      type: 'true_false',
                      text: 'When adding fractions with the same denominator, add the numerators and keep the denominator.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: '2/5 + 1/5 = __/5',
                      correct: '3'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Decimals and Percentages',
          lessons: [
            {
              title: 'Introduction to Decimals',
              description: 'Learn how decimals represent parts of a whole.',
              sections: [
                {
                  title: 'Understanding Decimal Places',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'What does 0.5 mean?',
                      options: { A: '5/10', B: '5/100', C: '5/1000', D: '50/100' },
                      correct: 'A'
                    },
                    {
                      type: 'true_false',
                      text: '0.5 is equal to 1/2.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'The first digit after the decimal point represents __________.',
                      correct: 'tenths'
                    }
                  ]
                },
                {
                  title: 'Decimal Operations',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'What is 0.3 + 0.4?',
                      options: { A: '0.7', B: '0.12', C: '0.07', D: '3.4' },
                      correct: 'A'
                    },
                    {
                      type: 'true_false',
                      text: '2.5 is less than 2.50.',
                      correct: 'False'
                    },
                    {
                      type: 'fill_blank',
                      text: '1.0 - 0.3 = __________',
                      correct: '0.7'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    Science: {
      icon: '🔬',
      units: [
        {
          title: 'Earth and Space Science',
          lessons: [
            {
              title: 'The Solar System',
              description: 'Explore our solar system and the planets.',
              sections: [
                {
                  title: 'Our Solar System',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'What is at the center of our solar system?',
                      options: { A: 'The Moon', B: 'The Sun', C: 'Earth', D: 'A star' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'The solar system contains eight planets.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'The __________ orbits around the Sun.',
                      correct: 'Earth'
                    }
                  ]
                },
                {
                  title: 'Planets and Their Characteristics',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'Which planet is closest to the Sun?',
                      options: { A: 'Venus', B: 'Mercury', C: 'Earth', D: 'Mars' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'Jupiter is the largest planet in our solar system.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'Mars is known as the __________ planet.',
                      correct: 'red'
                    }
                  ]
                }
              ]
            },
            {
              title: 'Rocks and Soil',
              description: 'Learn about rocks and how soil is formed.',
              sections: [
                {
                  title: 'Types of Rocks',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'Rocks are made of:',
                      options: { A: 'Sand and water', B: 'Minerals', C: 'Plants', D: 'Air' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'Igneous rocks form from cooled lava.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'Sedimentary rocks are formed from compressed __________.',
                      correct: 'sediment'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Life Science Exploration',
          lessons: [
            {
              title: 'Food Chains and Food Webs',
              description: 'Understand how energy flows through ecosystems.',
              sections: [
                {
                  title: 'What is a Food Chain?',
                  type: 'intro',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'Energy in a food chain starts with:',
                      options: { A: 'Animals', B: 'Plants (producers)', C: 'Consumers', D: 'Heat' },
                      correct: 'B'
                    },
                    {
                      type: 'true_false',
                      text: 'A herbivore eats plants.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'An animal that eats only meat is called a __________.',
                      correct: 'carnivore'
                    }
                  ]
                },
                {
                  title: 'Predators and Prey',
                  type: 'learning',
                  questions: [
                    {
                      type: 'mcq',
                      text: 'In a food chain, what is the role of a hawk?',
                      options: { A: 'Producer', B: 'Herbivore', C: 'Predator', D: 'Decomposer' },
                      correct: 'C'
                    },
                    {
                      type: 'true_false',
                      text: 'A mouse is both a predator and prey in different food chains.',
                      correct: 'True'
                    },
                    {
                      type: 'fill_blank',
                      text: 'The animal being hunted is called the __________.',
                      correct: 'prey'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
};

// ==================== SEEDING FUNCTION ====================

async function seedComprehensiveData() {
  try {
    console.log('🌱 Starting comprehensive seed process...\n');

    // ===== STEP 1: Create 5 Mock Students =====
    console.log('📚 Creating 5 mock students for Grade 3 & 4...');
    
    const students = [
      { login_id: 'STU-G3-001', name: 'Aarav Singh', grade: 3, section: 'A' },
      { login_id: 'STU-G3-002', name: 'Priya Sharma', grade: 3, section: 'B' },
      { login_id: 'STU-G3-003', name: 'Rajesh Kumar', grade: 3, section: 'A' },
      { login_id: 'STU-G4-001', name: 'Maya Gupta', grade: 4, section: 'C' },
      { login_id: 'STU-G4-002', name: 'Arjun Patel', grade: 4, section: 'B' }
    ];

    const studentIds = {};
    for (const student of students) {
      const result = await pool.query(
        `INSERT INTO students (login_id, password_hash, name, grade, section, streak_days) 
         VALUES ($1, $2, $3, $4, $5, 0) 
         ON CONFLICT (login_id) DO UPDATE SET name = $3, grade = $4, section = $5
         RETURNING id`,
        [student.login_id, STUDENT_PASS, student.name, student.grade, student.section]
      );
      studentIds[student.login_id] = result.rows[0].id;
      console.log(`  ✓ ${student.name} (Grade ${student.grade})`);
    }

    // ===== STEP 2: Create or Get Subjects =====
    console.log('\n📖 Creating/retrieving subjects for Grade 3 & 4...');
    
    const subjectIds = {};
    for (const grade of [3, 4]) {
      for (const [subjectName, subjectData] of Object.entries(CURRICULUM[grade])) {
        const result = await pool.query(
          `INSERT INTO subjects (grade, name, icon) VALUES ($1, $2, $3) 
           ON CONFLICT (grade, name) DO UPDATE SET icon = $3
           RETURNING id`,
          [grade, subjectName, subjectData.icon]
        );
        const key = `G${grade}-${subjectName}`;
        subjectIds[key] = result.rows[0].id;
        console.log(`  ✓ Grade ${grade} ${subjectName} (${subjectData.icon})`);
      }
    }

    // ===== STEP 3: Create Units, Lessons, Sections, and Questions =====
    console.log('\n🎯 Creating curriculum hierarchy...');

    for (const grade of [3, 4]) {
      for (const [subjectName, subjectData] of Object.entries(CURRICULUM[grade])) {
        const subjectKey = `G${grade}-${subjectName}`;
        const subjectId = subjectIds[subjectKey];

        // Create Units
        for (let unitIdx = 0; unitIdx < subjectData.units.length; unitIdx++) {
          const unit = subjectData.units[unitIdx];
          
          const unitResult = await pool.query(
            `INSERT INTO units (subject_id, title, unit_order) VALUES ($1, $2, $3) 
             ON CONFLICT (subject_id, unit_order) DO UPDATE SET title = $2
             RETURNING id`,
            [subjectId, unit.title, unitIdx + 1]
          );
          const unitId = unitResult.rows[0].id;
          console.log(`  ✓ Unit: ${unit.title} (Grade ${grade}, ${subjectName})`);

          // Create Lessons
          for (let lessonIdx = 0; lessonIdx < unit.lessons.length; lessonIdx++) {
            const lesson = unit.lessons[lessonIdx];
            
            const lessonResult = await pool.query(
              `INSERT INTO lessons (unit_id, title, description, lesson_order, video_url) 
               VALUES ($1, $2, $3, $4, $5) 
               ON CONFLICT (unit_id, lesson_order) DO UPDATE SET title = $2, description = $3
               RETURNING id`,
              [
                unitId,
                lesson.title,
                lesson.description,
                lessonIdx + 1,
                `https://funnova.edu/videos/${grade}/${subjectName}/${lesson.title.replace(/\s+/g, '-').toLowerCase()}`
              ]
            );
            const lessonId = lessonResult.rows[0].id;
            console.log(`    ✓ Lesson: ${lesson.title}`);

            // Create Sections & Questions
            for (let sectionIdx = 0; sectionIdx < lesson.sections.length; sectionIdx++) {
              const section = lesson.sections[sectionIdx];
              
              const sectionResult = await pool.query(
                `INSERT INTO sections (lesson_id, title, type, section_order) 
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT (lesson_id, section_order) DO UPDATE SET title = $2, type = $3
                 RETURNING id`,
                [lessonId, section.title, section.type, sectionIdx + 1]
              );
              const sectionId = sectionResult.rows[0].id;
              console.log(`      ✓ Section: ${section.title}`);

              // Create Questions
              for (let qIdx = 0; qIdx < section.questions.length; qIdx++) {
                const q = section.questions[qIdx];
                
                const optionsJson = q.type === 'mcq' ? JSON.stringify(q.options) : null;
                
                await pool.query(
                  `INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) 
                   VALUES ($1, $2, $3, $4, $5, $6)
                   ON CONFLICT (section_id, question_order) DO UPDATE SET 
                     type = $2, question_text = $3, options = $4, correct_answer = $5`,
                  [
                    sectionId,
                    q.type,
                    q.text,
                    optionsJson,
                    q.correct,
                    qIdx + 1
                  ]
                );
              }
              console.log(`        ✓ 3 Questions added to section`);
            }
          }
        }
      }
    }

    // ===== STEP 4: Mark Some Lessons as Completed =====
    console.log('\n✅ Recording lesson completions for students...');
    
    const lessonsToComplete = await pool.query('SELECT id FROM lessons LIMIT 5');
    for (const studentId of Object.values(studentIds).slice(0, 3)) {
      for (const lesson of lessonsToComplete.rows) {
        await pool.query(
          `INSERT INTO lesson_completions (student_id, lesson_id, completed_at) 
           VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING`,
          [studentId, lesson.id]
        );
      }
    }
    console.log(`  ✓ Lesson completions recorded for first 3 students`);

    // ===== STEP 5: Summary =====
    console.log('\n' + '='.repeat(60));
    console.log('✨ COMPREHENSIVE SEED COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   • 5 Students created (3 in Grade 3, 2 in Grade 4)`);
    console.log(`   • 4 Subjects created (2 per grade)`);
    console.log(`   • 8 Units created`);
    console.log(`   • 10 Lessons created`);
    console.log(`   • 15 Sections created`);
    console.log(`   • 45 Questions created`);
    console.log('\n🔐 Default Credentials:');
    console.log(`   Login: Any STU-* ID from output above`);
    console.log(`   Password: password123`);
    console.log('\n');

    await pool.end();
    process.exit(0);

  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

// Run seeding
seedComprehensiveData();
