import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ totalStars }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🧮</span>
          <span className="logo-text">수학 탐험대</span>
        </Link>
        <div className="navbar-right">
          <div className="star-badge" title="획득한 별">
            ⭐ {totalStars}
          </div>
          {!isHome && (
            <Link to="/" className="nav-home-btn">🏠 홈</Link>
          )}
          <Link to="/games" className="nav-game-btn">🎮 게임</Link>
        </div>
      </div>
    </nav>
  );
}
