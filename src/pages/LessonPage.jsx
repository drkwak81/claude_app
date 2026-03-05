import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import curriculum from '../data/curriculum';

export default function LessonPage({ markLessonViewed }) {
  const { gradeId, topicId } = useParams();
  const grade = curriculum[gradeId];
  const topic = grade?.topics.find(t => t.id === topicId);

  useEffect(() => {
    if (grade && topic) {
      markLessonViewed(gradeId, topicId);
    }
  }, [gradeId, topicId]);

  if (!grade || !topic) {
    return (
      <div className="error-page">
        <h2>수업을 찾을 수 없어요 😢</h2>
        <Link to="/" className="btn btn-learn">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <div className="lesson-breadcrumb">
        <Link to={`/grade/${gradeId}`}>{grade.name}</Link>
        <span> › </span>
        <span>{topic.title}</span>
      </div>

      <header className="lesson-header">
        <span className="lesson-icon">{topic.icon}</span>
        <h1>{topic.title}</h1>
      </header>

      <section className="lesson-video">
        <h2>🎬 동영상으로 배우기</h2>
        <div className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/${topic.videoId}`}
            title={topic.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="video-note">💡 영상을 보고 아래 설명도 함께 읽어보세요!</p>
      </section>

      <section className="lesson-content">
        <h2>📝 개념 설명</h2>
        <div className="explanation-card">
          <FormattedExplanation text={topic.explanation} />
        </div>
      </section>

      <div className="lesson-actions">
        <Link to={`/quiz/${gradeId}/${topicId}`} className="btn btn-quiz btn-large">
          ✏️ 퀴즈 풀러 가기
        </Link>
        <Link to={`/grade/${gradeId}`} className="btn btn-learn btn-large">
          📚 다른 단원 보기
        </Link>
      </div>
    </div>
  );
}

function FormattedExplanation({ text }) {
  const lines = text.trim().split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let inCode = false;
  let codeLines = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const headers = tableRows[0];
    const dataRows = tableRows.slice(2); // skip separator row
    elements.push(
      <table key={`table-${elements.length}`} className="lesson-table">
        <thead>
          <tr>{headers.split('|').filter(Boolean).map((h, i) => <th key={i}>{h.trim()}</th>)}</tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={ri}>
              {row.split('|').filter(Boolean).map((cell, ci) => <td key={ci}>{cell.trim()}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
    tableRows = [];
  };

  const flushCode = () => {
    if (codeLines.length === 0) return;
    elements.push(
      <pre key={`code-${elements.length}`} className="lesson-code"><code>{codeLines.join('\n')}</code></pre>
    );
    codeLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.includes('|') && line.trim().startsWith('|')) {
      if (!inTable) {
        inTable = true;
      }
      tableRows.push(line);
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    if (line.trim() === '') {
      elements.push(<br key={`br-${i}`} />);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="exp-h2">{line.replace('## ', '')}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="exp-h3">{line.replace('### ', '')}</h3>);
    } else if (line.trim().startsWith('- ')) {
      elements.push(<li key={i}>{formatInline(line.trim().replace(/^- /, ''))}</li>);
    } else {
      elements.push(<p key={i} className="exp-p">{formatInline(line)}</p>);
    }
  }

  if (inTable) flushTable();
  if (inCode) flushCode();

  return <div className="formatted-explanation">{elements}</div>;
}

function formatInline(text) {
  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={match.index}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
