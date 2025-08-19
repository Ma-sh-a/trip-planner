import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import "../styles/header.css";

const Header = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          Trip Planner 🌏 ✈️
        </Link>

        {currentUser && (
          <nav className="header-nav">
            <Link to="/trips" className="nav-link">
              Мои поездки
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Выйти
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
