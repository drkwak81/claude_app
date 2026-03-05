import { useNavigate } from 'react-router-dom';
import curriculum from '../data/curriculum';
import GradeCard from '../components/GradeCard';

const grades = Object.values(curriculum);
const firstGrade = grades[0];
const firstTopic = firstGrade?.topics[0];

export default function HomePage({ getGradeCompletionPercent }) {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📖',
      title: '쉬운 설명',
      desc: '개념을 확실하게 이해할 수 있는 친절한 설명',
      path: `/lesson/${firstGrade?.id}/${firstTopic?.id}`,
    },
    {
      icon: '🎬',
      title: '동영상 학습',
      desc: '영상으로 더 쉽게 이해해요',
      path: `/lesson/${firstGrade?.id}/${firstTopic?.id}`,
    },
    {
      icon: '✏️',
      title: '재미있는 퀴즈',
      desc: '배운 내용을 퀴즈로 확인해요',
      path: `/quiz/${firstGrade?.id}/${firstTopic?.id}`,
    },
    {
      icon: '🎮',
      title: '수학 게임',
      desc: '게임하면서 수학 실력 UP!',
      path: '/games',
    },
  ];

  return (
    <div className="home-page">
      <header className="hero">
        <h1>🚀 수학 탐험대에 오신 걸 환영해요!</h1>
        <p>재미있게 수학을 배우고, 퀴즈와 게임으로 실력을 키워봐요!</p>
      </header>

      <section className="grade-grid">
        {grades.map(grade => (
          <GradeCard
            key={grade.id}
            grade={grade}
            completionPercent={getGradeCompletionPercent(grade.id, grade.topics.length)}
          />
        ))}
      </section>

      <section className="home-features">
        {features.map((f) => (
          <div
            key={f.title}
            className="feature-card feature-card-link"
            onClick={() => navigate(f.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate(f.path); }}
          >
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
