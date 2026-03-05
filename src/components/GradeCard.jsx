import { Link } from 'react-router-dom';

export default function GradeCard({ grade, completionPercent }) {
  return (
    <Link to={`/grade/${grade.id}`} className="grade-card" style={{ '--grade-color': grade.color }}>
      <div className="grade-emoji">{grade.emoji}</div>
      <h2 className="grade-name">{grade.name}</h2>
      <p className="grade-desc">{grade.description}</p>
      <div className="grade-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionPercent}%` }} />
        </div>
        <span className="progress-text">{completionPercent}% 완료</span>
      </div>
      <div className="grade-topics-count">{grade.topics.length}개 단원</div>
    </Link>
  );
}
