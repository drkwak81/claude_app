import { useState, useEffect, useCallback, useRef } from 'react';
import Confetti from 'react-confetti';

const GAMES = [
  { id: 'speed-calc', title: '⚡ 스피드 계산', desc: '30초 안에 최대한 많은 문제를 풀어요!', color: '#FF6B6B' },
  { id: 'number-puzzle', title: '🧩 숫자 퍼즐', desc: '빈칸에 알맞은 수를 찾아요!', color: '#4ECDC4' },
  { id: 'times-table', title: '🎯 구구단 챌린지', desc: '구구단을 얼마나 빨리 맞출 수 있을까?', color: '#45B7D1' },
];

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="games-page">
      <header className="games-header">
        <h1>🎮 수학 게임</h1>
        <p>게임하면서 수학 실력을 키워봐요!</p>
      </header>

      {!activeGame ? (
        <div className="games-grid">
          {GAMES.map(game => (
            <button key={game.id} className="game-select-card" style={{ '--game-color': game.color }} onClick={() => setActiveGame(game.id)}>
              <h2>{game.title}</h2>
              <p>{game.desc}</p>
              <span className="play-btn">▶ 시작하기</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="game-area">
          <button className="btn btn-learn game-back" onClick={() => setActiveGame(null)}>← 게임 목록</button>
          {activeGame === 'speed-calc' && <SpeedCalcGame />}
          {activeGame === 'number-puzzle' && <NumberPuzzleGame />}
          {activeGame === 'times-table' && <TimesTableGame />}
        </div>
      )}
    </div>
  );
}

function generateProblem(difficulty) {
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * (difficulty > 5 ? 3 : 2))];
  let a, b, answer;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * (10 + difficulty * 5)) + 1;
      b = Math.floor(Math.random() * (10 + difficulty * 5)) + 1;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * (10 + difficulty * 5)) + 5;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      answer = a * b;
      break;
  }

  return { text: `${a} ${op} ${b}`, answer };
}

function SpeedCalcGame() {
  const [phase, setPhase] = useState('ready');
  const [problem, setProblem] = useState(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState(1);
  const inputRef = useRef(null);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem(difficulty));
    setInput('');
  }, [difficulty]);

  useEffect(() => {
    if (phase === 'playing') {
      nextProblem();
      inputRef.current?.focus();
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      setPhase('done');
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, phase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(input) === problem.answer) {
      setScore(s => s + 1);
      setDifficulty(d => d + 0.3);
      nextProblem();
    } else {
      setInput('');
    }
    inputRef.current?.focus();
  };

  if (phase === 'ready') {
    return (
      <div className="game-ready">
        <h2>⚡ 스피드 계산</h2>
        <p>30초 동안 최대한 많은 수학 문제를 풀어보세요!</p>
        <button className="btn btn-quiz btn-large" onClick={() => setPhase('playing')}>🚀 시작!</button>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="game-result">
        {score >= 10 && <Confetti recycle={false} numberOfPieces={200} />}
        <h2>⚡ 결과</h2>
        <div className="result-score"><span className="score-number">{score}</span>문제 정답!</div>
        <p>{score >= 15 ? '천재! 🏆' : score >= 10 ? '대단해요! 🌟' : score >= 5 ? '잘했어요! 👏' : '다시 도전해봐요! 💪'}</p>
        <button className="btn btn-quiz btn-large" onClick={() => { setPhase('ready'); setScore(0); setTimeLeft(30); setDifficulty(1); }}>🔄 다시 하기</button>
      </div>
    );
  }

  return (
    <div className="speed-calc-game">
      <div className="game-hud">
        <div className="hud-item">⏱️ {timeLeft}초</div>
        <div className="hud-item">✅ {score}문제</div>
      </div>
      <div className="game-problem">{problem?.text} = ?</div>
      <form onSubmit={handleSubmit} className="game-input-form">
        <input
          ref={inputRef}
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="game-input"
          autoFocus
          placeholder="정답 입력"
        />
        <button type="submit" className="btn btn-quiz">확인</button>
      </form>
    </div>
  );
}

