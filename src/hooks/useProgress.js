import { useState, useEffect } from 'react';

const STORAGE_KEY = 'math-app-progress';

const getInitialProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export function useProgress() {
  const [progress, setProgress] = useState(getInitialProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const getTopicProgress = (gradeId, topicId) => {
    return progress[`${gradeId}/${topicId}`] || { quizScore: 0, quizCompleted: false, lessonViewed: false };
  };

  const saveQuizScore = (gradeId, topicId, score, total) => {
    const key = `${gradeId}/${topicId}`;
    const prev = progress[key] || {};
    const bestScore = Math.max(prev.quizScore || 0, score);
    setProgress(p => ({
      ...p,
      [key]: { ...prev, quizScore: bestScore, quizTotal: total, quizCompleted: true },
    }));
  };

  const markLessonViewed = (gradeId, topicId) => {
    const key = `${gradeId}/${topicId}`;
    setProgress(p => ({
      ...p,
      [key]: { ...(p[key] || {}), lessonViewed: true },
    }));
  };

  const getTotalStars = () => {
    return Object.values(progress).reduce((sum, p) => {
      if (!p.quizCompleted) return sum;
      const pct = (p.quizScore / (p.quizTotal || 5)) * 100;
      if (pct === 100) return sum + 3;
      if (pct >= 60) return sum + 2;
      return sum + 1;
    }, 0);
  };

  const getGradeCompletionPercent = (gradeId, topicCount) => {
    let completed = 0;
    for (const [key, val] of Object.entries(progress)) {
      if (key.startsWith(gradeId + '/') && val.quizCompleted) completed++;
    }
    return topicCount ? Math.round((completed / topicCount) * 100) : 0;
  };

  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return { progress, getTopicProgress, saveQuizScore, markLessonViewed, getTotalStars, getGradeCompletionPercent, resetProgress };
}
