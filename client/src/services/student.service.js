import api from '../lib/axios';

// ===========================================================================
// Student Services
// Wraps all the endpoints provided by server/routes/student.api.routes.js
// ===========================================================================

export const studentService = {
  /**
   * GET /api/student/home
   * Returns: student info, overall streak, subjects for their grade with completion rates, recent activity
   */
  getHome: async () => {
    const response = await api.get('/student/home');
    return response;
  },

  /**
   * GET /api/student/subjects/:subjectId/units
   * Returns: units mapped to lessons, dynamically asserting server-side lock statuses
   */
  getSubjectUnits: async (subjectId) => {
    const response = await api.get(`/student/subjects/${subjectId}/units`);
    return response;
  },

  /**
   * GET /api/student/lessons/:lessonId
   * Returns: lesson data + sections + questions, returns 403 if locked
   */
  getLessonContent: async (lessonId) => {
    const response = await api.get(`/student/lessons/${lessonId}`);
    return response;
  },

  /**
   * POST /api/student/lessons/:lessonId/submit
   * @param {Array<{question_id: number, answer_given: string}>} answers 
   * Returns: score, feedback, and unlocked next lesson 
   */
  submitLesson: async (lessonId, answers) => {
    const response = await api.post(`/student/lessons/${lessonId}/submit`, { answers });
    return response;
  },

  /**
   * POST /api/student/games/:gameId/score
   * @param {number} gameId - Database game ID
   * @param {{ score: number, accuracy: number }} payload
   * Returns: upserted game_scores row
   */
  submitGameScore: async (gameId, payload) => {
    const response = await api.post(`/student/games/${gameId}/score`, payload);
    return response;
  },

  /**
   * GET /api/student/profile
   * Returns: comprehensive gamification data including badges, score by subject, streaks 
   */
  getProfile: async () => {
    const response = await await api.get('/student/profile');
    return response;
  }
};