function NumberPuzzleGame() {
  const [phase, setPhase] = useState('ready');
  const [problem, setProblem] = useState(null);
  const [input, setInput] = useState('');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const totalRounds = 10;

  const generatePuzzle = () => {
    const types = ['missing-add', 'missing-sub', 'missing-mul'];
    const type = types[Math.floor(Math.random() * types.length)];
    let a, b, answer, text;

    switch (type) {
      case 'missing-add':
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        answer = b;
        text = `${a} + ? = ${a + b}`;
        break;
      case 'missing-sub':
        a = Math.floor(Math.random() * 50) + 20;
        b = Math.floor(Math.random() * 20) + 1;
        answer = b;
        text = `${a} - ? = ${a - b}`;
        break;
      case 'missing-mul':
        a = Math.floor(Math.random() * 9) + 2;
        b = Math.floor(Math.random() * 9) + 2;
        answer = b;
        text = `${a} × ? = ${a * b}`;
        break;
    }
    return { text, answer };
  };

  const startGame = () => {
    setPhase('playing');
    setRound(0);
    setScore(0);
    setProblem(generatePuzzle());
    setInput('');
    setShowAnswer(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const correct = parseInt(input) === problem.answer;
    setShowAnswer(true);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (round + 1 >= totalRounds) {
        setPhase('done');
      } else {
        setRound(r => r + 1);
        setProblem(generatePuzzle());
        setInput('');
        setShowAnswer(false);
      }
    }, 1200);
  };

  if (phase === 'ready') {
    return (
      <div className="game-ready">
        <h2>🧩 숫자 퍼즐</h2>
        <p>?에 알맞은 숫자를 찾아보세요! 총 {totalRounds}문제!</p>
        <button className="btn btn-quiz btn-large" onClick={startGame}>🚀 시작!</button>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="game-result">
        {score >= 8 && <Confetti recycle={false} numberOfPieces={200} />}
        <h2>🧩 결과</h2>
        <div className="result-score"><span className="score-number">{score}</span>/{totalRounds} 정답!</div>
        <p>{score === totalRounds ? '완벽해요! 🏆' : score >= 7 ? '훌륭해요! 🌟' : '다시 도전! 💪'}</p>
        <button className="btn btn-quiz btn-large" onClick={startGame}>🔄 다시 하기</button>
      </div>
    );
  }

  return (
    <div className="puzzle-game">
      <div className="game-hud">
        <div className="hud-item">📝 {round + 1}/{totalRounds}</div>
        <div className="hud-item">✅ {score}점</div>
      </div>
      <div className="game-problem">{problem?.text}</div>
      <form onSubmit={handleSubmit} className="game-input-form">
        <input
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="game-input"
          disabled={showAnswer}
          autoFocus
          placeholder="? = "
        />
        {!showAnswer && <button type="submit" className="btn btn-quiz">확인</button>}
      </form>
      {showAnswer && (
        <div className={`quiz-feedback ${parseInt(input) === problem.answer ? 'correct' : 'wrong'}`}>
          {parseInt(input) === problem.answer ? '🎉 정답!' : `❌ 정답은 ${problem.answer}이에요`}
        </div>
      )}
    </div>
  );
}

function TimesTableGame() {
  const [phase, setPhase] = useState('ready');
  const [selectedTable, setSelectedTable] = useState(null);
  const [problems, setProblems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef(null);

  const start = (table) => {
    setSelectedTable(table);
    const probs = [];
    for (let i = 1; i <= 9; i++) {
      probs.push({ a: table, b: i, answer: table * i });
    }
    // Shuffle
    for (let i = probs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [probs[i], probs[j]] = [probs[j], probs[i]];
    }
    setProblems(probs);
    setCurrent(0);
    setScore(0);
    setInput('');
    setShowAnswer(false);
    setPhase('playing');
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 100);
    return () => clearInterval(timer);
  }, [phase, startTime]);

  useEffect(() => {
    if (phase === 'playing') inputRef.current?.focus();
  }, [current, phase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correct = parseInt(input) === problems[current].answer;
    setShowAnswer(true);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= problems.length) {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
        setPhase('done');
      } else {
        setCurrent(c => c + 1);
        setInput('');
        setShowAnswer(false);
      }
    }, 800);
  };

  if (phase === 'ready') {
    return (
      <div className="game-ready">
        <h2>🎯 구구단 챌린지</h2>
        <p>몇 단에 도전할까요?</p>
        <div className="times-table-select">
          {[2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} className="times-btn" onClick={() => start(n)}>{n}단</button>
          ))}
        </div>
        <button className="btn btn-quiz times-all-btn" onClick={() => {
          const allProbs = [];
          for (let t = 2; t <= 9; t++) for (let i = 1; i <= 9; i++) allProbs.push({ a: t, b: i, answer: t * i });
          for (let i = allProbs.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [allProbs[i], allProbs[j]] = [allProbs[j], allProbs[i]]; }
          const subset = allProbs.slice(0, 20);
          setProblems(subset);
          setSelectedTable('전체');
          setCurrent(0);
          setScore(0);
          setInput('');
          setShowAnswer(false);
          setPhase('playing');
          setStartTime(Date.now());
        }}>🔥 전체 도전 (20문제)</button>
      </div>
    );
  }

  if (phase === 'done') {
    const total = problems.length;
    return (
      <div className="game-result">
        {score === total && <Confetti recycle={false} numberOfPieces={200} />}
        <h2>🎯 {selectedTable}단 결과</h2>
        <div className="result-score"><span className="score-number">{score}</span>/{total} 정답!</div>
        <p>⏱️ {elapsed}초 걸렸어요!</p>
        <p>{score === total ? '완벽! 🏆' : score >= total * 0.7 ? '잘했어요! 🌟' : '연습하면 잘 할 수 있어요! 💪'}</p>
        <button className="btn btn-quiz btn-large" onClick={() => setPhase('ready')}>🔄 다시 하기</button>
      </div>
    );
  }

  const prob = problems[current];
  return (
    <div className="times-game">
      <div className="game-hud">
        <div className="hud-item">📝 {current + 1}/{problems.length}</div>
        <div className="hud-item">✅ {score}점</div>
        <div className="hud-item">⏱️ {elapsed}초</div>
      </div>
      <div className="game-problem">{prob.a} × {prob.b} = ?</div>
      <form onSubmit={handleSubmit} className="game-input-form">
        <input
          ref={inputRef}
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="game-input"
          disabled={showAnswer}
          autoFocus
          placeholder="정답"
        />
        {!showAnswer && <button type="submit" className="btn btn-quiz">확인</button>}
      </form>
      {showAnswer && (
        <div className={`quiz-feedback ${parseInt(input) === prob.answer ? 'correct' : 'wrong'}`}>
          {parseInt(input) === prob.answer ? '🎉 정답!' : `❌ ${prob.a} × ${prob.b} = ${prob.answer}`}
        </div>
      )}
    </div>
  );
}
