import { useAuth } from '../contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (currentUser) {
      navigate('/trips');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="home-container">
      <div className="home-title-link" onClick={handleClick}>
        <h1 className="home-title">Trip Planner</h1>
        <p className="home-subtitle">
          {currentUser ? 'Перейти к моим поездкам' : 'Нажмите, чтобы начать'}
        </p>
      </div>
    </div>
  );
};

export default Home;
