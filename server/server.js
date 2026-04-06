const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/subjects', require('./routes/subject.routes'));
app.use('/api/lessons', require('./routes/lesson.routes'));
app.use('/api/questions', require('./routes/question.routes'));
app.use('/api/games', require('./routes/game.routes'));
app.use('/api/progress', require('./routes/progress.routes'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
