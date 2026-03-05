import curriculum from '../data/curriculum';
import GradeCard from '../components/GradeCard';

const grades = Object.values(curriculum);

export default function HomePage({ getGradeCompletionPercent }) {
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
        <div className="feature-card">
          <span className="feature-icon">📖</span>
          <h3>쉬운 설명</h3>
          <p>개념을 확실하게 이해할 수 있는 친절한 설명</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🎬</span>
          <h3>동영상 학습</h3>
          <p>영상으로 더 쉽게 이해해요</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">✏️</span>
          <h3>재미있는 퀴즈</h3>
          <p>배운 내용을 퀴즈로 확인해요</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🎮</span>
          <h3>수학 게임</h3>
          <p>게임하면서 수학 실력 UP!</p>
        </div>
      </section>
    </div>
  );
}
