import { Link } from 'react-router-dom';

export default function TopicCard({ gradeId, topic, progress }) {
  const { quizCompleted, quizScore, quizTotal, lessonViewed } = progress;
  const pct = quizCompleted ? Math.round((quizScore / (quizTotal || 5)) * 100) : 0;
  const stars = !quizCompleted ? 0 : pct === 100 ? 3 : pct >= 60 ? 2 : 1;

  return (
    <div className="topic-card">
      <div className="topic-icon">{topic.icon}</div>
      <div className="topic-info">
        <h3>{topic.title}</h3>
        <p>{topic.description}</p>
        {quizCompleted && (
          <div className="topic-stars">
            {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
            <span className="topic-score">({quizScore}/{quizTotal || 5})</span>
          </div>
        )}
        {lessonViewed && !quizCompleted && <span className="badge-viewed">📖 학습 완료</span>}
      </div>
      <div className="topic-actions">
        <Link to={`/lesson/${gradeId}/${topic.id}`} className="btn btn-learn">
          📖 배우기
        </Link>
        <Link to={`/quiz/${gradeId}/${topic.id}`} className="btn btn-quiz">
          ✏️ 퀴즈
        </Link>
      </div>
    </div>
  );
}
