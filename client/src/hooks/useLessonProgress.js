import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

const SECTION_ORDER = ['mcq', 'fill_blank', 'true_false', 'game'];

/**
 * useLessonProgress — Manages section unlock state for the zigzag roadmap.
 * Fetches progress from /api/student/lessons/:lessonId/progress
 * and provides completeSection() to advance the roadmap.
 */
export function useLessonProgress(lessonId) {
  const [progress, setProgress] = useState({
    mcq:        { status: 'unlocked', score: null, total: 0 },
    fill_blank: { status: 'locked',   score: null, total: 0 },
    true_false: { status: 'locked',   score: null, total: 0 },
    game:       { status: 'locked',   score: null, total: null },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    api.get(`/student/lessons/${lessonId}/progress`)
      .then((data) => {
        if (data?.success && data.data) {
          setProgress(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lessonId]);

  const completeSection = useCallback(async (type, score, total) => {
    const res = await api.post(`/student/lessons/${lessonId}/section/${type}/complete`, {
      score,
      total,
    });

    // Unlock next section locally for instant feedback
    const nextIdx = SECTION_ORDER.indexOf(type) + 1;
    if (nextIdx < SECTION_ORDER.length) {
      setProgress((prev) => ({
        ...prev,
        [type]: { ...prev[type], status: 'completed', score, total },
        [SECTION_ORDER[nextIdx]]: { ...prev[SECTION_ORDER[nextIdx]], status: 'unlocked' },
      }));
    } else {
      setProgress((prev) => ({
        ...prev,
        [type]: { ...prev[type], status: 'completed', score, total },
      }));
    }

    return res;
  }, [lessonId]);

  return { progress, loading, completeSection };
}
