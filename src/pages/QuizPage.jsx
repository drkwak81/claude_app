import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Confetti from 'react-confetti';
import curriculum from '../data/curriculum';

export default function QuizPage({ saveQuizScore }) {
  const { gradeId, topicId } = useParams();
  const navigate = useNavigate();
  const grade = curriculum[gradeId];
  const topic = grade?.topics.find(t => t.id === topicId);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  if (!grade || !topic) {
    return (
      <div className="error-page">
        <h2>퀴즈를 찾을 수 없어요 😢</h2>
        <Link to="/" className="btn btn-learn">홈으로 돌아가기</Link>
      </div>
    );
  }

  const quizzes = topic.quizzes;
  const total = quizzes.length;
  const quiz = quizzes[currentQ];
  const isCorrect = selected === quiz.answer;
  const isPerfect = finished && score === total;
  const pct = finished ? Math.round((score / total) * 100) : 0;

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === quiz.answer;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { question: quiz.question, selected: idx, correct: quiz.answer, isCorrect: correct }]);
  };

  const handleNext = () => {
    if (currentQ + 1 >= total) {
      const finalScore = score;
      saveQuizScore(gradeId, topicId, finalScore, total);
      setFinished(true);
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  if (finished) {
    return (
      <div className="quiz-page">
        {isPerfect && <Confetti recycle={false} numberOfPieces={300} />}
        <div className="quiz-result">
          <div className="result-emoji">{pct === 100 ? '🏆' : pct >= 60 ? '😊' : '💪'}</div>
          <h1>퀴즈 결과</h1>
          <div className="result-score">
            <span className="score-number">{score}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{total}</span>
          </div>
          <div className="result-stars">
            {pct === 100 ? '⭐⭐⭐' : pct >= 60 ? '⭐⭐☆' : '⭐☆☆'}
          </div>
          <p className="result-message">
            {pct === 100 && '완벽해요! 정말 대단해요! 🎉'}
            {pct >= 60 && pct < 100 && '잘했어요! 조금만 더 연습하면 만점! 👍'}
            {pct < 60 && '괜찮아요! 다시 공부하고 도전해봐요! 💪'}
          </p>

          <div className="result-review">
            <h3>📋 문제 리뷰</h3>
            {answers.map((a, i) => (
              <div key={i} className={`review-item ${a.isCorrect ? 'correct' : 'wrong'}`}>
                <span className="review-num">Q{i + 1}.</span>
                <span className="review-q">{a.question}</span>
                <span className="review-icon">{a.isCorrect ? '✅' : '❌'}</span>
                {!a.isCorrect && (
                  <span className="review-answer">정답: {quizzes[i].options[a.correct]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="result-actions">
            <button onClick={() => { setCurrentQ(0); setSelected(null); setShowResult(false); setScore(0); setFinished(false); setAnswers([]); }} className="btn btn-quiz">
              🔄 다시 풀기
            </button>
            <Link to={`/lesson/${gradeId}/${topicId}`} className="btn btn-learn">
              📖 다시 공부하기
            </Link>
            <Link to={`/grade/${gradeId}`} className="btn btn-learn">
              📚 다른 단원
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-breadcrumb">
        <Link to={`/grade/${gradeId}`}>{grade.name}</Link>
        <span> › </span>
        <span>{topic.title} 퀴즈</span>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${((currentQ + 1) / total) * 100}%` }} />
      </div>
      <div className="quiz-counter">문제 {currentQ + 1} / {total}</div>

      <div className="quiz-card">
        <h2 className="quiz-question">{quiz.question}</h2>
        <div className="quiz-options">
          {quiz.options.map((opt, idx) => {
            let cls = 'quiz-option';
            if (showResult) {
              if (idx === quiz.answer) cls += ' correct';
              else if (idx === selected) cls += ' wrong';
            } else if (idx === selected) {
              cls += ' selected';
            }
            return (
              <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={showResult}>
                <span className="option-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                <span className="option-text">{opt}</span>
                {showResult && idx === quiz.answer && <span className="option-check">✅</span>}
                {showResult && idx === selected && idx !== quiz.answer && <span className="option-check">❌</span>}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <p>🎉 정답이에요! 잘했어요!</p>
            ) : (
              <p>😅 아쉬워요! 정답은 <strong>{quiz.options[quiz.answer]}</strong>이에요.</p>
            )}
          </div>
        )}

        {showResult && (
          <button onClick={handleNext} className="btn btn-quiz btn-next">
            {currentQ + 1 < total ? '다음 문제 →' : '결과 보기 🏆'}
          </button>
        )}
      </div>
    </div>
  );
}
