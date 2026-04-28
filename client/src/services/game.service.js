// Game Service - Plant or Animal API calls
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const gameService = {
  // Save game score
  saveGameScore: async (gameData) => {
    try {
      const { data } = await axios.post(`${API_BASE}/games/scores/save`, gameData);
      return data;
    } catch (error) {
      console.error('Error saving game score:', error);
      throw error;
    }
  },

  // Get game scores for current student (optional - for leaderboards)
  getGameScores: async (gameId) => {
    try {
      const { data } = await axios.get(`${API_BASE}/games`, { params: { gameId } });
      return data;
    } catch (error) {
      console.error('Error fetching game scores:', error);
      throw error;
    }
  },
};
