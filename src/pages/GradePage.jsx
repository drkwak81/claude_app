import { useParams, Link } from 'react-router-dom';
import curriculum from '../data/curriculum';
import TopicCard from '../components/TopicCard';

export default function GradePage({ getTopicProgress }) {
  const { gradeId } = useParams();
  const grade = curriculum[gradeId];

  if (!grade) {
    return (
      <div className="error-page">
        <h2>학년을 찾을 수 없어요 😢</h2>
        <Link to="/" className="btn btn-learn">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="grade-page">
      <header className="grade-header" style={{ '--grade-color': grade.color }}>
        <span className="grade-header-emoji">{grade.emoji}</span>
        <h1>{grade.name}</h1>
        <p>{grade.description}</p>
      </header>

      <div className="topics-list">
        {grade.topics.map((topic, i) => (
          <TopicCard
            key={topic.id}
            gradeId={grade.id}
            topic={topic}
            progress={getTopicProgress(grade.id, topic.id)}
          />
        ))}
      </div>
    </div>
  );
}
