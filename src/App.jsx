import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GradePage from './pages/GradePage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import GamesPage from './pages/GamesPage';
import { useProgress } from './hooks/useProgress';
import './App.css';

export default function App() {
  const {
    getTopicProgress,
    saveQuizScore,
    markLessonViewed,
    getTotalStars,
    getGradeCompletionPercent,
  } = useProgress();

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar totalStars={getTotalStars()} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage getGradeCompletionPercent={getGradeCompletionPercent} />} />
            <Route path="/grade/:gradeId" element={<GradePage getTopicProgress={getTopicProgress} />} />
            <Route path="/lesson/:gradeId/:topicId" element={<LessonPage markLessonViewed={markLessonViewed} />} />
            <Route path="/quiz/:gradeId/:topicId" element={<QuizPage saveQuizScore={saveQuizScore} />} />
            <Route path="/games" element={<GamesPage />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>🧮 수학 탐험대 | 즐겁게 배우는 수학!</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
